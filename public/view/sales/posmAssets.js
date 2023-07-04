let assetsTable = document.getElementById('assetsTable');
let selectItemAsset = document.getElementById('selectSearch1');
let assetSearch = document.getElementById('assetSearch');
let addAssetButton = document.getElementById('addAssetButton');

let assetAddedItems = []

let searchItems = []

let bodyToBeSent = {}

// Function to populate the table with default items
async function populateTableWithDefaultItems() {

    //We will get items which are not assets as mentioned in constants/constants.js file
    let itemMaster = await readAllData('itemMasterCopy');
    let itemMasterRecordTypes = await readAllData('itemMasterRecordTypes');

    let requiredPosId = itemMasterRecordTypes.find((eachItem) => eachItem.name.toLowerCase() === "posm")

    searchItems = itemMaster.filter((eachItem) => eachItem.recordTypeId == requiredPosId.recordTypeId && posmAssets.includes(eachItem.Sub_Channel__c.toLowerCase()))

    // Fetch the default items from IndexedDB (accountGoals table) and store them in an array called 'defaultItems'
    // Iterate over the 'defaultItems' array and add rows to the table
    assetAddedItems.forEach(item => {
        const newRow = assetsTable.insertRow(0);
        newRow.dataset.id = item.Id;

        const itemNameCell = newRow.insertCell();
        itemNameCell.textContent = item.Display_Name__c;

        const checkboxCell = newRow.insertCell();
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('defaultCheckBox');
        checkboxCell.appendChild(checkbox);

        // Add event listener to check box
        checkbox.addEventListener('change', (e) => handleCheckBoxInput(e, item.Id))

        const imageUploadCell = newRow.insertCell();

        const imageUploadContainer = document.createElement('div');
        imageUploadContainer.classList.add('image-upload_NoInput', 'form-group', 'm-0');

        const cameraLabel = document.createElement('label');
        cameraLabel.setAttribute('for', item.Id);
        const cameraIcon = document.createElement('i');
        cameraIcon.classList.add('fa', 'fa-camera', item.Id);
        cameraLabel.appendChild(cameraIcon);

        const fileInput = document.createElement('input');
        fileInput.setAttribute('onchange', 'fileInput(this)');
        fileInput.setAttribute('capture', 'camera');
        fileInput.setAttribute('accept', 'image/*');
        fileInput.type = 'file';
        fileInput.style.display = 'none';

        // Add event listener to camera icon
        cameraIcon.addEventListener('click', () => {
            fileInput.click(); // Trigger the file input click event when camera icon is clicked
        });

        imageUploadContainer.appendChild(cameraLabel);
        imageUploadContainer.appendChild(fileInput);
        imageUploadCell.appendChild(imageUploadContainer);
    });

    //console.log("Item Table===>",itemTable)

    addOptionsToSelect(selectItemAsset, searchItems)

    calculateTotalAssetQuantity()
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

const handleAssetSearch = (e) => {

    console.log("Select Item===>", selectItemAsset)
    console.log("New Search===>", newSearch)

    selectItemAsset.innerHTML = '';
    selectItemAsset.disabled = true;
    assetSearch.style.display = 'none';

    console.log("Select Item after diabling===>", selectItemAsset)
    console.log("New Search after diabsling===>", newSearch)


    let data = e.params.data;
    console.log("Data====>", data);
    quantityInput.focus()

    let selectedItem = searchItems.find((item)=>item.Id ==data.id)

    selectedItem['quantity'] = 0

    assetAddedItems.push(selectedItem)


    $('#selectItem').val(null).trigger('change');

    // Hide all options in the selectSearch dropdown
    $('#selectItem').find('option').hide();

    // Show the default placeholder option
    $('#selectItem').find('option[value="0"]').show();

    // Reset the selected value to the placeholder option
    selectItemAsset.value = '0';

    // Refresh the select2 dropdown to reflect the changes
    $(selectItemAsset).trigger('change');

    updateTable()

}

$(function () {
    $("#selectSearch1").select2();
});

$('#selectSearch1').on('select2:select', (e) => handleAssetSearch(e));

function updateTable() {

    // Clear the existing table rows
    assetsTable.innerHTML = '';

    assetAddedItems.forEach(item => {
        const newRow = assetsTable.insertRow();
        newRow.dataset.id = item.Id;

        const itemNameCell = newRow.insertCell();
        itemNameCell.textContent = item.Display_Name__c;

        const checkboxCell = newRow.insertCell();
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('defaultCheckBox');
        checkboxCell.appendChild(checkbox);

        // Add event listener to check box
        checkbox.addEventListener('change', (e) => handleCheckBoxInput(e, item.Id))

        const imageUploadCell = newRow.insertCell();

        const imageUploadContainer = document.createElement('div');
        imageUploadContainer.classList.add('image-upload_NoInput', 'form-group', 'm-0');

        const cameraLabel = document.createElement('label');
        cameraLabel.setAttribute('for', item.Id);
        const cameraIcon = document.createElement('i');
        cameraIcon.classList.add('fa', 'fa-camera', item.Id);
        cameraLabel.appendChild(cameraIcon);

        const fileInput = document.createElement('input');
        fileInput.setAttribute('onchange', 'fileInput(this)');
        fileInput.setAttribute('capture', 'camera');
        fileInput.setAttribute('accept', 'image/*');
        fileInput.type = 'file';
        fileInput.style.display = 'none';

        // Add event listener to camera icon
        cameraIcon.addEventListener('click', () => {
            fileInput.click(); // Trigger the file input click event when camera icon is clicked
        });

        imageUploadContainer.appendChild(cameraLabel);
        imageUploadContainer.appendChild(fileInput);
        imageUploadCell.appendChild(imageUploadContainer);
    });



    console.log("Default Items===>", assetAddedItems)

    // Clear the dropdown and hide it
    selectItemAsset.innerHTML = '';
    selectItemAsset.style.display = 'none';
    assetSearch.style.display = 'none';

    calculateTotalAssetQuantity()

}


function updateItems(prodId, checkBoxValue) {
    assetAddedItems.forEach(item => {
        if (item.Id === prodId) {
            item.checkBox = checkBoxValue
        }
    });
    console.log("default Items after updating quantity", assetAddedItems);
}

function handleCheckBoxInput(e, prodId) {
    const checkBoxInput = document.querySelector(`tr[data-id="${prodId}"] input`);
    const checkBoxValue = e.target.checked

    updateItems(prodId, checkBoxValue)

}

const createNewAssetRow = () => {
    // Destroy the old newSearch
    const existingAssetSearch = document.getElementById('assetSearch');
    if (existingAssetSearch) {
        existingAssetSearch.remove();
    }

    // Generate unique IDs for the new elements
    const uniqueId = Date.now();
    const clonedSelectSearchId = 'selectSearch1' + uniqueId;
    const clonedCheckBoxId = 'checkBox' + uniqueId;
    const cameraId = 'cameraSearch' + uniqueId;

    const optionsString = searchItems.map((eachItem) => `<option value="${eachItem.Id}">${eachItem.Display_Name__c}</option>`)

    // Create the newSearch HTML string with dynamic IDs
    const newSearchHTML = `
    <tr id="assetSearch">
    <td class="wd-80">
      <select name="selectSearch" id="${clonedSelectSearchId}" class="form-control wd-50">
        <option value='0' selected='true'> Search POSM</option>
        ${optionsString.join('')}
      </select>
    </td>
    <td><input type="checkbox" id="${clonedCheckBoxId}" class="defaultCheckBox"></td>
    <td style="vertical-align: middle;">
        <div class="image-upload_NoInput form-group" style="margin:0">
            <div class="camera">
                <label>
                    <i class="fa fa-camera 1"aria-hidden="true"></i>                                    
                </label>
                <input id="${cameraId}" onchange="fileInput(this)" capture="camera" accept="image/*" type="file"/>
            </div>
        </div>
    </td>
</tr>`

    //addOptionsToSelect(newSearchHTML.getElementById(clonedSelectSearchId),items)

    // Append the newSearch HTML string to the itemTable
    assetsTable.insertAdjacentHTML('beforeend', newSearchHTML);

    // Apply Select2 to the cloned select element
    $("#" + clonedSelectSearchId).select2();

    // Add the event listener for the cloned select element
    $('#' + clonedSelectSearchId).on('select2:select', (e) => handleAssetSearch(e));
};


addAssetButton.addEventListener('click', () => createNewAssetRow())

async function fileInput(event) {

    console.log("Camera Event ====>", event.parentNode.querySelector('label').getAttribute('for'))

    const key = event.parentNode.querySelector('label').getAttribute('for');
    console.log("Key====>", key)
    const fileInput = event.files[0];
    var options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    };
    const compressedFile = await imageCompression(fileInput, options);
    console.log("Compressed File====>", compressedFile)
    uploadBase64Value(key, compressedFile);

}

