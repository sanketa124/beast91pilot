let listOfAccount;
initializeAccount = (accountLists) => {
    listOfAccount = accountLists;


};
let cardSection = document.querySelector('#listOfAcc');

showListOfAccount = (i = 0) => {
    var tmp = '';
    if(i===0){
        $('#listOfAcc').html('');
    }
    if (listOfAccount && listOfAccount.length > 0) {
    
    let VisitDate;
    console.log(listOfAccount, 'listOfAccount')
    for (let i of listOfAccount) {
        let temp1;
        if (i?.Recent_Activity_Date_Time__c) {
          VisitDate = new Date(i?.Recent_Activity_Date_Time__c)
            .toISOString()
            .slice(0, 10);
        }
        let circle;
        if(i?.Actual_Start_Visit__c && i.Completed__c == false){
          circle = '<i class="fa fa-check-circle checkCircle" style="color:#6600ff;"></i>'
        }else if(i?.Actual_End_Visit__c && i.Completed__c == true){
          circle = '<i class="fa fa-check-circle checkCircle" style="color:#2DB83D; "></i>'
        }else{
          circle = ''
        }
        let tmp;
        if(i.QCO_Flag__c != undefined && i.Beacon_Flag__c != undefined && i.QCO_Flag__c != null && i.Beacon_Flag__c != null){
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
        if(i.Industry_Segment__c != null || i.Industry_Segment__c != undefined){
          if(i.Industry_Segment__c == 'P0'){
            temp1 = `<strong class="p0">P0</strong>`
          }else  if(i.Industry_Segment__c == 'P1'){
          temp1 = `<strong class="p1">P1</strong>`
          }else if(i.Industry_Segment__c == 'P2'){
            temp1 = `<strong class="p2">P2</strong>`
          }else  if(i.Industry_Segment__c == 'P3'){
            temp1 = `<strong class="p3">P3</strong>`
          }else  if(i.Industry_Segment__c == 'P4'){
            temp1 = `<strong class="p4">P4</strong>`
          }
        }else{
          temp1 = '';
        }
        let loc;
        if(i.Geolocation__c != null || i.Geolocation__c != undefined){
          let map = "https://maps.google.com?q="+i.Geolocation__c?.latitude+','+i.Geolocation__c?.longitude;
          $('.loc').prop('href',map)
          loc = '<a class="loc" ><span>'+(i.Geolocation__c?.latitude ? i.Geolocation__c?.latitude : '')+','+(i.Geolocation__c?.longitude ? i.Geolocation__c?.longitude : '')+'</span></a>'
          //console.log("https://maps.google.com?q="+i.Geolocation__c?.latitude+','+i.Geolocation__c?.longitude);
          
        }
    
    
        const AccId = i.Id 
        const event_Id = i.eventId 
        cardSection.innerHTML +=`<div class="card">
          <div class="card-body">
          <i>${circle}</i>
          <div class="row">
             <div class="col-xs-8">
                <h4 id="storeName" onclick="gotoAccount('${AccId}')"> ${i.Name ? i.Name : ''}</h4>
                <label> ${i.Channel__c? i.Channel__c : ''} /${i.Sub_Channel__c ? i.Sub_Channel__c: ''}</label> <label>
                <strong>Order: </strong>
                <span>${(i.Recent_Retail_Depletion__c ? dateformat(i.Recent_Retail_Depletion__c) : '')}${(i.Recent_Retail_Depletion__c ? (getLapsedDate(i.Recent_Retail_Depletion__c) <= -90 ? '(Lapsed)' : '' ) : '' )} </span>
                <span>|</span>
                <strong>Visit: </strong>
                <span>${(VisitDate ? dateformat(VisitDate) : '' )}</span>
                </label>
                <label> ${( i.BillingStreet? '#' : '' )+ ( i.BillingStreet? i.BillingStreet : '' )}</label>
                <label>${(loc?loc:'')} </label>
             </div>
             <div class="col-xs-4 pl-0 text-right">
                <ul>
                   <li>${temp1}</li>
                   <li>${(i.Draft_Status__c == true ? ' <img src="/media/icon11.png" alt="icon" />' : '') } </li>
                   <li> ${(tmp ? tmp : '')} </li>
                </ul>
             </div>
          </div>
          </div>
    </div>`
      }
    showNotification({ message: 'Total records : ' + listOfAccount.length });
      }
    else {
        showNotification({ message: 'No records Found!' });
    }

};
dateformat = (date) => {
    return moment(date).format('DD-MMM')
  }
  
gotoAccount = (id) => {
  window.location.href = `/view/accountLanding/accountLanding.html?accountId=${id}`
}

getLapsedDate = (target) => {
  var today = new Date();
  var d1 = new Date(today),
    d2 = new Date(target);
  return Math.trunc((d2.getTime() - d1.getTime()) / 1000 / 60 / 60 / 24);
};

accountDetail =async (accountIndex) => {
    const recordTypeName = listOfAccount[accountIndex].RecordType.DeveloperName;
    let nonSales = await isTechnicianAuditorFuncHelper();
    if(nonSales.isSales){
        if (recordTypeName === 'Distributor_Warehouse') {
            window.location.href = '/view/accountDetail/accountDetailDistributorWarehouse/accountDetailDistributorWarehouseLanding.html?Id=' + listOfAccount[accountIndex].Id;
        }
        else if (recordTypeName === 'Distributor') {
            window.location.href = '/view/accountDetail/accountDetailDistributor/accountDetailDistributorLanding.html?Id=' + listOfAccount[accountIndex].Id;
        }
        else if (recordTypeName === 'On_Premise_General') {
            window.location.href = '/view/accountDetail/accountDetailOnPremiseGeneral/accountDetailOnPremiseGeneralLanding.html?Id=' + listOfAccount[accountIndex].Id;
        }
        else if (recordTypeName === 'Consumer') {
            window.location.href = '/view/accountDetail/accountDetailConsumer/accountDetailConsumerLanding.html?Id=' + listOfAccount[accountIndex].Id;
        }
        else if (recordTypeName === 'Institutional_Off_Premise') {
            window.location.href = '/view/accountDetail/accountDetailInstitutionalOffPremise/accountDetailInstitutionalOffPremiseLanding.html?Id=' + listOfAccount[accountIndex].Id;
        }
        else if (recordTypeName === 'Institutional_On_Premise') {
            window.location.href = '/view/accountDetail/accountDetailInstitutionalOnPremise/accountDetailInstitutionalOnPremiseLanding.html?Id=' + listOfAccount[accountIndex].Id;
        }
        else if (recordTypeName === 'Non_beer_Warehouse') {
            window.location.href = '/view/accountDetail/accountDetailNonbeerWarehouse/accountDetailNonbeerWarehouseLanding.html?Id=' + listOfAccount[accountIndex].Id;
        }
        else if (recordTypeName === 'Off_Premise_Outlet') {
            window.location.href = '/view/accountDetail/accountDetailOffPremiseOutlet/accountDetailOffPremiseOutletLanding.html?Id=' + listOfAccount[accountIndex].Id;
        }
        else if (recordTypeName === 'On_Premise_Hotel') {
            window.location.href = '/view/accountDetail/accountDetailOnPremiseHotel/accountDetailOnPremiseHotelLanding.html?Id=' + listOfAccount[accountIndex].Id;
        }
        else if (recordTypeName === 'Supplier') {
            window.location.href = '/view/accountDetail/accountDetailSupplier/accountDetailSupplierLanding.html?Id=' + listOfAccount[accountIndex].Id;
        }
        else if (recordTypeName === 'Temporary_Event') {
            window.location.href = '/view/accountDetail/accountDetailTemporaryEvent/accountDetailTemporaryEventLanding.html?Id=' + listOfAccount[accountIndex].Id;
        }
        else if (recordTypeName === 'Wholesaler') {
            window.location.href = '/view/accountDetail/accountDetailWholesaler/accountDetailWholesalerLanding.html?Id=' + listOfAccount[accountIndex].Id;
        }
    }
    else if(nonSales.isTech){
        window.location.href = '/view/accountDetailLandingTechnician/accountDetailLandingTechnician.html?accountId='+listOfAccount[accountIndex].Id;
    }
    else if(nonSales.isAudit){
        window.location.href = '/view/accountDetailLandingAuditor/accountDetailLandingAuditor.html?accountId='+listOfAccount[accountIndex].Id;
    }
    
};
let channelMap = new Map([
    ["On-Premise", ["Hotel", "General", "Resorts", "Hostels", "Home-Stays", "Bed-and-Breakfasts", "Guesthouses", "Cottages", "Villas", "Luxury-Hotels", "Business-Hotels", "Economy-Hotels", "Restaurant", "Bar", "Club"]],
    ["Off-Premise", ["Retail-Account", "Wholesaler", "Modern-Trade", "Convenience-Store", "Gas-Station", "Drug-Store", "Liquor-Shop", "Wine-and-Beer-Shop", "Home-Distributor", "Diplomatic-Store"]],
    ["Institutional", ["Military", "Airlines", "Railways", "Cruise-Ships", "Stadiums", "Duty-Free", "Canteen-Store-Department-On", "Canteen-Store-Department-Off"]],
    ["Temporary-Event", ["Food-Festival", "Exhibition", "Music-Festival", "Others"]]
]);


let checkBoxLabel = [];
onChangeHandler = (ele) => {
    let channelName = $(ele).prop("value");

    if ($(ele).prop("checked")) {
        checkBoxLabel.push(channelName);
        $("input[name='subChannel']").parent().css("display", "none");
        $("input[name='type']").parent().css("display", "none");
        $("input[name='size']").parent().css("display", "none");
        for (var i = 0; i < checkBoxLabel.length; i++) {


            for (var j = 0; j < channelMap.get(checkBoxLabel[i]).length; j++) {


                if ($("input[type='checkbox']").hasClass(channelMap.get(checkBoxLabel[i])[j])) {

                    $('.' + channelMap.get(checkBoxLabel[i])[j]).parent().css("display", "block");
                }
            }

            if (checkBoxLabel == 'Temporary-Event') {
                $("input[name='size']").parent().css("display", "none");
            }
            else {
                $("input[name='size']").parent().css("display", "block");
            }
        }
    }
    else {
        checkBoxLabel.splice($.inArray(channelName, checkBoxLabel), 1);

        for (var i = 0; i < channelMap.get(channelName).length; i++) {
            $('.' + channelMap.get(channelName)[i]).prop("checked", false);
        }

        if (checkBoxLabel.length > 0) {
            $("input[name='subChannel']").parent().css("display", "none");
            $("input[name='type']").parent().css("display", "none");
            $("input[name='size']").parent().css("display", "none");
            for (var i = 0; i < checkBoxLabel.length; i++) {

                for (var j = 0; j < channelMap.get(checkBoxLabel[i]).length; j++) {
                    if ($("input[type='checkbox']").hasClass(channelMap.get(checkBoxLabel[i])[j])) {
                        $('.' + channelMap.get(checkBoxLabel[i])[j]).parent().css("display", "block");
                    }
                }
                if (checkBoxLabel == 'Temporary-Event') {
                    $("input[name='size']").parent().css("display", "none");
                }
                else {
                    $("input[name='size']").parent().css("display", "block");
                }
            }
        }
        else {
            $("input[name='subChannel']").parent().css("display", "block");
            $("input[name='size']").parent().css("display", "block");
            $("input[name='type']").parent().css("display", "block");
        }
    }

};


let subChannelMap = new Map([
    ["Hotel", ["On-Premise", "Resorts", "Hostels", "Guesthouses", "Home-Stays", "Cottages", "Villas", "Bed-and-Breakfasts", "Luxury Hotels", "Business Hotels", "Economy Hotels"]],
    ["General", ["On-Premise", "Restaurant", "Bar", "Club"]],
    ["Retail-Account", ["Off-Premise", "Modern-Trade", "Convenience-Store", "Gas-Station", "Drug-Store", "Liquor-Shop", "Wine-and-Beer-Shop", "Home-Distributor", "Diplomatic-Store"]],
    ["Wholesaler", ["Off-Premise", "Modern-Trade", "Convenience-Store", "Gas-Station", "Drug-Store", "Liquor-Shop", "Wine-and-Beer-Shop", "Home-Distributor", "Diplomatic-Store"]],
    ["Military", ["Institutional", "Canteen-Store-Department-On", "Canteen-Store-Department-Off"]],
    ["Airlines", ["Institutional", "Airlines"]],
    ["Railways", ["Institutional", "Railways"]],
    ["Cruise-Ships", ["Institutional", "Cruise-Ships"]],
    ["Stadiums", ["Institutional", "Stadiums"]],
    ["Duty-Free", ["Institutional", "Duty-Free"]],
]);


let checkBoxSubLabel = [];
onChangeSubHandler = (ele) => {
    let channelName = $(ele).prop("value");

    if ($(ele).prop("checked")) {
        checkBoxSubLabel.push(channelName);
        $("input[name='type']").parent().css("display", "none");
        $("input[name='channel[]']").parent().css("display", "none");
        $("input[name='size']").parent().css("display", "none");
        for (var i = 0; i < checkBoxSubLabel.length; i++) {

            for (var j = 0; j < subChannelMap.get(checkBoxSubLabel[i]).length; j++) {
                console.log(subChannelMap.get(checkBoxSubLabel[i])[j]);
                if ($("input[type='checkbox']").hasClass(subChannelMap.get(checkBoxSubLabel[i])[j])) {

                    $('.' + subChannelMap.get(checkBoxSubLabel[i])[j]).parent().css("display", "block");
                }
            }
            if (checkBoxSubLabel == 'Hotel') {
                $("input[name='size']").parent().css("display", "none");
            }
            else {
                $("input[name='size']").parent().css("display", "block");
            }
        }
    }
    else {
        checkBoxSubLabel.splice($.inArray(channelName, checkBoxSubLabel), 1);

        for (var i = 0; i < subChannelMap.get(channelName).length; i++) {
            $('.' + subChannelMap.get(channelName)[i]).prop("checked", false);
        }

        if (checkBoxSubLabel.length > 0) {
            $("input[name='type']").parent().css("display", "none");
            $("input[name='channel[]']").parent().css("display", "none");
            $("input[name='size']").parent().css("display", "none");
            for (var i = 0; i < checkBoxSubLabel.length; i++) {
                //console.log('i',subChannelMap.get(checkBoxSubLabel[i]).length);

                for (var j = 0; j < subChannelMap.get(checkBoxSubLabel[i]).length; j++) {
                    // console.log(subChannelMap.get(checkBoxSubLabel[i])[j]);

                    if ($("input[type='checkbox']").hasClass(subChannelMap.get(checkBoxSubLabel[i])[j])) {

                        $('.' + subChannelMap.get(checkBoxSubLabel[i])[j]).parent().css("display", "block");
                    }
                }
                if (checkBoxSubLabel == 'Hotel') {
                    $("input[name='size']").parent().css("display", "none");
                }
                else {
                    $("input[name='size']").parent().css("display", "block");
                }
            }
        }
        else {
            $("input[name='type']").parent().css("display", "block");
            $("input[name='channel[]']").parent().css("display", "block");
            $("input[name='size']").parent().css("display", "block");
        }
    }

};

let typeMap = new Map([
    ["Resorts", ["Hotel", "On-Premise"]],
    ["Hostels", ["Hotel", "On-Premise"]],
    ["Guesthouses", ["Hotel", "On-Premise"]],
    ["Home-Stays", ["Hotel", "On-Premise"]],
    ["Cottages", ["Hotel", "On-Premise"]],
    ["Villas", ["Hotel", "On-Premise"]],
    ["Bed-and-Breakfasts", ["Hotel", "On-Premise"]],
    ["Luxury-Hotels", ["Hotel", "On-Premise"]],
    ["Business-Hotels", ["Hotel", "On-Premise"]],
    ["Economy-Hotels", ["Hotel", "On-Premise"]],
    ["Restaurant", ["General", "On-Premise"]],
    ["Bar", ["General", "On-Premise"]],
    ["Club", ["General", "On-Premise"]],
    ["Modern-Trade", ["Wholesaler", "Retail-Account", "Off-Premise"]],
    ["Convenience-Store", ["Wholesaler", "Retail-Account", "Off-Premise"]],
    ["Gas-Station", ["Wholesaler", "Retail-Account", "Off-Premise"]],
    ["Drug-Store", ["Wholesaler", "Retail-Account", "Off-Premise"]],
    ["Liquor-Shop", ["Wholesaler", "Retail-Account", "Off-Premise"]],
    ["Wine-and-Beer-Shop", ["Wholesaler", "Retail-Account", "Off-Premise"]],
    ["Home-Distributor", ["Wholesaler", "Retail-Account", "Off-Premise"]],
    ["Diplomatic-Store", ["Wholesaler", "Retail-Account", "Off-Premise"]],
    ["Modern-Trade", ["Wholesaler", "Retail-Account", "Off-Premise"]],
    ["Canteen-Store-Department-On", ["Military", "Institutional"]],
    ["Canteen-Store-Department-Off", ["Military", "Institutional"]],
    ["Airlines", ["Airlines", "Institutional"]],
    ["Railways", ["Railways", "Institutional"]],
    ["Cruise-Ships", ["Cruise-Ships", "Institutional"]],
    ["Stadiums", ["Stadiums", "Institutional"]],
    ["Duty-Free", ["Duty-Free", "Institutional"]],
    ["Food-Festival", ["Temporary-Event"]],
    ["Exhibition", ["Temporary-Event"]],
    ["Music-Festival", ["Temporary-Event"]],
    ["Others", ["Temporary-Event"]],
]);


let checkBoxTypeLabel = [];
onChangeTypeHandler = (ele) => {
    let channelName = $(ele).prop("value");
    console.log(channelName);
    if ($(ele).prop("checked")) {
        checkBoxTypeLabel.push(channelName);
        $("input[name='subChannel']").parent().css("display", "none");
        $("input[name='channel[]']").parent().css("display", "none");
        for (var i = 0; i < checkBoxTypeLabel.length; i++) {

            for (var j = 0; j < typeMap.get(checkBoxTypeLabel[i]).length; j++) {
                //  console.log(typeMap.get(checkBoxTypeLabel[i])[j]);
                if ($("input[type='checkbox']").hasClass(typeMap.get(checkBoxTypeLabel[i])[j])) {

                    $('.' + typeMap.get(checkBoxTypeLabel[i])[j]).parent().css("display", "block");
                }
            }
        }
    }
    else {
        checkBoxTypeLabel.splice($.inArray(channelName, checkBoxTypeLabel), 1);
        checkBoxLabel = [];
        checkBoxSubLabel = [];
        for (var i = 0; i < typeMap.get(channelName).length; i++) {
            $('.' + typeMap.get(channelName)[i]).prop("checked", false);
        }

        if (checkBoxTypeLabel.length > 0) {
            $("input[name='subChannel']").parent().css("display", "none");
            $("input[name='channel[]']").parent().css("display", "none");
            for (var i = 0; i < checkBoxTypeLabel.length; i++) {
                // console.log('i',typeMap.get(checkBoxTypeLabel[i]).length);

                for (var j = 0; j < typeMap.get(checkBoxTypeLabel[i]).length; j++) {
                    //  console.log(typeMap.get(checkBoxTypeLabel[i])[j]);

                    if ($("input[type='checkbox']").hasClass(typeMap.get(checkBoxTypeLabel[i])[j])) {

                        $('.' + typeMap.get(checkBoxTypeLabel[i])[j]).parent().css("display", "block");
                    }
                }
            }
        }
        else {
            $("input[name='subChannel']").parent().css("display", "block");
            $("input[name='channel[]']").parent().css("display", "block");
        }
    }

};


clearFilter = () => {
    var inputCheck = $("input:checkbox");
    var inputRadio = $("input:radio");

    for (var i = 0; i < inputCheck.length; i++) {
        $(inputCheck[i]).prop('checked', false);
        $(inputCheck[i]).parent().css('display', 'block');
    }

    for (var i = 0; i < inputRadio.length; i++) {
        $(inputRadio[i]).prop('checked', false);
    }
};

var sortDir = true;
$('.filCom i').css('display', 'none');
sortingFields = (fieldName) => {
    showLoader();
    $('.filCom i').css('display', 'none');
    if (sortDir === true) {
        sortDir = false;
        $("." + fieldName + " .fa-arrow-down").css('display', 'inline-block');
        $("." + fieldName + " .fa-arrow-up").css('display', 'none');
    }
    else {
        sortDir = true;
        $("." + fieldName + " .fa-arrow-down").css('display', 'none');
        $("." + fieldName + " .fa-arrow-up").css('display', 'inline-block');
    }

    setTimeout(() => {
        listOfAccount = sortList(fieldName, listOfAccount, sortDir);
        hideLoader();
    }, 100);
};





showLoader = () => {
    $('#loader-main').css('display', 'block');
};

hideLoader = () => {
    $('#loader-main').css('display', 'none');
};

applyFilter = async() => {
    accountLists = [];
    listOfAccount = [];
    openCursor = null;
    filterAccounts();
    
    
};

//setup before functions
let typingTimer;                //timer identifier
let doneTypingInterval = 3000;  //time in ms, 5 second for example
let $input = $('#searchValue');

//on keyup, start the countdown
$input.on('keyup', function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(applyFilter, doneTypingInterval);
});

//on keydown, clear the countdown 
$input.on('keydown', function () {
  clearTimeout(typingTimer);
});
