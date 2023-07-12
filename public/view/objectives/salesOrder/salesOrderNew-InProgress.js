
$(document).ready(function () {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  const individual = urlParam.get('individual')
  console.log(individual, 'individual')
  if (individual == 'true') {
    console.log("I am inside the if block===>")
    $('#closeIco').hide();
    $('.arrowIcons').hide();
    $('.logoSection').css('width', '93%')
    $('#finishBtn').show();
  }
  let reasonSection = document.querySelector('.reasonSection');
  // Set the style property to hide the div element
  reasonSection.style.display = 'none';
  //let visits = visits
  //reasonSection.remove()
})

let accountRec;
let totalCart;
let selectionMap = new Map();
let initialLength = 0;
let lessReasonSelect = [];
let salesOrderSyncData = {};

const initializeShowAccount = async () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  //const accountId = localStorage.getItem('accountId');
  accountRec = await getItemFromStore('account', accountId);
  if (!accountRec) {
    accountRec = await getItemFromStore('lead', accountId);
  }
  //showAccount();
  getLineItems();
};



goBack = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  window.location.href = `/view/sales/recomendation.html?accountId=${accountID}`
}

// Get a reference to the table and buttons
const itemTable = document.getElementById('salesOrderTable');
const addRowButton = document.getElementById('addRowButton');
const finishButton = document.getElementById('finishButton');
const productList = document.getElementById('productList');
const quantityInput = document.getElementById('prodQ');
const newEntry = document.getElementById('newEntry');
let selectProduct = document.getElementById('productSearch');
// Get the reference to the div element
var reasonSection = document.querySelector('.reasonSection');
let reasonElement = document.getElementById('reasonForNotLikingSelect');
//const accountId = localStorage.getItem('accountId');
// Reason for not liking Product drop downs 
const subReason = new Map([
  ['Pricing/ Promotion/ Discount', ['Landing Price higher than competition', 'Need better promotion offer', 'Need longer duration for promotion', 'Need more Discount']],
  ['Competition Tie-up', ['Premium', 'Mass', 'Draft', 'Craft', 'Overall']],
  ['Operational Feedback', ['Stock is not available regularly', 'Service is not regular',
    'Past issues not settled', 'Outlet needs more time to decide', 'Not met decision maker']],
]);

let lineItems = []
let defaultItems = [
]

// Function to populate the table with default items
function populateTableWithDefaultItems() {

  console.log("Default Itemsssssss=>", defaultItems)

  const alreadySelectedProducts = defaultItems.map((item) => item.Product__r.Display_Name__c)
  console.log("Already Selected Products===>", alreadySelectedProducts)
  console.log("Line Items ===>", lineItems)
  const filteredItems = lineItems.filter(item => !alreadySelectedProducts.includes(item.Product__r.Display_Name__c));
  console.log("filteredItems", filteredItems)

  // Fetch the default items from IndexedDB (accountGoals table) and store them in an array called 'defaultItems'
  // Iterate over the 'defaultItems' array and add rows to the table
  defaultItems.forEach(item => {
    const newRow = itemTable.insertRow(0);
    newRow.dataset.id = item.Product__c;
    const itemElement =  newRow.insertCell()
    itemElement.innerText = item.Product__r.Display_Name__c;
    itemElement.width = "75%"

    // Create an input field for quantity
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = item.quantity; // Set the initial value
    quantityInput.min = '0';
    quantityInput.class = 'form-control';
    quantityInput.float = 'right';
    //quantityInput.onkeyup = () => qtyTotalUpdate(item.Id); // Attach the qtyTotalUpdate function with the respective item ID
    quantityInput.addEventListener('input', () => qtyTotalUpdate(item.Product__c))

    const quantityCell = newRow.insertCell();
    quantityCell.width = '25%'
    const divElement = document.createElement('div')
    divElement.style.display = 'flex';
    divElement.style['flex-direction'] = 'row'
    divElement.style['align-items'] = 'center'
    divElement.style['justify-content'] = 'space-even'
    divElement.appendChild(quantityInput)
    if (item.recommended_quantity && item.recommended_quantity > item.quantity) {
      // Create and append the <i> element
      const iconElement = document.createElement('i');
      iconElement.className = 'fa fas fa-exclamation';
      //iconElement.align='right';
      //iconElement.style.float = 'right';
      iconElement.style.alignItems = 'center';
      divElement.appendChild(iconElement);
      //inputElement.style.backgroundColor ='red'
    }
    quantityCell.appendChild(divElement);
  });

  console.log("Item Table===>", itemTable)

  addOptionsToSelect(selectProduct, filteredItems)

  calculateTotalQuantity()

  calculateTotalLineItemQuantity()
}

