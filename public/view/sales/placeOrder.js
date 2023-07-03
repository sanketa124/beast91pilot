$('#feedback').hide()
$('#placeOrderModal').modal('show');
submit = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    
    $('#placeOrderModal').modal('hide');
    window.location.href = `/view/sales/recomendation.html?accountId=${accountId}`

}
cancel = () => {
    $('#placeOrderModal').modal('hide');
    $('#feedback').show()
}

