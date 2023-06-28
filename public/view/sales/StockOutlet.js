$(function () {
    $("#selectSearch").select2();
  });
  

  let itemValueMap = new Map();
let productSelectedTotal = new Set();

  searchableProducts = (itemList) => {
    itemsBackend = itemList;
    itemsBackend.forEach(ele => {
      itemValueMap.set(ele.Product__c, ele);
    });
    console.log('itemList', itemList);
    
  
  
  };
  
let stockOutletList = [];
getStockOutletList = () => {

  for (var i = 0; i < retailDepletionData.length; i++) {
    $("#stckOutletTbl tbody").prepend(' <tr>\
    <td>'+retailDepletionData[i].Item__r.Display_Name__c+'</td>\
    <td><input type="number" class="form-control" min="0" value="0"></td>\
    </tr>')
    //console.log(retailDepletionData[i].Item__r.Display_Name__c)
  }
}

addProduct = () =>{
  $("#stckOutletTbl tbody").append(
    '<tr class="newEntry">\
    <td class="wd-80"><input class="wd-50" type="text" placeholder="search" /></td>\
    <td class="wd-20"><input class="wd-50" type="number" min="0" value="0"/>  <i class="fa fas fa-exclamation"></i></td>\
    </tr>')
}

function localSearch(array, searchKey, searchValue) {
  for (var key in array) {
    if (typeof array[key] === 'object') {
      var result = localSearch(array[key], searchKey, searchValue);
      if (result) {
        return result;
      }
    } else if (key === searchKey && array[key] === searchValue) {
      return array;
    }
  }

  return null;
}

// Example usage:
var data = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 },
  { name: 'Bob', age: 35 },
  { name: 'Alice', age: 25 }
];

var result = localSearch(data, 'name', 'Bob');
console.log(result); // { name: 'Bob', age: 35 }
