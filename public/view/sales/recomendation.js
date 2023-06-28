gotoDetail = (event) => {
    console.log(event)
    if(event == 'noExternal'){
        window.location.href = 'placeOrder.html'
    }else{
        window.location.href = 'productDetail.html'
    }
}