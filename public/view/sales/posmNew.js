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



let itemTable = document.getElementById('posmTable');
let selectItem = document.getElementById('selectSearch');
let quantityInput = document.getElementById('posmQuantity');
let addButton = document.getElementById('addButton');
const newSearch = document.getElementById('newSearch');


goBack = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/sales/visibility.html?accountId=${accountId}`
  }
  
  
  gotoCompitation1 = () => {
    localStorage.getItem('accountId')
    const accountID = localStorage.getItem('accountId') 
    window.location.href = `/view/objectives/competitorInsights/competitionInsightsPage1.html?accountId=${accountID}`
  }



let items = []

//Filter the recordTypeIds which are not in the Assets

let defaultItems = []

// const items = [
//     {
//         itemId: 3,
//         itemName: "Brushes"

//     },
//     {
//         itemId: 4,
//         itemName: "Tables"

//     }
// ]

const initializeShowPOSM = async () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  //const accountId = localStorage.getItem('accountId');
  accountRec = await getItemFromStore('account', accountId);
  if (!accountRec) {
    accountRec = await getItemFromStore('lead', accountId);
  }
  let app_id = fetchCurrentDateIdStr() + '-' + accountId
  // FetchExisting Record
  let existingPOSM = await getItemFromStore('posm',app_id)
  console.log("Existign POSMMMM===>",existingPOSM)
  if(existingPOSM && !existingPOSM.isSynced){
    defaultItems = existingPOSM.POSM_Line_Item__c.filter((eachItem) => !eachItem.hasOwnProperty('Space_Available__c'))
  }
  //showAccount();
  populateTableWithDefaultItems();
};

// Function to populate the table with default items
async function populateTableWithDefaultItems() {

    //We will get items which are not assets as mentioned in constants/constants.js file
    let itemMaster = await readAllData('nonBeerItems');
    let itemMasterRecordTypes = await readAllData('itemMasterRecordTypes');
    const alreadySelectedProducts = defaultItems.map((item) => item.Name)

    console.log("Item Master===>", itemMaster)
    console.log("Item Master Record Type===>", itemMasterRecordTypes)

    let requiredPosId = itemMasterRecordTypes.find((eachItem) => eachItem.name.toLowerCase() === "posm")

    console.log("Required Pos IDs===>", requiredPosId.recordTypeId)

    const POSMItems = itemMaster.filter((eachItem) => eachItem.recordTypeId == requiredPosId.recordTypeId)
    
    console.log("posm items===>",POSMItems)

    items = itemMaster.filter((eachItem) => eachItem.RecordType.DeveloperName.toLowerCase() == "posm" && !posmAssets.includes(eachItem.Sub_Channel__c.toLowerCase()) && !alreadySelectedProducts.includes(eachItem.name))

    console.log("Items ====>",items)

    // Fetch the default items from IndexedDB (accountGoals table) and store them in an array called 'defaultItems'
    // Iterate over the 'defaultItems' array and add rows to the table
    defaultItems.forEach(item => {
        const newRow = itemTable.insertRow(0);
        newRow.dataset.id = item.Id;
        const itemCell = newRow.insertCell()
        itemCell.innerText = item.Name;
        itemCell.classList.add("wd-60");

        // Create an input field for quantity
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = item.quantity; // Set the initial value
        //quantityInput.class = 'form-control'
        quantityInput.min = '0';
        //quantityInput.onkeyup = () => qtyTotalUpdate(item.itemId); // Attach the qtyTotalUpdate function with the respective item ID
        quantityInput.addEventListener('input', () => qtyTotalUpdate(item.Id))

        const quantityCell = newRow.insertCell();
        quantityCell.appendChild(quantityInput);
        quantityCell.classList.add("wd-40")
    });

    console.log("Item Table===>", itemTable)

    addOptionsToSelect(selectItem, items)

    calculateTotalPOSMQuantity()
}

function addOptionsToSelect(selectItem, items) {

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var option = document.createElement("option");
        option.text = item.Name;
        option.value = item.Id;
        selectItem.appendChild(option);
    }

}

function updateQuantity(prodId, quantity) {
    let sum = 0;
    defaultItems.forEach(item => {
        if (item.Id === prodId) {
            item.quantity = parseInt(quantity);
        }
        sum += item.quantity;
    });
    //updateTable()
    console.log("default Items after updating quantity", defaultItems);
}

function qtyTotalUpdate(prodId) {
    const quantityInput = document.querySelector(`tr[data-id="${prodId}"] input`);
    console.log("Quantity Input===>", isNaN(quantityInput.value))
    console.log(quantityInput.value)
    let quantity = 0
    if (quantityInput.value) {
        quantity = parseInt(quantityInput.value)
    }
    updateQuantity(prodId, quantity);
}


const handleSearch = (e) => {

    console.log("I am in hndle search")

    console.log("Select Item===>", selectItem)
    console.log("New Search===>", newSearch)

    selectItem.innerHTML = '';
    selectItem.disabled = true;
    newSearch.style.display = 'none';

    console.log("Select Item after diabling===>", selectItem)
    console.log("New Search after diabsling===>", newSearch)


    let data = e.params.data;
    console.log("Data====>", data);
    quantityInput.focus()

    let selectedItem = items.find((item)=>item.Id ==data.id)

    console.log("Selected item---->",selectedItem)

    selectedItem['quantity'] = 0

    defaultItems.push(selectedItem)

    console.log("DI====>",defaultItems)


    $('#selectItem').val(null).trigger('change');

    // Hide all options in the selectSearch dropdown
    $('#selectItem').find('option').hide();

    // Show the default placeholder option
    $('#selectItem').find('option[value="0"]').show();

    // Reset the selected value to the placeholder option
    selectItem.value = '0';

    // Refresh the select2 dropdown to reflect the changes
    $(selectItem).trigger('change');

    updateTable()

}

$(function () {
    $("#selectSearch").select2();
});

$(function () {
    $("#selectSearch1").select2();
});

$('#selectSearch').on('select2:select', (e) => handleSearch(e));


function updateTable() {

    // Clear the existing table rows
    itemTable.innerHTML = '';

    console.log("DLO===>",defaultItems)

    defaultItems.forEach(item => {
        const newRow = itemTable.insertRow();
        newRow.dataset.id = item.Id;
        const itemCell = newRow.insertCell()
        itemCell.innerText = item.Name;
        itemCell.classList.add("wd-60");

        // Create an input field for quantity
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = item.quantity; // Set the initial value
        //quantityInput.class = 'form-control'
        quantityInput.min = '0';
        //quantityInput.onkeyup = () => qtyTotalUpdate(item.itemId); // Attach the qtyTotalUpdate function with the respective item ID
        quantityInput.addEventListener('input', () => qtyTotalUpdate(item.Id))

        const quantityCell = newRow.insertCell();
        quantityCell.appendChild(quantityInput);
        quantityCell.classList.add("wd-40")
    });

    console.log("Default Items===>", defaultItems)

    // Clear the dropdown and hide it
    selectItem.innerHTML = '';
    selectItem.style.display = 'none';
    newSearch.style.display = 'none';

    calculateTotalPOSMQuantity()

}

const createNewRow = () => {
    // Destroy the old newSearch
    const existingNewSearch = document.getElementById('newSearch');
    if (existingNewSearch) {
        existingNewSearch.remove();
    }

    // Generate unique IDs for the new elements
    const uniqueId = Date.now();
    const clonedSelectSearchId = 'selectSearch' + uniqueId;
    const clonedPosmQuantityId = 'posmQuantity' + uniqueId;

    const alreadySelectedProducts = defaultItems.map((item) => item.Name)
    console.log("Already new===>",alreadySelectedProducts)

    let presentItems = items.filter((eachItem) => eachItem.RecordType.DeveloperName.toLowerCase() == "posm" && !posmAssets.includes(eachItem.Sub_Channel__c.toLowerCase()) && !alreadySelectedProducts.includes(eachItem.Name))

    const optionsString = presentItems.map((eachItem) => `<option value="${eachItem.Id}">${eachItem.Name}</option>`)

    // Create the newSearch HTML string with dynamic IDs
    const newSearchHTML = `
      <tr id="newSearch">
        <td style="width: 75%">
          <select name="selectSearch" id="${clonedSelectSearchId}" class="form-control">
            <option value='0' selected='true'> Search Asset</option>
            ${optionsString.join('')}
          </select>
        </td>
        <td style="width: 20%">
          <input id="${clonedPosmQuantityId}" type="number" class="form-control">
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
};

// Function to calculate the total quantity of defaultItems
function calculateTotalPOSMQuantity() {
    const totalElement = document.getElementById('posmTotal').querySelector('span');
    const totalQuantity = defaultItems.length
    totalElement.textContent = totalQuantity.toString();
}

addButton.addEventListener('click', () => createNewRow())


initializeShowPOSM();
