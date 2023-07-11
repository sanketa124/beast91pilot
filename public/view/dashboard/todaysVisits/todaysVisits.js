let getDisable = sessionStorage.getItem('disablesection');
let cardSection = document.querySelector('.cardSectionList');
let visitProgress = document.querySelector('.visitProgress');

$(document).ready(function () {
  $("body").tooltip({ selector: '[data-toggle=tooltip]' });
});
// if (getDisable == null || getDisable == 'true') {
//     $('.cardSectionList').addClass('disabledsection');
// } else if (getDisable == 'false') {
//     $('.cardSectionList').removeClass('disabledsection');
// }

// ${(i.CheckedInStatus ==  false && i.Completed__c == false) ?
//   `<button id="checkin_"${AccId} onclick="handleCheckIn('${event_Id}','${AccId}')" class="btn btn-small">Check-In</button>`  :`${(i.CheckedInStatus ==  false && i.Actual_Start_Visit__c == false) ?
//     `<button id="checkin_"${AccId} onclick="handleCheckIn('${event_Id}','${AccId}')" class="btn btn-small" disabled>Check-In</button>`  :``
//   }`
// }

showTodaysVisit = (todaysVisit, currentCheckIn) => {
  let VisitDate;
  let IsCheckedIn = false;
  let IsCheckedOut = false;
  console.log(todaysVisit, 'todaysVisit')
  const completedVisits = todaysVisit.filter((visit) => {
    if (visit.Completed__c == true) {
      visit.CheckedInStatus = true
      return visit
    }
  });

  const checkedInVisits = todaysVisit.filter(
    (visit) => {
      if (visit.Actual_Start_Visit__c != null && visit.Completed__c == false) {
        visit.CheckedInStatus = true
        return visit
      }

    }
  );

  const notCheckedInVisits = todaysVisit.filter(
    (visit) => {
      if (visit.Actual_Start_Visit__c == null && visit.Completed__c == false) {
        visit.CheckedInStatus = false
        return visit
      }
    }
  );

  let finalArray = [...completedVisits, ...checkedInVisits, ...notCheckedInVisits]
  finalArray.sort(function (a, b) {
    var c = new Date(a.Start_date_and_time__c);
    var d = new Date(b.Start_date_and_time__c);
    return c - d;
  });
  let progressPercentage = (todaysVisit.length > 0) ? (Math.round((completedVisits.length / todaysVisit.length) * 100)) : 0
  visitProgress.innerHTML = `<div class="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="width:${progressPercentage}%"></div></div> 
  <span id="todayVisits"><strong>${completedVisits.length} / ${todaysVisit.length}</strong> (${progressPercentage}%) </span>`

  for (let i of finalArray) {
    console.log(finalArray, 'todaysVisit')
    let temp1;
    if (i?.Recent_Activity_Date_Time__c) {
      VisitDate = new Date(i?.Recent_Activity_Date_Time__c)
        .toISOString()
        .slice(0, 10);
    }
    let circle;
    if (i?.Actual_Start_Visit__c && i.Completed__c == false) {
      circle = '<i class="fa fa-check-circle checkCircle" style="color:#6600ff;"></i>'
    } else if (i?.Actual_End_Visit__c && i.Completed__c == true) {
      circle = '<i class="fa fa-check-circle checkCircle" style="color:#2DB83D; "></i>'
    } else {
      circle = ''
    }
    let tmp;
    if (i.QCO_Flag__c != undefined && i.Beacon_Flag__c != undefined && i.QCO_Flag__c != null && i.Beacon_Flag__c != null) {
      if (i.QCO_Flag__c == true && i.Beacon_Flag__c == true) {
        tmp = '<img src="/media/icon12.png" alt="icon" />';
      }
      if (i.QCO_Flag__c == true && i.Beacon_Flag__c == false) {
        tmp = '<img src="/media/icon13.png" alt="icon" />';
      }
      if (i.QCO_Flag__c == false && i.Beacon_Flag__c == true) {
        tmp = '<img src="/media/icon12.png" alt="icon" />';
      }
    }
    if (i.Industry_Segment__c != null || i.Industry_Segment__c != undefined) {
      if (i.Industry_Segment__c == 'P0') {
        temp1 = `<strong class="p0">P0</strong>`
      } else if (i.Industry_Segment__c == 'P1') {
        temp1 = `<strong class="p1">P1</strong>`
      } else if (i.Industry_Segment__c == 'P2') {
        temp1 = `<strong class="p2">P2</strong>`
      } else if (i.Industry_Segment__c == 'P3') {
        temp1 = `<strong class="p3">P3</strong>`
      } else if (i.Industry_Segment__c == 'P4') {
        temp1 = `<strong class="p4">P4</strong>`
      }
    } else {
      temp1 = '';
    }
    let loc;
    //if(i.Geolocation__c){

    // }else{
    //   loc = $('#loc').attr('href',"");
    // }
    if (i.Geolocation__c != null || i.Geolocation__c != undefined) {
      // let map = "https://maps.google.com?q="+i.Geolocation__c?.latitude+','+i.Geolocation__c?.longitude;
      // $('.loc').prop('href',map)
      // loc = `<a class="loc" target="_blank" href="https://maps.google.com?q=${(i.Geolocation__c?.latitude ? i.Geolocation__c?.latitude : '')},${(i.Geolocation__c?.longitude ? i.Geolocation__c?.longitude : '')}"><span>${(i.Geolocation__c?.latitude ? i.Geolocation__c?.latitude : '')},${(i.Geolocation__c?.longitude ? i.Geolocation__c?.longitude : '')}</span></a>`
      loc = `<a class="loc" target="_blank" href="https://maps.google.com?q=${(i.Geolocation__c?.latitude ? i.Geolocation__c?.latitude : '')},${(i.Geolocation__c?.longitude ? i.Geolocation__c?.longitude : '')}"><span>Open Maps</span></a>`

    }


    const AccId = i?.Id
    const Accname = i?.Name;
    const event_Id = i?.eventId
    cardSection.innerHTML += `<div class="card">
      <div class="card-body">
      <i>${circle}</i>
      <div class="row">
         <div class="col-xs-8">
            <h4 id="storeName" onclick="gotoAccount('${AccId}','${Accname}')"> ${i.Name ? i.Name : ''}</h4>
            <label> ${i.Channel__c ? i.Channel__c : ''} /${i.Sub_Channel__c ? i.Sub_Channel__c : ''}</label> <label>
            <strong>Order: </strong>
            <span>${(i.Recent_Retail_Depletion__c ? dateformat(i.Recent_Retail_Depletion__c) : '')}${(i.Recent_Retail_Depletion__c ? (getLapsedDate(i.Recent_Retail_Depletion__c) <= -90 ? '(Lapsed)' : '') : '')} </span>
            <span>|</span>
            <strong>Visit: </strong>
            <span>${(VisitDate ? dateformat(VisitDate) : '')}</span>
            </label>
            <label> ${(i.BillingStreet ? '#' : '') + (i.BillingStreet ? i.BillingStreet : '')}</label>
            <label>${(loc ? loc : '')} </label>
           <label><span class="updateLoc" onclick="goToGeoLocation('${AccId}')">Update Location  </span> <span class="tooltipIcon"><img class="infoIcon" data-toggle="tooltip" data-placement="top" title="Update the location when you are at the outlet entrance to capture accurate geotag" src="/media/icons/meetGreetInfo.png"/>
           </span></label>
         </div>
         <div class="col-xs-4 pl-0 text-right">
            <ul>
               <li>${temp1}</li>
               <li>${(i.Draft_Status__c == true ? ' <img src="/media/icon11.png" alt="icon" />' : '')} </li>
               <li> ${(tmp ? tmp : '')} </li>
            </ul>
         </div>
      </div>
        ${(i.Completed__c == true) ? `` : `<button id="checkin_"${AccId} onclick="handleCheckIn('${event_Id}','${AccId}')" class="btn btn-small">Check-In</button>` }
      </div>
</div>`
  }
};

gotomap = (map) => {
  window.location.href = map;
  //console.log(map)
}

gotoAccount = (AccId, Accname) => {
  localStorage.setItem('Accname', Accname);
  window.location.href = `/view/accountLanding/accountLanding.html?accountId=${AccId}`
}

goToGeoLocation = (AccId) => {
  window.location.href = `/view/geoLocation/geoLocationAdd.html?accountId=${AccId}&fromVisits=${true}`
}



dateformat = (date) => {
  return moment(date).format('DD-MMM')
}

// returns diff in days
getLapsedDate = (target) => {
  var today = new Date();
  var d1 = new Date(today),
    d2 = new Date(target);
  return Math.trunc((d2.getTime() - d1.getTime()) / 1000 / 60 / 60 / 24);
};

handleCheckIn = (eventId, accountId) => {
  console.log(accountId, "accId");
  sessionStorage.setItem('checkinPlace', 'firstCheckin')
  //checkInFucn(eventId,accountId)
  window.location.href = `/view/checkIn/checkIn.html?accountId=${accountId}&eventId=${eventId}`;
}
