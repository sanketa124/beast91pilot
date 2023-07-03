


let stockDetail = [];
let items = [];
let itemsBackend = [];
let imageMap = new Map();
let itemValueMap = new Map();
let selectedProducts = new Set();

let stockVisbility = {};
const initializeStockVisibility = async () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    const key = `${fetchCurrentDateIdStr()}-${accountId}`;
    stockVisbility = await getItemFromStore('stockVisibility',key);
    stockDetail = stockDetail.concat(stockVisbility.stockVisibilityChilds);
    selectedProducts = stockVisbility.stockVisibilityChilds;
    console.log('productSelectedTotal',stockVisbility.stockVisibilityChilds)
    displayProducts();
};
displayProducts = () =>{
    for (var i = 0; i < selectedProducts.length; i++) {
    $("#stckRiskTbl tbody").prepend(' <tr data-id="'+selectedProducts[i].Item_Master+'">\
    <td>'+selectedProducts[i].name+'</td>\
    <td>'+selectedProducts[i].Quantity+'</td>\
    <td><input type="number" class="form-control cartQtyChange" min="0" value="0" onkeyup="qtyTotalUpdate(`'+selectedProducts[i].Item_Master+'`)"></td>\
    <td><i class="fas fa-camera"></i></td>\
    </tr>')
    }
}
qtyTotalUpdate = (prodId) =>{

    let sum = 0;
    $(".cartQtyChange").each(function() {
     // var thisId = $(this).parent().parent().attr("data-id");
      var value = parseInt($(this).val());  
    //   if(thisId == prodId){
    //     $.each(addedProducts, function(index, obj) {
    //       if (obj.Item_Master == prodId) {
    //         obj.Quantity = value;
    //       }
    //     });
    //   }
      if (!isNaN(value)) {
        sum += value;
      }
    });
    console.log('sum',sum)
    $('#cartTotal').html(sum)
    }
    
initializeStockVisibility()

goBack = () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  window.location.href = `/view/sales/stockOutlet.html?accountId=${accountId}`
}

goForward = () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  window.location.href = `/view/sales/recomendation.html?accountId=${accountId}`
}