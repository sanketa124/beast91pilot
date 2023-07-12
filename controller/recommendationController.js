const CONSTANTS=require('../constants')
const axios = require('axios');
exports.fetchAllRecommendations=async(req,res,next)=>{
    const conn= req.conn
    try{
        /*** Fetch Recommendations, Samples */
        let recommendations = await conn.query(`
          SELECT Id, Accepted_Date__c,	Variant_Name__c, CreatedById, Duration__c, End_Date__c, Is_Accepted__c, Kitchen_Order_Ticket_KOT__c, New_or_Existing__c, Recommended_SKU__r.Display_Name__c, Recommended_SKU__c, Outlet_Name__r.Account_ID_18_digit__c, Outlet_Name__r.Channel__c, OwnerId, Pitch__c, Promotion_Name__c, Name, Promotion_Name_With_Scheme__c, Scheme__c, Start_Date__c, Week__c, Recommended_SKU__r.Liquid_Layer__c, Promotion_Name__r.Active__c,Promotion_Name__r.Name ,Recommended_SKU__r.Size_ID__r.Primary_Pack_Size__c, Recommended_SKU__r.Size_ID__r.Volume_Unit__c, Recommended_SKU__r.Liquid_Layer__r.Name
          FROM Recommendation__c
          WHERE Start_Date__c <= TODAY AND End_Date__c >= TODAY
        `).execute();
        let result= recommendations && recommendations.records? recommendations.records:[]
        res.status(200).json({isError : false,isAuth : true,recommendations:result});
    }catch(err){
        console.log(err)
        res.status(500).json({isError : true,isAuth :true,message : err});
    }
  
}


exports.processSamples = async (req, res, next) => {

  try {
      const conn = req.conn
      const {
          items
      } = req.body
      const batchSize = 100; // Adjust the batch size as per your requirements
      const numBatches = Math.ceil(items.length / batchSize);
      const SFDC_PARENT_SAMPLE = `Product_Pre_Sales_Sampling__c`
      const SFDC_CHILD_SAMPLE = `Product_Pre_Sales_Sampling_Child__c`
      const processBatch = async (batch) => {
          try {
              const promises = batch.map(async (sample, index) => {
                  let {
                      sampleTag,
                      children,
                      ...payload
                  } = sample;
                  children = children.filter((sampleLineItem) => {
                      return sampleLineItem.Quantity__c > 0
                  })
                  if (children.length) {

                      const parentSample = await conn.sobject(`${SFDC_PARENT_SAMPLE}`).create(payload)
                      let id = '';
                      if (parentSample && parentSample.id) {
                          id = parentSample.id
                      }
                      const updatedChildren = children.map(({
                          sampleTag,
                          ...childWithoutSampleTag
                      }) => ({
                          ...childWithoutSampleTag,
                          Product_Pre_Sales_Sampling__c: id
                      }));
                      await conn.sobject(`${SFDC_CHILD_SAMPLE}`).create(updatedChildren)
                      return {
                          ...sample,
                          children: updatedChildren
                      };

                  }
              });

              return Promise.all(promises);
          } catch (err) {
              console.log(`Bulk create sampling data Error`, console)
          }
      };

      const batches = Array.from({
          length: numBatches
      }, (_, index) => {
          const startIndex = index * batchSize;
          return items.slice(startIndex, startIndex + batchSize);
      });
      for (const batch of batches) {
          await processBatch(batch);
      }
      res.status(200).json({
          isError: false,
          isAuth: true,
          proccessedamples: true
      });
  } catch (err) {
      console.log(err);
      res.status(500).json({
          isError: true,
          isAuth: true,
          message: err
      });
  }

}

