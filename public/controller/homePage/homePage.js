let dailyTracker = {};
let mappingStandardEventIds = new Map();

const fetchTodayVisit =async () => {

    const dateId = fetchCurrentDateIdStr();
    dailyTracker = await getItemFromStore('dailyTracker',dateId);
    console.log(dailyTracker,"daily")
    let standardEvents = await readAllData('standardEvents');
    console.log('WWW standardEvents',standardEvents)
    let standardEventsList = [];
    for(let i of standardEvents){
        let eventDate = new Date (i.StartDateTime);
        let currentDate = new Date();
        // eventDate.setHours(0,0,0,0);
        // currentDate.setHours(0,0,0,0);
        
        if(eventDate.getDate() === currentDate.getDate()){
            standardEventsList.push(i);   
            mappingStandardEventIds.set(i.Id,i);  
        }
    }

    renderTodaysMeeting(standardEventsList);

    if(dailyTracker&&dailyTracker.Start_Coordinates_Latitude&&dailyTracker.End_Coordinates_latitude){
        $('#startDayTime').css('display','none');
        $('#endDayTime').css('display','none');
        let events = await readAllData('events');
        let eventUtiity = await getItemFromStore('utility','event');
        if(events){
            await  displayFetchEvents(events,eventUtiity);
        }
    }
    else if((dailyTracker&&dailyTracker.Start_Coordinates_Latitude)){
        
        let events = await readAllData('events');
        let eventUtiity = await getItemFromStore('utility','event');
        
        if(events){
           await displayFetchEvents(events,eventUtiity);
        }
        $('#startDayTime').css('display','none');
        $('#endDayTime').css('display','block');
        // $('#startDayTime').attr('disabled',true);
        // $('#endDayTime').attr('disabled',false);
        
    }
    else{
        let events = await readAllData('events');
        if(events){
            await  displayFetchEvents(events);
        }
        // $('#startDayTime').attr('disabled',false);
        // $('#endDayTime').attr('disabled',true);
        $('#startDayTime').css('display','block');
        $('#endDayTime').css('display','none');
        //$('#todays-visit').prepend(tmp);
        $('.panel-content li').css('filter','grayscale(100%)');
        
    }
    
    // if(navigator.onLine){
    //     let loginData =await loginDataFetch();
    //     await eventsFetch(loginData[0].username,loginData[0].password);
    //     events = await readAllData('events');
    //     console.log(events);
    //     if(events.length>0){
    //         displayFetchEvents(events,currentCheckIn);
    //     }
        
    // }
    await preInstallationApproval();
};
const displayFetchEvents =async (events,currentCheckIn) => {
    let accountList = [];
    let pulloutApproval = [];
    let eventsSync = await readAllData('eventsSync');// For Checked Status Since syncing will happen later so we require current status of the event
    
    let eventStatusMap = new Map();
    eventsSync.forEach(ele => {
        let eventDate = new Date (ele.Actual_Start_Visit);
        let currentDate = new Date();
        eventDate.setHours(0,0,0,0);
        currentDate.setHours(0,0,0,0);
        if(eventDate.getTime()===currentDate.getTime() ){
            eventStatusMap.set(ele.Account,ele.Completed);// Account wise status of event since only account is link between Event Sync and Event IndexedDB and Only 1 event can be their for 1 account in single day
        }
    });
    events.forEach(ele => {
        if(ele.Type_of_Visit__c === 'Planned'){
            if(ele.Draft_Pullout__r){
                let eventDate = new Date ((ele.Start_date_and_time__c).substring(0,(ele.Start_date_and_time__c).length-2)+':00');
                let currentDate = new Date();
                eventDate.setHours(0,0,0,0);
                currentDate.setHours(0,0,0,0);
                if(eventDate.getTime()===currentDate.getTime()){
                    pulloutApproval.push({...ele.Account__r,eventId :ele.Id,Start_date_and_time__c:ele.eventStatusMap.has(ele.Account__c) ? eventStatusMap.get(ele.Account__c) : ele.Start_date_and_time__c,Completed__c : eventStatusMap.has(ele.Account__c) ? eventStatusMap.get(ele.Account__c) : ele.Completed__c,Actual_End_Visit__c : eventStatusMap.has(ele.Account__c) ? eventStatusMap.get(ele.Account__c) : ele.Actual_End_Visit__c, Actual_Start_Visit__c : eventStatusMap.has(ele.Account__c) ? eventStatusMap.get(ele.Account__c) : ele.Actual_Start_Visit__c});
                }
            }
            else{
                let eventDate = new Date ((ele.Start_date_and_time__c).substring(0,(ele.Start_date_and_time__c).length-2)+':00');
                let currentDate = new Date();
                eventDate.setHours(0,0,0,0);
                currentDate.setHours(0,0,0,0);
                if(eventDate.getTime()===currentDate.getTime()){
                accountList.push({...ele.Account__r,eventId :ele.Id,Start_date_and_time__c:ele.Start_date_and_time__c,Completed__c : eventStatusMap.has(ele.Account__c) ? eventStatusMap.get(ele.Account__c) : ele.Completed__c,Actual_End_Visit__c : eventStatusMap.has(ele.Account__c) ? eventStatusMap.get(ele.Account__c) : ele.Actual_End_Visit__c, Actual_Start_Visit__c : eventStatusMap.has(ele.Account__c) ? eventStatusMap.get(ele.Account__c) : ele.Actual_Start_Visit__c });
                }
            }
        }
        
    });
    
    
    showTodaysVisit(accountList,currentCheckIn);
    showPulloutApproval(pulloutApproval,currentCheckIn);
};