function addOptionsToSelect(selectItem, items) {

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var option = document.createElement("option");
    option.text = item.Product__r.Display_Name__c;
    option.value = item.Product__c;
    selectItem.appendChild(option);
  }

}

function updateQuantity(prodId, quantity) {
  let sum = 0;
  const inputElement = document.querySelector(`tr[data-id="${prodId}"]`);
  console.log("Input element=======>",inputElement)
  const tdElement = inputElement.childNodes[1].childNodes[0];
  console.log("TD ELEMENET===>",tdElement)
  defaultItems.forEach(item => {
    if (item.Product__c === prodId) {
      item.quantity = quantity;
    }
    if (item.Product__c === prodId && item.recommended_quantity && item.recommended_quantity > quantity) {
      // Create and append the <i> element
      const getIconElement = tdElement.getElementsByTagName('i')[0]
      console.log("Get ICON ELEMENT===>",getIconElement)
      if(!getIconElement){
        const iconElement = document.createElement('i');
        iconElement.className = 'fa fas fa-exclamation';
        //iconElement.align='right';
        //iconElement.style.float = 'right';
        iconElement.style.alignItems = 'center';
        tdElement.appendChild(iconElement);
        //inputElement.style.backgroundColor ='red'
      }
    }
    if (item.Product__c === prodId && item.recommended_quantity && item.recommended_quantity <= quantity) {
      // Create and append the <i> element
      const getIconElement = tdElement.getElementsByTagName('i')[0]
      console.log("Get ICON ELEMENT===>",getIconElement)
      if(getIconElement){
            getIconElement.remove()
      }
    }
    sum += item.quantity;
  });
  console.log(defaultItems);
  localStorage.setItem('itemsToBeDisplayed',JSON.stringify(defaultItems))
  console.log('sum', sum);
  document.getElementById('cartTotal').querySelector('label span').textContent = sum;
  totalCart = sum


}

function qtyTotalUpdate(prodId) {
  const quantityInput = document.querySelector(`tr[data-id="${prodId}"] input`);
  console.log("Quantity Input===>", quantityInput.value)
  let quantity = 0
  if (quantityInput.value) {
    quantity = parseInt(quantityInput.value)
  }

  //const quantity = parseInt(quantityInput.value);

  updateQuantity(prodId, quantity);
}

const handleSearch = (e) => {

  console.log("I am in handle serach===>")

  console.log("Select Item===>", selectProduct)
  console.log("New Search===>", newEntry)

  selectProduct.innerHTML = '';
  selectProduct.disabled = true;
  newEntry.style.display = 'none';

  console.log("Select Item after diabling===>", selectProduct)
  console.log("New Search after diabsling===>", newEntry)


  let data = e.params.data;
  console.log("Data====>", data);
  quantityInput.focus()

  let selectedItem = lineItems.find((item) => item.Product__c == data.id)

  selectedItem['quantity'] = 0

  defaultItems.push(selectedItem)


  $('#selectProduct').val(null).trigger('change');

  // Hide all options in the selectSearch dropdown
  $('#selectProduct').find('option').hide();

  // Show the default placeholder option
  $('#selectProduct').find('option[value="0"]').show();

  // Reset the selected value to the placeholder option
  selectProduct.value = '0';

  // Refresh the select2 dropdown to reflect the changes
  $(selectProduct).trigger('change');

  updateTable()

}

$(function () {
  $("#productSearch").select2();
});

$('#productSearch').on('select2:select', (e) => handleSearch(e));


