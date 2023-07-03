$(document).ready(function(){
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    const individual = urlParam.get('individual')
    console.log(individual, 'individual')
    if(individual == 'true'){
      $('#closeIco').hide();
      $('.arrowIcons').hide();
      $('.logoSection').css('width','93%')
      $('#finishBtn').show();
    }
  })



goBack = () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  window.location.href = `/view/sales/productDetail.html?accountId=${accountId}`
}

goForward = () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  window.location.href = `/view/sales/placeOrder.html?accountId=${accountId}`
}