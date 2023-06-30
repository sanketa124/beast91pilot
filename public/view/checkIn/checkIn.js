let urlParam = new URLSearchParams(window.location.search);
const eventId = urlParam.get('eventId')
const accountId =  urlParam.get('accountId')

localStorage.setItem('accountId',accountId)
localStorage.setItem('eventId',eventId)
console.log(localStorage.getItem('accountId'))

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
      eventKey: fetchCurrentDateIdStr() + '-' + accountRec.Id + '-' + event.Type__c,
  };
  console.log('utility----', event)
  await writeData('utility', utility);
  
  event = {
      ...event,
      App_Id: fetchCurrentDateIdStr() + '-' + accountRec.Id + '-' + event.Type__c,
      Actual_Start_Visit: new Date(),
      Actual_Start_Visit__c: new Date(),
      Check_In_Latitude: position.coords.latitude,
      Check_In_Longitude: position.coords.longitude,
      isSynced: false,
      Created_Date: new Date(),
      CheckedIn: true,
  };
  console.log('urlParam----', event)

  await writeData('eventsSync', event);
  await writeData('events', event);

  // hideLoaderSpinner();
  objectivesRender(event);
  let outletDistance = getDistanceFromLatLonInKm(accountRec?.Geolocation__c?.latitude,accountRec?.Geolocation__c?.longitude,event?.Check_In_Longitude,event?.Check_In_Latitude)
  outletDistance = Math.trunc((outletDistance.toFixed(2))*1000)
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