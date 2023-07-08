handleCheckedOut = () => {
  showLoader()
  checkedOut();
  $('#progress-bar-container').hide()
  $('#loader-img').hide()
}

finalSubmit = async () => {
  $('#checkoutSection').hide()
  $('#progress-bar-container').show()
  $('#loader-img').show()
  if(navigator.onLine){
    const nonSales = await isTechnicianAuditorFuncHelper();
    let loginData = await loginDataFetch();
      await itemsFetch(loginData[0].username,loginData[0].password,loginData[0].syncDateTime,nonSales);
      // showNotification({message : 'Items sync complete!'});
      progressBarLoad(20);
      await objectivePushHelper(loginData[0].username,loginData[0].password,loginData[0].syncDateTime,nonSales);
      // showNotification({message : 'Objectives sync complete!'});
      progressBarLoad(30);
      await accountFetch(loginData[0].username,loginData[0].password,loginData[0].syncDateTime);
      // showNotification({message : 'Account sync complete!'});
      progressBarLoad(40);
      await itemImagesFetch(loginData[0].username,loginData[0].password,loginData[0].syncDateTime);
      // showNotification({message : 'Items Images sync complete!'});
      progressBarLoad(50);
      await eventsFetch(loginData[0].username,loginData[0].password,nonSales);
      // showNotification({message : 'Events sync complete!'});
      progressBarLoad(60);
      if(nonSales.isSales){
        await reportFetch(loginData[0].username,loginData[0].password);
        // showNotification({message : 'Reports sync complete!'});
        progressBarLoad(70);
      }
      await payOutSlabsFetch(loginData[0].username,loginData[0].password);
      await accountGoalsFetch(loginData[0].username,loginData[0].password);
      await marketInventoriesFetch(loginData[0].username,loginData[0].password);
      // showNotification({message : 'Events sync complete!'});
      progressBarLoad(80);
      
      await libraryFilesFetch(loginData[0].username,loginData[0].password,loginData[0].syncDateTime);
     
     /** Recommendations and Samples */
      await pushApprovedRecommendationObjects(loginData[0].username,loginData[0].password);
      await syncSamples(loginData[0].username,loginData[0].password);
      await fetchRecommendations(loginData[0].username,loginData[0].password);
      await fetchAllLiquids(loginData[0].username,loginData[0].password);
      progressBarLoad(100);
      

      loginData[0].syncDateTime = new Date((new Date().setMinutes(new Date().getMinutes() - 10)));
      loginData[0].reminderDateTime = new Date((new Date().setMinutes(new Date().getMinutes() - 10)));
      await writeData('login',loginData[0]);
      localStorage.removeItem('accountId');
      localStorage.removeItem('eventId');
      window.location.href = `/view/dashboard/todaysVisits/todaysVisits.html`;
    
  }
  else{
    showNotification({message : 'Device offline cannot Sync!'});
  }
  setTimeout(async () => {
    const nonSales = await isTechnicianAuditorFuncHelper();
    if(!nonSales.isSales){
     window.location.href = `/view/dashboard/todaysVisits/todaysVisits.html`;
    }
    else{
      window.location.href = `/view/dashboard/todaysVisits/todaysVisits.html`;
    }
    
  },500);
  // let checkinRedirect = sessionStorage.getItem('checkinPlace');
  // let urlParams = new URLSearchParams(window.location.search);
  // const accountId = urlParams.get('accountId');
  // console.log(checkinRedirect, 'checkinRedirect');
  // if(checkinRedirect == 'secondCheckin'){
  //   window.location.href = `/view/accountLanding/accountLanding.html?accountId=${accountId}`;
  // }else if(checkinRedirect == 'firstCheckin'){
  //   window.location.href = `/view/dashboard/todaysVisits/todaysVisits.html?accountId=${accountId}`;
  // }
  //sessionStorage.removeItem('checkinPlace')
}

