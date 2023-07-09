exports.fetchPayOutSlabs = async (req, res) => {
    try {
        let sfConnection = req.conn;
        let slabs = await sfConnection.sobject("Payout_Slab__c").find()
        let timeoutHandler;
        res.setHeader('Content-Type', 'application/json');
        // Time Out Check
        // timeoutHandler = setTimeout(() => {
        //     res.write('');
        // }, 20000);
        // Time Out Check
        res.status(200).json({ isError: false, isAuth: true, slabs: slabs })
    }
    catch (e) {
        // console.log(e);
        // res.status(500).json({isError : true,isAuth : true,message : e});
        console.log(e);
        res.status(500).json({ isError: true, isAuth: true, message: e });

    }

};

exports.fetchAccountGoals = async (req, res) => {
    try {
        let sfConnection = req.conn;
        let table = 'Account_Goal__c';
        let queryString = 'SELECT ';
        let todayDate = new Date().toISOString().split('T')[0]

        let sobjectDescribe = await sfConnection.sobject(table).describe();

        console.log("SObject===>", sobjectDescribe.recordTypeInfos)

        let columns = sobjectDescribe.fields.map((eachField) => {
            return eachField.name
        })
        for (let column of columns) {
            queryString += column + ',';
        }
        queryString = queryString.slice(0, -1); // remove trailing comma
        queryString += ' FROM ' + table;
        queryString += ` WHERE Start_Date__c <= ${todayDate} AND End_Date__c >= ${todayDate} `;
        let goals = await sfConnection.query(queryString);
        let timeoutHandler;
        res.setHeader('Content-Type', 'application/json');
        // Time Out Check
        // timeoutHandler = setTimeout(() => {
        //     res.write('');
        // }, 20000);
        // Time Out Check
        res.status(200).json({ isError: false, isAuth: true, goals: goals.records })
    }
    catch (e) {
        // console.log(e);
        // res.status(500).json({isError : true,isAuth : true,message : e});
        console.log(e);
        res.status(500).json({ isError: true, isAuth: true, message: e });

    }

};

exports.postPOSMItems = async (req, res) => {
    try {

        let sfConnection = req.conn;
        let posmTable = 'POSM_Requisition__c';
        let posmLineItemsTable = 'POSM_Line_Item__c';

        console.log(req.body.data.posm)

        if(req.body.data.posm.length > 0){
            for(let i=0;i<req.body.data.posm.length;i++){

                let eachPOSM = req.body.data.posm[i]
    
                eachPOSM.POSM_Requisition__c.Requisition_Date__c = formatDate(eachPOSM.POSM_Requisition__c.Requisition_Date__c)
    
                let createRequisition = await sfConnection.sobject(posmTable).create(eachPOSM['POSM_Requisition__c'])
                let posLineItems;
    
                console.log("Create Requisition===>",createRequisition)
    
                //Output ---> { id: 'a0fBi0000005yJhIAI', success: true, errors: [] }
                if(createRequisition){
                    posLineItems = eachPOSM.POSM_Line_Item__c.map((eachLineItem)=>{
                        delete eachLineItem.quantity
                        delete eachLineItem.image
                        delete eachLineItem.checkBox
                        return {
                            ...eachLineItem,
                            POSM_Requisition__c: createRequisition.id
                        }
            
                    })
    
                }
                console.log("Line Items to be inserted===>",posLineItems)
                let createLineItems = await sfConnection.sobject(posmLineItemsTable).create(posLineItems)
                console.log("Create Requisition Line Items===>",JSON.stringify(createLineItems))

                if(req.body.data.posm[i].images.length > 0){
                    console.log("Images to be posted===>",req.body.data.posm[i].images)
                    let createImages = await sfConnection.sobject('ContentVersion').create(req.body.data.posm[i].images)
    
                    console.log("Create Images===>",JSON.stringify(createImages))
                }
                
            }
        }



        res.status(200).json({ isError: false, isAuth: true, message: "POSM items posted successfully" })

        
    } catch (e) {
        console.log("Error in Posting POS Items",e)
        res.status(500).json({ isError: true, isAuth: true, message: e });

    }
};


exports.fetchSample = async (req, res) => {
    try {
        let sfConnection = req.conn;
        let table = req.body.table;
        let queryString = 'SELECT ';
        let todayDate = new Date().toISOString().split('T')[0]

        let sobjectDescribe = await sfConnection.sobject(table).describe();


        //     Title: "File name for visibility"
        // };

        // let createFile = await sfConnection.sobject('ContentVersion').create(contentVersionData)

        // console.log("CreateFile", createFile)



        let recordTypes = sobjectDescribe.recordTypeInfos

        //console.log("SObject===>",sobjectDescribe.recordTypeInfos)

        let columns = sobjectDescribe.fields.map((eachField) => {
            return eachField.name
        })
        for (let column of columns) {
            queryString += column + ',';
        }
        queryString = queryString.slice(0, -1); // remove trailing comma
        queryString += ' FROM ' + table;
        //queryString += ` WHERE isActive=true `;
        console.log(queryString)
        let goals = await sfConnection.query(queryString);
        //let sobjectUpsert = await sfConnection.upsert(table,goals.records[0],goals.records[0].Id)
        //console.log("Upsert====>",sobjectUpsert)
        let timeoutHandler;
        res.setHeader('Content-Type', 'application/json');
        // Time Out Check
        // Time Out Check
        res.status(200).json({
            isError: false,
            isAuth: true,
            fields: columns,
            goals: goals.records,
            recordTypes: recordTypes
        })
    }
    catch (e) {
        // console.log(e);
        // res.status(500).json({isError : true,isAuth : true,message : e});
        console.log(e);
        res.status(500).json({ isError: true, isAuth: true, message: e });

    }

};

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

// exports.salesOrderSync = async (request) => {

//     try{

//         let sfConnection = request.conn;
//         let table = req.body.table;
//         let queryString = 'SELECT ';
//         let todayDate = new Date().toISOString().split('T')[0]

//         let sobjectDescribe = await sfConnection.sobject(table).describe();

//     }catch(e){

//     }
              
// }




