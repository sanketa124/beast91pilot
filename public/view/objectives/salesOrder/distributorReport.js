const inventoryTable = document.getElementById('inventoryTable');
// Assuming you have an array called marketInventory
const marketInventory = [
    { date: '10-11-2023', item: 'Item number 1', quantity: 1 },
    // Add more objects representing inventory items here
];

const prepareTable = async () => {

    console.log("I am called to prepare table")

    const accountId = localStorage.getItem('accountId')
    let accountRec = await getItemFromStore('account', accountId);
    console.log("Account Record",accountRec.Distributor_Warehouse__c)
    let inventories = await readAllData('marketInventory');
    let itemMaster = await readAllData('itemMasterCopy')

    console.log("Inventories===>",inventories)

    let accountInventories = inventories.filter(eachInventory=>eachInventory.Distributor_Key__c== accountRec.Distributor_Warehouse__c)

    console.log("Account Inventories",accountInventories)

    // Iterate over the marketInventory array and create table rows
    accountInventories.forEach(item => {
        console.log(item.Item_Key__c)
        // Create a new table row
        const row = document.createElement('tr');

        let itemName =  null;

        itemMaster.forEach((actualItem) => {
            if(actualItem.Id == item.Item_Key__c){
                console.log("Actual Item isss",actualItem)
                itemName = actualItem.Display_Name__c
            }
        })

        // Create and append table cells for each data element
        const dateCell = createTableCell(item.Inventory_Date__c, 6);
        const itemCell = createTableCell(itemName, 6);
        const quantityCell = createTableCell(item.Closing_Stock__c, 6);

        row.appendChild(dateCell);
        row.appendChild(itemCell);
        row.appendChild(quantityCell);

        // Append the row to the table body
        inventoryTable.appendChild(row);
    });


}



// Function to create a table cell with specified content and colspan
function createTableCell(content, colspan) {
    const cell = document.createElement('td');
    cell.textContent = content;
    //cell.setAttribute('colspan', colspan);
    cell.setAttribute('class', 'wd-20');
    return cell;
}

prepareTable()