exports.processAcceptedRecommnedations=async (req,res,next)=>{
  /** Use for Pusing both Recommendations and Promotions since they have the same schema in SF (Recommendation__c)*/
  const conn = req.conn;
  const {items}=req.body
  try {
      const filteredItems= items.filter((item)=>{
        const condition=item && item.Accepted_Date__c && item.Id
        return condition && (item.hasOwnProperty('Is_Accepted__c') && typeof item['Is_Accepted__c'] === "boolean")
      }).map((item)=>{
        const  {Id,Accepted_Date__c,Is_Accepted__c,Recommendation_Feedback__c}=item
        return {Id,Accepted_Date__c,Is_Accepted__c,Recommendation_Feedback__c}
      })
      if(filteredItems && filteredItems.length){
        const result=await conn.sobject('Recommendation__c').update(filteredItems);
        console.log('update recommendation result')
        console.log(result)
        return res.status(200).json({ isError: false, isAuth: true, result });
      }
      else{
        res.status(200).json({ isError: false, isAuth: true, result:{message:'No records to update'} });
      }

   } catch (err) {
      console.error(err);
      res.status(500).json({ isError: true, isAuth: true, message: err });
    }
  }

exports.fetchSellSheet=async(req,res,next)=>{
    const conn= req.conn
    const {liquidName}= req.body
    try{
        /*** Fetch Sell Sheet, Samples */
        let sellSheet =  await conn.query(`SELECT DistributionPublicUrl, Id, Name, ContentVersion.Title FROM ContentDistribution WHERE ContentVersion.Title LIKE '%${liquidName}%'`).execute();
        res.status(200).json({isError : false,isAuth : true, sellSheet});
    }catch(err){
        console.log(err)
        res.status(500).json({isError : true,isAuth :true,message : err});
    }
  
}

exports.completedEvents=async(req,res,next)=>{
    /*** Store in schema outlet360-events ,tag: Account__c*/
    const conn= req.conn
    try{
        
        let recordType= await conn.query(
            `SELECT Id,Name FROM RecordType WHERE SobjectType='Event__c' and Name='Salesperson'`
          );
        const recordTypeId = recordType && recordType.records && recordType.records[0] && recordType.records[0].Id;
        const month=new Date().toLocaleString('en-IN', { month: 'long' });
        const result= await conn.query(`SELECT Account__c, COUNT(Id)  FROM Event__c  where Month__c='${month}' and RecordTypeId='${recordTypeId}' and Completed__c=true GROUP BY Account__c`)
        const records = result && result.records ? result.records : [];  
        res.status(200).json({isError : false,isAuth : true,events:records});
    }catch(err){
        console.log('\n\populate events  error')
        res.status(500).json({isError : true,isAuth :true,message : err});
    }
}


exports.feedbackMetadata=async(req,res,next)=>{
    /*** Store in schema outlet360-events ,tag: Account__c*/
    const conn= req.conn
    try{
        const meta= await  conn.sobject('Recommendation__c').describe() 
        const fields=  meta.fields.find(f => f.name === 'Recommendation_Feedback__c');
        const values= fields && fields.picklistValues ? fields.picklistValues.map((item)=>{
        return {option:item.value}
        }):[] 
        res.status(200).json({isError : false,isAuth : true,feedBackValues:values});
    }catch(err){
        console.log('\n\populate events  error')
        res.status(500).json({isError : true,isAuth :true,message : err});
    }
}
  
exports.sendSms=async(req,res,next)=>{
    const {mobile}= req.body
    try{
        let data = JSON.stringify({
            "root": {
              "sms": [
                {
                  "to": mobile,
                  "body": `Hello! Your sales rep has invited you to join Bira 91 All Stars! Click here to complete your registration: ${CONSTANTS.ALL_STARS_APP_LINK}`
                }
              ]
            }
          });
          
          let config = {
            method: 'post',
            url: 'https://apac.api.capillarytech.com/v1.1/communications/sms?format=json',
            headers: { 
              'Content-Type': 'application/json', 
              'Accept': 'application/json', 
              'Authorization': `Basic ${CONSTANTS.CAPILLARY_BASIC_AUTH}`
            },
            data : data
          };
          
         const response=await axios.request(config)
         const responseData= response && response.data? response.data :{}
         res.status(200).json({isError : false,isAuth : true,result: responseData});
    }catch(err){
        console.log('Send sms error')
        console.log(err)
        res.status(500).json({isError : true,isAuth :true,message : err});
    }
}