function updateTable() {

  // Clear the existing table rows
  itemTable.innerHTML = '';

  // Iterate over the defaultItems list and add rows to the table
  defaultItems.forEach(item => {
    const newRow = itemTable.insertRow();
    newRow.dataset.id = item.Product__c;
    newRow.insertCell().innerText = item.Product__r.Display_Name__c;

    // Create an input field for quantity
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = item.quantity; // Set the initial value
    quantityInput.min = '0';
    quantityInput.class = 'form-control';
    quantityInput.addEventListener('input', () => qtyTotalUpdate(item.Product__c))

    const quantityCell = newRow.insertCell();
    quantityCell.width = '25%'
    const divElement = document.createElement('div')
    divElement.style.display = 'flex';
    divElement.style['flex-direction'] = 'row'
    divElement.style['align-items'] = 'center'
    divElement.style['justify-content'] = 'space-even'
    divElement.appendChild(quantityInput)
    console.log("Recommended quantity===>",item.recommended_quantity)
    if (item.recommended_quantity && item.recommended_quantity > item.quantity) {
      // Create and append the <i> element
      const iconElement = document.createElement('i');
      iconElement.className = 'fa fas fa-exclamation';
      //iconElement.align='right';
      //iconElement.style.float = 'right';
      iconElement.style.alignItems = 'center';
      divElement.appendChild(iconElement);
      //inputElement.style.backgroundColor ='red'
    }
    quantityCell.appendChild(divElement);
  });

  // Clear the dropdown and hide it
  selectProduct.innerHTML = '';
  selectProduct.style.display = 'none';
  newEntry.style.display = 'none';
  
  localStorage.setItem('itemsToBeDisplayed',JSON.stringify(defaultItems))
  calculateTotalQuantity()
  calculateTotalLineItemQuantity()
}

function openSearch() {
  // Destroy the old newSearch
  const existingNewSearch = document.getElementById('newEntry');
  console.log("Existing New Search===>",existingNewSearch)
  if (existingNewSearch) {
    return
  }

  // Generate unique IDs for the new elements
  const uniqueId = Date.now();
  const clonedSelectSearchId = 'productSearch' + uniqueId;
  const clonedPosmQuantityId = 'prodQ' + uniqueId;

  const alreadySelectedProducts = defaultItems.map((item) => item.Product__r.Display_Name__c)

  console.log("Line Items already selected items ===>", alreadySelectedProducts)
  const filteredItems = lineItems.filter(item => !alreadySelectedProducts.includes(item.Product__r.Display_Name__c));
  const optionsString = filteredItems.map((eachItem) => `<option value="${eachItem.Product__c}">${eachItem.Product__r.Display_Name__c}</option>`)

  // Create the newSearch HTML string with dynamic IDs
  const newSearchHTML = `
        <tr id="newEntry">
        <td style="width: 75%">
          <select name="productSearch" id="${clonedSelectSearchId}" class="form-control">
            <option value='0' selected='true'> Search SKU</option>
            ${optionsString.join('')}
          </select>
        </td>
        <td style="width: 25%" class="cartQtyChange">
          <div style="display: flex; flex-direction: row; align-items: center;">
            <input id="${clonedPosmQuantityId}" type="number" min="0" value="0" class="form-control">
          </div>  
        </td>
    </tr>
        `;

  //addOptionsToSelect(newSearchHTML.getElementById(clonedSelectSearchId),items)

  // Append the newSearch HTML string to the itemTable
  itemTable.insertAdjacentHTML('beforeend', newSearchHTML);

  // Apply Select2 to the cloned select element
  $("#" + clonedSelectSearchId).select2();

  // Add the event listener for the cloned select element
  $('#' + clonedSelectSearchId).on('select2:select', (e) => handleSearch(e));
}


// Function to calculate the total quantity of defaultItems
function calculateTotalQuantity() {
  const totalElement = document.getElementById('cartTotal').querySelector('span');
  const totalQuantity = defaultItems.reduce((sum, item) => sum + item.quantity, 0);
  totalElement.textContent = totalQuantity.toString();
  totalCart = totalQuantity
}

