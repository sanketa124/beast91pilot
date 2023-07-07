exports.marketInventories = async (req, res) => {
    try {
        let sfConnection = req.conn;
        let maxDate = await sfConnection.query(`SELECT MAX(Inventory_Date__c) FROM Market_Inventory__c`)
        console.log("Max Date===>",maxDate.records[0].expr0)
        let table = 'Market_Inventory__c';
        let queryString = 'SELECT ';
        let todayDate = new Date().toISOString().split('T')[0]

        let sobjectDescribe = await sfConnection.sobject(table).describe();

        let columns = sobjectDescribe.fields.map((eachField) => {
            return eachField.name
        })
        for (let column of columns) {
            queryString += column + ',';
        }
        queryString = queryString.slice(0, -1); // remove trailing comma
        queryString += ' FROM ' + table;
        queryString += ` WHERE Inventory_Date__c = ${maxDate.records[0].expr0}`;
        let inventories = await sfConnection.query(queryString);
        let timeoutHandler;
        res.setHeader('Content-Type', 'application/json');
        // Time Out Check
        res.status(200).json({ isError: false, isAuth: true, data: inventories.records })
    }
    catch (e) {
        // console.log(e);
        // res.status(500).json({isError : true,isAuth : true,message : e});
        console.log(e);
        res.status(500).json({ isError: true, isAuth: true, message: e });

    }

};