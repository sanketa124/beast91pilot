
exports.fetchEvents = async (req, res) => {
    try {
        console.log(":::::::::::::EVENTS SYNC :::::::::::::::")
        const sfConnection = req.conn;
        let tasks = req.body.tasks;
        let cases = req.body.case;
        console.log(":::::::::::::EVENTS CASE DATA :::::::::::::::", cases)
        const syncDateTime = req.syncDateTime;
        let events = null;
        let casesList = []
        let standardEvents = null;
        let stateClusterMappingArr = [];
        let territoryRecords;
        let draftInstallationPendingApproval;
        if (tasks.length > 0) {
            tasks = tasks.map(ele => {
                delete ele.Unique_Identifier__c;
                return ele;
            });
            const taskUpdate = tasks.filter(ele => ele.Id);
            const taskInsert = tasks.filter(ele => !ele.Id);
            await sfConnection.sobject('Task').insert(taskInsert);
            await sfConnection.sobject('Task').update(taskUpdate);

        }
        if (cases && cases.length > 0) {
            cases = cases.map(item => {
                if (item.Unique_Identifier__c) {
                    delete item.Id;
                    delete item.Unique_Identifier__c;
                    delete item.isSynced
                } else {
                    delete item.isSynced
                }
                if (item.Unique_Identifier__c == null)
                    delete item.Unique_Identifier__c;
                return item;
            });
            console.log(cases, "cases----------------------------888888888888888");
            const caseUpdate = cases.filter(item => item.Id);
            const caseInsert = cases.filter(item => !item.Id);
            const d = await sfConnection.sobject('Case').insert(caseInsert);
            const q = await sfConnection.sobject('Case').update(caseUpdate);
            // console.log(caseUpdate,"demo1",JSON.stringify(q))
            // console.log(caseInsert,"demo",JSON.stringify(d))
        }

        if (req.body.nonSales.isTech) {
            events = await sfConnection.query(`
SELECT 
  Check_In__latitude__s, 
  Check_In__longitude__s, 
  End_date_and_time__c, 
  Distance_from_Account__c, 
  Time_Spent_in_Outlet__c, 
  Start_date_and_time__c, 
  Name, 
  Account__c, 
  Id, 
  Account__r.Beer_Selection__c, 
  Account__r.L3M_Billed_Liquids__c, 
  Account__r.Name, 
  Account__r.Account_Status__c, 
  Account__r.BillingStreet, 
  Account__r.Sub_Channel__c, 
  Account__r.Industry_Segment__c, 
  Account__r.Draft_Status__c, 
  Account__r.Geolocation__c Account__r.BillingCity, 
  Account__r.BillingPostalCode, 
  Account__r.BillingState, 
  Account__r.BillingCountry, 
  Account__r.Beacon_Flag__c, 
  Account__r.QCO_Flag__c, 
  Account__r.Bira_Segment__c, 
  Account__r.Id, 
  Account__r.Industry_Segment__c, 
  Account__r.Industry_Segment_Mass__c, 
  Account__r.Draft_Ready__c, 
  Account__r.Channel__c, 
  Account__r.Sub_Channel__c, 
  Account__r.L1M_Billed_Liquids__c, 
  Account__r.Recent_Retail_Depletion__c, 
  Account__r.Recent_Activity_Date_Time__c, 
  Completed__c, 
  Actual_Start_Visit__c, 
  Actual_End_Visit__c, 
  Type__c, 
  Draft_Installation__c, 
  Draft_Installation__r.Recent_Preventive_Maintenance_Date__c, 
  Draft_Installation__r.Recent_Sanitization_Date__c, 
  Draft_Installation__r.Confirmed_with_the_outlet_owner_for_inst__c, 
  Draft_Installation__r.Recommended_Machine_Type_Sales__c, 
  Draft_Installation__r.Recommended_Tower_Type_Sales__c, 
  Draft_Installation__r.Display_Machine_Id__c, 
  Draft_Installation__r.Over_the_counter_space_required__c, 
  Draft_Installation__r.Under_the_counter_space_required__c, 
  Draft_Installation__r.Location_of_Draft_machine__c, 
  Draft_Installation__r.KYC__r.Tin_Number__c, 
  Draft_Installation__r.KYC__r.PAN_number__c, 
  Draft_Installation__r.Machine_Id_Not_Sign_Up__c, 
  Draft_Installation__r.Recommended_Machine_type__c, 
  Draft_Installation__r.Number__c, 
  Draft_Installation__r.Recommended_Tower_Type__c, 
  Draft_Installation__r.Draft_Sign_up__c, 
  Draft_Installation__r.Draft_Sign_up__r.Number__c, 
  Draft_Installation__r.Draft_Sign_up__r.Active_Liquids__c, 
  Draft_Installation__r.App_Id__c, 
  Draft_Installation__r.Draft_Installation__c, 
  App_Id__c, 
  Draft_Installation__r.Draft_Sign_up__r.Recommended_Machine_Type_Sales__c, 
  Draft_Installation__r.Draft_Sign_up__r.Recommended_Tower_Type_Sales__c,
  RecordTypeId 
FROM 
  Event__c 
WHERE 
  Start_date_and_time__c >= LAST_90_DAYS 
  AND Type__c != null 
  AND RecordType.DeveloperName = 'Technician' 
  AND OwnerId = '${req.conn.userInfo.id}' 
ORDER BY 
  Start_date_and_time__c DESC
            `);
        }
        else if (req.body.nonSales.isAudit) {
            events = await sfConnection.query(`
SELECT 
  Check_In__latitude__s, 
  Check_In__longitude__s, 
  End_date_and_time__c, 
  Distance_from_Account__c, 
  Time_Spent_in_Outlet__c, 
  Start_date_and_time__c, 
  Name, 
  Account__c, 
  Id, 
  Account__r.Beer_Selection__c, 
  Account__r.L3M_Billed_Liquids__c, 
  Account__r.Name, 
  Account__r.Account_Status__c, 
  Account__r.BillingStreet, 
  Account__r.BillingCity, 
  Account__r.BillingPostalCode, 
  Account__r.Sub_Channel__c, 
  Account__r.Draft_Status__c, 
  Account__r.BillingState, 
  Account__r.BillingCountry, 
  Account__r.Beacon_Flag__c, 
  Account__r.QCO_Flag__c, 
  Account__r.Bira_Segment__c, 
  Account__r.Id, 
  Account__r.Industry_Segment__c, 
  Account__r.Geolocation__c, 
  Account__r.Industry_Segment_Mass__c, 
  Account__r.Draft_Ready__c, 
  Account__r.Channel__c, 
  Account__r.L1M_Billed_Liquids__c, 
  Account__r.Recent_Retail_Depletion__c, 
  Account__r.Recent_Activity_Date_Time__c, 
  Completed__c, 
  Actual_Start_Visit__c, 
  Actual_End_Visit__c, 
  Type__c, 
  Draft_Installation__c, 
  Draft_Installation__r.Recommended_Machine_Type_Sales__c, 
  Draft_Installation__r.Recommended_Tower_Type_Sales__c, 
  Draft_Installation__r.Display_Machine_Id__c, 
  Draft_Installation__r.Over_the_counter_space_required__c, 
  Draft_Installation__r.Under_the_counter_space_required__c, 
  Draft_Installation__r.Location_of_Draft_machine__c, 
  Draft_Installation__r.KYC__r.Tin_Number__c, 
  Draft_Installation__r.KYC__r.PAN_number__c, 
  Draft_Installation__r.Machine_Id_Not_Sign_Up__c, 
  Draft_Installation__r.Recommended_Machine_type__c, 
  Draft_Installation__r.Recommended_Tower_Type__c, 
  Draft_Installation__r.Draft_Sign_up__c, 
  Draft_Installation__r.Draft_Sign_up__r.Active_Liquids__c, 
  Draft_Installation__r.App_Id__c, 
  Draft_Installation__r.Draft_Installation__c, 
  App_Id__c 
FROM 
  Event__c 
WHERE 
  Start_date_and_time__c >= LAST_90_DAYS 
  AND Type_of_Visit__c != null 
  AND RecordType.DeveloperName = 'Auditor' 
  AND OwnerId = '${req.conn.userInfo.id}' 
ORDER BY 
  Start_date_and_time__c DESC

            `);
        }
        else {
            events = await sfConnection.query(`
SELECT 
  Type_of_Visit__c, 
  Check_In__latitude__s, 
  Check_In__longitude__s, 
  Distance_from_Account__c, 
  Time_Spent_in_Outlet__c, 
  End_date_and_time__c, 
  Start_date_and_time__c, 
  Name, 
  Account__c, 
  Id, 
  Account__r.Beer_Selection__c, 
  Account__r.L3M_Billed_Liquids__c, 
  Account__r.Name, 
  Account__r.Account_Status__c, 
  Account__r.BillingStreet, 
  Account__r.BillingCity, 
  Account__r.Sub_Channel__c, 
  Account__r.Draft_Status__c, 
  Account__r.BillingPostalCode, 
  Account__r.BillingState, 
  Account__r.BillingCountry, 
  Account__r.Beacon_Flag__c, 
  Account__r.QCO_Flag__c, 
  Account__r.Bira_Segment__c, 
  Account__r.Id, 
  Account__r.Industry_Segment__c, 
  Account__r.Geolocation__c, 
  Account__r.Industry_Segment_Mass__c, 
  Account__r.Draft_Ready__c, 
  Account__r.Channel__c, 
  Account__r.L1M_Billed_Liquids__c, 
  Account__r.Recent_Retail_Depletion__c, 
  Account__r.Recent_Activity_Date_Time__c, 
  Completed__c, 
  Actual_Start_Visit__c, 
  Actual_End_Visit__c, 
  Type__c, 
  Draft_Installation__r.Payment_Status__c, 
  Draft_Installation__r.Display_Machine_Id__c, 
  Draft_Pullout__r.Draft_Pre_Installation__r.Recommended_Machine_type__c, 
  Draft_Pullout__r.Draft_Pre_Installation__r.Recommended_Tower_Type__c, 
  Draft_Pullout__r.Draft_Sign_up__r.Number__c, 
  Draft_Pullout__r.Draft_Sign_up__r.Recommended_Machine_Type_Sales__c, 
  Draft_Pullout__r.Draft_Sign_up__r.Recommended_Tower_Type_Sales__c, 
  Draft_Pullout__r.Draft_Sign_up__r.Location_of_Draft_machine__c, 
  Account__r.Cluster__r.Name, 
  Draft_Pullout__r.App_Id__c,
  RecordTypeId 
FROM 
  Event__c 
WHERE 
  Start_date_and_time__c >= LAST_90_DAYS 
  AND RecordType.DeveloperName = 'Salesperson' 
  AND OwnerId = '${req.conn.userInfo.id}' 
ORDER BY 
  Start_date_and_time__c DESC`);
            draftInstallationPendingApproval = await sfConnection.query(`
SELECT 
  Account__c, 
  Account__r.Channel__c, 
  Account__r.Account_Status__c, 
  Account__r.Name, 
  Account__r.L1M_Billed_Liquids__c, 
  Account__r.L3M_Billed_Liquids__c, 
  Account__r.Recent_Retail_Depletion__c, 
  Account__r.Beer_Selection__c, 
  Account__r.Bira_Segment__c, 
  Account__r.Industry_Segment__c, 
  Account__r.Industry_Segment_Mass__c, 
  Account__r.Beacon_Flag__c, 
  Account__r.Draft_Ready__c, 
  Account__r.QCO_Flag__c, 
  Draft_Sign_up__r.Recommended_Machine_Type_Sales__c, 
  Draft_Sign_up__r.Recommended_Tower_Type_Sales__c, 
  Recommended_Tower_Type__c, 
  Account__r.Geolocation__c, 
  Recommended_Machine_type__c, 
  Over_the_counter_space_required__c, 
  Under_the_counter_space_required__c, 
  Location_of_Draft_machine__c, 
  Reason_for_Change__c, 
  Id, 
  App_Id__c, 
  Status__c, 
  Machine_Id_Not_Sign_Up__c, 
  Confirmed_with_the_outlet_owner_for_inst__c, 
  RecordType.Name,
  RecordTypeId 
FROM 
  Draft_Installation__c 
WHERE 
  Status__c = 'Submitted to SO' 
  AND Draft_Sign_up__r.CreatedBy.Id = '${req.conn.userInfo.id}'`);
        }

        standardEvents = await sfConnection.query(`Select Id,WhatId,StartDateTime, Description, EndDateTime, Location, Subject from Event WHERE StartDateTime>=LAST_90_DAYS AND Custom_Event__c=null AND OwnerId='${req.conn.userInfo.id}' ORDER BY StartDateTime DESC`);

        casesList = await sfConnection.query('Select Id, Issue_Resolved__c,AccountId,Priority,Event__c,Issue_Type__c,Settlement_Date__c,Type from Case Where Issue_Resolved__c = false');
        //  console.log(casesList,"casesList casesListcasesListcasesListcasesListcasesLists");
        let taskList = await sfConnection.query('SELECT  WhatId, What.Name, What.Id, Priority,Subject,Description,ActivityDate,Status,Id,OwnerId FROM Task WHERE ActivityDate>=LAST_90_DAYS  ORDER BY ActivityDate DESC');
        let Acc = await sfConnection.query('SELECT  Id, Name FROM Account');
        //let LapsedAccountDetails = await sfConnection.query("SELECT  Id, Name,Recent_Retail_Depletion__c,BillingStreet,BillingAddress,Recent_Activity_Date_Time__c,Draft_Status__c,Beacon_Flag__c,Channel__c,Draft_Ready__c,Sub_Channel__c,QCO_Flag__c,Industry_Segment__c FROM Account Where Account_Status__c != \'Permanently Closed\' and Recent_Retail_Depletion__c < LAST_90_DAYS and RecordTypeId IN (\'0122w000000Y7wvAAC\', \'0122w000000Y7wyAAC\',\'0122w000000Y7wzAAC\',\'0122w000000Y7wxAAC\',\'0122w000000Y7x2AAC\',\'0122w000000Y7wuAAC\',\'0122w000000Y7wtAAC\') ");
        //let NeverBilledAccounts = await sfConnection.query("SELECT  Id, Name,Recent_Retail_Depletion__c,BillingStreet,BillingAddress,Recent_Activity_Date_Time__c,Draft_Status__c,Beacon_Flag__c,Channel__c,Draft_Ready__c,Sub_Channel__c,QCO_Flag__c,Industry_Segment__c FROM Account Where Account_Status__c != \'Permanently Closed\' and  RecordTypeId IN (\'0122w000000Y7wvAAC\', \'0122w000000Y7wyAAC\',\'0122w000000Y7wzAAC\',\'0122w000000Y7wxAAC\',\'0122w000000Y7x2AAC\',\'0122w000000Y7wuAAC\',\'0122w000000Y7wtAAC\') and Recent_Retail_Depletion__c = null");
        //let recordType = await sfConnection.query('SELECT Id FROM RecordType where SobjectType = \'Account\' and DeveloperName IN (\'Lead\',\'On_Premise_General\',\'Off_Premise_Outlet\',\'On_Premise_Hotel\',\'Institutional_On_Premise\',\'Institutional_Off_Premise\',\'Wholesaler\') and isActive =true');
        let LapsedAccountDetails = await sfConnection.query(`SELECT  Id, Name,Recent_Retail_Depletion__c,BillingStreet,BillingAddress,Recent_Activity_Date_Time__c,Draft_Status__c,Beacon_Flag__c,Channel__c,Draft_Ready__c,Sub_Channel__c,QCO_Flag__c,Industry_Segment__c FROM Account Where Account_Status__c != \'Permanently Closed\' and Recent_Retail_Depletion__c < LAST_90_DAYS and RecordTypeId IN (SELECT Id FROM RecordType where SobjectType = \'Account\'  and isActive = true and DeveloperName IN (\'Lead\',\'On_Premise_General\',\'Off_Premise_Outlet\',\'On_Premise_Hotel\',\'Institutional_On_Premise\',\'Institutional_Off_Premise\',\'Wholesaler\') ) `);
        let NeverBilledAccounts = await sfConnection.query("SELECT  Id, Name,Recent_Retail_Depletion__c,BillingStreet,BillingAddress,Recent_Activity_Date_Time__c,Draft_Status__c,Beacon_Flag__c,Channel__c,Draft_Ready__c,Sub_Channel__c,QCO_Flag__c,Industry_Segment__c FROM Account Where Account_Status__c != \'Permanently Closed\' and  RecordTypeId IN (SELECT Id FROM RecordType where SobjectType = \'Account\'  and isActive = true and DeveloperName IN (\'Lead\',\'On_Premise_General\',\'Off_Premise_Outlet\',\'On_Premise_Hotel\',\'Institutional_On_Premise\',\'Institutional_Off_Premise\',\'Wholesaler\')) and Recent_Retail_Depletion__c = null");
        taskList = taskList.records.map(ele => {
            ele.Unique_Identifier__c = ele.Id;
            Acc.records.map(elem => {
                if (elem.Id == ele.WhatId) {
                    ele.AccountName = elem.Name
                }
            })
            return ele;
        });
        let lapAcc = LapsedAccountDetails
        if (req.body.nonSales.isSales) {
            let stateClusterMapping = await sfConnection.query(`SELECT Name,Id,RecordType.DeveloperName,Country__c,District__c,State__c,(SELECT Cluster__r.Name, Cluster__c FROM Cluster_State_Mappings__r ORDER BY Cluster__r.Name) FROM Geo_Hierarchy__c   ORDER BY Name`);
            let isCompleted = false;
            isCompleted = stateClusterMapping.done;
            stateClusterMappingArr = stateClusterMappingArr.concat(stateClusterMapping.records);
            while (!isCompleted) {

                let queryLocator = stateClusterMapping.nextRecordsUrl;
                isCompleted = stateClusterMapping.done;
                if (!isCompleted) {
                    stateClusterMapping = await sfConnection.queryMore(queryLocator);
                    stateClusterMappingArr = stateClusterMappingArr.concat(stateClusterMapping.records);
                }
            }
            territoryRecords = await sfConnection.query(`SELECT Name,Id,RecordType.DeveloperName,Division__c,Zone__c,Business_Hierarchy__c FROM Cluster__c  ORDER BY Name`);
        }
        let eventObjects = await sfConnection.sobject('Event__c').describe()
        let eventRecordTypes = eventObjects.recordTypeInfos
        //  console.log("EventRecordTypes",eventRecordTypes)
        //console.log(LapsedAccountDetails,"AccountDetails");
        //res.status(200).json({isError : false,isAuth : true, NBA:NeverBilledAccounts,lapsedAcc: lapAcc, events :events ?  events.records : [],taskList : taskList,stateClusterMapping : stateClusterMappingArr.length>0 ? stateClusterMappingArr :[],territoryRecords : territoryRecords ? territoryRecords.records : [],draftInstallationPendingApproval : draftInstallationPendingApproval ? draftInstallationPendingApproval.records : [], standardEvents : standardEvents ? standardEvents.records : [] });
        res.status(200).json({
            isError: false,
            isAuth: true,
            issueList: casesList ? casesList.records : [],
            NBA: NeverBilledAccounts,
            lapsedAcc: lapAcc,
            events: events ? events.records : [],
            taskList: taskList,
            stateClusterMapping: stateClusterMappingArr.length > 0 ? stateClusterMappingArr : [],
            territoryRecords: territoryRecords ? territoryRecords.records : [],
            draftInstallationPendingApproval: draftInstallationPendingApproval ? draftInstallationPendingApproval.records : [],
            standardEvents: standardEvents ? standardEvents.records : [],
            eventRecordTypes: eventRecordTypes ? eventRecordTypes : []
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ isError: true, isAuth: true, message: 'Error occurred' });
    }
};