const preInstallationApproval =async () => {
    let draftPreInstallationApproval = await readAllData('draftPreInstallationApproval');
    let accountArr = [];
    for(let i of draftPreInstallationApproval){
        if(i.Status__c === 'Submitted to SO' && i.RecordType.Name === 'Pre-Installation'){
            let accountRec = await getItemFromStore('account',i.Account__c);
            if(accountRec){
                accountArr.push({
                    ...accountRec,
                    preInstallationId : i.Id,
                })
            }
            
            console.log(i)
        }
    }
    showPreInstallApproval(accountArr);
};
const reportDataFetch =async () => {
    let reportDataFetch = await getItemFromStore('utility','report');
    console.log('reportDataFetch-----0000',reportDataFetch)
    if(reportDataFetch){
        displayReportData(reportDataFetch);
    }
};
const displayReportData = (reportDataFetch) => {
    let reportData = [];
    console.log('reportData',reportDataFetch)
    reportData.push({
        reportName : 'Volume Overall',
        achievement : reportDataFetch.Volume_Achievement_Overall,
        target : reportDataFetch.Volume_Target_overall
    });
    reportData.push({
        reportName : 'Volume Premium',
        achievement : reportDataFetch.Volume_Achievement_Premium,
        target : reportDataFetch.Volume_Target_Premium
    });
    reportData.push({
        reportName : 'Volume Boom',
        achievement : reportDataFetch.Volume_Achievement_Boom,
        target : reportDataFetch.Volume_Target_Boom
    });
    reportData.push({
        reportName : 'Distribution Premium',
        achievement: reportDataFetch.Distribution_Premium_Achievement1,
         target : reportDataFetch.Distribution_Premium_Target1
    });
    reportData.push({
        reportName : 'Distribution Boom',
        achievement: reportDataFetch.Distribution_Boom_Achievement1,
         target : reportDataFetch.Distribution_Boom_Target1
    });
    reportData.push({
        reportName : 'Range Selling',
        achievement: reportDataFetch.Range_Achievement,
         target : reportDataFetch.Range_Target
    });
    reportData.push({
        reportName : 'POD',
        achievement: reportDataFetch.POD_Achievement_nYS,
         target : reportDataFetch.POD_Target_A7A
    });
    
    showSliderData(reportData);
};

const fetchAccounts = async() => {
    showDropdown();
};

const initializeHomePage = async () => {
    let dailyTracker = await getItemFromStore('dailyTracker',fetchCurrentDateIdStr());
    setTimeout(() => {
    fetchAccounts();
    reportDataFetch();
    //if(dailyTracker) 
    fetchTodayVisit();
    renderTodaysTasks();
    },100);
};
initializeHomePage();
handleStartDayHandler = () =>{
    startDayConfirm();
};

startDayConfirm =  () => {
    $('#loader-main').css('display','block');
    //$('.cardSectionList').css('display','block');
    
    dailyTracker = {};
    dailyTracker.Last_Modified = new Date();
    dailyTracker.App_Id = fetchCurrentDateIdStr();
    dailyTracker.isSynced = false;
    dailyTracker.Created_Date = new Date();
    dailyTracker.Start_Date_Time = new Date();

    navigator.geolocation.getCurrentPosition(async(position) => {
        dailyTracker.Start_Coordinates_Latitude = position.coords.latitude;
        dailyTracker.Start_Coordinates_Longitude = position.coords.longitude;
        await deleteItemFromData('utility','event');
        await writeData('dailyTracker',dailyTracker);
        if(navigator.onLine){
            let loginData =await loginDataFetch();
            let nonSales = await isTechnicianAuditorFuncHelper();
            await objectivePushHelper(loginData[0].username,loginData[0].password,loginData[0].syncDateTime,nonSales);
        }
        await deletePreviousObjectiveHelper();
        let events = await readAllData('events');
        if(events){
            fetchTodayVisit();
        }
        $('#loader-main').css('display','none');
    }, checkErrorGeolocation, {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 0
    });
    
};



 


