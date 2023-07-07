
$(document).ready(function(){
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  const individual = urlParam.get('individual')
  console.log(individual, 'individual')
  if(individual == 'true'){
    $('#closeIco').hide();
    $('.arrowIcons').hide();
    $('.logoSection').css('width','93%')
    $('#finishBtn').show();
  }
})

let accountRec;
let totalQuantity = 0;

const initializeShowAccount = async () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  //const accountId = localStorage.getItem('accountId');
  accountRec = await getItemFromStore('account',accountId);
  if(!accountRec){
      accountRec = await getItemFromStore('lead',accountId);
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
const searchInput = document.getElementById('productSearch');
const productList = document.getElementById('productList');
const quantityInput = document.getElementById('prodQ');
const newEntry = document.getElementById('newEntry');
let selectProduct = document.getElementById('productSearch');
//const accountId = localStorage.getItem('accountId');

let lineItems = []
let defaultItems = [
]

// Function to populate the table with default items
function populateTableWithDefaultItems() {

  const alreadySelectedProducts = defaultItems.filter((item) => {return item.Display_Name__c})
  console.log("Already Selected Products===>",alreadySelectedProducts)
  console.log("Line Items ===>",lineItems)
  const filteredItems = lineItems.filter(item =>!alreadySelectedProducts.includes(item.Display_Name__c));
  console.log("filteredItems",filteredItems)

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

  addOptionsToSelect(selectProduct, filteredItems)

  calculateTotalQuantity()
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


// Define the itemList array with the available items
let itemList = [
  ];
  
// Function to filter the items based on search input
// function filterItems(searchInput,productList) {
//     searchInput.disabled = false
//     console.log("I am here=====>")
//     const searchValue = searchInput.value.toLowerCase();
//     console.log("Search Value====>",searchValue)
//     const alreadySelectedProducts = defaultItems.map((item) => {return item.Display_Name__c})
//     console.log("Line Items ===>",lineItems)
//     const filteredItems = lineItems.filter(item => item.Display_Name__c.toLowerCase().includes(searchValue) && !alreadySelectedProducts.includes(item.itemName));

//     console.log("Filtered Items===>",filteredItems)
  
//     // Clear the previous dropdown items
//     productList.innerHTML = '';
  
//     // Show the dropdown if search input is not empty and filtered items exist
//     if (searchValue !== '' && filteredItems.length > 0) {
//       productList.style.display = 'block';

//       console.log("Product List====>",productList)
  
//       // Add the filtered items as options
//       filteredItems.forEach(item => {
//         const suggestion = document.createElement('div');
//         suggestion.classList.add('autocomplete-item');
//         suggestion.textContent = item.Display_Name__c;
//         console.log("Suggestion====>",suggestion)
//         suggestion.addEventListener('click', () => {
//           productClicked(item.Display_Name__c, item.Id); // Call the productClicked function with the selected item's name and ID
//           searchInput.value = item.Display_Name__c;
//           productList.style.display = 'none';
//         });
//         productList.appendChild(suggestion);
//       });
//     } else {
//       productList.style.display = 'none';
//     }
//   }
  
  // Event listener for the input event of the search input
  // searchInput.addEventListener('keyup', () => filterItems(searchInput, productList));

  const handleSearch = (e) => {

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

    let selectedItem = items.find((item)=>item.Id ==data.id)

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
  }
  
  function qtyTotalUpdate(prodId) {
    const quantityInput = document.querySelector(`tr[data-id="${prodId}"] input`);
    console.log("Quantity Input===>",quantityInput.value)
    const quantity = parseInt(quantityInput.value);
  
    updateQuantity(prodId, quantity);
  }
  



  function productClicked(itemName, itemId) {

    // Set the selected item name in the search input
    searchInput.value = '';
    // Disable the search input field
    searchInput.disabled = true;
  

  
    // Move the cursor to the quantity input field
    quantityInput.focus();
    quantityInput.min = '0';
    quantityInput.onkeyup = () => qtyTotalUpdate(itemId); // Attach the qtyTotalUpdate function with the respective item ID

    let selectedItem = lineItems.find((item)=>item.Id ==itemId)

    console

    selectedItem['quantity'] = 0
  
    // Add the selected item to the defaultItems list
    defaultItems.push(selectedItem);
  
    // Update the table with the new defaultItems list
    updateTable();
  
    // Clear the dropdown and hide it
    productList.innerHTML = '';
    productList.style.display = 'none';
    newEntry.style.display = 'none';
  }

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

    calculateTotalQuantity()
  }


// Event listener for the addButton click
addRowButton.addEventListener('click', () => {
    openSearch();
  });

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

        const alreadySelectedProducts = defaultItems.map((item) => {return item.Display_Name__c})
        console.log("Line Items ===>",lineItems)
        const filteredItems = lineItems.filter(item =>!alreadySelectedProducts.includes(item.itemName));
    
        const optionsString = filteredItems.map((eachItem) => `<option value="${eachItem.Id}">${eachItem.Display_Name__c}</option>`)
    
        // Create the newSearch HTML string with dynamic IDs
        const newSearchHTML = `
        <tr id="newEntry">
        <td style="width: 75%">
          <select name="productSearch" id="${clonedSelectSearchId}" class="form-control">
            <option value='0' selected='true'> Search Asset</option>
            ${optionsString.join('')}
          </select>
        </td>
        <td style="width: 25%" class="cartQtyChange"><input id="${clonedPosmQuantityId}" type="number" min="0" value="0" class="form-control"></td>
    </tr>
        `;
    
        //addOptionsToSelect(newSearchHTML.getElementById(clonedSelectSearchId),items)
    
        // Append the newSearch HTML string to the itemTable
        itemTable.insertAdjacentHTML('beforeend', newSearchHTML);
    
        // Apply Select2 to the cloned select element
        $("#" + clonedSelectSearchId).select2();
    
        // Add the event listener for the cloned select element
        $('#' + clonedSelectSearchId).on('select2:select', (e) => handleSearch(e));


    // if (newEntry.style.display === 'none') {
    //   newEntry.style.display = 'table-row';
  
    //   // Clone the newEntry row to create a new row for the item table
    //   const newRow = newEntry.cloneNode(true);
  
    //   // Generate unique IDs for the cloned elements
    //   const clonedSearchInput = newRow.querySelector('#productSearch');
    //   const clonedProductList = newRow.querySelector('#productList');
    //   const clonedQuantityInput = newRow.querySelector('#prodQ');
  
    //   const uniqueId = Date.now();
    //   clonedSearchInput.id = 'productSearch' + uniqueId;
    //   clonedProductList.id = 'productList' + uniqueId;
    //   clonedQuantityInput.id = 'prodQ' + uniqueId;
  
    //   clonedSearchInput.disabled = false
    //   // Clear the values of cloned elements
    //   clonedSearchInput.value = '';
    //   clonedQuantityInput.value = '0';
  
    //   // Remove the event listener from the original search input
    //   searchInput.removeEventListener('keyup', filterItems);
  
    //   // Add the event listener for the cloned search input and pass the cloned elements as arguments
    //   clonedSearchInput.addEventListener('keyup', () => filterItems(clonedSearchInput, clonedProductList));
  
    //   // Clear the dropdown for the cloned search input
    //   clonedProductList.innerHTML = '';
  
    //   // Append the new row to the item table
    //   itemTable.appendChild(newRow);
    // }
  }