// Function to find the default items
async function getDefaultSalesItems() {

  let accountId = accountRec.Id
  let orderKey = `${fetchCurrentDateIdStr()}-${accountId}`

  let visits = new Map()
  visits.set("P0", 4)
  visits.set("P1", 4)
  visits.set("P2", 4)
  visits.set("P3", 2)
  visits.set("P4", 1)

  // Get the current account details
  let accountDetail = await getItemFromStore('account', accountId);
  let industrySegment = accountDetail.Industry_Segment__c
  let currentDate = new Date()
  let currentMonth = currentDate.getMonth()
  let currentYear = currentDate.getFullYear()

  // Get the visit details
  // let numberOfVisits = 1
  // if (industrySegment) {
  //   numberOfVisits = visits.get(industrySegment)
  // }
  // Get the visit details
  let numberOfVisits = 0

  let eventRecord = await getItemFromStore('outlet360-events',accountId);

  if(eventRecord){
    numberOfVisits = eventRecord.expr0
  }

  //Read from the account goals from indexDB
  let accountGoals = await readAllData('accountGoals');
  console.log("Account Goals===>",accountGoals);
  let goalsOfCurrentAccount = accountGoals.filter(eachGoal => eachGoal.Account__c === accountId && currentDate >= new Date(eachGoal.Start_Date__c) && currentDate <= new Date(eachGoal.End_Date__c))

  console.log("Goals of Current Account===>",goalsOfCurrentAccount)

  //Find line Items with account goals
  let lineItemIdsOfGoals = []
  let requiredLineItems = []
  if (goalsOfCurrentAccount.length) {
    goalsOfCurrentAccount.forEach((eachGoal) => {
      lineItemIdsOfGoals.push({
        itemId: eachGoal.Item_Master__c,
        goalQuantity: eachGoal.Goal_Quantity__c
      })
    })
  }

  if (lineItemIdsOfGoals.length > 0) {

    lineItems.forEach((eachItem) => {
      lineItemIdsOfGoals.forEach((eachLineItemGoal) => {
        if (eachLineItemGoal.itemId == eachItem.Product__c) {
          eachItem['goalQuantity'] = eachLineItemGoal.goalQuantity
          requiredLineItems.push(eachItem)
        }
      })
    })

  }
  let depletedItems = [];
  let nonDepletedItemIds = [];
  if (requiredLineItems.length > 0) {

    /* Need to find out the recommended quantity
    quantity = (goal - mtd value of variant)/total number of visits of SalesPerson
    Goal is available from goalQuantity above.
    mtd value will be fetched from account retail depletion rate Retail_Depletion1__r.records
    number of visits from Event(Visit) table where recordType is SalesPerson
    And also these values will be displayed to user only if he is salesPerson
    */


    let idOfRequiredLineItems = requiredLineItems.map((eachRecord) => eachRecord.Product__c)

    //Get the retail depletion rate of requiredLineItems
    let currentMonthDepletionRates = []

    console.log("Account Detail===>", accountDetail)
    if (accountDetail.Retail_Depletion1__r && accountDetail.Retail_Depletion1__r.records.length > 0) {
      accountDetail.Retail_Depletion1__r.records.forEach((eachDepletedRecord) => {
        if (
          eachDepletedRecord.Item__c
          &&
          eachDepletedRecord.Date__c
          &&
          idOfRequiredLineItems.includes(eachDepletedRecord.Item__c)
          &&
          new Date(eachDepletedRecord.Date__c).getMonth() == currentMonth
          &&
          new Date(eachDepletedRecord.Date__c).getFullYear() == currentYear
        ) {

          currentMonthDepletionRates.push({
            itemId: eachDepletedRecord.Item__c,
            quantity: eachDepletedRecord.Physical_Cases__c
          })
        }

      })
    }


    // Reduce the array to calculate sum of quantities for each unique itemId
    let summedQuantities = [];

    if (currentMonthDepletionRates.length > 0) {

      summedQuantities = currentMonthDepletionRates.reduce((acc, obj) => {
        const existingItem = acc.find(item => item.itemId === obj.itemId);
        if (existingItem) {
          existingItem.quantity += obj.quantity;
        } else {
          acc.push({ itemId: obj.itemId, quantity: obj.quantity });
        }
        return acc;
      }, []);

      console.log("Summed Quantitites===>",summedQuantities)

      requiredLineItems.forEach((eachRequiredLineItem) => {
        summedQuantities.forEach((eachSummedQuantity) => {
          if (eachSummedQuantity.itemId == eachRequiredLineItem.Product__c) {

            eachRequiredLineItem['quantity'] = Math.floor(Math.max(eachRequiredLineItem['goalQuantity'] - eachSummedQuantity.quantity, 0) / Math.max(numberOfVisits, 1))
            eachRequiredLineItem['recommended_quantity'] = eachRequiredLineItem['quantity']

            defaultItems.push(eachRequiredLineItem)
            depletedItems.push(eachRequiredLineItem.Product__c)
          }


        })
      })

    } 
    console.log("RequiredLineItems===>",requiredLineItems)
    console.log("Depleted Items===>",depletedItems)

    let nonDepletedItems = requiredLineItems.filter((eachItem) => !depletedItems.includes(eachItem.Product__c))
    nonDepletedItemIds = nonDepletedItems.map((eachNonDepletedItem) => eachNonDepletedItem.Product__c)

    console.log("Non Depleted Items===>",nonDepletedItems)

    nonDepletedItems.forEach((eachRequiredLineItem) => {
        eachRequiredLineItem['quantity'] = Math.floor(eachRequiredLineItem['goalQuantity'] / Math.max(numberOfVisits, 1))
        eachRequiredLineItem['recommended_quantity'] = eachRequiredLineItem['quantity']
        defaultItems.push(eachRequiredLineItem)
      })
  }

  // Check for recommendations
  let urlParam = new URLSearchParams(window.location.search);
  const individual = urlParam.get('individual')
  if(!individual){

        let recommendedItems = await readAllData('accepted_recommendations')

        console.log("Recommende==>",recommendedItems)

        if(recommendedItems){
          recommendedItems = 
          recommendedItems
          .filter((eachRecommendation) => eachRecommendation.Outlet_Name__r.Account_ID_18_digit__c === accountId && eachRecommendation.Is_Accepted__c)
          .forEach((reco) => {
            lineItems.forEach((eachLineItem) => {
              if(eachLineItem.Product__c === reco.Recommended_SKU__c && !depletedItems.includes(eachLineItem.Product__c) && !nonDepletedItemIds.includes(eachLineItem.Product__c)){
                eachLineItem.quantity = 0
                defaultItems.push(eachLineItem)
              }
            })
          })
        }
  }

  initialLength = defaultItems.reduce((accumulator, item) => {
    if (item.quantity) {
      return accumulator + item.quantity;
    }
    return accumulator;
  }, 0);
  console.log("initial length==>", initialLength)

  populateTableWithDefaultItems();

}

