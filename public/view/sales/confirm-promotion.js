//TODO: remove hardcoded values
// let accountId=localStorage.getItem('accountId') || '001Bi000007JSMPIA4'
// let eventId=localStorage.getItem('eventId') ||'a0KBi000003NchCMAS'
let accountId=localStorage.getItem('accountId') 
let eventId=localStorage.getItem('eventId') 
const promotionId= localStorage.getItem('promotionId')
if(!(accountId && eventId && promotionId )){
window.location.href='/view/dashboard/todaysVisits/todaysVisits.html'
}

$('#feedback').hide()
$('#placeOrderModal').modal('show');
submit = async() => {
    $('#placeOrderModal').modal('hide')
     /** Marking a recommendation as accepted so that it won't be visible again*/
     const date= new Date();
     const promotion= await getItemFromStore('recommendations',promotionId)
     const {Recommended_SKU__r,Outlet_Name__r,attributes,...rest }=promotion
     const acceptedPromotion= {...rest,Is_Accepted__c:true,Accepted_Date__c: date,Interested__c:true}

     /** Moving Applied promotions to a new schema that can then be used by the Sales order */
     await writeData('activated_promotions',acceptedPromotion)
     await writeData('recommendations',{...promotion,Is_Accepted__c:true,Accepted_Date__c: date});
     localStorage.removeItem("promotionId");
     window.location.href = `recomendation.html?accountId=${accountId}`
}
cancel = () => {
    window.location.href = `recomendation.html?accountId=${accountId}`
}