// Function to calculate the total quantity of defaultItems
function calculateTotalQuantity() {
    const totalElement = document.getElementById('cartTotal').querySelector('span');
    const totalQuantity = defaultItems.reduce((sum, item) => sum + item.quantity, 0);
    totalElement.textContent = totalQuantity.toString();
  }
  
// Function to find the default items
async function getDefaultSalesItems(){

  let urlParam = new URLSearchParams(window.location.search);
  const accountId = urlParam.get('accountId')
  
  // Get the current account details
  let accountDetail = await getItemFromStore('account',accountId);
  let currentDate = new Date()
  let currentMonth = currentDate.getMonth()
  let currentYear = currentDate.getFullYear() 

  // Get the visit details
  let numberOfVisits = 0
  let events = await readAllData('events')
  events?.forEach((eachEvent)=>{
    if(
      eachEvent.Account__c
      &&
      eachEvent.Account__c == accountId
      &&
      new Date(eachEvent.Start_date_and_time__c).getMonth == currentMonth-1
      &&
      new Date(eachEvent.Start_date_and_time__c).getFullYear == currentYear
    ){
      
      numberOfVisits = numberOfVisits+1

    }
  })

  console.log("Number of visists===>",numberOfVisits)

  //Read from the account goals from indexDB
  let accountGoals = await readAllData('accountGoals');
  let goalsOfCurrentAccount = accountGoals.filter(eachGoal => eachGoal.Account__c === accountId && currentDate>=eachGoal.Start_Date__c && currentDate<=eachGoal.End_Date__c)

  console.log("AccountGoals===>",goalsOfCurrentAccount)

  //Find line Items with account goals
  let lineItemIdsOfGoals = []
  let requiredLineItems = []
  if(goalsOfCurrentAccount.length){
                goalsOfCurrentAccount.forEach((eachGoal) => {
                  lineItemIdsOfGoals.push({
                    itemId : eachGoal.Item_Master__c,
                    goalQuantity: eachGoal.Goal_Quantity_CE__c
                  })
                })
  }
  if(lineItemIdsOfGoals.length > 0){

      //let lineItems = await readAllData('itemMasterCopy')

      items.forEach((eachItem) => {
                lineItemIdsOfGoals.forEach((eachLineItemGoal) => {
                    if(eachLineItemGoal.itemId == eachItem.Id){
                      eachItem['goalQuantity'] = eachLineItemGoal.goalQuantity
                      requiredLineItems.push(eachItem)
                    }
                })
      })
      
  }
  if(requiredLineItems.length > 0){
     
    /* Need to find out the recommended quantity
    quantity = (goal - mtd value of variant)/total number of visits of SalesPerson
    Goal is available from goalQuantity above.
    mtd value will be fetched from account retail depletion rate Retail_Depletion1__r.records
    number of visits from Event(Visit) table where recordType is SalesPerson
    And also these values will be displayed to user only if he is salesPerson
    */
    

    let idOfRequiredLineItems = requiredLineItems.map((eachRecord)=> eachRecord.Id)
    
    //Get the retail depletion rate of requiredLineItems
    let currentMonthDepletionRates = []
    accountDetail.Retail_Depletion1__r.records.forEach((eachDepletedRecord)=>{
      if(
        eachDepletedRecord.Item__c
        &&
        eachDepletedRecord.Date__c
        &&
        idOfRequiredLineItems.includes(eachDepletedRecord.Item__c)
        &&
        new Date(eachDepletedRecord.Date__c).getMonth() == currentMonth
        &&
        new Date(eachDepletedRecord.Date__c).getFullYear() == currentYear      
      ){
         
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
      summedQuantities.forEach((eachSummedQuantity)=>{
        if(eachSummedQuantity.itemId == eachRequiredLineItem.Id){
           
             eachRequiredLineItem['quantity'] = Math.max(eachRequiredLineItem['goalQuantity'] - eachSummedQuantity.quantity,0)/Math.max(numberOfVisits,1)

             defaultItems.push(eachRequiredLineItem)
        }


      })
    })


  }
  populateTableWithDefaultItems();
}

async function getLineItems(){


  lineItems = await readAllData('itemMasterCopy')

  console.log("Line Items in SalesOrder====>",lineItems)

  getDefaultSalesItems();
}



quantityBtn = (a, IdName) => {
  var $button = a;
  var inputName = $(IdName).attr("id");
  var index = $(a).attr("data-index");

  var oldValue = $button
    .parent()
    .find("#" + inputName)
    .val();
  if (oldValue === "Bottles" || oldValue === "Cases") {
    oldValue = 0;
  }
  if ($button.text() == "+") {
    var newVal = parseFloat(oldValue) + 1;
    orderRecord.products[index][
      inputName === "cases" ? "Cases" : "Bottles"
    ] = newVal;
  } else {
    if (oldValue === "1") {
      newVal = inputName === "cases" ? "0" : "Bottles";
      orderRecord.products[index][
        inputName === "cases" ? "Cases" : "Bottles"
      ] = 0;
    } else if (oldValue === "0" || oldValue === "0") {
      var newVal = oldValue;
      orderRecord.products[index][
        inputName === "cases" ? "Cases" : "Bottles"
      ] = 0;
    } else {
      if (oldValue > 0) {
        var newVal = parseFloat(oldValue) - 1;
        orderRecord.products[index][
          inputName === "cases" ? "Cases" : "Bottles"
        ] = newVal;
      } else if (oldValue == 0) {
        newVal = inputName === "cases" ? "0" : "Bottles";
        orderRecord.products[index][
          inputName === "cases" ? "Cases" : "Bottles"
        ] = 0;
      }
    }
  }
  showSummary();
  $button
    .parent()
    .find("#" + inputName)
    .val(newVal);
};


checkout = async () => {



  if(!checkforPreSalesOrder()){
    getProductData();
    // orderRec.Comment = $("#salesOrderComment").val();
    await saveOrder();
  }
  
};

const checkforPreSalesOrder = () => {
  if(orderRec.Has_Zero_Quantity_Product){
    $('#reasonForNotLiking').modal('show');
    $('#salesOrderSubmit').modal('hide');
    let urlParam = new URLSearchParams(window.location.search);
    if(urlParam.has('presalesId'))
      orderRec.Product_Pre_Sales_Sampling = urlParam.get('presalesId');
    constructReasonNotLikingSelect();
    return true;
  }
  else{
    orderRec['Reasons_for_not_Liking_Product'] = null;
    orderRec['pricing_promotion_discount'] = null;
    orderRec['competition_tie_up'] = null;
    orderRec['operational_feedback'] = null;
    orderRec['Comment'] = null;
    
  }
  return false;
};

confirmOrder = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  const individual = urlParam.get('individual')
  if(individual == 'true'){
    window.location.href = `/view/accountLanding/accountLanding.html?accountId=${accountID}`
  }else{
    window.location.href = `/view/sales/visibility.html?accountId=${accountID}`
  }
  $('#confirmOrder').modal('hide');
}