createModalPopUp = (msg,confirmHandler) =>{
    let tmp = '';

    
    tmp +='<div id="logoutModal" class="modal fade" role="dialog">';
    tmp +='     <div class="modal-dialog">';
    tmp +='         <div class="modal-content">';
    tmp +='             <div class="modal-header">';
    tmp +='                 <button type="button" class="close" data-dismiss="modal">&times;</button>';
    tmp +='             </div>';
    tmp +='             <div class="modal-body text-center">';
    tmp +='                 <h5>'+msg+'</h5>';
    tmp +='             </div>';
    tmp +='             <div class="modal-footer text-center">';
    tmp +='                 <button type="button" onclick="'+confirmHandler+'" class="btn btn-danger">Yes</button>';
    tmp +='                 <button type="button" class="btn btn-success" data-dismiss="modal">No</button>';
    tmp +='             </div>';
    tmp +='         </div>';
    tmp +='     </div>';
    tmp +='</div>';


    $('#app').append(tmp);
};

handleEndDayHandler = async() => {
   EndDayConfirm();
};

CompletedEventValidator = async () =>{
    const events  = await readAllData('events')
    let accountList = [];
    let pulloutApproval = [];
    let eventsSync = await readAllData('eventsSync');// For Checked Status Since syncing will happen later so we require current status of the event
    
    let eventStatusMap = new Map();
    eventsSync.forEach(ele => {
        let eventDate = new Date (ele.Actual_Start_Visit);
        let currentDate = new Date();
        eventDate.setHours(0,0,0,0);
        currentDate.setHours(0,0,0,0);
        if(eventDate.getTime()===currentDate.getTime() ){
            eventStatusMap.set(ele.Account,ele.Completed);// Account wise status of event since only account is link between Event Sync and Event IndexedDB and Only 1 event can be their for 1 account in single day
        }
    });
    events.forEach(ele => {
        if(ele.Type_of_Visit__c === 'Planned'){
            if(ele.Draft_Pullout__r){
                let eventDate = new Date ((ele.Start_date_and_time__c).substring(0,(ele.Start_date_and_time__c).length-2)+':00');
                let currentDate = new Date();
                eventDate.setHours(0,0,0,0);
                currentDate.setHours(0,0,0,0);
                if(eventDate.getTime()===currentDate.getTime()){
                    pulloutApproval.push({...ele.Account__r,eventId :ele.Id,Start_date_and_time__c:ele.eventStatusMap.has(ele.Account__c) ? eventStatusMap.get(ele.Account__c) : ele.Start_date_and_time__c,Completed__c : eventStatusMap.has(ele.Account__c) ? eventStatusMap.get(ele.Account__c) : ele.Completed__c,Actual_End_Visit__c : eventStatusMap.has(ele.Account__c) ? eventStatusMap.get(ele.Account__c) : ele.Actual_End_Visit__c, Actual_Start_Visit__c : eventStatusMap.has(ele.Account__c) ? eventStatusMap.get(ele.Account__c) : ele.Actual_Start_Visit__c});
                }
            }
            else{
                let eventDate = new Date ((ele.Start_date_and_time__c).substring(0,(ele.Start_date_and_time__c).length-2)+':00');
                let currentDate = new Date();
                eventDate.setHours(0,0,0,0);
                currentDate.setHours(0,0,0,0);
                if(eventDate.getTime()===currentDate.getTime()){
                accountList.push({...ele.Account__r,eventId :ele.Id,Start_date_and_time__c:ele.Start_date_and_time__c,Completed__c : eventStatusMap.has(ele.Account__c) ? eventStatusMap.get(ele.Account__c) : ele.Completed__c,Actual_End_Visit__c : eventStatusMap.has(ele.Account__c) ? eventStatusMap.get(ele.Account__c) : ele.Actual_End_Visit__c, Actual_Start_Visit__c : eventStatusMap.has(ele.Account__c) ? eventStatusMap.get(ele.Account__c) : ele.Actual_Start_Visit__c });
                }
            }
        }
        
    });

    const completedVisits = accountList.filter((visit) => {
        console.log(visit,"visit");
        if (visit.Completed__c == true) {
            return visit
          }
      });

    if(accountList.length != completedVisits.length){
        $('#endVisit .modal-body').html('Your PJP compliance is not complete, Are you sure you want to end your visit ?');
    }else{
        $('#endVisit .modal-body').html('Are you sure you want to end your visit ?');
    }   

}
EndDayConfirm = async () => {
    $('#loader-main').css('display','block');
    dailyTracker = await getItemFromStore('dailyTracker',fetchCurrentDateIdStr());
    const position = await getCurrentLocationHelper();
    dailyTracker.End_Coordinates_latitude = position.coords.latitude;
    dailyTracker.End_Coordinates_longitude = position.coords.longitude;
    dailyTracker.End_Date_Time = new Date();
    dailyTracker.isSynced = false;
    let salesOrderCreated = await salesOrderMandateCondition();
    // if(!salesOrderCreated){
    //     $('#loader-main').css('display','none');
    //     showNotification({message: 'Sales Order for all planned event is mandatory!'});
    //     return;
    // }
    await writeData('dailyTracker',dailyTracker);
    if(navigator.onLine){
        let loginData = await loginDataFetch(); 
        let nonSales = await isTechnicianAuditorFuncHelper();
        await itemsFetch(loginData[0].username,loginData[0].password,loginData[0].syncDateTime,nonSales);
        await pushSalesOrder(loginData[0].username,loginData[0].password);
        await pushPOSMItems(loginData[0].username,loginData[0].password);
        await objectivePushHelper(loginData[0].username,loginData[0].password,loginData[0].syncDateTime,nonSales);      
        await accountFetch(loginData[0].username,loginData[0].password,loginData[0].syncDateTime);
        await itemImagesFetch(loginData[0].username,loginData[0].password,loginData[0].syncDateTime);
        await eventsFetch(loginData[0].username,loginData[0].password,nonSales);
        await payOutSlabsFetch(loginData[0].username,loginData[0].password);
        await accountGoalsFetch(loginData[0].username,loginData[0].password);
        await marketInventoriesFetch(loginData[0].username,loginData[0].password);

        await libraryFilesFetch(loginData[0].username,loginData[0].password,loginData[0].syncDateTime);
        /*** Account Geolocation Update */
        await updateAccountGeolocations(loginData[0].username,loginData[0].password);

        /** Recommendations and Samples */
        await pushApprovedRecommendationObjects(loginData[0].username,loginData[0].password);
        await syncSamples(loginData[0].username,loginData[0].password);
        await fetchRecommendations(loginData[0].username,loginData[0].password);
        await recommendationWeekFilter(loginData[0].username,loginData[0].password);
        await recommendationFeedbackMeta(loginData[0].username,loginData[0].password);
        /*** Outlet 360 */
        await outlet360AccountGoalsTarget(loginData[0].username,loginData[0].password);
        await outlet360Records(loginData[0].username,loginData[0].password);
        await outlet360RetailDepletion(loginData[0].username,loginData[0].password);
        await outlet360AccountGoals(loginData[0].username,loginData[0].password);
        await outlet360VisibilityScores(loginData[0].username,loginData[0].password);
        await outlet360Events(loginData[0].username,loginData[0].password);
        await outlet360PosItemRequisition(loginData[0].username,loginData[0].password);
    }
    //$('.cardSectionList').css('display','none');
    $(".cardSectionList").empty();
    //$('# endDayTime').css('display','none');
    $('#loader-main').css('display','none');
    //if(dailyTracker && !dailyTracker.End_Date_Time) 
    fetchTodayVisit();
};

const salesOrderMandateCondition =async () => {
    let accountIds = [];
    let events = await readAllData('events');
    events.forEach(ele => {
        let eventDate = new Date ((ele.Start_date_and_time__c).substring(0,(ele.Start_date_and_time__c).length-2)+':00');
        let currentDate = new Date();
        eventDate.setHours(0,0,0,0);
        currentDate.setHours(0,0,0,0);
        if(eventDate.getTime()===currentDate.getTime()){
            accountIds.push(ele.Account__r?.Id);
        }
    });
    let isValid = true;
    for(let i of accountIds){
        let orderRec;
        orderRec = await getItemFromStore('salesOrderSync',(fetchCurrentDateIdStr()+'-'+i));
        if(!orderRec){
            isValid = false;
            break;
        }
    }
    return isValid;
};
const fetchTodaysTasks = async() => {
    let tasks = await readAllData('taskOriginal');
    if(tasks.length>0){
        tasks = tasks.filter(ele => {
            let eventDate =  new Date(ele.ActivityDate).setHours(0,0,0,0);
            let todaysDate = new Date().setHours(0,0,0,0);
            return eventDate === todaysDate;
        });
    }
    
    return tasks;
};