async function getLineItems() {

  let products = await readAllData('itemMaster');
  lineItems = products.filter(ele => {
      return (ele.State__r&&accountRec.BillingState&&ele.State__r.Name===accountRec.BillingState);
  });

  // If directly coming from Depot Inventory
  let localStorageItems = localStorage.getItem('itemsToBeDisplayed')

  if(localStorageItems){
    defaultItems = JSON.parse(localStorageItems)

    return populateTableWithDefaultItems()

  }

  let accountId = accountRec.Id
  let orderKey = `${fetchCurrentDateIdStr()}-${accountId}`

  // Check if a record is already present in the indexDB for today
  let existingRecord = await getItemFromStore('salesOrderSync', orderKey)

  if (existingRecord) {
    defaultItems = existingRecord.products;
    selectionMap = existingRecord.Reasons_For_Zero_Products;
    lessReasonSelect = existingRecord.Reasons_For_Less_Products;
    initialLength = existingRecord.recommended_quantity;
    if (existingRecord.Has_Zero_Quantity_Product) {
      populateTableWithDefaultItems();
      console.log("Keyss====>", Array.from(selectionMap.keys()));
      constructReasonNotLikingSelect(Array.from(selectionMap.keys()));
      handleReasonSelectOption(selectionMap.keys())
    } else if (existingRecord.Has_Less_Products) {
      populateTableWithDefaultItems();
      constructReasonLessSelect(lessReasonSelect);
      handleLessReasonSelectOption(lessReasonSelect);
    } else {
      populateTableWithDefaultItems();
    }
  } else {
    getDefaultSalesItems();
  }
}

// Function to calculate the total quantity of defaultItems
function calculateTotalLineItemQuantity() {
  const totalElement = document.getElementById('totalItems').querySelector('span');
  const totalQuantity = defaultItems.length
  totalElement.textContent = totalQuantity.toString();
}

// Event listener for the addButton click
addRowButton.addEventListener('click', () => {
  openSearch();
});

checkout = async () => {

  //console.log("checking for order===>",checkforPreSalesOrder())

  if (!checkforPreSalesOrder()) {
    await salesOrderSubmit();
    confirmOrder()
  }

};