const constructReasonNotLikingSelect = () => {
  $('#reasonForNotLikingSelect').empty();
  let options = ["Pricing/ Promotion/ Discount" ,"Competition Tie-up","Operational Feedback","Other" ];
  let tmp = `<select class="form-control" multiple name="" id="reason" onchange="handleReasonSelectOption(this)">`;
  tmp += `<option>--None--</option>`;
  options.forEach(ele => {
    tmp += `<option  value="${ele}">${ele}</option>`;
  });
  tmp  += `</select>`;
  tmp += `<span class="reason showError">This Field is required</span><br/>`;
  $('#reasonForNotLikingSelect').append(tmp);
  $('#reason').val(orderRec.Reasons_for_not_Liking_Product ?orderRec.Reasons_for_not_Liking_Product : [] );                 
  handleReasonSelectOption(orderRec.Reasons_for_not_Liking_Product &&orderRec.Reasons_for_not_Liking_Product.length > 0 ?orderRec.Reasons_for_not_Liking_Product : [] );
          
};

const reasonsReRenderHelper = () => {
  $('#reasonForNotLikingSelect').empty();
  let options = ["Pricing/ Promotion/ Discount" ,"Competition Tie-up","Operational Feedback","Other" ];
  let tmp = `<select class="form-control" multiple name="" id="reason" onchange="handleReasonSelectOption(this)">`;
  tmp += `<option value="">--None--</option>`;
  options.forEach(ele => {
    tmp += `<option  value="${ele}">${ele}</option>`;
  });
  tmp  += `</select>`;
  tmp += `<span class="reason showError">This Field is required</span><br/>`;
  $('#reasonForNotLikingSelect').append(tmp);
  $('#reason').val(orderRec.Reasons_for_not_Liking_Product ?orderRec.Reasons_for_not_Liking_Product : [] );                 
};

