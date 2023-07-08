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
    const selectElement = document.querySelector('#feedback-options');
    const options = await readAllData('recommendation-feedback-meta') || [];
    options.forEach((item) => {
      const samplingOption = document.createElement('option');
      samplingOption.value = item.option;
      samplingOption.text = item.option;
      selectElement.appendChild(samplingOption);
    });

    selectElement.value=recommendation?.Recommendation_Feedback__c||options?.[0] ||"" 
    selectElement.addEventListener('change',async(event) => {
        const selectedValue = event.target.value;
        await writeData('recommendations',{...recommendation,Recommendation_Feedback__c:selectedValue});
      });

    if(!recommendation){
        window.location.href='/view/dashboard/todaysVisits/todaysVisits.html'
    }
})();


$('#feedback').hide()
$('#placeOrderModal').modal('show');
submit = async() => {
    $('#placeOrderModal').modal('hide');

    const date= new Date();
    const recommendation= await getItemFromStore('recommendations',recommendationId)
    const acceptedReccomendation= {...recommendation,Is_Accepted__c:true,Accepted_Date__c: date}

    /** Moving Accepted Recommendations to a new schema that can then be used by the Sales order */
    await writeData('accepted_recommendations',acceptedReccomendation)
    await writeData('recommendations',{...recommendation,Is_Accepted__c:true,Accepted_Date__c: date});
    let urlParams = new URLSearchParams(window.location.search);
    const accountId2 = urlParams.get('accountId');
    localStorage.removeItem("recommendationId");
    window.location.href = `recomendation.html?accountId=${accountId2}`
}
cancel = () => {
    $('#placeOrderModal').modal('hide');
    $('#feedback').show()
}

finish=async()=>{
    const recommendation= await getItemFromStore('recommendations',recommendationId)
    await writeData('accepted_recommendations',recommendation)
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/sales/recomendation.html?acountId=${accountId}`
}