const checkforPreSalesOrder = () => {
  if (!totalCart) {
    if (selectionMap && selectionMap.size > 0) {
      $('#confirmOrder').modal('hide');
      $('#reasonForNotLiking').modal('show');

      let urlParam = new URLSearchParams(window.location.search);
      constructReasonNotLikingSelect(Array.from(selectionMap.keys()));
      handleReasonSelectOption(selectionMap.keys())
      return true;
    }
    else if (document.getElementById('reasonBox')) {
      $('#confirmOrder').modal('hide');
      alert("Please fill the reasons before moving forward")
      return true
    }
    else {
      console.log("I am in zeroSales Order not selection Map", selectionMap.size)
      $('#confirmOrder').modal('hide');
      $('#reasonForNotLiking').modal('show');

      let urlParam = new URLSearchParams(window.location.search);
      constructReasonNotLikingSelect([]);
      return true;
    }
  } else if (totalCart > 0 && totalCart < initialLength) {
    if (lessReasonSelect.length > 0) {
      $('#confirmOrder').modal('hide');
      $('#reasonForLessProduct').modal('show');

      let urlParam = new URLSearchParams(window.location.search);
      constructReasonLessSelect(lessReasonSelect);
      handleLessReasonSelectOption(lessReasonSelect);
      return true
    }
    else if (document.getElementById('lessBox')) {
      $('#confirmOrder').modal('hide');
      alert("Please fill the reasons before moving forward")
      return true
    }
    else {
      $('#confirmOrder').modal('hide');
      $('#reasonForLessProduct').modal('show');
      let urlParam = new URLSearchParams(window.location.search);
      constructReasonLessSelect([]);
      return true;
    }
  }
};

const constructReasonNotLikingSelect = (selectedOptions) => {
  reasonSection.style.display = 'block';
  //let reasonElement = document.getElementById('reasonForNotLikingSelect')
  // const lessReasonSelection = document.getElementById('lessBox')
  // lessReasonSelection.style.display = 'none'
  $('#reasonBox').empty();

  let optionsArray = ["Pricing/ Promotion/ Discount", "Competition Tie-up", "Operational Feedback", "Other"];

  let options = optionsArray.map((choice, index) => {
    if (selectedOptions.length > 0 && selectedOptions.includes(choice)) {
      return `<option  selected id="${index}" value="${choice}">${choice}</option>`
    } else {
      return `<option id="${index}" value="${choice}">${choice}</option>`
    }
  }
  )

  console.log("Options===>", options.join(''))


  let htmlElement = `
  <div class="row" id="reasonBox">
  <div class="col-xs-6">
      <span class="">
          Reason For Zero Sales Order
      </span>
  </div>
  
  <div class="col-xs-6">
      <div class="">
      <select class= "form-control" multiple="multiple" name="" id="first_reason_select" onchange="handleReasonSelectOption(this.selectedOptions)">
          <option value="">--None--</option>
          ${options.join('')}
      </select>
      </div>
  </div>
  </div>
  `
  //reasonSection.insertAdjacentHTML('beforeend', htmlElement);
  reasonElement.insertAdjacentHTML('beforeend', htmlElement);

  /*
  // Load the Bootstrap Multiselect script after adding the HTML element
  const scriptElement = document.createElement('script');
  scriptElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-multiselect/0.9.13/js/bootstrap-multiselect.js';
  scriptElement.onload = function () {
    $('#first_reason_select').multiselect({
      includeSelectAllOption: true,
    });
  };
  document.body.appendChild(scriptElement);
  */
  //handleReasonSelectOption(orderRec.Reasons_for_not_Liking_Product &&orderRec.Reasons_for_not_Liking_Product.length > 0 ?orderRec.Reasons_for_not_Liking_Product : [] );

};

