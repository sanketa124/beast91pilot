(async function () {
    $('.loader-div').css('display', 'block');
    const position = await getCurrentLocationHelper();
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
    let accountDetail = await getItemFromStore('account', accountID);
    let existingGeoLocation = accountDetail && accountDetail.Geolocation__c
    existingGeoLocation.latitude = geoLocation['Geolocation__c'].latitude
    existingGeoLocation.longitude = geoLocation['Geolocation__c'].longitude
    accountDetail['isSynced'] = false;
    await writeData('account', accountDetail);
    if (fromVisits) {
        window.location.href = `/view/dashboard/todaysVisits/todaysVisits.html`
    } else {
        window.location.href = `/view/accountLanding/accountLanding.html?accountId=${accountID}`
    }
}


noMoveBack = async () => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    const fromVisits = urlParam.get('fromVisits')
    if (fromVisits) {
        window.location.href = `/view/dashboard/todaysVisits/todaysVisits.html`
    } else {
        window.location.href = `/view/accountLanding/accountLanding.html?accountId=${accountID}`
    }
}


