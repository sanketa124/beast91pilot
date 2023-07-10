


let stockDetail = [];
let items = [];
let itemsBackend = [];
let imageMap = new Map();
let itemValueMap = new Map();
let selectedProducts = new Set();
const accountID = localStorage.getItem('accountId');
let accoutnDetails = {};
let totalStockAtRiskQty = 0;

let stockVisbility = {};
const initializeStockVisibility = async () => {
  var currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 2);
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

  if (!('Stock_at_Risk' in stockVisbility.stockVisibilityChilds[0])) {
    for (var i = 0; i < stockVisbility.stockVisibilityChilds.length; i++) {
      console.log('count')
      stockVisbility.stockVisibilityChilds[i].Stock_at_Risk = 0;

    }
  }

  selectedProducts = stockVisbility.stockVisibilityChilds;
  console.log('productSelectedTotal', stockVisbility.stockVisibilityChilds);
  $('.checkHeader, #showCases').hide();
  displayProducts();
  updateImageColorOnLoad();
};
displayProducts = () => {
  for (var i = 0; i < selectedProducts.length; i++) {
    console.log('selectedProducts', selectedProducts[i])
    var stockAtRisk = selectedProducts[i].Stock_at_Risk ? selectedProducts[i].Stock_at_Risk : 0;
    $("#stckRiskTbl tbody").prepend(' <tr data-id="' + selectedProducts[i].Item_Master + '">\
    <td style="width:45%">'+ selectedProducts[i].name + '</td>\
    <td style="width:14%;text-align:center;" class="itemOty">'+ selectedProducts[i].Quantity + '</td>\
    <td style="width:23%"><input type="number" style="padding:0;" class="form-control cartQtyChange" min="0" value="'+ stockAtRisk + '" max="' + selectedProducts[i].Quantity + '" onkeyup="qtyTotalUpdate(`' + selectedProducts[i].Item_Master + '`,' + selectedProducts[i].Quantity + ')" name="stockRiskVal"></td>\
    <td style="width:18%">'+ createImgInput(('' + selectedProducts[i].Item_Master + ''), '', stockVisbility['xxxx'], "fileInput(this,`" + selectedProducts[i].Item_Master + "`)", true) + '</td>\
    </tr>')
    totalStockAtRiskQty += stockAtRisk;
  }
  $('#cartTotal').html(totalStockAtRiskQty);
  if (totalStockAtRiskQty > 0) {
    $('.checkHeader').show();
    if (typeof stockVisbility.liquidPromotion !== 'undefined' && stockVisbility.liquidPromotion !== null) {
      $("#showCasesCheck").prop("checked", true);
      $("#caseQty").val(stockVisbility.liquidPromotion.Number_of_Cases__c);
      $("#showCases").show();

    }
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
  const index = stockVisbility.stock_at_risk_images.findIndex(obj => obj.id === key);
  if (index !== -1) {
    stockVisbility.stock_at_risk_images.splice(index, 1);
  }

  const newImgPath = await toBase64(fileInput);
  let newImg = {
    PathOnClient: accoutnDetails.Name + ' | Stock at Risk | ' + stockVisbility.recordTypeName + ' | ' + stockVisbility.Geolocation_Latitude + ' ' + stockVisbility.Geolocation_Longitude + ' | ' + new Date() + '.' + fileInput.type.split('/').pop(),
    VersionData: newImgPath.replace(/^data:image\/[a-z]+;base64,/, ""),
    Title: accoutnDetails.Name + ' | Stock at Risk | ' + stockVisbility.recordTypeName + ' | ' + stockVisbility.Geolocation_Latitude + ' ' + stockVisbility.Geolocation_Longitude + ' | ' + new Date(),
    id: key
  }
  stockVisbility['stock_at_risk_images'].push(newImg);
  fileAttachedBackgroundChange(key);
};

const fileAttachedBackgroundChange = (key) => {
  let iconKey = key;
  let icon = $('.' + iconKey);
  icon.css('color', '#5cb85c');
};

updateImageColorOnLoad = () => {
  if (stockVisbility.stock_at_risk_images.length > 0) {
    stockVisbility.stock_at_risk_images.forEach(item => {
      let iconKey = item.id;
      let icon = $('.' + iconKey);
      icon.css('color', '#5cb85c');
    });
  }
}

qtyTotalUpdate = (prodId, qty) => {

  let sum = 0;
  $(".cartQtyChange").each(function () {
    var thisId = $(this).parent().parent().attr("data-id");
    var value = parseInt($(this).val());
    if (thisId == prodId) {
      $.each(selectedProducts, function (index, obj) {
        if (obj.Item_Master == prodId) {
          if (isNaN(value)) {
            value = 0;
          }
          if (qty >= value) {
            obj.Stock_at_Risk = value;
          }
        }
      });
    }
    if (!isNaN(value)) {
      sum += value;
    }
    if (sum > 0) {
      $('.checkHeader').show();
    } else {
      $('.checkHeader').hide();
    }
  });
  totalStockAtRiskQty = sum
  console.log('sum', sum)
  $('#cartTotal').html(sum);
}

showCases = () => {
  var isChecked = $('#showCasesCheck').prop('checked');
  if (isChecked) {
    $('#showCases').show();
  } else {
    $('#showCases').hide();
  }

}

saveStockAtRisk = async () => {
  console.log('stockVisbility', stockVisbility)
  $('#errorMsg').hide();
  var isChecked = $('#showCasesCheck').prop('checked');
  if (inputError()) {
    var errmsg = inputError() == 'negative_error' ? 'Stock at risk quantity cannot be a negative value' : inputError() == 'stock_error' ? 'Stock at risk cannot be more than stock at outlet' : '';
    $('#errorMsg').html(errmsg).show();
    $("html, body").scrollTop($("#errorMsg").offset().top);
    return false;
  }

  let isValid = true;
  for (let i in stockVisbility.stockVisibilityChilds) {
    const notPresent = stockVisbility.stock_at_risk_images.every(obj => obj['id'] !== stockVisbility.stockVisibilityChilds[i].Item_Master);
    if (stockVisbility.stockVisibilityChilds[i].Stock_at_Risk > 0) {
      if (stockVisbility.stock_at_risk_images.length <= 0 || (stockVisbility.stock_at_risk_images.length > 0 && notPresent)) {
        isValid = false;
        break;
      }
    }
  }
  console.log('isValid', isValid)
  if (!isValid) {
    $('#stockSubmit').modal('show');
    $('#stockSubmit .modal-body').html('Images are mandatory for stock at risk items');
    $('.modal-footer .btn-success').css('display', 'none');
    $('.modal-footer .btn-danger').html('Close');
    return false;
  }
  else {
    $('#stockSubmit').modal('hide');
    $('.modal-footer .btn').css('display', '');
    $('#stockSubmit .modal-body').html('Are you sure you want to submit ? ');
    $('.modal-footer .btn-danger').html('No');
  }

  if (isChecked) {
    var showCase = $('#showCases input').val();
    if (!showCase || showCase == 0) {
      $('#errorMsg').html('Number of cases must be more than 0').show();
      $("html, body").scrollTop($("#errorMsg").offset().top);
      return false;
    } else {
      if (showCase > totalStockAtRiskQty) {
        $('#errorMsg').html('Number of cases for promotion should not be more than total stock at risk').show();
        $("html, body").scrollTop($("#errorMsg").offset().top);
        return false;
      } else {
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, "0");
        let day = String(currentDate.getDate()).padStart(2, "0");
        let acceptedDate = `${year}-${month}-${day}`;

        stockVisbility.liquidPromotion = {
          Outlet_Name__c: accountID,
          Is_Accepted__c: true,
          Number_of_Cases__c: showCase,
          Accepted_Date__c: acceptedDate
        }
      }
    }
  } if ($('#cartTotal').html() == '0') {
    delete stockVisbility['liquidPromotion'];
  }
  await writeData('stockVisibility', stockVisbility);
  window.location.href = `/view/sales/recomendation.html?accountId=${accountID}`
}

inputError = () => {
  let err = 0;
  let errMsg = ''
  const inputFields = $('input[name="stockRiskVal"]');

  inputFields.each(function () {
    const value = parseInt($(this).val());

    if (Number(value) < 0) {
      err += 1;
      errMsg = 'negative_error';
    } else {
      const stockOutletQty = parseInt($(this).parent().siblings('.itemOty').html());
      console.log(stockOutletQty, value)
      if (Number(value) > stockOutletQty) {
        err += 1;
        errMsg = 'stock_error';
      }
    }

  });
  if (err > 0) {
    return errMsg;
  }
  return false;
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