exports.fetchIssues = async (req, res) => {
    try {
        console.log(":::::::::::::Issues SYNC :::::::::::::::")
        const sfConnection = req.conn;
        let cases = req.body.case;
        //   console.log(":::::::::::::Issues cases SYNC :::::::::::::::", cases)
        const syncDateTime = req.syncDateTime;
        if (cases.length > 0) {
            cases = cases.map(item => {
                delete item.Id;
                return item;
            });
            const caseUpdate = cases.filter(item => item.Id);
            const caseInsert = cases.filter(item => !item.Id);
            const d = await sfConnection.sobject('Case').insert(caseInsert);
            const q = await sfConnection.sobject('Case').update(caseUpdate);
            console.log(caseUpdate, "demo1")
            console.log(caseInsert, "demo")
        }

        let casesList = await sfConnection.query('Select Id,AccountId,Priority,Event__c,Issue_Type__c,Settlement_Date__c,Type from Case');
        res.status(200).json({ isError: false, isAuth: true, issueList: casesList })
    }
    catch (e) {
        console.log(e, "------------------------------------------");
        res.status(500).json({ isError: true, isAuth: true, message: 'Error occurred' });
    }
};
// Fetching item records
exports.itemFetchController = async (req, res) => {
    try {
        let sfConnection = req.conn;
        const syncDateTime = req.syncDateTime;
        let clusterLiquids = null;
        let items = null;
        let top5SKU = [];
        let queryString = 'SELECT Liquid_Name__c,Liquid_Id__c,Has_Keg_Item__c,Product__r.isActive,Id,Product__c,Product__r.Name,Product__r.Display_Name__c,Total_Billing_Price__c,Total_Tax__c,State__r.Name,Product__r.Size_ID__r.Pack_Type__c,Product__r.Size_ID__r.Volume_Unit__c,Product__r.Size_ID__r.UOM_of_Primary_Conversion__c,Variant__c,Product__r.Variant_ID__c,Pack_Size__c,Product__r.Portfolio__c FROM Price_Master__c ';
        let table = 'Product2';
        let itemQueryString = 'SELECT ';

        let sobjectDescribe = await sfConnection.sobject(table).describe();

        let itemMasterRecordTypes = sobjectDescribe.recordTypeInfos


        let columns = sobjectDescribe.fields.map((eachField) => {
            return eachField.name
        })
        for (let column of columns) {
            itemQueryString += column + ',';
        }
        itemQueryString = itemQueryString.slice(0, -1); // remove trailing comma
        itemQueryString += ' FROM ' + table;
        if (syncDateTime) {
            queryString += ' WHERE LastModifiedDate >= ' + syncDateTime;
        }
        items = await sfConnection.query(queryString);
        masterItems = await sfConnection.query(itemQueryString);
        if (req.body.nonSales.isSales) {
            clusterLiquids = await sfConnection.query(`SELECT Cluster__c,Liquid__c,Liquid_Name__c,is_Draft_Available__c FROM Cluster_Liquid_Mapping__c`);
        }
        top5SKU = await sfConnection.query('SELECT Channel__c, Cluster__c, Item_Master__c,Id FROM Top_5_SKU__c');
        const slabs = await sfConnection.sobject("Payout_Slab__c").find()
        res.status(200).json(
            {
                isError: false,
                isAuth: true,
                items: items ? items.records : [],
                clusterLiquids: clusterLiquids ? clusterLiquids.records : [],
                top5SKU: top5SKU ? top5SKU.records : [],
                slabs: slabs ? slabs.records : [],
                masterItems: masterItems ? masterItems.records : [],
                itemMasterRecordTypes: itemMasterRecordTypes
            }
        );
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ isError: true, isAuth: true, message: e });
    }
};

