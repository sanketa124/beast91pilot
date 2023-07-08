let stockOutlet = {};
let retailDepletionData = []
let stockOutletExistingData = []
const initializeStockVisibility = async () => {
    // let urlParams = new URLSearchParams(window.location.search);
    // const accountId = urlParams.get('accountId');
    const accountId = localStorage.getItem('accountId')
    const key = `${fetchCurrentDateIdStr()}-${accountId}`;
    stockOutlet = await getItemFromStore('stockVisibility', key);
    accountRec = await getItemFromStore('account', accountId);
    if (!accountRec) {
        accountRec = await getItemFromStore('lead', accountId);
    }
    await getSearchableProducts();
    if (!stockOutlet) {
        let defaultAddedProduct = new Set();
        let recordTypeName = '';
        if (((accountRec.RecordType.DeveloperName).toLowerCase()).indexOf('on') > -1) {
            recordTypeName = 'On_Premise';
        }
        else if ((accountRec.RecordType.DeveloperName).toLowerCase().indexOf('off') > -1) {
            recordTypeName = 'Off_Premise_Retail_Account';
        }
        else {
            recordTypeName = 'Others';
        }
        stockOutlet = {
            stockVisibilityChilds: [],
            accountId: accountId,
            recordTypeName: recordTypeName,
            App_Id: key,
            Created_Date: new Date()
        };
        retailDepletionData = accountRec.Retail_Depletion1__r.records;
        if (accountRec.Retail_Depletion1__r) {
            let retailDepletionArr = accountRec.Retail_Depletion1__r.records;
            retailDepletionArr = retailDepletionArr.filter(ele => {
                return ele.Last_90_Days__c;
            });

            var unique = {};
            var result = [];

            for (var i = 0; i < retailDepletionArr.length; i++) {
                var item = retailDepletionArr[i];
                var value = item['Item__c'];

                if (!unique[value]) {
                    result.push(item);
                    unique[value] = true;
                }
            }
            retailDepletionArr = result;
            retailDepletionArr.forEach(ele => {
                if ((itemValueMap.has(ele.Item__c) && !defaultAddedProduct.has(ele.Item__c))) {
                    defaultAddedProduct.add(ele.Item__c);
                }
            });
            retailDepletionData = retailDepletionArr;
        }
    } else {
        stockOutletExistingData = stockOutlet.stockVisibilityChilds;
    }

    getStockOutletList();
    //  showAccount();
};

const getSearchableProducts = async () => {
    let items = await readAllData('itemMaster');
    console.log('items', items)
    items = items.filter(ele => {
        return (ele.State__r && accountRec && accountRec.BillingState && ele.State__r.Name === accountRec.BillingState && ele.Product__r.IsActive);
    });
    searchableProducts(items);
};

const saveStockOutlet = async () => {
    console.log('addedProds', addedProducts)

    //  if(!stockOutlet){
    stockOutlet.isSynced = false;
    stockOutlet.Event_Id = fetchCurrentDateIdStr() + '-' + accountRec.Id;
    stockOutlet.Daily_Tracker = fetchCurrentDateIdStr();
    stockOutlet.Last_Modified = new Date();
    const position = await getCurrentLocationHelper();
    stockOutlet.Geolocation_Latitude = position.coords.latitude;
    stockOutlet.Geolocation_Longitude = position.coords.longitude;
    //  }
    stockOutlet.stockVisibilityChilds = addedProducts;
    await writeData('stockVisibility', stockOutlet);
    window.location.href = `stockatRisk.html?accountId=${accountRec.Id}`;
};
initializeStockVisibility();