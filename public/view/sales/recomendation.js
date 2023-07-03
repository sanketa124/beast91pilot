gotoDetail = (event) => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    console.log(event)
    if(event == 'noExternal'){
        window.location.href = `placeOrder.html?accountId=${accountId}`
    }else{
        window.location.href = `productDetail.html?accountId=${accountId}`
    }
}

goBack = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/sales/stockOutlet.html?accountId=${accountId}`
  }
  
  goForward = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/objectives/salesOrder/salesOrderLanding.html?accountId=${accountId}`
  }