//Fetching images related to the items passed 
exports.itemImagesFetch = async (req, res) => {
    try {
        const syncDateTime = req.body.syncDateTime;
        let sfConnection = req.conn;
        const itemIds = req.body.itemIds;
        let body = { itemIdsString: itemIds, modifiedDate: syncDateTime };
        let apexWrapper = await sfConnection.apex.post('/Images/', body);
        let contentVersionIds = [];
        let itemIdWithContentId = new Map();
        apexWrapper.forEach(ele => {
            contentVersionIds.push(ele.base64Image);
            itemIdWithContentId.set(ele.base64Image, ele.picId);
        });

        require('../utility/sfSoapHelper').fetchContentVersion(req, contentVersionIds, (arr) => {
            let itemImagesList = [];
            if (arr && arr.result) {
                arr.result.forEach(ele => {
                    if (itemIdWithContentId.has(ele.Id)) {
                        itemImagesList.push({
                            base64Image: ele.VersionData,
                            picId: itemIdWithContentId.get(ele.Id)
                        });

                    }
                });
            }
            res.status(200).json({ isError: false, isAuth: true, images: itemImagesList });
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ isError: true, isAuth: true, message: e });
    }
};

exports.objectiveSync = async (req, res) => {
    try {
        let event = req.body.events;
        let kycDetail = req.body.kycDetail;
        let salesOrder = req.body.salesOrder;
        let stockVisibilites = req.body.stockVisibility;
        let sfConnection = req.conn;
        let competitorInsight = req.body.competitorInsight;
        let dailyTracker = req.body.dailyTracker;
        let productSampling = req.body.productSampling;
        let posm = req.body.posm;
        let draftSignup = req.body.draftSignup;
        let draftPreInstallation = req.body.draftPreInstallation;
        let draftItems = [];
        let dealerWiseVisitInfo = {};
        let posmLine = [];
        let filesAttach = [];
        let dealerWiseVisitInfoJSON = '';
        let posmSetting = null;
        let draftStarterKit = null;
        let licenseTypeStateWise = null;
        let scheduleVisits = req.body.scheduleVisit;
        let draftSanitization = req.body.draftSanitization;
        let preventiveMaintenance = req.body.preventiveMaintenance;
        let draftPullout = req.body.draftPullout;
        kycDetail = kycDetail.map(ele => {
            if (!ele.Estimated_Date_of_Approval) {
                ele.Estimated_Date_of_Approval = null;
            }
            return ele;
        });

        for (eve of event) {
            let event_data = {
                'End_date_and_time__c': eve.End_date_and_time__c,
                'Start_date_and_time__c': eve.Start_date_and_time__c,
                'Account__c': eve.Account__c,
                'Id': eve.Id,
                'Completed__c': eve.Completed__c,
                'Actual_Start_Visit__c': eve.Actual_Start_Visit__c,
                'Actual_End_Visit__c': eve.Actual_End_Visit__c,
                'Type__c': null,
                'RecordTypeId': eve.RecordTypeId,
                'Check_In__Latitude__s': eve.Check_In__Latitude__s,
                'Check_In__Longitude__s': eve.Check_In__Longitude__s,
                'Check_Out__Latitude__s': eve.Check_Out__Latitude__s,
                'Check_Out__Longitude__s': eve.Check_Out__Longitude__s
            }
            sfConnection.sobject("Event__c")
                .update(event_data, function (err, rets) {
                    if (err) {
                        return console.error(err);
                    }
                    if (err || !rets.success) {
                        console.log("Error on updating contact", JSON.stringify(err));
                        return console.error(err, rets);
                    }
                    console.log("Updated Successfully : " + rets.id);

                    for (var i = 0; i < rets.length; i++) {
                        if (rets[i].success) {
                            console.log("Updated Successfully : " + rets[i].id);
                        }
                    }
                });
        }

        let body = {
            User_Name: req.body.username,
            stockVisibilites: JSON.stringify(stockVisibilites),
            //SalesOrders: JSON.stringify(salesOrder),
            competitorInsightJSON: JSON.stringify(competitorInsight),
            accountJSON: JSON.stringify(kycDetail),
            dailyTracker: JSON.stringify(dailyTracker),
            eventString: JSON.stringify(event),
            syncDateTime: req.body.syncDateTime,
            productPreSalesSamples: JSON.stringify(productSampling)
        };
        dealerWiseVisitInfo = await sfConnection.apex.post('/ObjectivesCheckoutHelper/', body);
        if(stockVisibilites &&  stockVisibilites.length>0 && stockVisibilites[0].stock_at_risk_images.length > 0){
            const imageBodyArr = stockVisibilites[0].stock_at_risk_images;
            const imageBody = imageBodyArr.map(obj => {
                const updatedObj = { ...obj }; 
                delete updatedObj['id'];
                return updatedObj;
            });
            await postStockImages(req.conn, imageBody);
        }

        if (stockVisibilites && stockVisibilites.length > 0 && stockVisibilites[0].liquidPromotion) {
            const promotionBody = stockVisibilites[0].liquidPromotion && stockVisibilites[0].liquidPromotion;
            const liquidPromotionData = {
                conn: req.conn,
                liquidPromotionData: promotionBody
            }
            await updateLiquidPromotion(liquidPromotionData, res);
        }

        if (req.body.contactMeeting && req.body.contactMeeting.length > 0) {
            const reqContactMeetingData = {
                conn: req.conn,
                contactMeetingData: req.body.contactMeeting
            }
            await updateContactMeeting(reqContactMeetingData, res);
        }



        dealerWiseVisitInfoJSON = JSON.parse(dealerWiseVisitInfo);

        // Draft Pre Installation
        if (draftPreInstallation.length > 0) {
            draftPreInstallation = draftPreInstallation.map(ele => {
                draftItems = draftItems.concat(ele.items);
                delete ele.items;
                if (ele['Over_the_counter_space_required_File']) {
                    filesAttach.push({
                        base64: ele['Over_the_counter_space_required_File'],
                        typeOfObjective: 'Draft Pre-Installation',
                        accountId: ele.Account__c,
                        objectiveId: ele.App_Id__c,
                        fieldName: 'Over the Counter Space Available Image (Technician)'
                    });
                }
                if (ele['Under_the_counter_space_required_File']) {
                    filesAttach.push({
                        base64: ele['Under_the_counter_space_required_File'],
                        typeOfObjective: 'Draft Pre-Installation',
                        accountId: ele.Account__c,
                        objectiveId: ele.App_Id__c,
                        fieldName: 'Under the Counter Space Available Image (Technician)'
                    });
                }
                ele.App_Created_Date__c = formatDate(ele.App_Created_Date__c);
                delete ele['Under_the_counter_space_required_File'];
                delete ele['Over_the_counter_space_required_File'];
                return ele;
            });

        }
        // Draft Pre Installation
        // Draft Sanitization and Preventive Maintenance
        if (draftSanitization && draftSanitization.length > 0) {
            draftSanitization = draftSanitization.map(ele => {
                delete ele.isSynced;
                ele.App_Created_Date__c = formatDate(ele.App_Created_Date__c);
                if (ele.items && ele.items.length > 0)
                    draftItems = draftItems.concat(ele.items);
                delete ele.items;
                if (ele.liquidItems && ele.liquidItems.length > 0)
                    draftItems = draftItems.concat(ele.liquidItems);
                delete ele.liquidItems;
                for (let i in ele) {
                    if (i.includes('File')) {
                        filesAttach.push({
                            base64: ele[i],
                            typeOfObjective: 'Draft Sanitization',
                            accountId: ele.Account__c,
                            objectiveId: ele.App_Id__c,
                            fieldName: ele[i + '_Name']
                        });
                        delete ele[i];
                        delete ele[i + '_Name'];
                    }

                }
                return ele;
            });
        }
        if (preventiveMaintenance && preventiveMaintenance.length > 0) {
            preventiveMaintenance = preventiveMaintenance.map(ele => {
                delete ele.isSynced;
                ele.App_Created_Date__c = formatDate(ele.App_Created_Date__c);
                if (ele.items && ele.items.length > 0)
                    draftItems = draftItems.concat(ele.items);
                delete ele.items;
                if (ele.liquidItems && ele.liquidItems.length > 0)
                    draftItems = draftItems.concat(ele.liquidItems);
                delete ele.liquidItems;
                for (let i in ele) {
                    if (i.includes('File')) {
                        filesAttach.push({
                            base64: ele[i],
                            typeOfObjective: 'Preventive Maintenance',
                            accountId: ele.Account__c,
                            objectiveId: ele.App_Id__c,
                            fieldName: ele[i + '_Name']
                        });
                        delete ele[i];
                        delete ele[i + '_Name'];
                    }

                }
                return ele;
            });
        }
        // Draft Sanitization and Preventive Maintenance
        // Draft Pull Out
        if (draftPullout && draftPullout.length > 0) {
            draftPullout = draftPullout.map(ele => {
                delete ele.isSynced;
                ele.App_Created_Date__c = formatDate(ele.App_Created_Date__c);
                if (ele.items && ele.items.length > 0)
                    draftItems = draftItems.concat(ele.items);
                delete ele.items;
                for (let i in ele) {
                    if (i.includes('File')) {
                        filesAttach.push({
                            base64: ele[i],
                            typeOfObjective: 'Draft Pullout',
                            accountId: ele.Account__c,
                            objectiveId: ele.App_Id__c,
                            fieldName: ele[i + '_Name']
                        });
                        delete ele[i];
                        delete ele[i + '_Name'];
                    }

                }
                return ele;
            });
        }
        // Draft Pull Out
        // posm = posm.map(ele => {
        //     delete ele.isSynced;
        //     ele.Requisition_Date__c = formatDate(ele.Requisition_Date__c);
        //     //Output ---> { id: 'a0fBi0000005yJhIAI', success: true, errors: [] }
        //     let posLineItems = ele.POSM_Line_Item__c.map((eachLineItem) => {
        //         delete eachLineItem.quantity
        //         delete eachLineItem.checkBox
        //         delete eachLineItem.image
        //         return eachLineItem

        //     })
        //     console.log("POSM LIne Items===>",posLineItems)
        //     posmLine = posmLine.concat(posLineItems);
        //     delete ele.Created_Date;
        //     delete ele.POSM_Line_Item__c;
        //     delete ele.App_Id__c;
        //     let posmRequistion = ele.POSM_Requisition__c
        //     posmRequistion.Requisition_Date__c = formatDate(posmRequistion.Requisition_Date__c)
        //     return ele.posmRequistion;
        // });

        draftSignup = draftSignup.map(ele => {
            if (ele['Over_the_counter_space_available_File']) {
                filesAttach.push({
                    base64: ele['Over_the_counter_space_available_File'],
                    typeOfObjective: 'Draft Installation',
                    accountId: ele.Account__c,
                    objectiveId: ele.App_Id__c,
                    fieldName: 'Over the Counter Space Available Image'
                });
            }
            if (ele['Under_the_counter_space_available_File']) {
                filesAttach.push({
                    base64: ele['Under_the_counter_space_available_File'],
                    typeOfObjective: 'Draft Installation',
                    accountId: ele.Account__c,
                    objectiveId: ele.App_Id__c,
                    fieldName: 'Under the Counter Space Available Image'
                });
            }
            if ('Pullout_Date__c' in ele) {
                ele['Pullout_Date__c'] = new Date(ele['Pullout_Date__c']);
            }
            if ('Installation_Date__c' in ele) {
                ele['Installation_Date__c'] = new Date(ele['Installation_Date__c']);
            }
            if ('Requisition_Date__c' in ele) {
                ele['Requisition_Date__c'] = formatDate(new Date(ele['Requisition_Date__c']));
            }
            delete ele['Under_the_counter_space_available_File'];
            delete ele['Over_the_counter_space_available_File'];
            return ele;
        });

        // Draft Installation
        let draftInstallation = req.body.draftInstallation;
        if (draftInstallation && draftInstallation.length > 0) {
            draftInstallation = draftInstallation.map(ele => {

                if (ele.items && ele.items.length > 0)
                    draftItems = draftItems.concat(ele.items);
                delete ele.items;
                for (let i in ele) {
                    if (i.includes('File')) {
                        filesAttach.push({
                            base64: ele[i],
                            typeOfObjective: 'Draft Installation',
                            accountId: ele.Account__c,
                            objectiveId: ele.App_Id__c,
                            fieldName: ele[i + '_Name']
                        });
                        delete ele[i];
                        delete ele[i + '_Name'];
                    }

                }
                ele.App_Created_Date__c = formatDate(ele.App_Created_Date__c);
                return ele;
            });
        }
        // Draft Installation
        //Brand Freshness and Hygiene Item Addition to draftItem variable
        for (let i of req.body.auditorObjective) {
            if (i.Record_Type_Helper__c === 'Audit_Brand_Freshness_and_Hygiene_Audit' && i.brandFreshnessItems) {
                draftItems = draftItems.concat(i.brandFreshnessItems);
                delete i.brandFreshnessItems;
            }
        }
        //Brand Freshness and Hygiene Item Addition to draftItem variable
        // Draft Item Filter
        draftItems = draftItems.filter(ele => {
            if ('Keg_Expiry_Date__c' in ele && ele['Keg_Expiry_Date__c']) {
                ele['Keg_Expiry_Date__c'] = formatDate(ele['Keg_Expiry_Date__c']);


            }
            if ('Pullout_Quantity__c' in ele) {
                return ele;
            }

            if ('Quantity__c' in ele) {
                return ele.Quantity__c > 0;
            }
            else {
                return true;
            }
        });
        // Draft Item Filter
        // Draft Processes Helper Function
        let draftProcesses = draftProcessesHelper(req);
        draftProcesses = draftProcesses.concat(draftSanitization);
        draftProcesses = draftProcesses.concat(preventiveMaintenance);
        // Draft Processes Helper Function
        let bodyHelper2 = {
            //posmString: JSON.stringify(posm),
            //posmItemString: JSON.stringify(posmLine),
            draftInstallationString: JSON.stringify(draftSignup),
            draftPreInstallationStr: JSON.stringify(draftPreInstallation),
            draftItemsStr: JSON.stringify(draftItems),
            filesAttach: JSON.stringify(filesAttach),
            draftInstallationStr: JSON.stringify(draftInstallation),
            draftProcessesStr: JSON.stringify(draftProcesses),
            draftPulloutStr: JSON.stringify(draftPullout)
        };
        let ObjectiveHelper2 = await sfConnection.apex.post('/ObjectivesCheckoutHelper2/', bodyHelper2);
        console.log("ObjectiveHelper2====>",ObjectiveHelper2)
        let nonBeerproducts = await sfConnection.query("SELECT Id,RecordType.DeveloperName,ProductCode,Description,Name,QuantityUnitOfMeasure,Channel_On_Off__c,Sub_Channel__c,Type__c,Category__c,Draft_Section__c, Liquid_Layer__r.Name,Only_For_Pilot__c	FROM Product2 WHERE (RecordType.DeveloperName='POSM' OR RecordType.DeveloperName='Draft' ) AND IsActive=true ");

        if (req.body.nonSales.isSales) {
            posmSetting = await sfConnection.query("SELECT Account_Fields__c,DeveloperName,Off_Premise_POSM_Code__c,Off_Premise_Record_Type_Allowed__c,On_Premise_POSM_Code__c,On_Premise_Record_Type_Allowed__c,Channel_Allowed__c FROM POSM__mdt WHERE DeveloperName='POSM_App_Setup' OR DeveloperName='Draft_App_Setting'");
            draftStarterKit = await sfConnection.query("SELECT Starter_Kit__c,Product_Code__c FROM Draft_Starter_Kit__mdt");
            licenseTypeStateWise = await sfConnection.query("SELECT DeveloperName,MasterLabel,License__c FROM Type_of_Licence_State_Wise__mdt ");
            let res = await sfConnection.sobject('Draft_Installation__c').update(req.body.draftPreInstallationApproval);
        }

        // Schedule Visit Procedure
        if (scheduleVisits && scheduleVisits.length > 0) {
            await sfConnection.sobject('Event__c').create(scheduleVisits);

        }
        // Syncing Sales Orders
        for (let i = 0; i < salesOrder.length; i++) {

            let eachSalesOrder = salesOrder[i]

            console.log("Sales Order===>", eachSalesOrder)

            console.log("Values===>", eachSalesOrder.Reasons_For_Zero_Products)

            let salesOrderBody = {
                Account__c: eachSalesOrder.accountId,
                App_Id__c: eachSalesOrder.App_Id,
                Created_Date__c: eachSalesOrder.Created_Date,
                Has_Zero_Quantity_Product__c: eachSalesOrder.Has_Zero_Quantity_Product,
                Reason_for_Low_Sales_order__c: eachSalesOrder.Has_Less_Products ? eachSalesOrder.Reasons_For_Less_Products.join(';') : '',
                Reasons_for_not_Liking_Product__c: eachSalesOrder.Stringified_Reasons_For_Zero_Products,
                Sub_reasons__c: eachSalesOrder.Stringified_Sub_reasons__c
            }

            let createSalesOrder = await sfConnection.sobject('Sales_Orders__c').create(salesOrderBody)

            if (createSalesOrder && eachSalesOrder.products.length > 0) {
                //Create the Line Items
                let salesOrderLineItems = eachSalesOrder.products.map((eachLineItem) => {
                    return {
                        Item_Name__c: eachLineItem.Product__c,
                        Cases__c: eachLineItem.quantity,
                        SO__c: createSalesOrder.id
                    }
                })

                let createLineItems = await sfConnection.sobject('Sales_Order_Line_Items__c').create(salesOrderLineItems)

                console.log("Creating line itemss====>", JSON.stringify(createLineItems))

                if (createLineItems) {
                    console.log("Sales order created successfully")
                } else {
                    console.log("Error in creating Sales Orders")
                }
            }
        }

        // Schedule Visit Procedure
        res.status(200).json({ isError: false, isAuth: true, competitorInsightJSON: dealerWiseVisitInfoJSON.competitorInsights, StockVisibilityJSON: dealerWiseVisitInfoJSON.StockVisibilitySurveyWrapper, nonBeerProducts: nonBeerproducts ? nonBeerproducts.records : [], posmSetting: posmSetting ? posmSetting.records : [], licenseType: licenseTypeStateWise ? licenseTypeStateWise.records : [], draftStarterKit: draftStarterKit ? draftStarterKit.records : [] });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ isError: true, isAuth: true, message: e });
    }
};