handleProductRefresh = () => {
  items = backendItems.filter((ele, index) => {
    let isValid = true;
    let displayName = ele.Product__c ? ele.Product__r.Display_Name__c : "";
    displayName = displayName.toLowerCase();
    if (selectedProductTotal.has(ele.Product__c)) {
      isValid = false;
    }
    return isValid;
  });
  getProduct();
};

handlePageRedirect = async (value) => {
  getProductData();
  orderRec.Last_Modified = new Date();
  orderRec.isSynced = false;
  orderRec.Comment = $("#salesOrderComment").val();
  orderRec.Daily_Tracker = fetchCurrentDateIdStr();
  const position = await getCurrentLocationHelper();
  orderRec.Geolocation_Latitude = position.coords.latitude;
  orderRec.Geolocation_Longitude = position.coords.longitude;
  await writeData("salesOrderSync", orderRec);

  const recordTypeName = accountRec.RecordType.DeveloperName;

  if (recordTypeName === "Distributor_Warehouse") {
    if (value === "Home") {
        let nonSales = await isTechnicianAuditorFuncHelper();
        if(nonSales.isAudit){
            window.location.href =
            "/view/accountDetailLandingAuditor/accountDetailLandingAuditor.html?accountId=" +
            accountRec.Id;
        }
        else if(nonSales.isSales){
            window.location.href =
            "/view/accountDetail/accountDetailDistributorWarehouse/accountDetailDistributorWarehouseLanding.html?Id=" +
            accountRec.Id;
        }
        else if(nonSales.isTech){
            window.location.href =
            "/view/accountDetailLandingTechnician/accountDetailLandingTechnician.html?accountId=" +
            accountRec.Id;
        }
      
    } else if (value === "Related") {
      window.location.href =
        "/view/accountDetail/accountDetailDistributorWarehouse/accountDetailDistributorWarehouseRelated.html?Id=" +
        accountRec.Id;
    } else if (value === "Media") {
      window.location.href =
        "/view/accountDetail/accountDetailDistributorWarehouse/accountDetailDistributorWarehouseMedia.html?Id=" +
        accountRec.Id;
    } else if (value === "Detail") {
      window.location.href =
        "/view/accountDetail/accountDetailDistributorWarehouse/accountDetailDistributorWarehouseDetail.html?Id=" +
        accountRec.Id;
    }
  } else if (recordTypeName === "Distributor") {
    if (value === "Home") {
        let nonSales = await isTechnicianAuditorFuncHelper();
        if(nonSales.isAudit){
            window.location.href =
            "/view/accountDetailLandingAuditor/accountDetailLandingAuditor.html?accountId=" +
            accountRec.Id;
        }
        else if(nonSales.isSales){
            window.location.href =
            "/view/accountDetail/accountDetailDistributor/accountDetailDistributorLanding.html?Id=" +
            accountRec.Id;
        }
        else if(nonSales.isTech){
            window.location.href =
            "/view/accountDetailLandingTechnician/accountDetailLandingTechnician.html?accountId=" +
            accountRec.Id;
        }
      
    } else if (value === "Related") {
      window.location.href =
        "/view/accountDetail/accountDetailDistributor/accountDetailDistributorRelated.html?Id=" +
        accountRec.Id;
    } else if (value === "Detail") {
      window.location.href =
        "/view/accountDetail/accountDetailDistributor/accountDetailDistributorDetail.html?Id=" +
        accountRec.Id;
    } else if (value === "Media") {
      window.location.href =
        "/view/accountDetail/accountDetailDistributor/accountDetailDistributorMedia.html?Id=" +
        accountRec.Id;
    }
  } else if (recordTypeName === "On_Premise_General") {
    if (value === "Home") {
        let nonSales = await isTechnicianAuditorFuncHelper();
        if(nonSales.isAudit){
            window.location.href =
            "/view/accountDetailLandingAuditor/accountDetailLandingAuditor.html?accountId=" +
            accountRec.Id;
        }
        else if(nonSales.isSales){
            window.location.href =
            "/view/accountDetail/accountDetailOnPremiseGeneral/accountDetailOnPremiseGeneralLanding.html?Id=" +
            accountRec.Id;
        }
        else if(nonSales.isTech){
            window.location.href =
            "/view/accountDetailLandingTechnician/accountDetailLandingTechnician.html?accountId=" +
            accountRec.Id;
        }
      
    } else if (value === "Related") {
      window.location.href =
        "/view/accountDetail/accountDetailOnPremiseGeneral/accountDetailOnPremiseGeneralRelated.html?Id=" +
        accountRec.Id;
    } else if (value === "Detail") {
      window.location.href =
        "/view/accountDetail/accountDetailOnPremiseGeneral/accountDetailOnPremiseGeneralDetail.html?Id=" +
        accountRec.Id;
    } else if (value === "Media") {
      window.location.href =
        "/view/accountDetail/accountDetailOnPremiseGeneral/accountDetailOnPremiseGeneralMedia.html?Id=" +
        accountRec.Id;
    }
  } else if (recordTypeName === "Consumer") {
    if (value === "Home") {
        let nonSales = await isTechnicianAuditorFuncHelper();
        if(nonSales.isAudit){
            window.location.href =
            "/view/accountDetailLandingAuditor/accountDetailLandingAuditor.html?accountId=" +
            accountRec.Id;
        }
        else if(nonSales.isSales){
            window.location.href =
            "/view/accountDetail/accountDetailConsumer/accountDetailConsumerLanding.html?Id=" +
            accountRec.Id;
        }
        else if(nonSales.isTech){
            window.location.href =
            "/view/accountDetailLandingTechnician/accountDetailLandingTechnician.html?accountId=" +
            accountRec.Id;
        }
      
    } else if (value === "Related") {
      window.location.href =
        "/view/accountDetail/accountDetailConsumer/accountDetailConsumerRelated.html?Id=" +
        accountRec.Id;
    } else if (value === "Detail") {
      window.location.href =
        "/view/accountDetail/accountDetailConsumer/accountDetailConsumerDetail.html?Id=" +
        accountRec.Id;
    } else if (value === "Media") {
      window.location.href =
        "/view/accountDetail/accountDetailConsumer/accountDetailConsumerMedia.html?Id=" +
        accountRec.Id;
    }
  } else if (recordTypeName === "Institutional_Off_Premise") {
    if (value === "Home") {
        let nonSales = await isTechnicianAuditorFuncHelper();
        if(nonSales.isAudit){
            window.location.href =
            "/view/accountDetailLandingAuditor/accountDetailLandingAuditor.html?accountId=" +
            accountRec.Id;
        }
        else if(nonSales.isSales){
            window.location.href =
            "/view/accountDetail/accountDetailInstitutionalOffPremise/accountDetailInstitutionalOffPremiseLanding.html?Id=" +
            accountRec.Id;
        }
        else if(nonSales.isTech){
            window.location.href =
            "/view/accountDetailLandingTechnician/accountDetailLandingTechnician.html?accountId=" +
            accountRec.Id;
        }
      
    } else if (value === "Related") {
      window.location.href =
        "/view/accountDetail/accountDetailInstitutionalOffPremise/accountDetailInstitutionalOffPremiseRelated.html?Id=" +
        accountRec.Id;
    } else if (value === "Detail") {
      window.location.href =
        "/view/accountDetail/accountDetailInstitutionalOffPremise/accountDetailInstitutionalOffPremiseDetail.html?Id=" +
        accountRec.Id;
    } else if (value === "Media") {
      window.location.href =
        "/view/accountDetail/accountDetailInstitutionalOffPremise/accountDetailInstitutionalOffPremiseMedia.html?Id=" +
        accountRec.Id;
    }
  } else if (recordTypeName === "Institutional_On_Premise") {
    if (value === "Home") {
        let nonSales = await isTechnicianAuditorFuncHelper();
        if(nonSales.isAudit){
            window.location.href =
            "/view/accountDetailLandingAuditor/accountDetailLandingAuditor.html?accountId=" +
            accountRec.Id;
        }
        else if(nonSales.isSales){
            window.location.href =
            "/view/accountDetail/accountDetailInstitutionalOnPremise/accountDetailInstitutionalOnPremiseLanding.html?Id=" +
            accountRec.Id;
        }
        else if(nonSales.isTech){
            window.location.href =
            "/view/accountDetailLandingTechnician/accountDetailLandingTechnician.html?accountId=" +
            accountRec.Id;
        }
      
    } else if (value === "Related") {
      window.location.href =
        "/view/accountDetail/accountDetailInstitutionalOnPremise/accountDetailInstitutionalOnPremiseRelated.html?Id=" +
        accountRec.Id;
    } else if (value === "Detail") {
      window.location.href =
        "/view/accountDetail/accountDetailInstitutionalOnPremise/accountDetailInstitutionalOnPremiseDetail.html?Id=" +
        accountRec.Id;
    } else if (value === "Media") {
      window.location.href =
        "/view/accountDetail/accountDetailInstitutionalOnPremise/accountDetailInstitutionalOnPremiseMedia.html?Id=" +
        accountRec.Id;
    }
  } else if (recordTypeName === "Non_beer_Warehouse") {
    if (value === "Home") {
        let nonSales = await isTechnicianAuditorFuncHelper();
        if(nonSales.isAudit){
            window.location.href =
            "/view/accountDetailLandingAuditor/accountDetailLandingAuditor.html?accountId=" +
            accountRec.Id;
        }
        else if(nonSales.isSales){
            window.location.href =
            "/view/accountDetail/accountDetailNonbeerWarehouse/accountDetailNonbeerWarehouseLanding.html?Id=" +
            accountRec.Id;
        }
        else if(nonSales.isTech){
            window.location.href =
            "/view/accountDetailLandingTechnician/accountDetailLandingTechnician.html?accountId=" +
            accountRec.Id;
        }
      
    } else if (value === "Related") {
      window.location.href =
        "/view/accountDetail/accountDetailNonbeerWarehouse/accountDetailNonbeerWarehouseRelated.html?Id=" +
        accountRec.Id;
    } else if (value === "Detail") {
      window.location.href =
        "/view/accountDetail/accountDetailNonbeerWarehouse/accountDetailNonbeerWarehouseDetail.html?Id=" +
        accountRec.Id;
    } else if (value === "Media") {
      window.location.href =
        "/view/accountDetail/accountDetailNonbeerWarehouse/accountDetailNonbeerWarehouseMedia.html?Id=" +
        accountRec.Id;
    }
  } else if (recordTypeName === "Off_Premise_Outlet") {
    if (value === "Home") {
        let nonSales = await isTechnicianAuditorFuncHelper();
        if(nonSales.isAudit){
            window.location.href =
            "/view/accountDetailLandingAuditor/accountDetailLandingAuditor.html?accountId=" +
            accountRec.Id;
        }
        else if(nonSales.isSales){
            window.location.href =
            "/view/accountDetail/accountDetailOffPremiseOutlet/accountDetailOffPremiseOutletLanding.html?Id=" +
            accountRec.Id;
        }
        else if(nonSales.isTech){
            window.location.href =
            "/view/accountDetailLandingTechnician/accountDetailLandingTechnician.html?accountId=" +
            accountRec.Id;
        }
      
    } else if (value === "Related") {
      window.location.href =
        "/view/accountDetail/accountDetailOffPremiseOutlet/accountDetailOffPremiseOutletRelated.html?Id=" +
        accountRec.Id;
    } else if (value === "Detail") {
      window.location.href =
        "/view/accountDetail/accountDetailOffPremiseOutlet/accountDetailOffPremiseOutletDetail.html?Id=" +
        accountRec.Id;
    } else if (value === "Media") {
      window.location.href =
        "/view/accountDetail/accountDetailOffPremiseOutlet/accountDetailOffPremiseOutletMedia.html?Id=" +
        accountRec.Id;
    }
  } else if (recordTypeName === "On_Premise_Hotel") {
    if (value === "Home") {
        let nonSales = await isTechnicianAuditorFuncHelper();
        if(nonSales.isAudit){
            window.location.href =
            "/view/accountDetailLandingAuditor/accountDetailLandingAuditor.html?accountId=" +
            accountRec.Id;
        }
        else if(nonSales.isSales){
            window.location.href =
            "/view/accountDetail/accountDetailOnPremiseHotel/accountDetailOnPremiseHotelLanding.html?Id=" +
            accountRec.Id;
        }
        else if(nonSales.isTech){
            window.location.href =
            "/view/accountDetailLandingTechnician/accountDetailLandingTechnician.html?accountId=" +
            accountRec.Id;
        }
      
    } else if (value === "Related") {
      window.location.href =
        "/view/accountDetail/accountDetailOnPremiseHotel/accountDetailOnPremiseHotelRelated.html?Id=" +
        accountRec.Id;
    } else if (value === "Detail") {
      window.location.href =
        "/view/accountDetail/accountDetailOnPremiseHotel/accountDetailOnPremiseHotelDetail.html?Id=" +
        accountRec.Id;
    } else if (value === "Media") {
      window.location.href =
        "/view/accountDetail/accountDetailOnPremiseHotel/accountDetailOnPremiseHotelMedia.html?Id=" +
        accountRec.Id;
    }
  } else if (recordTypeName === "Supplier") {
    if (value === "Home") {
        let nonSales = await isTechnicianAuditorFuncHelper();
        if(nonSales.isAudit){
            window.location.href =
            "/view/accountDetailLandingAuditor/accountDetailLandingAuditor.html?accountId=" +
            accountRec.Id;
        }
        else if(nonSales.isSales){
            window.location.href =
            "/view/accountDetail/accountDetailSupplier/accountDetailSupplierLanding.html?Id=" +
            accountRec.Id;
        }
        else if(nonSales.isTech){
            window.location.href =
            "/view/accountDetailLandingTechnician/accountDetailLandingTechnician.html?accountId=" +
            accountRec.Id;
        }
      
    } else if (value === "Related") {
      window.location.href =
        "/view/accountDetail/accountDetailSupplier/accountDetailSupplierRelated.html?Id=" +
        accountRec.Id;
    } else if (value === "Detail") {
      window.location.href =
        "/view/accountDetail/accountDetailSupplier/accountDetailSupplierDetail.html?Id=" +
        accountRec.Id;
    } else if (value === "Media") {
      window.location.href =
        "/view/accountDetail/accountDetailSupplier/accountDetailSupplierMedia.html?Id=" +
        accountRec.Id;
    }
  } else if (recordTypeName === "Temporary_Event") {
    if (value === "Home") {
        let nonSales = await isTechnicianAuditorFuncHelper();
        if(nonSales.isAudit){
            window.location.href =
            "/view/accountDetailLandingAuditor/accountDetailLandingAuditor.html?accountId=" +
            accountRec.Id;
        }
        else if(nonSales.isSales){
            window.location.href =
            "/view/accountDetail/accountDetailTemporaryEvent/accountDetailTemporaryEventLanding.html?Id=" +
            accountRec.Id;
        }
        else if(nonSales.isTech){
            window.location.href =
            "/view/accountDetailLandingTechnician/accountDetailLandingTechnician.html?accountId=" +
            accountRec.Id;
        }
      
    } else if (value === "Related") {
      window.location.href =
        "/view/accountDetail/accountDetailTemporaryEvent/accountDetailTemporaryEventRelated.html?Id=" +
        accountRec.Id;
    } else if (value === "Detail") {
      window.location.href =
        "/view/accountDetail/accountDetailTemporaryEvent/accountDetailTemporaryEventDetail.html?Id=" +
        accountRec.Id;
    } else if (value === "Media") {
      window.location.href =
        "/view/accountDetail/accountDetailTemporaryEvent/accountDetailTemporaryEventMedia.html?Id=" +
        accountRec.Id;
    }
  } else if (recordTypeName === "Wholesaler") {
    if (value === "Home") {
        let nonSales = await isTechnicianAuditorFuncHelper();
        if(nonSales.isAudit){
            window.location.href =
            "/view/accountDetailLandingAuditor/accountDetailLandingAuditor.html?accountId=" +
            accountRec.Id;
        }
        else if(nonSales.isSales){
            window.location.href =
            "/view/accountDetail/accountDetailWholesaler/accountDetailWholesalerLanding.html?Id=" +
            accountRec.Id;
        }
        else if(nonSales.isTech){
            window.location.href =
            "/view/accountDetailLandingTechnician/accountDetailLandingTechnician.html?accountId=" +
            accountRec.Id;
        }
      
    } else if (value === "Related") {
      window.location.href =
        "/view/accountDetail/accountDetailWholesaler/accountDetailWholesalerRelated.html?Id=" +
        accountRec.Id;
    } else if (value === "Detail") {
      window.location.href =
        "/view/accountDetail/accountDetailWholesaler/accountDetailWholesalerDetail.html?Id=" +
        accountRec.Id;
    } else if (value === "Media") {
      window.location.href =
        "/view/accountDetail/accountDetailWholesaler/accountDetailWholesalerMedia.html?Id=" +
        accountRec.Id;
    }
  }
  else if (recordTypeName === 'Lead') {
    if (value === 'Home') {
      window.location.href = '/view/leadDetail/leadDetailLanding.html?leadId=' + accountRec.Id;
    }
    else if (value === 'Related') {
      window.location.href = '/view/leadDetail/leadDetailRelated.html?leadId=' + accountRec.Id;
    }
    else if (value === 'Detail') {
      window.location.href = '/view/leadDetail/leadDetail.html?leadId=' + accountRec.Id;
    }
    else if (value === 'Media') {
      window.location.href = '/view/leadDetail/leadDetailMedia.html?leadId=' + accountRec.Id;
    }

  }
};


