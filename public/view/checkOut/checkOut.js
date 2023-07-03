handleCheckedOut = () => {
  showLoader()
  checkedOut();
}

finalSubmit = () => {
  let checkinRedirect = sessionStorage.getItem('checkinPlace');
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  console.log(checkinRedirect, 'checkinRedirect');
  if(checkinRedirect == 'secondCheckin'){
    window.location.href = `/view/accountLanding/accountLanding.html?accountId=${accountId}`;
  }else if(checkinRedirect == 'firstCheckin'){
    window.location.href = `/view/dashboard/todaysVisits/todaysVisits.html?accountId=${accountId}`;
  }
  sessionStorage.removeItem('checkinPlace')
}

goBack = () => {
  let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/followUp/followUpPage.html?accountId=${accountId}`;
}

const checkedOut = async () => {
  try{
      let accountId = localStorage.getItem('accountId')
      let eventId =localStorage.getItem('eventId')
      let eventRecV2 = await getItemFromStore('events', eventId);
      let accountRec = await getItemFromStore('account', accountId);
      const position = await getCurrentLocation();
      eventRecV2.Check_Out_Latitude = position.coords.latitude;
      eventRecV2.Check_Out_Longitude = position.coords.longitude;
      eventRecV2.Actual_End_Visit = new Date();
      eventRecV2.Completed = true;
      eventRecV2.CheckedIn = false;
      eventRecV2.isSynced = false;
      //accountRec.Recent_Activity_Date_Time__c = new Date();
      eventRecV2.Completed__c = true;
      console.log(eventRecV2,"eventRecV2");
      await writeData('events', eventRecV2);
      await writeData('eventsSync', eventRecV2);
      //await writeData('account', accountRec);
      let outletDistance = getDistanceFromLatLonInKm(accountRec?.Geolocation__c?.latitude,accountRec?.Geolocation__c?.longitude,eventRecV2.Check_Out_Longitude,eventRecV2.Check_Out_Latitude)
      outletDistance = Math.trunc((outletDistance.toFixed(2))*1000)
      const sfdc_outlet_dist = eventRecV2?.Distance_from_Account__c * 1000
      const endDate = (eventRecV2?.Actual_End_Visit__c) ? eventRecV2?.Actual_End_Visit__c : eventRecV2?.Actual_End_Visit
      const Actual_End_Visit_Date= new Date(endDate).toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})
      document.getElementById('checked-out-time').innerHTML = Actual_End_Visit_Date;  
      document.getElementById('TimeSpent@Outlet').innerHTML = `Spent ${(eventRecV2?.Time_Spent_in_Outlet__c)?eventRecV2?.Time_Spent_in_Outlet__c : 0} minutes at the outlet.`
      document.getElementById('DistfromStore').innerHTML = ` Current location is  ${(sfdc_outlet_dist)?sfdc_outlet_dist : outletDistance} metres from the outlet location.`
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