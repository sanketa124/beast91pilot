exports.fetchPayOutSlabs = async (req, res) => {
    try {
        let sfConnection = req.conn;
        let slabs = await sfConnection.sobject("Payout_Slab__c").find()
        let timeoutHandler;
        res.setHeader('Content-Type', 'application/json');
        // Time Out Check
        timeoutHandler = setTimeout(() => {
            res.write('');
        }, 20000);
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
        timeoutHandler = setTimeout(() => {
            res.write('');
        }, 20000);
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

        console.log(req.body.data['POSM_Requisition__c'])

        let createRequisition = await sfConnection.sobject(posmTable).create(req.body.data['POSM_Requisition__c'])

        //Output ---> { id: 'a0fBi0000005yJhIAI', success: true, errors: [] }
        let posLineItems = req.body.data.POSM_Line_Item__c.map((eachLineItem)=>{
            return {
                ...eachLineItem,
                POSM_Requisition__c: createRequisition.id
            }

        })

        let createLineItems = await sfConnection.sobject(posmLineItemsTable).create(posLineItems)
        
        // if(req.body.data.images.length > 0){
        //     let createImages = await sfConnection.sobject('ContentVersion').create(req.body.data.images)
        // }

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

        const contentVersionData = {
            PathOnClient: "fileName.png", 
            VersionData: "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",
            Title: "File name for visibility"
        };

        let createFile = await sfConnection.sobject('ContentVersion').create(contentVersionData)

        console.log("CreateFile", createFile)



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
        queryString += ` WHERE isActive=true `;
        console.log(queryString)
        let goals = await sfConnection.query(queryString);
        //let sobjectUpsert = await sfConnection.upsert(table,goals.records[0],goals.records[0].Id)
        //console.log("Upsert====>",sobjectUpsert)
        let timeoutHandler;
        res.setHeader('Content-Type', 'application/json');
        // Time Out Check
        timeoutHandler = setTimeout(() => {
            res.write('');
        }, 20000);
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




