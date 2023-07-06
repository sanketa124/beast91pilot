const slabsTable = document.getElementById('individualSlabs')


async function createSlabRows() {

    const group_id = "0129B0000004L9xQAE"

    let payOutSlabs = await readAllData('payOutSlabs');
    let accountId = localStorage.getItem('accountId');
    let accountDetail = await getItemFromStore('account', accountId);
    let currentDate = new Date()
    let currentMonth = currentDate.getMonth()
    let currentYear = currentDate.getFullYear()

    let requiredPayOutSlabs = []

    //Off-PREM and Group will not have Industry_Segment__c
    if (accountDetail.Channel__c == "Off-Premise" && accountDetail.RecordTypeId == group_id) {
        console.log("I am inside offline group premise")
        requiredPayOutSlabs = payOutSlabs.filter((eachPayOutSlab) => {
            if (
                eachPayOutSlab.Channel__c == accountDetail.Channel__c
            ) {
                if (eachPayOutSlab.Valid_Till__c && eachPayOutSlab.Valid_From__c <= currentDate
                    && eachPayOutSlab.Valid_Till__c >= currentDate
                ) {
                    return eachPayOutSlab
                } else if (!eachPayOutSlab.Valid_Till__c && eachPayOutSlab.Valid_From__c <= currentDate) {
                    return eachPayOutSlab
                }

            }
        })
    } else {
        requiredPayOutSlabs = payOutSlabs.filter((eachPayOutSlab) => {
            if (
                eachPayOutSlab.Channel__c == accountDetail.Channel__c
                &&
                eachPayOutSlab.Industry_Segment__c
                &&
                eachPayOutSlab.Industry_Segment__c.split(";").includes(accountDetail.Industry_Segment__c)
            ) {
                if (eachPayOutSlab.Valid_Till__c && new Date(eachPayOutSlab.Valid_From__c) <= currentDate
                    && new Date(eachPayOutSlab.Valid_Till__c >= currentDate)
                ) {
                    return eachPayOutSlab
                } else if (!eachPayOutSlab.Valid_Till__c && new Date(eachPayOutSlab.Valid_From__c) <= currentDate) {
                    return eachPayOutSlab
                }

            }
        })
    }

    if (requiredPayOutSlabs.length == 0) {
        const getSlabElement = document.getElementById('individualSlabs')
        getSlabElement.remove()
        const getKegsElement = document.getElementById('kegsTable')
        getKegsElement.remove()
        return
    }

    console.log("Required Pay Out Slabs====>", requiredPayOutSlabs)

    //Get the retail depletion rate of requiredLineItems
    let currentMonthDepletionRates = []
    accountDetail.Retail_Depletion1__r.records.forEach((eachDepletedRecord) => {
        if (
            eachDepletedRecord.Item__c
            &&
            eachDepletedRecord.Date__c
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

    // Reduce the array to calculate sum of quantity for all items
    const totalQuantity = currentMonthDepletionRates.reduce((sum, obj) => {
        return sum + obj.quantity;
    }, 0);

    //Innovation__c slabs
    const filterInnnovationSlabs = requiredPayOutSlabs.filter((slab) => slab.Innovation__c)

    //Innovation_Kegs__c
    const filterKegsSlabs = requiredPayOutSlabs.filter((slab) => slab.Innovation_Kegs__c)

    console.log("Kegs Slabs===>",filterKegsSlabs)

    //Sort the items
    filterInnnovationSlabs.sort((a, b) => a.Min_Range__c - b.Min_Range__c)
    filterKegsSlabs.sort((a, b) => a.Min_Range__c - b.Min_Range__c)


    // Destroy the old newSearch
    const existingAssetSearch = document.getElementById('individualSlabs');
    const kegsTable = document.getElementById('kegsTable')
    const slabsDiv = document.getElementById('slabsDiv')
    const kegsDiv = document.getElementById('kegsDiv')
    if (existingAssetSearch) {
        existingAssetSearch.remove();
        kegsTable.remove();
    }

    // Generate unique IDs for the new elements
    const uniqueId = Date.now();
    let slabsArray = [];
    let kegsArray = [];

    for (let i = 0; i < filterInnnovationSlabs.length; i++) {

        console.log("Minimum Range===>", filterInnnovationSlabs[i].Min_Range__c)
        console.log("Maximum Range=====>", filterInnnovationSlabs[i].Max_Range__c)

        let tempString;

        if (filterInnnovationSlabs[i].Min_Range__c <= totalQuantity &&
            filterInnnovationSlabs[i].Max_Range__c &&
            filterInnnovationSlabs[i].Max_Range__c >= totalQuantity
        ) {
            tempString = `
                <tr class="activeTr" id=${uniqueId - [i]}>
                <td>${filterInnnovationSlabs[i].Min_Range__c}-${filterInnnovationSlabs[i].Max_Range__c}</td>
                <td>${filterInnnovationSlabs[i].Mass__c}</td>
                <td>${filterInnnovationSlabs[i].Premium__c}</td>
                <td>${filterInnnovationSlabs[i].Innovation__c}</td>
            </tr>
                `

        } else if (filterInnnovationSlabs[i].Min_Range__c <= totalQuantity &&
            !filterInnnovationSlabs[i].Max_Range__c) {

            tempString = `
                    <tr class="activeTr" id=${uniqueId - [i]}>
                    <td>>${filterInnnovationSlabs[i].Min_Range__c}</td>
                    <td>${filterInnnovationSlabs[i].Mass__c}</td>
                    <td>${filterInnnovationSlabs[i].Premium__c}</td>
                    <td>${filterInnnovationSlabs[i].Innovation__c}</td>
                </tr>
                    `


        } else {
            if(filterInnnovationSlabs[i].Max_Range__c){
                tempString = `
                <tr id=${uniqueId - [i]}>
                <td>${filterInnnovationSlabs[i].Min_Range__c}-${filterInnnovationSlabs[i].Max_Range__c}</td>
                <td>${filterInnnovationSlabs[i].Mass__c}</td>
                <td>${filterInnnovationSlabs[i].Premium__c}</td>
                <td>${filterInnnovationSlabs[i].Innovation__c}</td>
            </tr>
                `

            }else{
                tempString = `
                <tr id=${uniqueId - [i]}>
                <td>>${filterInnnovationSlabs[i].Min_Range__c-1}</td>
                <td>${filterInnnovationSlabs[i].Mass__c}</td>
                <td>${filterInnnovationSlabs[i].Premium__c}</td>
                <td>${filterInnnovationSlabs[i].Innovation__c}</td>
            </tr>
                `
            }
        }

        slabsArray.push(tempString)
    }

    //const optionsString = searchItems.map((eachItem) => `<option value="${eachItem.Id}">${eachItem.Display_Name__c}</option>`)

    // Create the newSearch HTML string with dynamic IDs
    const newSearchHTML = `
    <div class="table-responsive">
    <table class="table table-bordered" id="individualSlabs">
    <thead>
        <tr>
            <th scope="col">Volume</th>
            <th scope="col">Mass</th>
            <th scope="col">Premium</th>
            <th scope="col">Innovation</th>
        </tr>
    </thead>
        <tbody id="payOutSlabsIndividual">
        ${slabsArray.join('')}
    </tbody>
    </table>
    </div>
    `

    // Append the newSearch HTML string to the itemTable
    slabsDiv.innerHTML += newSearchHTML;
    if (filterKegsSlabs.length > 0) {

        for (let i = 0; i < filterKegsSlabs.length; i++) {


            let tempString;

            if (filterKegsSlabs[i].Min_Range__c <= totalQuantity &&
                filterKegsSlabs[i].Max_Range__c &&
                filterKegsSlabs[i].Max_Range__c >= totalQuantity
            ) {
                tempString = `
                    <tr class="activeTr" id=${uniqueId - [i]}>
                    <td>${filterKegsSlabs[i].Min_Range__c}-${filterKegsSlabs[i].Max_Range__c}</td>
                    <td>${filterKegsSlabs[i].Premium_Kegs__c}</td>
                    <td>${filterKegsSlabs[i].Innovation_Kegs__c}</td>
                </tr>
                    `

            } else if (filterKegsSlabs[i].Min_Range__c <= totalQuantity &&
                !filterKegsSlabs[i].Max_Range__c) {

                tempString = `
                        <tr class="activeTr" id=${uniqueId - [i]}>
                        <td>>${filterKegsSlabs[i].Min_Range__c-1}</td>
                        <td>${filterKegsSlabs[i].Premium_Kegs__c}</td>
                        <td>${filterKegsSlabs[i].Innovation_Kegs__c}</td>
                    </tr>
                        `
            } else {

                tempString = `
                        <tr id=${uniqueId - [i]}>
                        <td>${filterKegsSlabs[i].Min_Range__c}-${filterKegsSlabs[i].Max_Range__c}</td>
                        <td>${filterKegsSlabs[i].Premium_Kegs__c}</td>
                        <td>${filterKegsSlabs[i].Innovation_Kegs__c}</td>
                    </tr>
                        `

            }

            kegsArray.push(tempString)
        }

        // Create the newSearch HTML string with dynamic IDs
        const newSearchHTML1 = `
        <div class="table-responsive">
                <table class="table table-bordered " id="kegsTable">
                <thead>
                <tr>
                    <th scope="col">Volume</th>
                    <th scope="col">Premium Kegs</th>
                    <th scope="col">Innovation Kegs</th>
                </tr>
            </thead>
                <tbody id="">
                ${kegsArray.join('')}
            </tbody>
            </table>
            </div>
            `
        kegsDiv.innerHTML += newSearchHTML1;


    }
}

createSlabRows()

