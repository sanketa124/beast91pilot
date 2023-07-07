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
    //console.log(retailDepletionData[i].Item__r.Display_Name__c)
  }
}else{
  for (var i = 0; i < stockOutletExistingData.length; i++) {
    let productsAdded = {
      Item_Master: stockOutletExistingData[i].Item_Master,
      Quantity: stockOutletExistingData[i].Quantity,
      Quantity__c: stockOutletExistingData[i].Quantity,
      mrp: 0,
      name: stockOutletExistingData[i].name,
      ...(stockOutletExistingData[i].Stock_at_Risk ? { Stock_at_Risk: stockOutletExistingData[i].Stock_at_Risk } : {})
    }
    addedProducts.push(productsAdded)
    addedProductIds.push(stockOutletExistingData[i].Item_Master);
    $("#stckOutletTbl tbody").prepend(' <tr data-id="'+stockOutletExistingData[i].Item_Master+'">\
    <td>'+stockOutletExistingData[i].name+'</td>\
    <td><input type="number" class="form-control cartQtyChange" name="stockOutletVal" min="0" value="'+stockOutletExistingData[i].Quantity+'" onkeyup="qtyTotalUpdate(`'+stockOutletExistingData[i].Item_Master+'`)"></td>\
    </tr>')
}
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


//$(document).ready(function() {
  $('#productSearch').keyup(function() {
    console.log('sss',addedProductIds)
    var query = $(this).val().toLowerCase();
    var results = [];
    console.log('itemsBackend',itemsBackend)
    if (query.length > 0) {
      // Perform the search
      var value = $(this).val().toLowerCase();
      items = itemsBackend.filter(ele => {
        console.log(ele.Product__c)
        if(!addedProductIds.includes(ele.Product__c)){
          let displayName = (ele.Product__c ? (ele.Product__r.Display_Name__c) : '');
          displayName = displayName.toLowerCase();
          const obj = { id: ele.Product__c, name: displayName.indexOf(value) > -1 ? displayName : '' };
          results.push(obj); // Add the object to the array
          //results.push(displayName.indexOf(value) > -1 ? displayName : '');
        }
       
      });
    }
    getProduct()
    // Display the autocomplete suggestions
    displayAutocomplete(results);
  });
  
  // Function to display the autocomplete suggestions
  function displayAutocomplete(results) {
    console.log(results)
    var autocompleteList = $('#productList');
    autocompleteList.empty();
    
    for (var i = 0; i < results.length; i++) {
      var suggestion = $('<div  onclick="productClicked(`'+results[i].name+'`,`'+results[i].id+'`)">').addClass('autocomplete-item').text(results[i].name);
      autocompleteList.append(suggestion);
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
$('#cartTotal label span').html(sum)
}

// saveStockOutlet = () => {
//   let urlParam = new URLSearchParams(window.location.search);
//   const individual = urlParam.get('individual')
//   console.log(individual, 'individual')
//   if(individual = 'true'){
//     window.location.href = `/view/accountLanding/accountLanding.html?accountId=${accountID}`
//   }else{
//     window.location.href = `/view/sales/stockatRisk.html?accountId=${accountID}`
//   }
// }



areAllFieldsEmpty = () => {
  $('#errorMsg').hide();
  const inputFields = document.querySelectorAll('input[name="stockOutletVal"]');
  console.log(inputFields)
  for (let i = 0; i < inputFields.length; i++) {
    const value = inputFields[i].value.trim();
    if (value === '' || typeof Number(value) !== 'number' || Number(value) < 0 ) {
      $('#errorMsg').show();
      console.log('ddd', value,typeof value)
      return false;
    }
  }
  saveStockOutlet();
}

goBack = () => {
  window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountID}`
}