goBack = () => {
  let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/followUp/followUpPage.html?accountId=${accountId}`;
}
showNotification = (data) =>{
  $("#notification").fadeIn("slow");
  $("#notification span").html(data.message);
  setTimeout(function(){ $("#notification").fadeOut("slow"); }, 3000);
};

const progressBarLoad = (percentage) => {
  
  let progressBar = document.querySelector('.progress-bar');
  progressBar.style.minWidth =`${percentage}%`;
  progressBar.innerHTML = `${percentage}%`;
};

const checkedOut = async () => {
  try{
      let accountId = localStorage.getItem('accountId')
      let eventId =localStorage.getItem('eventId')
      let eventRecV2 = await getItemFromStore('events', eventId);
      let accountRec = await getItemFromStore('account', accountId);
      const position = await getCurrentLocation();
      eventRecV2.Check_Out_Latitude = position.coords.latitude;
      eventRecV2.Check_Out_Longitude = position.coords.longitude;
      eventRecV2.Check_Out__Latitude__s = position.coords.latitude;
      eventRecV2.Check_Out__Longitude__s = position.coords.longitude;
      eventRecV2.Actual_End_Visit = new Date();
      eventRecV2.Actual_End_Visit__c = new Date();
      eventRecV2.Completed = true;
      eventRecV2.CheckedIn = false;
      eventRecV2.isSynced = false;
      //accountRec.Recent_Activity_Date_Time__c = new Date();
      eventRecV2.Completed__c = true;
      console.log(eventRecV2,"eventRecV2");
      await writeData('events', eventRecV2);
      await clearAllData('eventsSync')
      await writeData('eventsSync', eventRecV2);
      //await writeData('account', accountRec);
      if(!accountRec?.Geolocation__c && !accountRec?.Geolocation__c?.latitude){
        showNotification({message : 'Account lat long not configured!'});
      }
      const diff = Math.abs(new Date(eventRecV2.Actual_Start_Visit__c) - new Date(eventRecV2.Actual_End_Visit__c));
      const time_in_outlet = Math.floor((diff/1000)/60);
      let time_spent_in_outlet = (eventRecV2?.Time_Spent_in_Outlet__c)?eventRecV2?.Time_Spent_in_Outlet__c : time_in_outlet
      console.log(time_in_outlet,"time_in_outlettime_in_outlettime_in_outlettime_in_outlettime_in_outlet");
      let account_lat = accountRec?.Geolocation__c?.latitude ? accountRec?.Geolocation__c?.latitude : 0
      let account_lon = accountRec?.Geolocation__c?.longitude ? accountRec?.Geolocation__c?.longitude : 0
      let user_lat = eventRecV2?.Check_Out__Latitude__s ? eventRecV2?.Check_In__Latitude__s : 0
      let user_lon = eventRecV2?.Check_In__Longitude__s ? eventRecV2?.Check_In__Longitude__s : 0
      let outletDistance = getDistanceFromLatLonInKm(account_lat,account_lon,user_lat,user_lon)
      outletDistance = Math.trunc((outletDistance.toFixed(2))*1000)
      const sfdc_outlet_dist = eventRecV2?.Distance_from_Account__c * 1000
      const endDate = (eventRecV2?.Actual_End_Visit__c) ? eventRecV2?.Actual_End_Visit__c : eventRecV2?.Actual_End_Visit
      const Actual_End_Visit_Date= new Date(endDate).toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})
      document.getElementById('checked-out-time').innerHTML = Actual_End_Visit_Date;  
      document.getElementById('TimeSpent@Outlet').innerHTML = `Spent <strong>${time_spent_in_outlet} </strong> minutes at the outlet.`
      document.getElementById('DistfromStore').innerHTML = ` Current location is <strong> ${(sfdc_outlet_dist)?sfdc_outlet_dist : outletDistance} </strong> metres from the outlet location.`
      hideLoader()
    }
    catch(e){
        $('#loader-main').css('display','none');
        showNotification({message : 'There is some issue with Location pl try again later!'+e});
        return;
    }
};

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 12000,
          maximumAge: 0
      });
  });
};

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  console.log(lat1,lon1,lat2,lon2);
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

showLoader = () =>{
  $('.loader-div').css('display','block');
};

hideLoader = () =>{
  $('.loader-div').css('display','none');
};

handleCheckedOut();