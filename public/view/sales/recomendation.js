// let accountId=localStorage.getItem('accountId') || '001Bi000007JSMPIA4'
// let eventId=localStorage.getItem('eventId') ||'a0KBi000003NchCMAS'

let accountId=localStorage.getItem('accountId') 
let eventId=localStorage.getItem('eventId')
if(!(accountId && eventId )){
  window.location.href='/view/dashboard/todaysVisits/todaysVisits.html'
}

// gotoDetail = (recommendationId) => {
//   console.log('clicking recommendationId',recommendationId)
//     localStorage.setItem('recommendationId',recommendationId)
//     window.location.href = `productDetail.html`
// }

goToPromotion=(promotionId)=>{
  console.log('promotionId',promotionId)
  localStorage.setItem('promotionId',promotionId)
  window.location.href = `confirm-promotion.html`
}


const newOutletRecommendations = (recommendationData) => {
    let title = '<div class="linkSec"><a href="">NEW OUTLET ACTIVATION</a></div>';
    let html=''
    recommendationData.forEach((recommendation) => {
    const {Recommended_SKU__r,Outlet_Name__r}=recommendation
    html += `
        <div class="linkSec">
          <div class="row"${`onClick=gotoDetail(${JSON.stringify(recommendation?.Id)})`}>
            <div class="col-xs-9">
              <div class="boxLink">
              <h4>${Recommended_SKU__r.Display_Name__c }</h4>
              <p>${recommendation.Pitch__c}</p>
              </div>
            </div>
            <div class="col-xs-3">
            ${Outlet_Name__r.Channel__c==='On-Premise'?`<i class="fa fa-external-link"></i>`:``}
            </div>
          </div>
        </div>
      `;
    });
  return title+html
  };
const existingRecommendations=(recommendationData)=>{

    let title = '<div class="linkSec"><a href="">NEW PRODUCT RECOMMENDATION</a></div>';
    let html=''
    recommendationData.forEach((recommendation) => {
      const {Recommended_SKU__r,Outlet_Name__r}=recommendation
      html += `
        <div class="linkSec">
        <div class="row"${`onClick=gotoDetail(${JSON.stringify(recommendation?.Id)})`}>
            <div class="col-xs-9">
              <div class="boxLink">
                <h4>${Recommended_SKU__r.Display_Name__c }</h4>
                <p>${recommendation.Pitch__c}</p>
              </div>
            </div>
            <div class="col-xs-3">
            ${Outlet_Name__r.Channel__c==='On-Premise'?`<i class="fa fa-external-link"></i>`:``}
            </div>
          </div>
        </div>
      `;
    });
  return title+html
}
const displayPromotions=(promotionData)=>{
  
  let title = '<div class="linkSec"><a href="">PROMOTIONS</a></div>';
  let html=''
  promotionData.forEach((promotion) => {
    if(promotion.Promotion_Name__c && promotion.Promotion_Name_With_Scheme__c ){
      html += `
      <div class="linkSec">
        <div class="row" ${`onClick=goToPromotion(${JSON.stringify(promotion?.Id)})`}>
          <div class="col-xs-9">
            <div class="boxLink">
              <h4>${promotion.Promotion_Name__c}</h4>
              <p>${promotion.Promotion_Name__c}</p>
            </div>
          </div>
          <div class="col-xs-3">
          ${promotion.Channel__c==='On-Premise'?`<i class="fa fa-external-link"></i>`:``}
          </div>
        </div>
      </div>
    `;
    }
  
  });
return title+html
}

const initializeRecommendations=async()=>{

try{
  const columnConditions={
    'Active__c': true
  }

  //TODO: replace the existing call with two seperate calls to filter out data ( new outlet and product recommendations )
  const newOutletRecommendation = [];
  const existingProducts = [];
  const promotions = [];
  const result = (await filterDbData('recommendations', columnConditions)) || [];
  result.map((recommendation) => {
    const {Recommended_SKU__r,Outlet_Name__r}=recommendation
    const skuRecommendationCondition=Recommended_SKU__r?.Size_ID__r?.Volume_Unit__c
    && Recommended_SKU__r?.Liquid_Layer__r?.Name
    && Recommended_SKU__r?.Display_Name__c 
    && recommendation?.Pitch__c 
    && recommendation?.Recommended_SKU__c
    && (recommendation?.Is_Accepted__c===false)
    && (Outlet_Name__r?.Account_ID_18_digit__c===accountId)

    const promotionCondition= recommendation?.Promotion_Name_With_Scheme__c  && recommendation?.Is_Accepted__c===false &&  (Outlet_Name__r?.Account_ID_18_digit__c===accountId)

    if (promotionCondition) {
      promotions.push(recommendation);
    } else if (skuRecommendationCondition) {
      if (recommendation?.New_or_Existing__c === 'New') {
        newOutletRecommendation.push(recommendation);
      } else if (recommendation?.New_or_Existing__c === 'Existing') {
        existingProducts.push(recommendation);
      }
    }
  });

 /**New outlet Activation */
 const container = document.getElementById('new-outlet-recommendations');
 const generatedHTML1 = newOutletRecommendations(newOutletRecommendation||[]);
 container.innerHTML = generatedHTML1;
   
   
 /** Existing Product Recommendation */
 const container2 = document.getElementById('existing-product-recommendation');
 const generatedHTML2 = existingRecommendations(existingProducts||[]);
 container2.innerHTML = generatedHTML2;


 /** Promotions */
 const container3 = document.getElementById('promotions');
 const generatedHTML3 = displayPromotions(promotions||[]);
 container3.innerHTML = generatedHTML3;
}catch(err){
  console.log(err)
}
}

(async()=>{
  await initializeRecommendations();
})();

gotoDetail = (event) => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  localStorage.setItem('recommendationId',event)
  console.log(event)
  if(event){
    window.location.href = `productDetail.html?accountId=${accountId}`
  }else{
     
      window.location.href = `placeOrder.html?accountId=${accountId}`
  }
}

goBack = () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  window.location.href = `/view/sales/stockatRisk.html?accountId=${accountId}`
}

// goForward = () => {
//   // let urlParams = new URLSearchParams(window.location.search);
//   // const accountId = urlParams.get('accountId');
//   window.location.href = `/view/objectives/salesOrder/salesOrderLanding.html`
// }
  goForward = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/objectives/salesOrder/salesOrderLanding.html?accountId=${accountId}`
  }

  gotoEnrollPage = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/sales/enroll.html?accountId=${accountId}`
  }