const constructReasonLessSelect = (selectedOptions) => {
  reasonSection.style.display = 'block';
  // const reasonBox = document.getElementById('reasonBox')
  // console.log("Reason Box===>",reasonBox)
  // reasonBox.style.display = 'none'
  // reasonBox.remove()
  $('#lessBox').empty();

  let lessReasonElement = document.getElementById('reasonForLessSelect');

  console.log("Less Reason Element===>",lessReasonElement)

  console.log("LessBoc oprtions===>", selectedOptions)

  let optionsArray = 
  ["Stock is Slow Moving",
   "Settlements are not Happening Regularly", 
   "Supply Issues", 
   "Need Better Discounts"];

  let options = optionsArray.map((choice, index) => {
    if (selectedOptions.length > 0 && selectedOptions.includes(choice)) {
      return `<option  selected id="${index}" value="${choice}">${choice}</option>`
    } else {
      return `<option  id="${index}" value="${choice}">${choice}</option>`
    }
  }
  )

  console.log("Options===>", options.join(''))


  let htmlElement = `
  <div class="row" id="lessBox">
  <div class="col-xs-6">
      <span class="">
          Reason For Low Sales Order
      </span>
  </div>
  
  <div class="col-xs-6">
      <div class="">
      <select class="form-control" multiple="multiple" name="" id="low_reason_select" onchange="handleLessReasonSelectOption(this)">
          <option value="">--None--</option>
          ${options.join('')}
      </select>
      </div>
  </div>
  </div>
  `
  lessReasonElement.insertAdjacentHTML('beforeend', htmlElement);

  // Load the Bootstrap Multiselect script after adding the HTML element
  // const scriptElement = document.createElement('script');
  // scriptElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-multiselect/0.9.13/js/bootstrap-multiselect.js';
  // scriptElement.onload = function () {
  //   $('#low_reason_select').multiselect({
  //     includeSelectAllOption: true,
  //   });
  // };
  // document.body.appendChild(scriptElement);

}

function handleReasonSelectOption(event) {
  const selectedOptions = Array.from(event).map(option => option.value ? option.value : option);

  console.log("Selected Options===>", selectedOptions);

  // Update selectionMap with parent elements
  selectedOptions.forEach(option => {
    if (!selectionMap.has(option)) {
      selectionMap.set(option, []);
    }
  });

  // Remove existing sec_reason_select elements
  const existingSecReasonSelects = document.querySelectorAll('.secondary-options-container');
  existingSecReasonSelects.forEach(select => select.remove());

  if (selectedOptions.length > 0) {
    selectedOptions.forEach((option, index) => {
      const subOptions = subReason.get(option);
      if (subOptions) {
        const newReasonBox = document.createElement('div');
        newReasonBox.className = 'row secondary-options-container';
        newReasonBox.innerHTML = `
          <div class="col-xs-6">
              <span class="secondary-option-heading">Reason For ${option}</span>
          </div>
          <div class="col-xs-6">
              <div class="secondary-reason-container">
                  <select class="form-control" multiple="multiple" name="" id="sec_reason_select-${index}" onchange="handleSuboptionsSelect(this)">
                      <option value="">--None--</option>
                      ${subOptions.map(subOption => {
          if (selectionMap.get(option) && selectionMap.get(option).includes(subOption)) {
            return `<option selected value="${subOption}">${subOption}</option>`

          } else {
            return `<option value="${subOption}">${subOption}</option>`
          }
        }).join('')}
                  </select>
                  <span class="reason showError">This Field is required</span><br/>
              </div>
          </div>
        `;

        // Append the new reason box to the reasonSection div
        //reasonSection.appendChild(newReasonBox);

        reasonElement.appendChild(newReasonBox);

        // Convert the new <select> element to a multiple select checkbox
        const secReasonSelect = newReasonBox.querySelector(`#sec_reason_select-${index}`);
        secReasonSelect.setAttribute('multiple', 'multiple');
        secReasonSelect.style.height = 'auto';


        /*
        // Load the Bootstrap Multiselect script after adding the HTML element
        const scriptElement = document.createElement('script');
        scriptElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-multiselect/0.9.13/js/bootstrap-multiselect.js';
        scriptElement.onload = function () {
          $(`#sec_reason_select-${index}`).multiselect({
            includeSelectAllOption: true,
          });
        };
        document.body.appendChild(scriptElement);
        */
      }
    });
  }
}

function handleLessReasonSelectOption(event) {
  let selectedOptions = [];

  console.log("Arrayyyy==>", event)
  console.log("Arrayyyy==>", Array.isArray(event))

  if (Array.isArray(event)) {
    selectedOptions = event.map(option => option)
  } else {
    selectedOptions = Array.from(event.selectedOptions).map(option => option.value);
  }

  console.log("Selected Options===>", selectedOptions);

  if (!selectedOptions.length) {
    lessReasonSelect = []
  } else {
    // Update selectionMap with parent elements
    selectedOptions.forEach(option => {
      if (!lessReasonSelect.includes(option)) {
        lessReasonSelect.push(option)
      }
    });

  }

  console.log("Less Reasons selection==>", lessReasonSelect)

}


