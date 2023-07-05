


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
   // stockDetail = stockDetail.concat(stockVisbility.stockVisibilityChilds);
   stockVisbility.stock_at_risk_images = [];
    for (var i = 0; i < stockVisbility.stockVisibilityChilds.length; i++) {
      stockVisbility.stockVisibilityChilds[i].Stock_at_Risk = 0;
     
    }
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
    <td>'+createImgInput(('stock_at_risk_images'), '', stockVisbility['xxxx'], "fileInput(this,`"+selectedProducts[i].Item_Master+"`)", true)+'</td>\
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
  console.log('itemMaster',itemMaster)
  const key = $(event).attr('id');
  const fileInput = $(event).prop('files')[0];
console.log('fileInput',fileInput)
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
    PathOnClient : stockVisbility.accountId+'|'+stockVisbility.recordTypeName+'|'+stockVisbility.Geolocation_Latitude +' '+stockVisbility.Geolocation_Longitude+'.'+fileInput.type.split('/').pop(),
    VersionData: newImgPath.replace(/^data:image\/[a-z]+;base64,/, ""),
    Title: stockVisbility.accountId+'|'+stockVisbility.recordTypeName+'|'+stockVisbility.Geolocation_Latitude +' '+stockVisbility.Geolocation_Longitude,
    //FileExtension: fileInput.type.split('/').pop()
  }
  stockVisbility['stock_at_risk_images'].push(newImg);
  //fileAttachedBackgroundChange(key);
};

const fileAttachedBackgroundChange = (key) => {
  let iconKey = key;
  let icon = $('.' + iconKey);
  icon.css('color', '#5cb85c');
};


qtyTotalUpdate = (prodId) =>{

    let sum = 0;
    $(".cartQtyChange").each(function() {
      var thisId = $(this).parent().parent().attr("data-id");
      var value = parseInt($(this).val());  
      if(thisId == prodId){
        
        $.each(selectedProducts, function(index, obj) {
          if (obj.Item_Master == prodId) {
            console.log('matched',obj)
            obj.Stock_at_Risk = value;
          }
        });
      }
      if (!isNaN(value)) {
        sum += value;
      }
    });
    console.log('sum',sum)
    $('#cartTotal').html(sum)
    }
    
saveStockAtRisk = async () => {
  await writeData('stockVisibility',stockVisbility);
  // console.log('selectedProducts',selectedProducts)
  // console.log('stockVisbility',stockVisbility)
  const urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  window.location.href = `/view/sales/recomendation.html?accountId=${accountId}`
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