const updateContactMeeting = async (req, res) => {
    try {
        let sfConnection = req.conn;
        req.contactMeetingData.forEach(ele => {
            console.log('ele', ele)
            sfConnection.sobject("Contact_Meeting__c").create(ele.meetingData,
                function (err, rets) {
                    //console.error('error',rets[0].errors);
                    if (err) {
                        console.error('Updateerror', err);
                        return console.error(err);
                    }
                    for (var i = 0; i < rets.length; i++) {
                        if (rets[i].success) {
                            console.log("Created record id : " + rets[i].id);
                        }
                    }
                });
        });

    } catch (e) {
        console.log("Error in Updating contact meeting", e)
        res.status(500).json({ isError: true, isAuth: true, message: e });

    }

}

const updateLiquidPromotion = async (req, res) => {
    try {
        let sfConnection = req.conn;
        let recordTypeData = await sfConnection.query(
            `SELECT Id FROM RecordType WHERE Name='Promotion'`
        );
        let promotionIdData = await sfConnection.query(
            `SELECT ID FROM Promotion_Master__c WHERE Name='Liquidation promotion'`
        );
        let recordType = recordTypeData.records[0].Id;
        let promotionId = promotionIdData.records[0].Id;

        req.liquidPromotionData["Promotion_Name__c"] = promotionId;
        req.liquidPromotionData["RecordTypeId"] = recordType;
        console.log('liquidPromotionData', req.liquidPromotionData)
        sfConnection.sobject("Recommendation__c").create(req.liquidPromotionData,
            function (err, rets) {
                //console.error('error',rets[0].errors);
                if (err) {
                    console.error('Updateerror', err);
                    return console.error(err);
                } else {
                    res.status(200).json({ isError: false, isAuth: true, message: "posted successfully" })
                }
                for (var i = 0; i < rets.length; i++) {
                    if (rets[i].success) {
                        console.log("Created record id : " + rets[i].id);
                    }
                }
            });
    } catch (e) {
        console.log("Error in Updating liquid promotion", e)
        res.status(500).json({ isError: true, isAuth: true, message: e });

    }

}

