//TODO: remove hardcoded values
// let accountId=localStorage.getItem('accountId') || '001Bi000007JSMPIA4'
// let eventId=localStorage.getItem('eventId') ||'a0KBi000003NchCMAS'

let accountId=localStorage.getItem('accountId') 
let eventId=localStorage.getItem('eventId')
const recommendationId= localStorage.getItem('recommendationId')
if(!(accountId && eventId && recommendationId )){
window.location.href='/view/dashboard/todaysVisits/todaysVisits.html'
}
/**Go back vists page in the event that Recommendation has been previously accepted */
(async()=>{
    const recommendation= await getItemFromStore('recommendations',recommendationId)
    if(!recommendation){
        window.location.href='/view/dashboard/todaysVisits/todaysVisits.html'
    }
})();


$('#feedback').hide()
$('#placeOrderModal').modal('show');
submit = async() => {
    $('#placeOrderModal').modal('hide');
    // let urlParams = new URLSearchParams(window.location.search);
    // const accountId = urlParams.get('accountId');
    
    // $('#placeOrderModal').modal('hide');
    // window.location.href = `/view/sales/recomendation.html?accountId=${accountId}`

    /** Marking a recommendation as accepted so that it won't be visible again*/
    const date= new Date();
    const recommendation= await getItemFromStore('recommendations',recommendationId)
    const {Recommended_SKU__r,Outlet_Name__r,attributes,...rest }=recommendation
    const acceptedReccomendation= {...rest,Is_Accepted__c:true,Accepted_Date__c: date}
    console.log('accepted recommendation object',acceptedReccomendation)

    /** Moving Accepted Recommendations to a new schema that can then be used by the Sales order */
    await writeData('accepted_recommendations',acceptedReccomendation)
    await writeData('recommendations',{...recommendation,Is_Accepted__c:true,Accepted_Date__c: date});
    localStorage.removeItem("recommendationId");
    window.location.href = 'recomendation.html'
}
cancel = () => {
    $('#placeOrderModal').modal('hide');
    $('#feedback').show()
}

