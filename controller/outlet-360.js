
/*** MTO Performance and Account Goals */
exports.populateAccountGoals=async(req,res,next)=>{
    /*** Store in schema outlet360-account-goals ,tag: Account__c*/
    const conn= req.conn
    const {recordTypeName,fieldName}=req.body
    try{
      let Record = await conn.query(
        `SELECT Id FROM RecordType WHERE SobjectType='Account_Goal__c' and Name='${recordTypeName}'`
      );
      let skuRecordTypeId = Record && Record.records && Record.records[0] && Record.records[0].Id;
      const dateConditions = `(Start_Date__c <= THIS_MONTH ) AND (End_Date__c >= THIS_MONTH )`;
      const result = await conn.query(`
        SELECT Account__c, SUM(${fieldName})
        FROM Account_Goal__c
        WHERE RecordTypeId='${skuRecordTypeId}' AND ${dateConditions} AND ${fieldName} != NULL
        GROUP BY Account__c
      `);
      
      const records = result && result.records ? result.records : [];
        res.status(200).json({isError : false,isAuth : true,accountGoals:records});
    }catch(err){
        console.log('\n\naccount goals error')
        console.log(err)
        console.log('\n\n')
        res.status(500).json({isError : true,isAuth :true,message : err});
    }
}

exports.populateRateDepletion=async(req,res,next)=>{
    /*** Store in schema outlet360-rate-depletion , tag: Account__c*/
    const conn= req.conn
    try{
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // Add 1 to get 1-based month
      const currentYear = today.getFullYear();
      const query = `SELECT Outlet__r.Id, CE__c FROM Retail_Depletion__c WHERE CALENDAR_MONTH(DATE__c) = ${currentMonth} AND CALENDAR_YEAR(DATE__c) = ${currentYear}`;
      const result = await conn.query(query);
      const reducedData = Object.values(result.records.reduce((acc, obj) => {
        const account = obj && obj.Outlet__r ? obj.Outlet__r.Id : '';
        const ce = obj.CE__c || 0;
        if (acc[account]) {
          acc[account].CE__c += ce;
        } else {
          acc[account] = { ...obj, CE__c: ce };
          acc[account].Account__c= account
        }
        return acc;
      }, {}));
        res.status(200).json({isError : false,isAuth : true,retailDepletion:reducedData});
    }catch(err){

        res.status(500).json({isError : true,isAuth :true,message : err});
    }
}

exports.populateEvents=async(req,res,next)=>{
    /*** Store in schema outlet360-events ,tag: Account__c*/
    const conn= req.conn
    try{
        let recordType= await conn.query(
            `SELECT Id,Name FROM RecordType WHERE SobjectType='Event__c' and Name='Salesperson'`
          );
          const recordTypeId = recordType && recordType.records && recordType.records[0] && recordType.records[0].Id;
          const month=new Date().toLocaleString('en-IN', { month: 'long' });
          const result= await conn.query(`SELECT Account__c, COUNT(Id)  FROM Event__c  where Month__c='${month}' and RecordTypeId='${recordTypeId}' and Completed__c=false and 	Start_Date__c<=TODAY  GROUP BY Account__c`)
          const records = result && result.records ? result.records : [];
        res.status(200).json({isError : false,isAuth : true,events:records});
    }catch(err){
        console.log('\n\populate events  error')
        console.log(err)
        console.log('\n\n')
        res.status(500).json({isError : true,isAuth :true,message : err});
    }
}

exports.populateOutlet360=async(req,res,next)=>{
    /*** Store in schema outlet360-records ,tag: Account__c*/
    const conn= req.conn
    try{
        const result= await conn.sobject('Outlet_360__c').find({
        })
        const records = Object.values(result.reduce((acc, obj) => {
            const accountKey = obj.Account__c;
            if (!acc[accountKey]) {
              acc[accountKey] = { Account__c: accountKey, children: [] };
            }
            acc[accountKey].children.push(obj);
            return acc;
          }, {}));

        res.status(200).json({isError : false,isAuth : true,records});
    }catch(err){
        console.log('\n\noutlet 360 error')
        console.log(err)
        console.log('\n\n')
        res.status(500).json({isError : true,isAuth :true,message : err});
    }
}

exports.fetchVisibilityScores=async(req,res,next)=>{
    const conn= req.conn
    try{
        /*** Fetch Sell Visibility scores for the latest Stock visibility survey for a given account*/
        let records=await conn.query("SELECT Account__c, CreatedDate, Visibility_Score__c,Z3_Menu_Listing__c FROM Stock_Visibility_Survey__c  ORDER BY CreatedDate DESC");
        const filteredRecords = {};
        records.records.map(record => {
              const accountId = record.Account__c;
              const createdDate = new Date(record.CreatedDate);
              if (!filteredRecords[accountId] || createdDate > filteredRecords[accountId].CreatedDate) {
                filteredRecords[accountId] = record;
              }
        })
       let visibilityScores = Object.values(filteredRecords);
       res.status(200).json({isError : false,isAuth : true, visibilityScores});
    }catch(err){
        console.log(err)
        res.status(500).json({isError : true,isAuth :true,message : err});
    }
  }


  exports.fetchPilotPosLineItems=async(req,res,next)=>{
    const conn= req.conn
    try{
        /*** Fetch Sell Visibility scores for the latest Stock visibility survey for a given account*/
        const result= await conn.query(`SELECT  Id,Product__r.Name,Item_Sub_Category__c,POSM_Requisition__r.Outlet__c, POSM_Requisition__r.Only_For_Pilot__c from 	POSM_Line_Item__c  where POSM_Requisition__r.Only_For_Pilot__c=true and  Status__c='Delivered' `)
        const posResult = Object.values((result.records? result.records:[]).reduce((acc, obj) => {
          const accountKey = obj.POSM_Requisition__r.Outlet__c;
          if (!acc[accountKey]) {
            acc[accountKey] = { Account__c: accountKey, posmLineItems: [] };
          }
          acc[accountKey].posmLineItems.push(obj);
          return acc;
        }, {}));
        
       res.status(200).json({isError : false,isAuth : true, posLineItems:(posResult||[])});
    }catch(err){
        console.log(err)
        res.status(500).json({isError : true,isAuth :true,message : err});
    }
  }