const draftProcessesHelper = (req) => {
    let machineCommissioning = req.body.machineCommissioning;
    let training = req.body.training;
    let auditorObjective = req.body.auditorObjective;
    let draftProcesses = [];
    if (machineCommissioning && machineCommissioning.length > 0) {
        draftProcesses = draftProcesses.concat(machineCommissioning);
    }
    if (training && training.length > 0) {
        draftProcesses = draftProcesses.concat(training);
    }
    if (auditorObjective && auditorObjective.length > 0) {
        draftProcesses = draftProcesses.concat(auditorObjective);
    }
    for (let i of draftProcesses) {
        i.App_Created_Date__c = formatDate(i.App_Created_Date__c);
    }
    return draftProcesses;
};


const postStockImages = async (conn, imageBody) => {
    //console.log('imageBody',imageBody)
    try {
        let sfConnection = conn;
        const contentVersionData = imageBody;
        let createFile = await sfConnection.sobject('ContentVersion').create(contentVersionData)
        console.log("CreateFile", createFile[0] && createFile[0].errors)
    }
    catch (e) {
        // console.log(e);
        // res.status(500).json({isError : true,isAuth : true,message : e});
        console.log(e);
        //   res.status(500).json({ isError: true, isAuth: true, message: e });

    }

};

exports.fetchDayWiseEventsAndTask = async (req, res) => {
    try {
        const fetchedDate = formatDate(req.body.requestDate);
        const sfConnection = req.conn;
        let events = await sfConnection.query(`SELECT Name,Account__c,Id,Account__r.Name,Account__r.Account_Status__c,Start_date_and_time__c FROM Event__c WHERE DAY_ONLY(Start_date_and_time__c)=${fetchedDate} ORDER BY Start_date_and_time__c DESC`);
        let taskList = await sfConnection.query(`SELECT WhatId,Subject,Id,ActivityDate, OwnerId   FROM Task WHERE ActivityDate=${fetchedDate}  ORDER BY ActivityDate DESC`);
        let standardEvents = await sfConnection.query(`Select Id,StartDateTime,WhatId, Description, EndDateTime, Location, Subject from Event WHERE StartDateTime>=LAST_90_DAYS AND Custom_Event__c=null AND OwnerId='${req.conn.userInfo.id}' ORDER BY StartDateTime DESC`);

        res.json({ isError: false, isAuth: true, tasks: taskList.records, events: events.records, standardEvents: standardEvents.records });
    }
    catch (e) {
        console.log(e);
        res.json({ isError: true, isAuth: true, message: e });
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