incrementQtn = (ele) => {
  var $n = $(ele)
    .parent(".button-container")
    .find(".qty");
    let value = 0;
    var inputName = $(ele).attr("id");
    var amount = Number($n.val());
    if (amount > 999) {
      value = 999;
     
    }
    else{
      value = Number($n.val()) + 1;
      
    }
   let index = $n.attr('data-index');
    
    orderRecord.products[index][
      "Cases" 
    ] = value;
    $n.val(value);
    
    showSummary();
};


decrementQtn = (ele) => {
  var $n = $(ele)
    .parent(".button-container")
    .find(".qty");
    let value = 0;
    var inputName = $(ele).attr("id");
  var amount = Number($n.val());
  if (amount > 0) {
    
    value = amount -1;
  }
  let index = $n.attr('data-index');

  orderRecord.products[index][
     "Cases"
  ] = value;
  $n.val(value);
  showSummary();
};

handleQuantityChange = (ele) => {
  let val = $(ele).val();
  var inputName = $(ele).attr("id");
   let index = $(ele).attr('data-index');
  if(val<0){
    $(ele).val(0);

    orderRecord.products[index][
      "Cases"
    ] = 0;
    return;
  }
  if(val >999){
    $(ele).val(999);
    orderRecord.products[index][
       "Cases"
    ] = 999;

    return;
  }
  orderRecord.products[index][
     "Cases"
  ] = val;
  showSummary();
};




