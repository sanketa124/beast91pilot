const accountID = localStorage.getItem('accountId');
$(document).ready(function(){
  let urlParam = new URLSearchParams(window.location.search);
  const individual = urlParam.get('individual')
  console.log(individual, 'individual')
  if(individual == 'true'){
    $('#closeIco').hide();
    $('.arrowIcons').hide();
    $('.logoSection').css('width','93%')
    $('#finishBtn').show();
  }
})

$(function () {
    $("#selectSearch").select2();
  });
  
  let items = [];
  let itemValueMap = new Map();
  let addedProducts = [];
  let addedProductIds = [];
  let productSelectedTotal = new Set();

  searchableProducts = (itemList) => {
    itemsBackend = itemList;
    itemsBackend.forEach(ele => {
      itemValueMap.set(ele.Product__c, ele);
    });
    getProduct();
   // return itemList;

  };
  getProduct = () => {
    console.log('itemList', itemsBackend);
  }
 
let stockOutletList = [];
getStockOutletList = () => {
console.log('retailDepletionDataExisting', retailDepletionData)
if(retailDepletionData.length>0){
  for (var i = 0; i < retailDepletionData.length; i++) {
    let productsAdded = {
      Item_Master: retailDepletionData[i].Item__c,
      Quantity: 0,
      Quantity__c:0,
      mrp: 0,
      name: retailDepletionData[i].Item__r.Display_Name__c,
    }
    addedProducts.push(productsAdded)
    addedProductIds.push(retailDepletionData[i].Item__c);
    $("#stckOutletTbl tbody").prepend(' <tr data-id="'+retailDepletionData[i].Item__c+'">\
    <td>'+retailDepletionData[i].Item__r.Display_Name__c+'</td>\
    <td><input type="number" class="form-control cartQtyChange" min="0" value="0" name="stockOutletVal" onkeyup="qtyTotalUpdate(`'+retailDepletionData[i].Item__c+'`)"></td>\
    </tr>')
  }
}else{
  let totalQty = 0;
  for (var i = 0; i < stockOutletExistingData.length; i++) {
    let productsAdded = {
      Item_Master: stockOutletExistingData[i].Item_Master,
      Quantity: stockOutletExistingData[i].Quantity,
      Quantity__c: stockOutletExistingData[i].Quantity,
      mrp: 0,
      name: stockOutletExistingData[i].name,
      ...(stockOutletExistingData[i].Stock_at_Risk !== null ? { Stock_at_Risk: stockOutletExistingData[i].Stock_at_Risk } : {})
    }
    addedProducts.push(productsAdded)
    addedProductIds.push(stockOutletExistingData[i].Item_Master);
    $("#stckOutletTbl tbody").prepend(' <tr data-id="'+stockOutletExistingData[i].Item_Master+'">\
    <td>'+stockOutletExistingData[i].name+'</td>\
    <td><input type="number" class="form-control cartQtyChange" name="stockOutletVal" min="0" value="'+stockOutletExistingData[i].Quantity+'" onkeyup="qtyTotalUpdate(`'+stockOutletExistingData[i].Item_Master+'`)"></td>\
    </tr>')
    totalQty += stockOutletExistingData[i].Quantity;

}
$('#cartTotal label span, #totalItem').html(totalQty)
}
  getProduct();
}

const productClicked = (name, id) => {
  addedProductIds.push(id);
  $("#productList").empty();
  var quantity = $("#newEntry #prodQ").val();
  $("#stckOutletTbl tbody tr").filter(":last").before(' <tr data-id="'+id+'">\
  <td>'+name+'</td>\
  <td><input type="number" class="form-control cartQtyChange" min="0" value="'+quantity+'"  onkeyup="qtyTotalUpdate(`'+id+'`)"></td>\
  </tr>')
  let productsAdded = {
    Item_Master: id,
    Quantity__c: quantity,
    Quantity: quantity,
    mrp: 0,
    name: name
  }
  addedProducts.push(productsAdded)
  $("#newEntry").hide();

};

openSearch = () =>{
  if($("#newEntry").is(":hidden")){
    $("#newEntry #productSearch").val("");
    $("#newEntry #prodQ").val(0);
    $("#newEntry").show();
  }
}


  $('#productSearch').keyup(function() {
    console.log('sss',addedProductIds)
    var value = $(this).val().toLowerCase();
    var results = [];
    console.log('itemsBackend',itemsBackend)
    if (value.length > 0) {
      items = itemsBackend.filter(ele => {
        if(!addedProductIds.includes(ele.Product__c)){
          let displayName = (ele.Product__c ? (ele.Product__r.Display_Name__c) : '');
          displayName = displayName.toLowerCase();
          const obj = { id: ele.Product__c, name: displayName.indexOf(value) > -1 ? displayName : '' };
          console.log('obj',obj)
          {obj.name && results.push(obj)}
        }
      });
      if(results.length <= 0){
        results.push({id: 0 , name : 'No result found'});
      }
    }
    getProduct()
    displayAutocomplete(results);
  });
  
  function displayAutocomplete(results) {
    var autocompleteList = $('#productList');
    autocompleteList.empty();
    if(results.length > 0){
      if(results[0].id !== 0){
        for (var i = 0; i < results.length; i++) {
          var suggestion = $('<div  onclick="productClicked(`'+results[i].name+'`,`'+results[i].id+'`)">').addClass('autocomplete-item').text(results[i].name);
          autocompleteList.append(suggestion);
        }
      }else{
        var suggestion = $('<div>').addClass('autocomplete-item').text(results[0].name);
        autocompleteList.append(suggestion);
      }
    }
    

  }
//});

qtyTotalUpdate = (prodId) =>{

let sum = 0;
$(".cartQtyChange").each(function() {
  var thisId = $(this).parent().parent().attr("data-id");
  var value = parseInt($(this).val());  
  if(thisId == prodId){
    $.each(addedProducts, function(index, obj) {
      if (obj.Item_Master == prodId) {
        if(isNaN(value)){
          value = 0;
        }
        obj.Quantity = value;
        obj.Quantity__c = value;
      }
    });
  }
  if (!isNaN(value)) {
    sum += value;
  }
});
console.log(addedProducts)
console.log('sum',sum)
$('#cartTotal label span, #totalItem').html(sum)
}

areAllFieldsEmpty = () => {
  $('#errorMsg').hide();
  const inputFields = document.querySelectorAll('input[name="stockOutletVal"]');
  for (let i = 0; i < inputFields.length; i++) {
    const value = inputFields[i].value.trim();
    if (Number(value) < 0 ) {
      $('#errorMsg').show();
      return false;
    }
  }
  saveStockOutlet();
}

goBack = () => {
  window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountID}`
}
