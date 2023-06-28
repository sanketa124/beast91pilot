$('#feedback').hide()
$('#placeOrderModal').modal('show');
submit = () => {
    $('#placeOrderModal').modal('hide');
    window.location.href = 'recomendation.html'

}
cancel = () => {
    $('#placeOrderModal').modal('hide');
    $('#feedback').show()
}