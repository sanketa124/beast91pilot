
$(document).ready(function () {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  const individual = urlParam.get('individual')
  console.log(individual, 'individual')
  if (individual == 'true') {
    $('#closeIco').hide();
    $('.arrowIcons').hide();
    $('.logoSection').css('width', '93%')
    $('#finishBtn').show();
  }
  // Set the style property to hide the div element
  reasonSection.style.display = 'none';
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
//const accountId = localStorage.getItem('accountId');
// Reason for not liking Product drop downs 
const subReason = new Map([
  ['Pricing/ Promotion/ Discount', ['Landing Price higher than competition', 'Need better promotion offer', 'Need longer duration for promotion', 'Need more Discount']],
  ['Competition Tie-up', ['Premium', 'Mass', 'Draft', 'Craft', 'Overall']],
  ['Operational Feedback', ['Stock is not available regularly', 'Service is not regular',
    'Past issues not settled', 'Outlet needs more time to decide', 'Not met decision maker']],
]);


const subReasonId = new Map([
  ['Pricing/ Promotion/ Discount', 'pricing_promotion_discount'],
  ['Competition Tie-up', 'competition_tie_up'],
  ['Operational Feedback', 'operational_feedback'],
  ['Other', 'Comment']
]);

let lineItems = []
let defaultItems = [
]

// Function to populate the table with default items
function populateTableWithDefaultItems() {


  initialLength = 2
  const alreadySelectedProducts = defaultItems.map((item) => item.Display_Name__c)
  console.log("Already Selected Products===>", alreadySelectedProducts)
  console.log("Line Items ===>", lineItems)
  const filteredItems = lineItems.filter(item => !alreadySelectedProducts.includes(item.Display_Name__c));
  console.log("filteredItems", filteredItems)

  // Fetch the default items from IndexedDB (accountGoals table) and store them in an array called 'defaultItems'
  // Iterate over the 'defaultItems' array and add rows to the table
  defaultItems.forEach(item => {
    const newRow = itemTable.insertRow(0);
    newRow.dataset.id = item.Id;
    newRow.insertCell().innerText = item.Display_Name__c;

    // Create an input field for quantity
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = item.quantity; // Set the initial value
    quantityInput.min = '0';
    //quantityInput.onkeyup = () => qtyTotalUpdate(item.Id); // Attach the qtyTotalUpdate function with the respective item ID
    quantityInput.addEventListener('input', () => qtyTotalUpdate(item.Id))

    const quantityCell = newRow.insertCell();
    quantityCell.appendChild(quantityInput);
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
    option.text = item.Display_Name__c;
    option.value = item.Id;
    selectItem.appendChild(option);
  }

}

function updateQuantity(prodId, quantity) {
  let sum = 0;
  defaultItems.forEach(item => {
    if (item.Id === prodId) {
      item.quantity = quantity;
    }
    sum += item.quantity;
  });
  console.log(defaultItems);
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

  let selectedItem = lineItems.find((item) => item.Id == data.id)

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
    newRow.dataset.id = item.Id;
    newRow.insertCell().innerText = item.Display_Name__c;

    // Create an input field for quantity
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = item.quantity; // Set the initial value
    quantityInput.min = '0';
    quantityInput.onkeyup = () => qtyTotalUpdate(item.Id); // Attach the qtyTotalUpdate function with the respective item ID

    const quantityCell = newRow.insertCell();
    quantityCell.appendChild(quantityInput);
  });

  // Clear the dropdown and hide it
  selectProduct.innerHTML = '';
  selectProduct.style.display = 'none';
  newEntry.style.display = 'none';

  calculateTotalQuantity()
  calculateTotalLineItemQuantity()
}

function openSearch() {
  // Destroy the old newSearch
  const existingNewSearch = document.getElementById('productSearch');
  if (existingNewSearch) {
    existingNewSearch.remove();
  }

  // Generate unique IDs for the new elements
  const uniqueId = Date.now();
  const clonedSelectSearchId = 'productSearch' + uniqueId;
  const clonedPosmQuantityId = 'prodQ' + uniqueId;

  const alreadySelectedProducts = defaultItems.map((item) => item.Display_Name__c)

  console.log("Line Items already selected items ===>", alreadySelectedProducts)
  const filteredItems = lineItems.filter(item => !alreadySelectedProducts.includes(item.Display_Name__c));
  const optionsString = filteredItems.map((eachItem) => `<option value="${eachItem.Id}">${eachItem.Display_Name__c}</option>`)

  // Create the newSearch HTML string with dynamic IDs
  const newSearchHTML = `
        <tr id="newEntry">
        <td class="wd-80">
          <select name="productSearch" id="${clonedSelectSearchId}" class="form-control wd-50">
            <option value='0' selected='true'> Search POSM</option>
            ${optionsString.join('')}
          </select>
        </td>
        <td class="wd-20 cartQtyChange"><input id="${clonedPosmQuantityId}" type="number" min="0" value="0" class="form-control wd-50"></td>
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

  let urlParam = new URLSearchParams(window.location.search);
  const accountId = urlParam.get('accountId')

  // Get the current account details
  let accountDetail = await getItemFromStore('account', accountId);
  let currentDate = new Date()
  let currentMonth = currentDate.getMonth()
  let currentYear = currentDate.getFullYear()

  // Get the visit details
  let numberOfVisits = 0
  let events = await readAllData('events')
  events?.forEach((eachEvent) => {
    if (
      eachEvent.Account__c
      &&
      eachEvent.Account__c == accountId
      &&
      new Date(eachEvent.Start_date_and_time__c).getMonth == currentMonth - 1
      &&
      new Date(eachEvent.Start_date_and_time__c).getFullYear == currentYear
    ) {

      numberOfVisits = numberOfVisits + 1

    }
  })

  console.log("Number of visists===>", numberOfVisits)

  //Read from the account goals from indexDB
  let accountGoals = await readAllData('accountGoals');
  let goalsOfCurrentAccount = accountGoals.filter(eachGoal => eachGoal.Account__c === accountId && currentDate >= eachGoal.Start_Date__c && currentDate <= eachGoal.End_Date__c)

  console.log("AccountGoals===>", goalsOfCurrentAccount)

  //Find line Items with account goals
  let lineItemIdsOfGoals = []
  let requiredLineItems = []
  if (goalsOfCurrentAccount.length) {
    goalsOfCurrentAccount.forEach((eachGoal) => {
      lineItemIdsOfGoals.push({
        itemId: eachGoal.Item_Master__c,
        goalQuantity: eachGoal.Goal_Quantity_CE__c
      })
    })
  }
  if (lineItemIdsOfGoals.length > 0) {

    //let lineItems = await readAllData('itemMasterCopy')

    items.forEach((eachItem) => {
      lineItemIdsOfGoals.forEach((eachLineItemGoal) => {
        if (eachLineItemGoal.itemId == eachItem.Id) {
          eachItem['goalQuantity'] = eachLineItemGoal.goalQuantity
          requiredLineItems.push(eachItem)
        }
      })
    })

  }
  if (requiredLineItems.length > 0) {

    /* Need to find out the recommended quantity
    quantity = (goal - mtd value of variant)/total number of visits of SalesPerson
    Goal is available from goalQuantity above.
    mtd value will be fetched from account retail depletion rate Retail_Depletion1__r.records
    number of visits from Event(Visit) table where recordType is SalesPerson
    And also these values will be displayed to user only if he is salesPerson
    */


    let idOfRequiredLineItems = requiredLineItems.map((eachRecord) => eachRecord.Id)

    //Get the retail depletion rate of requiredLineItems
    let currentMonthDepletionRates = []
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

    // Reduce the array to calculate sum of quantities for each unique itemId
    const summedQuantities = currentMonthDepletionRates.reduce((acc, obj) => {
      const existingItem = acc.find(item => item.itemId === obj.itemId);
      if (existingItem) {
        existingItem.quantity += obj.quantity;
      } else {
        acc.push({ itemId: obj.itemId, quantity: obj.quantity });
      }
      return acc;
    }, []);



    requiredLineItems.forEach((eachRequiredLineItem) => {
      summedQuantities.forEach((eachSummedQuantity) => {
        if (eachSummedQuantity.itemId == eachRequiredLineItem.Id) {

          eachRequiredLineItem['quantity'] = Math.max(eachRequiredLineItem['goalQuantity'] - eachSummedQuantity.quantity, 0) / Math.max(numberOfVisits, 1)

          defaultItems.push(eachRequiredLineItem)
        }


      })
    })


  }
  populateTableWithDefaultItems();
}

async function getLineItems() {


  lineItems = await readAllData('itemMasterCopy')

  getDefaultSalesItems();
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
    //getProductData();
    // orderRec.Comment = $("#salesOrderComment").val();
    //await saveOrder();
    confirmOrder()
  }

};

const checkforPreSalesOrder = () => {
  console.log("Total Quantity===>",totalCart)
  console.log("initial Value==>",initialLength)
  if(!totalCart){
    console.log("I am in zeroSales Order")
    if(selectionMap && selectionMap.size > 0){
      console.log("I am in zeroSales Order selection Map",selectionMap.size)
      return false
    }else{
      console.log("I am in zeroSales Order not selection Map",selectionMap.size)
      reasonSection.style.display = 'block';
      const lessReasonSelection = document.getElementById('lessBox')
      lessReasonSelection.style.display = 'none'
      //$('#reasonForNotLiking').modal('show');
      $('#confirmOrder').modal('hide');
      let urlParam = new URLSearchParams(window.location.search);
      // if(urlParam.has('presalesId'))
      //   orderRec.Product_Pre_Sales_Sampling = urlParam.get('presalesId');
      constructReasonNotLikingSelect();
      return true;
    }
  }else if(totalCart>0 && totalCart < initialLength){
    if(lessReasonSelect.length>0){
      return false
    }else{
      reasonSection.style.display = 'block';
      const lessReasonSelection = document.getElementById('lessBox')
      lessReasonSelection.style.display = 'none'
      //$('#reasonForNotLiking').modal('show');
      $('#confirmOrder').modal('hide');
      let urlParam = new URLSearchParams(window.location.search);
      // if(urlParam.has('presalesId'))
      //   orderRec.Product_Pre_Sales_Sampling = urlParam.get('presalesId');
      constructReasonLessSelect();
      return true;
    }
  }
};

const constructReasonNotLikingSelect = () => {
  $('#reasonBox').empty();

  let optionsArray = ["Pricing/ Promotion/ Discount", "Competition Tie-up", "Operational Feedback", "Other"];

  let options = optionsArray.map((choice, index) => `<option  id="${index}" value="${choice}">${choice}</option>`)

  console.log("Options===>", options.join(''))


  let htmlElement = `
  <div class="row" id="reasonBox">
  <div class="col-xs-6">
      <span class="">
          Reason For Zero Sales Order
      </span>
  </div>
  
  <div class="col-xs-5">
      <div class="">
      <select multiple="multiple" name="" id="first_reason_select" onchange="handleReasonSelectOption(this)">
          <option value="">--None--</option>
          ${options.join('')}
      </select>
      </div>
  </div>
  </div>
  `
  reasonSection.insertAdjacentHTML('beforeend', htmlElement);

  // Load the Bootstrap Multiselect script after adding the HTML element
  const scriptElement = document.createElement('script');
  scriptElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-multiselect/0.9.13/js/bootstrap-multiselect.js';
  scriptElement.onload = function () {
    $('#first_reason_select').multiselect({
      includeSelectAllOption: true,
    });
  };
  document.body.appendChild(scriptElement);
  //handleReasonSelectOption(orderRec.Reasons_for_not_Liking_Product &&orderRec.Reasons_for_not_Liking_Product.length > 0 ?orderRec.Reasons_for_not_Liking_Product : [] );

};

const constructReasonLessSelect = () => {
  $('#reasonBox').empty();
  $('#lessBox').empty();

  let optionsArray = ["Stock is not available regularly", "Service is not regular", "Past issues not settled", "Outlet needs more time to decide", "Not met decision maker"];

  let options = optionsArray.map((choice, index) => `<option  id="${index}" value="${choice}">${choice}</option>`)

  console.log("Options===>", options.join(''))


  let htmlElement = `
  <div class="row" id="lessBox">
  <div class="col-xs-6">
      <span class="">
          Reason For Low Sales Order
      </span>
  </div>
  
  <div class="col-xs-5">
      <div class="">
      <select multiple="multiple" name="" id="low_reason_select" onchange="handleLessReasonSelectOption(this)">
          <option value="">--None--</option>
          ${options.join('')}
      </select>
      </div>
  </div>
  </div>
  `
  reasonSection.insertAdjacentHTML('beforeend', htmlElement);

  // Load the Bootstrap Multiselect script after adding the HTML element
  const scriptElement = document.createElement('script');
  scriptElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-multiselect/0.9.13/js/bootstrap-multiselect.js';
  scriptElement.onload = function () {
    $('#low_reason_select').multiselect({
      includeSelectAllOption: true,
    });
  };
  document.body.appendChild(scriptElement);

}

function handleReasonSelectOption(event) {
  const selectedOptions = Array.from(event.selectedOptions).map(option => option.value);

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
          <div class="col-xs-5">
              <div class="secondary-reason-container">
                  <select class="secondary-reason-select" multiple="multiple" name="" id="sec_reason_select-${index}" onchange="handleSuboptionsSelect(this)">
                      <option value="">--None--</option>
                      ${subOptions.map(subOption => `<option value="${subOption}">${subOption}</option>`).join('')}
                  </select>
                  <span class="reason showError">This Field is required</span><br/>
              </div>
          </div>
        `;

        // Append the new reason box to the reasonSection div
        reasonSection.appendChild(newReasonBox);

        // Convert the new <select> element to a multiple select checkbox
        const secReasonSelect = newReasonBox.querySelector(`#sec_reason_select-${index}`);
        secReasonSelect.setAttribute('multiple', 'multiple');
        secReasonSelect.style.height = 'auto';

        // Load the Bootstrap Multiselect script after adding the HTML element
        const scriptElement = document.createElement('script');
        scriptElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-multiselect/0.9.13/js/bootstrap-multiselect.js';
        scriptElement.onload = function () {
          $(`#sec_reason_select-${index}`).multiselect({
            includeSelectAllOption: true,
          });
        };
        document.body.appendChild(scriptElement);
      }
    });
  }
}

function handleLessReasonSelectOption(event) {
  const selectedOptions = Array.from(event.selectedOptions).map(option => option.value);

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

// function finalsubmit(){
//   checkout()
// }

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

initializeShowAccount();