// Reason for not liking Product drop downs 
const subReason = new Map([
  ['Pricing/ Promotion/ Discount',['Landing Price higher than competition','Need better promotion offer','Need longer duration for promotion','Need more Discount']],
  ['Competition Tie-up',['Premium','Mass','Draft','Craft','Overall']],
  ['Operational Feedback',['Stock is not available regularly','Service is not regular',
    'Past issues not settled','Outlet needs more time to decide','Not met decision maker']],  
]);


const subReasonId = new Map([
  ['Pricing/ Promotion/ Discount','pricing_promotion_discount'],
  ['Competition Tie-up','competition_tie_up'],
  ['Operational Feedback','operational_feedback'],
  ['Other','Comment']
]);
const handleReasonSelectOption = (ele) =>{
  
  // if($(ele)&&$(ele).val().length === 0){
  //   $(`.${$(ele).attr('id')}`).css('display','block');
  // }else{
  //   $(`.${$(ele).attr('id')}`).css('display','none');
  // }
  reasonsReRenderHelper();
    let values ;
  try{
    values  = $(ele).val();
    if(!values){
      values = ele;
    }
  }
  catch(e){
    values = ele&&ele.length>0 ? ele : [] ;
  }
    
    $('#subReasons').html('');
  let tmp = '';
  orderRec.Reasons_for_not_Liking_Product = values;
  for(let i = 0;i<values.length;i++)
  {
    if(subReasonId.has(values[i])){
      if(values[i] !== 'Other'){
        
        tmp +=`
          <label>${values[i]}</label>
          <select name="" class="form-control" multiple  onchange="handleSubReasons(this)" id="${subReasonId.get(values[i])}">
          <option value="">--None--</option>
        `;
        for(let j = 0;j<subReason.get(values[i]).length;j++){
          const subReasonSelectedValue = orderRec && orderRec[subReasonId.get(values[i])] ? orderRec[subReasonId.get(values[i])] :'';
          const subReasonSelectedSet = new Set(subReasonSelectedValue.split(';'));
          tmp +=`
            <option ${subReasonSelectedSet.has(subReason.get(values[i])[j]) ? 'selected' : ''}  value="${subReason.get(values[i])[j]}">${subReason.get(values[i])[j]}</option>
          `;
        }
        tmp +='</select>';
        tmp +=`<span class="${subReasonId.get(values[i])} showError">This Field is required</span> <br/>`;
      }else{
        tmp +=`<label>For Other, Enter Reason here...</label>
          <textarea required class="form-control" value="${orderRec.Comment}" id="${subReasonId.get(values[i])}" onkeyup="handleSubReasons(this)" row="3">${orderRec.Comment ? orderRec.Comment : ''}</textarea>
          <span class="${subReasonId.get(values[i])} showError">This Field is required</span><br/>
          `;
  
      }
    }
    
  }

  $('#subReasons').append(tmp);
  
  
  
  

};

