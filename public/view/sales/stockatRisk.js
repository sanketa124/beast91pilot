


let stockDetail = [];
let items = [];
let itemsBackend = [];
let imageMap = new Map();
let itemValueMap = new Map();
let selectedProducts = new Set();
const accountID = localStorage.getItem('accountId');
let accoutnDetails = {}

let stockVisbility = {};
const initializeStockVisibility = async () => {
  var currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 1);
  currentDate.setDate(0);
  var options = { day: 'numeric', month: 'long', year: 'numeric' };
  var lastFullDateOfNextMonth = currentDate.toLocaleDateString('en-US', options);
  $('#expiry_date').html(lastFullDateOfNextMonth);

  console.log('lastDateOfNextMonth', lastFullDateOfNextMonth);
  const key = `${fetchCurrentDateIdStr()}-${accountID}`;
  stockVisbility = await getItemFromStore('stockVisibility', key);
  accoutnDetails = await getItemFromStore('account', accountID);
  // stockDetail = stockDetail.concat(stockVisbility.stockVisibilityChilds);
  if (!stockVisbility.stock_at_risk_images) {
    stockVisbility.stock_at_risk_images = [];
  }

  if (stockVisbility.stockVisibilityChilds[0].Stock_at_Risk == undefined) {
    for (var i = 0; i < stockVisbility.stockVisibilityChilds.length; i++) {
      stockVisbility.stockVisibilityChilds[i].Stock_at_Risk = 0;

    }
  }

  selectedProducts = stockVisbility.stockVisibilityChilds;
  console.log('productSelectedTotal', stockVisbility.stockVisibilityChilds)
  displayProducts();
};
displayProducts = () => {

  for (var i = 0; i < selectedProducts.length; i++) {
    console.log('selectedProducts', selectedProducts[i])
    var stockAtRisk = selectedProducts[i].Stock_at_Risk ? selectedProducts[i].Stock_at_Risk : 0;
    $("#stckRiskTbl tbody").prepend(' <tr data-id="' + selectedProducts[i].Item_Master + '">\
    <td>'+ selectedProducts[i].name + '</td>\
    <td>'+ selectedProducts[i].Quantity + '</td>\
    <td><input type="number" class="form-control cartQtyChange" min="0" value="'+ stockAtRisk + '" max="' + selectedProducts[i].Quantity + '" onkeyup="qtyTotalUpdate(`' + selectedProducts[i].Item_Master + '`,' + selectedProducts[i].Quantity + ')" onblur="myFunction(`' + selectedProducts[i].Item_Master + '`,' + selectedProducts[i].Quantity + ')"></td>\
    <td>'+ createImgInput(('' + selectedProducts[i].Item_Master + ''), '', stockVisbility['xxxx'], "fileInput(this,`" + selectedProducts[i].Item_Master + "`)", true) + '</td>\
    </tr>')
  }
}


const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});
const fileInput = async (event, itemMaster) => {
  console.log('itemMaster', itemMaster)
  const key = $(event).attr('id');
  const fileInput = $(event).prop('files')[0];
  console.log('fileInput', fileInput)
  // var options = {
  //   maxSizeMB: 0.1,
  //   maxWidthOrHeight: 1920,
  //   useWebWorker: true
  // };
  //const compressedFile = await imageCompression(fileInput, options);
  uploadBase64Value(key, fileInput);


};

const uploadBase64Value = async (key, fileInput) => {

  const newImgPath = await toBase64(fileInput);
  let newImg = {
    PathOnClient: accoutnDetails.Name + ' | Stock at Risk | ' + stockVisbility.recordTypeName + ' | ' + stockVisbility.Geolocation_Latitude + ' ' + stockVisbility.Geolocation_Longitude + ' | ' + new Date() + '.' + fileInput.type.split('/').pop(),
    VersionData: newImgPath.replace(/^data:image\/[a-z]+;base64,/, ""),
    Title: accoutnDetails.Name + ' | Stock at Risk | ' + stockVisbility.recordTypeName + ' | ' + stockVisbility.Geolocation_Latitude + ' ' + stockVisbility.Geolocation_Longitude + ' | ' + new Date(),
    //FileExtension: fileInput.type.split('/').pop()
  }

  stockVisbility['stock_at_risk_images'].push(newImg);
  fileAttachedBackgroundChange(key);
};

const fileAttachedBackgroundChange = (key) => {
  let iconKey = key;
  let icon = $('.' + iconKey);
  icon.css('color', '#5cb85c');
};


qtyTotalUpdate = (prodId, qty) => {

  let sum = 0;
  $(".cartQtyChange").each(function () {
    var thisId = $(this).parent().parent().attr("data-id");
    var value = parseInt($(this).val());
    if (thisId == prodId) {
      $.each(selectedProducts, function (index, obj) {
        if (obj.Item_Master == prodId && qty > value) {
          obj.Stock_at_Risk = value;
        }
      });
    }
    if (!isNaN(value)) {
      sum += value;
    }
  });
  console.log('sum', sum)
  $('#cartTotal').html(sum)
}
myFunction = (thisId, qty) => {
  const thisVal = $('[data-id="' + thisId + '"]').find('.cartQtyChange').val();
  if (thisVal > qty) {
    $('[data-id="' + thisId + '"]').find('.cartQtyChange').val(0)
  }

}
saveStockAtRisk = async () => {
  await writeData('stockVisibility', stockVisbility);
  window.location.href = `/view/sales/recomendation.html?accountId=${accountID}`
}
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
initializeStockVisibility()