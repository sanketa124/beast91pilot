$('#gridTbl1 tbody tr:nth-child(n+6)').hide()
$('#gridTbl1 tbody tr:last-child').show()
$("#showGridTbl1").click(function(){
  $('#gridTbl1 tbody tr:nth-child(n+5)').toggle();
  $('#gridTbl1 tbody tr:last-child').show()
  $(this).toggleClass('addtrans')
})

$('#gridTbl2 tbody tr:nth-child(n+6)').hide()
$('#gridTbl2 tbody tr:last-child').show()
$("#showGridTbl2").click(function(){
  $('#gridTbl2 tbody tr:nth-child(n+5)').toggle();
  $('#gridTbl2 tbody tr:last-child').show()
  $(this).toggleClass('addtrans')
})




goBack = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/checkIn/checkIn.html?accountId=${accountId}`
  }
  
  goForward = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountId}`
  }