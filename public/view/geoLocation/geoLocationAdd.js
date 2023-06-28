(async function() {

    const position =  await getCurrentLocationHelper();
    $('#latitude').html(position.coords.latitude);
    $('#longitude').html(position.coords.latitude);

})();


finish = async() => {
    //to do
}