const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

async function uploadBase64Value(key, fileInput) {

    const base64Image = await toBase64(fileInput);

    assetAddedItems.forEach(item => {
        if (item.Id == key) {
            item.image = base64Image
        }
    });
    console.log("default Items after updating quantity", assetAddedItems);

    fileAttachedBackgroundChange(key);

};

const fileAttachedBackgroundChange = (key) => {
    let iconKey = key;

    //    let icon = document.querySelector(`#${iconKey}`);
    let icon = $('.' + iconKey);

    icon.css('color', '#5cb85c');
};

// Function to calculate the total quantity of defaultItems
function calculateTotalAssetQuantity() {
    const totalElement = document.getElementById('assetTotal').querySelector('span');
    const totalQuantity = assetAddedItems.length
    totalElement.textContent = totalQuantity.toString();
}

function posmSubmit(){

    let accountId = localStorage.getItem('accountId')
    let eventId = localStorage.get('eventId')

    bodyToBeSent.accountId = accountId
    bodyToBeSent.eventId = eventId
    bodyToBeSent.POSM_Requisiton__c = {}
    bodyToBeSent.POSM_Line_Item__c = []
    bodyToBeSent.images = []

    let tempObject = {
        Outlet__c : accountId,
        Event_Custom__c: eventId,
        Event_Id__c: eventId,
        Requisition_Date__c : new Date()
    }
    bodyToBeSent.POSM_Requisiton__c = tempObject

    //Check the length of the default Items and as well as the asset items
    if(defaultItems.length >0){

        defaultItems.forEach((eachPOSItem)=>{
            let tempLineItem = {
                Account__c : accountId,
                App_Id__c:fetchCurrentDateIdStr() + '-' + accountId,
                Name: eachPOSItem.Name,
                Product__c:eachPOSItem.Id
            }
            bodyToBeSent.POSM_Line_Item__c.push(tempLineItem)

        })
              

    }
    
    //Prepare Assets and aler box if image is missing for Space available check box
    if(assetAddedItems.length >0){

        let improperValues = assetAddedItems.some(
            (eachItem)=>
               eachItem.checkBox && !eachItem.image
        )

        if(improperValues) {
            alert("Some of the assets have no images, please add them")
            return
        }

        assetAddedItems.forEach((eachPOSItem)=>{

            let tempLineItem = {
                Account__c : accountId,
                App_Id__c:fetchCurrentDateIdStr() + '-' + accountId,
                Name: eachPOSItem.Name,
                Product__c:eachPOSItem.Id,
                Space_Available__c:eachPOSItem.checkBox
            }
            bodyToBeSent.POSM_Line_Item__c.push(tempLineItem)
            if(eachPOSItem.image){
                bodyToBeSent.images.push(eachPOSItem.image)
            }

        })
    }
    $('#endVisit').modal('show');

}

async function apiToPostData(){
    try{

        let loginData =await loginDataFetch();

        let res = await fetch('/posmItems',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                username : username,
                password : password,
                data:bodyToBeSent
            })
        });
    
        let resJson = await res.json();
        if(resJson.isError){
            console.log(resJson.isError);
            // Add Notification method here
            return false
        }else{
            return true
        }

    }catch(e){
        console.log(e)
    }
}

async function handleEndDayHandler(){

        let apiResponse = await apiToPostData()

        if(apiResponse){
            window.location.href = '/view/homePage/homePage.html'
        }else{
            alert("Something went wrong in posting the data")
        }
}

populateTableWithDefaultItems()