const handleSubReasons = (ele) => {
  
  if($(ele).attr('id')==='Comment'){
    orderRec[$(ele).attr('id')] = ($(ele).val());
  }
  else{
    handleReasonSelectOption(orderRec.Reasons_for_not_Liking_Product &&orderRec.Reasons_for_not_Liking_Product.length > 0 ?orderRec.Reasons_for_not_Liking_Product : [] );
    orderRec[$(ele).attr('id')] = ($(ele).val()).join(';');
  }
  

};

const submitPostReasonNotLiking = async() => {
  let isValid = true;
  
  if($('#reason').val().length === 0){
    $(`.reason`).css('display','block');
        isValid = false;
  }


  if(orderRec.Reasons_for_not_Liking_Product && orderRec.Reasons_for_not_Liking_Product.length > 0){
    for(let i of orderRec.Reasons_for_not_Liking_Product){
      if($(`#${subReasonId.get(i)}`).val().length === 0){
        $(`.${subReasonId.get(i)}`).css('display','block');
        isValid = false;
      }
      else{
        $(`.${subReasonId.get(i)}`).css('display','none')
      }
    }
  }

  if(isValid){  
  $('#reasonForNotLiking').modal('hide');
  
  getProductData();
  await saveOrder();
  }
  else{
    showNotification({message : 'Fill all mandatory fields !'});
  }
};

initializeShowAccount();
// getLineItems();
// getDefaultSalesItems();
// populateTableWithDefaultItems();