// Event listener for suboptions select elements
function handleSuboptionsSelect(event) {
  console.log("Secondary Event====>", event.selectedOptions)
  // const suboptionsSelectId = event.target.id;
  // const index = suboptionsSelectId.split('-')[1];
  const selectedSuboptions = Array.from(event.selectedOptions).map(option => option.value);

  //console.log(`Selected Suboptions for index ${index} ===>`, selectedSuboptions);

  selectedSuboptions.forEach((subOption) => {
    // Find parent element based on the selected child option
    const parentElement = Array.from(subReason.entries()).find(([parent, children]) => children.includes(subOption))[0];

    if (parentElement) {
      const childOptions = selectionMap.get(parentElement);

      // Remove deselected child options
      const deselectedOptions = childOptions.filter(option => !selectedSuboptions.includes(option));
      deselectedOptions.forEach(option => {
        const index = childOptions.indexOf(option);
        if (index !== -1) {
          childOptions.splice(index, 1);
        }
      });

      // Add selected child options
      selectedSuboptions.forEach(subOption => {
        if (!childOptions.includes(subOption)) {
          childOptions.push(subOption);
        }
      });

      // Update the selectionMap only if there are selected child options
      if (childOptions.length > 0) {
        selectionMap.set(parentElement, childOptions);
      } else {
        // If no child options are selected, check if the parent element exists in the selectionMap
        if (selectionMap.has(parentElement)) {
          // Remove the parent element from the selectionMap
          selectionMap.delete(parentElement);
        }
      }
    }

  })

  // // Update the selected suboptions array at the corresponding index
  // if (index >= 0 && index < selectedSuboptions.length) {
  //   selectedSuboptions[index] = selectedSuboptions;
  // }

  console.log("Updated Selected Suboptions===>", selectionMap);
}

//);

function finalsubmit() {
  checkout()
}

confirmOrder = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  const individual = urlParam.get('individual')
  if (individual == 'true') {
    window.location.href = `/view/accountLanding/accountLanding.html?accountId=${accountID}`
  } else {
    window.location.href = `/view/sales/visibility.html?accountId=${accountID}`
  }
  $('#confirmOrder').modal('hide');
}


async function salesOrderSubmit() {

  let accountId = accountRec.Id
  let orderKey = `${fetchCurrentDateIdStr()}-${accountId}`

  salesOrderSyncData.accountId = accountId
  salesOrderSyncData.App_Id = orderKey
  salesOrderSyncData.products = !totalCart > 0? [] : defaultItems
  salesOrderSyncData.Has_Zero_Quantity_Product = !totalCart > 0 && selectionMap.size > 0 ? true : false
  salesOrderSyncData.Has_Less_Products = totalCart < initialLength && lessReasonSelect.length > 0 ? true : false
  salesOrderSyncData.Reasons_For_Zero_Products = !totalCart > 0 ? selectionMap : new Map()
  salesOrderSyncData.Stringified_Reasons_For_Zero_Products = !totalCart > 0 ? Array.from(selectionMap.keys()).join(';') : '',
  salesOrderSyncData.Stringified_Sub_reasons__c = !totalCart > 0 ? [...selectionMap.values()].flat().filter(child => child).join(';') : '',
  salesOrderSyncData.Reasons_For_Less_Products = totalCart < initialLength ? lessReasonSelect : []
  salesOrderSyncData.recommended_quantity = initialLength
  salesOrderSyncData.total_quantity = totalCart
  salesOrderSyncData.Created_Date = new Date();
  salesOrderSyncData.isSynced = false;

  await writeData('salesOrderSync', salesOrderSyncData)
  localStorage.removeItem("itemsToBeDisplayed");

}

function goSales() {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  localStorage.setItem('itemsToBeDisplayed',JSON.stringify(defaultItems))
  window.location.href = `/view/objectives/salesOrder/distributorReport.html?accountId=${accountID}`
}

function goBackToSales(){
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    window.location.href = `/view/objectives/salesOrder/salesOrderLanding.html?accountId=${accountID}`
  }

async function submitPostReasonNotLiking(){
             await salesOrderSubmit()
             confirmOrder()
}

initializeShowAccount();



