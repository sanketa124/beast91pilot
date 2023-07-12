(async function () {
    $('.loader-div').css('display', 'block');
    const position = await getCurrentLocationHelper();
    console.log('position', position)
    $('#latitude').html(position.coords.latitude);
    $('#longitude').html(position.coords.longitude);
    $('.loader-div').css('display', 'none');
    geoLocation['Geolocation__c'] = {
        "latitude": position.coords.latitude,
        "longitude": position.coords.longitude
    }
})();

let geoLocation = {}

finish = async () => {
    $('#geoLocationSubmit').modal('show');
    $('#geoLocationSubmit .modal-body').html('Are you sure you want to update the geolocation?');
    $('#geoLocationSubmit .modal-footer .btn-success').html('Yes');
    $('#geoLocationSubmit .modal-footer .btn-danger').html('No');
}

saveGeoLocation = async () => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    const fromVisits = urlParam.get('fromVisits')
    const fromAccountListing = urlParam.get('fromAccountListing')

    let accountDetail = await getItemFromStore('account', accountID);
    if (accountDetail && accountDetail.Geolocation__c) {
        accountDetail.Geolocation__c.latitude = geoLocation['Geolocation__c'].latitude ? geoLocation['Geolocation__c'].latitude : ""
        accountDetail.Geolocation__c.longitude = geoLocation['Geolocation__c'].longitude ? geoLocation['Geolocation__c'].longitude : ""
    } else {
        accountDetail['Geolocation__c'] = {
            "latitude": geoLocation['Geolocation__c'].latitude ? geoLocation['Geolocation__c'].latitude : "",
            "longitude": geoLocation['Geolocation__c'].longitude ? geoLocation['Geolocation__c'].longitude : ""
        }
    }
    accountDetail.isSynced = false
    await writeData('account', accountDetail);
    await writeData('account', accountDetail);
    await writeData('account-push-geolocations',{ Geolocation__Latitude__s:accountDetail['Geolocation__c'].latitude ,Geolocation__Longitude__s:  accountDetail['Geolocation__c'].longitude,Id:accountID})
    if (fromVisits) {
        window.location.href = `/view/dashboard/todaysVisits/todaysVisits.html`
    } else if (fromAccountListing) {
        window.location.href = `/view/accountList/accountListView.html`
    } else {
        window.location.href = `/view/accountLanding/accountLanding.html?accountId=${accountID}`
    }
}


noMoveBack = async () => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    const fromVisits = urlParam.get('fromVisits')
    const fromAccountListing = urlParam.get('fromAccountListing')

    if (fromVisits) {
        window.location.href = `/view/dashboard/todaysVisits/todaysVisits.html`
    } else if (fromAccountListing) {
        window.location.href = `/view/accountList/accountListView.html`
    } else {
        window.location.href = `/view/accountLanding/accountLanding.html?accountId=${accountID}`
    }
}


