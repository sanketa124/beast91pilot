
let accountId=localStorage.getItem('accountId') 
let eventId=localStorage.getItem('eventId')
const recommendationId= localStorage.getItem('promotionId') || localStorage.getItem('recommendationId')
if(!(accountId && eventId && recommendationId)){
  window.location.href='/view/dashboard/todaysVisits/todaysVisits.html'
}

(async()=>{
    try{

       /** Fetch Channel and New/Existing details from Outlet */
       const recommendation=await getItemFromStore(`recommendations`,recommendationId);
        if(!recommendation){
         window.location.href='/view/dashboard/todaysVisits/todaysVisits.html'
       }

       if(recommendation?.Promotion_Name__c){
        const sellSheetUrl=await fetchSellSheets('boom');
        if(sellSheetUrl){
            $("#sell-sheet").attr("src",sellSheetUrl);
        }
       }
       else{
        const liquidName= recommendation?.Variant_Name__c
        if(!liquidName){
         window.location.href='/view/dashboard/todaysVisits/todaysVisits.html'
        }
 
         const sellSheetUrl=await fetchSellSheets('boom');
         if(sellSheetUrl){
          
            // const sellSheetImg = document.getElementById('sell-sheet');
             //sellSheetImg.src =sellSheetUrl
             console.log(sellSheetUrl, 'sellSheetImg');
             $("#sell-sheet").attr("src",sellSheetUrl);
         }
         
        
         const channel=recommendation?.Outlet_Name__r?.Channel__c
         const newOrExistingStore= recommendation?.New_or_Existing__c
         console.log('New Or Exiting',newOrExistingStore)
         if(channel==='On-Premise' && newOrExistingStore==='New'){
         /*** Create Sample Parent only for New Outlet with On-Premise Channel */
         const UNSYNCED_SAMPLE_SCHEMA="Unsynced_Sample"
         const sampleTag=`sample-${accountId}-${eventId}`;
         const sample=await getItemFromStore(`${UNSYNCED_SAMPLE_SCHEMA}`,sampleTag)
         if(!sample){
             const payload={
                 sampleTag,
                 "Event_Custom__c": `${eventId}`,
                 "Account__c": `${accountId}`,
                 Interested__c: false,
                 Sampling_Done__c: false,
                 children:[]
               }
               await writeData(`${UNSYNCED_SAMPLE_SCHEMA}`, payload);
         }
         }
       }
        
    }catch(err){
        console.log(err)
    }
})();


goBack = () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  window.location.href = `/view/sales/recomendation.html?accountId=${accountId}`
}

goForward =async () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');

/*** Navigate to Sample and Tasting only if the recommendation is for a new outlet and the outlet channel is "On-Premise" */
const recommendation=await getItemFromStore(`recommendations`,recommendationId);
if(!recommendation){
  window.location.href=`/view/dashboard/todaysVisits/todaysVisits.html`
}
const channel=recommendation?.Outlet_Name__r?.Channel__c
const newOrExistingStore= recommendation?.New_or_Existing__c
/** Handle Promotions */
if(recommendation?.Promotion_Name__c){
  window.location.href = `confirm-promotion.html?accountId=${accountId}`
}
else{
    /** Handle SKU Recommendations */
if(channel==='On-Premise' && newOrExistingStore==='New' ){
  window.location.href = `/view/sales/sampleTasting.html?accountId=${accountId}`
}
else{
    window.location.href=`/view/sales/placeOrder.html?accountId=${accountId}`
  }
}


}