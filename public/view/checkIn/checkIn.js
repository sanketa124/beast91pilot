let urlParam = new URLSearchParams(window.location.search);
const eventId = urlParam.get('eventId')
const accountId =  urlParam.get('accountId')

localStorage.setItem('accountId',accountId)
localStorage.setItem('eventId',eventId)


const checkInFucn = async (eventId,accountId) => {
  let accountRec = await getItemFromStore('account', accountId);
  //showLoaderSpinner();
  const position = await getCurrentLocationHelper();
  let event = await getItemFromStore('events', eventId);
  console.log(event,"event")
  let utility = {
      sobjectName: 'event',
      account: accountRec,
      event: event,
      eventKey: fetchCurrentDateIdStr() + '-' + accountRec.Id + '-' + event.Id,
  };
  console.log('utility----', event)
  await writeData('utility', utility);
  
  event = {
      ...event,
      App_Id: fetchCurrentDateIdStr() + '-' + accountRec.Id + '-' + event.Id,
      Actual_Start_Visit__c: new Date(),
      Check_In__Latitude__s: position.coords.latitude,
      Check_In__Longitude__s: position.coords.longitude
  };
  console.log('urlParam----', event)

  await writeData('eventsSync', event);
  await writeData('events', event);

  // hideLoaderSpinner();
  objectivesRender(event);
  if(!accountRec?.Geolocation__c && !accountRec?.Geolocation__c?.latitude){
    showNotification({message : 'Account lat long not configured!'});
  }
    

  let account_lat = accountRec?.Geolocation__c?.latitude ? accountRec?.Geolocation__c?.latitude : 0
  let account_lon = accountRec?.Geolocation__c?.longitude ? accountRec?.Geolocation__c?.longitude : 0
  let user_lat = event?.Check_In__Latitude__s ? event?.Check_In__Latitude__s : 0
  let user_lon = event?.Check_In__Longitude__s ? event?.Check_In__Longitude__s : 0
  
  let outletDistance 
  if(account_lat !=0){
    outletDistance = getDistanceFromLatLonInKm(account_lat,account_lon,user_lat,user_lon)
    outletDistance = Math.trunc((outletDistance.toFixed(2))*1000)
  }else{
    outletDistance = 'X'
  }  
  
  const sfdc_outlet_dist = event.Distance_from_Account__c * 1000
  const startDate = new Date(event.Actual_Start_Visit__c).toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})
  document.getElementById('checked-in-time').innerHTML = startDate;
  document.getElementById('outlet_distance').innerHTML = `Current location is ${(event.Distance_from_Account__c)? sfdc_outlet_dist :outletDistance} meters from outlet location`

  // }
};

const objectivesRender = async (currentEvent) => {
  console.log(currentEvent,"currentEvent");
  if(currentEvent){
      let eventDate = new Date ((currentEvent.Start_date_and_time__c).substring(0,(currentEvent.Start_date_and_time__c).length-2)+':00');
      let currentDate = new Date();
      eventDate.setHours(0,0,0,0);
      currentDate.setHours(0,0,0,0);
      if((eventDate.getTime()!==currentDate.getTime())){
          await deleteItemFromData('utility','event');
          currentEvent = null;
      }
  }
  $('.sales-order').prop('disabled',false);
  
  if(!currentEvent){
      $('.checkin').prop('disabled',false);
      $('.installation').prop('disabled',true);
      $('.maintenance').prop('disabled',true);
      $('.competition-insight').prop('disabled',true);
      $('.pullout').prop('disabled',true);
      $('.checkout').prop('disabled',true);
      await checkedInEventCheckNonSales();
  }
  else{
      $('.checkin').prop('disabled',true);
      $('.checkout').prop('disabled',false);
      $('.competition-insight').prop('disabled',false);
      $('.installation').prop('disabled',true);
      $('.maintenance').prop('disabled',true);
      $('.pullout').prop('disabled',true);
      let typeOfEvent = '';
      if(currentEvent.Type__c==='Installation' || currentEvent.Type__c==='Pre-Installation' ||currentEvent.Type__c==='Machine Commissioning' || currentEvent.Type__c === 'Training'){
          typeOfEvent ='Installation';
      }
      if(currentEvent.Type__c==='Draft Pullout'){
          typeOfEvent ='Draft Pullout';
      }
      if((currentEvent.Type__c === 'Draft Sanitization' || currentEvent.Type__c === 'Draft Preventive Maintenance')){
          typeOfEvent ='Maintenance';
      }
      if(typeOfEvent==='Installation'){
          $('.installation').prop('disabled',false);
      }
      if(typeOfEvent==='Draft Pullout'){
          $('.pullout').prop('disabled',false);
      }
      if(typeOfEvent==='Maintenance'){
          $('.maintenance').prop('disabled',false);
      }
      
  }
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

checkInFucn(eventId,accountId)

goBack = () => {
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
  
  goForward = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/sales/outlet360.html?accountId=${accountId}&eventId=${eventId}`
  }

  showNotification = (data) =>{
    $("#notification").fadeIn("slow");
    $("#notification span").html(data.message);
    setTimeout(function(){ $("#notification").fadeOut("slow"); }, 3000);
  };