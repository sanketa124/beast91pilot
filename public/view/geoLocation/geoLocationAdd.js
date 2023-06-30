(async function () {
    const position = await getCurrentLocationHelper();
    $('#latitude').html(position.coords.latitude);
    $('#longitude').html(position.coords.latitude);

    geoLocation['Geolocation__c'] = {
        "latitude": position.coords.latitude,
        "longitude": position.coords.latitude
    }

})();

let geoLocation = {}

finish = async () => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    let accountDetail = await getItemFromStore('account', accountID);
    // console.log('accountDetail',accountDetail)

    let existingGeoLocation = accountDetail && accountDetail.Geolocation__c
    existingGeoLocation.latitude = geoLocation['Geolocation__c'].latitude
    existingGeoLocation.longitude = geoLocation['Geolocation__c'].longitude
    accountDetail['isSynced'] = false;
    console.log('accountDetail---------------',accountDetail)
    await writeData('account', accountDetail);

    // console.log('Geo Location---', geoLocation)
    // Geolocation__c

    // Geolocation__c
}

