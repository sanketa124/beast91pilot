const CONTRACT_URLS={
  OFF_PREMISE:"https://form.jotform.com/231873132476054",
  ON_PREMISE:"https://form.jotform.com/231904837281459"
}

let accountId=localStorage.getItem('accountId') 
let eventId=localStorage.getItem('eventId')
if(!(accountId && eventId )){
  window.location.href='/view/dashboard/todaysVisits/todaysVisits.html'
}

const gotoDetailCheck=async(recommendationObj)=>{
  const itemName= (recommendationObj?.Variant_Name__c ||'Not Found').toLowerCase()
  let account= await getItemFromStore('account',accountId)
  let {L1M_Billed_Liquid__c,L3M_Billed_Liquid__c, Ever_Billed_Liquid__c}=account
  let presentInL1M= (L1M_Billed_Liquid__c||'').toLowerCase().includes(itemName)
  let presentInL3M= (L3M_Billed_Liquid__c||'').toLowerCase().includes(itemName)
  let presentInEverBilled= (Ever_Billed_Liquid__c||'').toLowerCase().includes(itemName)
  if(!(presentInL1M || presentInL3M || presentInEverBilled)){
    return true
  }
  return false;
}

gotoDetail = (recommendationId) => {
    localStorage.setItem('recommendationId',recommendationId)
    window.location.href = `productDetail.html?accountId=${accountId}`
}

goToPromotion=(promotionId)=>{
  localStorage.setItem('promotionId',promotionId)
  window.location.href = `productDetail.html?accountId=${accountId}`
}

placeOrderNav = (recommendationId) => {
   localStorage.setItem('recommendationId',recommendationId)
   window.location.href = `placeOrder.html?accountId=${accountId}`
}


const newOutletRecommendations = async(recommendationData) => {
    let title = recommendationData.length?'<div class="linkSec"><a href="">NEW OUTLET ACTIVATION</a></div>':'';
    const promises= recommendationData.map(async(recommendation) => {
    const displayIcon=await gotoDetailCheck(recommendation)
    const {Recommended_SKU__r}=recommendation
    const navigationCondition=displayIcon? `gotoDetail(${JSON.stringify(recommendation?.Id)})`:`placeOrderNav(${JSON.stringify(recommendation?.Id)})`
    return `
        <div class="linkSec">
        <div class="row"${`onClick=${navigationCondition}`}>
            <div class="col-xs-9">
              <div class="boxLink">
              <h4>${Recommended_SKU__r.Display_Name__c }</h4>
              <p>${recommendation.Pitch__c}</p>
              </div>
            </div>
            <div class="col-xs-3">
            ${displayIcon?`<i class="fa fa-external-link"></i>`:``}
            </div>
          </div>
        </div>
      `;
    });
    const result=(await Promise.all(promises)).join('')
    return title+result
  };
const existingRecommendations=async(recommendationData)=>{

    let title = recommendationData.length?'<div class="linkSec"><a href="">NEW PRODUCT RECOMMENDATION</a></div>':'';
    const promises=recommendationData.map(async(recommendation) => {
    const {Recommended_SKU__r}=recommendation
    const displayIcon=await gotoDetailCheck(recommendation) 
    const navigationCondition=displayIcon? `gotoDetail(${JSON.stringify(recommendation?.Id)})`:`placeOrderNav(${JSON.stringify(recommendation?.Id)})`
    return `
        <div class="linkSec">
        <div class="row"${`onClick=${navigationCondition}`}>
            <div class="col-xs-9">
              <div class="boxLink">
                <h4>${Recommended_SKU__r.Display_Name__c }</h4>
                <p>${recommendation.Pitch__c}</p>
              </div>
            </div>
            <div class="col-xs-3">
            ${displayIcon?`<i class="fa fa-external-link"></i>`:``}
            </div>
          </div>
        </div>
      `;
    });
    const result= (await Promise.all(promises)).join('')
    return title+result
}
const displayPromotions=(promotionData)=>{
  
  let title = promotionData.length?'<div class="linkSec"><a href="">PROMOTIONS</a></div>':'';
  let html=''
  promotionData.forEach((promotion) => {
    if(promotion?.Promotion_Name__r?.Name && promotion?.Promotion_Name_With_Scheme__c ){
      html += `
      <div class="linkSec">
        <div class="row" ${`onClick=goToPromotion(${JSON.stringify(promotion?.Id)})`}>
          <div class="col-xs-9">
            <div class="boxLink">
              <h4>${promotion.Promotion_Name__r.Name}</h4>
              <p>${promotion.Promotion_Name_With_Scheme__c}</p>
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
  localStorage.removeItem('recommendationId')
  localStorage.removeItem('promotionId')
try{
  const columnConditions={
    'Active__c': true
  }

  const weekFilter =( await getItemFromStore(`recommendation-weekfilter`,accountId))?.expr0 || 0;
  const weekFilterValue= weekFilter>4? ((weekFilter%4)+1): weekFilter
  const newOutletRecommendation = [];
  const existingProducts = [];
  const promotions = [];
  const result = (await filterDbData('recommendations', columnConditions)) || [];
  console.log('week filter value',weekFilterValue)
  result.map((recommendation) => {
    const {Recommended_SKU__r,Outlet_Name__r}=recommendation
    const skuRecommendationCondition=Recommended_SKU__r?.Size_ID__r?.Volume_Unit__c
    && recommendation?.Variant_Name__c
    && Recommended_SKU__r?.Display_Name__c 
    && recommendation?.Pitch__c 
    && recommendation?.Recommended_SKU__c
    && (recommendation?.Is_Accepted__c===false)
    && (Outlet_Name__r?.Account_ID_18_digit__c===accountId)
    && (recommendation?.Week__c === weekFilterValue)

    const promotionCondition= recommendation?.Promotion_Name__c  && recommendation?.Is_Accepted__c===false &&  (Outlet_Name__r?.Account_ID_18_digit__c===accountId)

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
 const generatedHTML1 =await newOutletRecommendations(newOutletRecommendation||[]);
 container.innerHTML = generatedHTML1;
   
   
 /** Existing Product Recommendation */
 const container2 = document.getElementById('existing-product-recommendation');
 const generatedHTML2 = await existingRecommendations(existingProducts||[]);
 container2.innerHTML = generatedHTML2;


 /** Promotions */
 const container3 = document.getElementById('promotions');
 const generatedHTML3 = displayPromotions(promotions||[]);
 container3.innerHTML = generatedHTML3;


 /*** Contract */
 let accountDetail = await getItemFromStore('account',accountId);
 const channel= accountDetail?.Channel__c||''
 const buttonElement = document.getElementById('contract-link');
 buttonElement.addEventListener('click', function() {
  // Set the value of the input element
  if(channel=== "On-Premise"){
    buttonElement.href = CONTRACT_URLS.ON_PREMISE;
  }
  if(channel==="Off-Premise"){
      buttonElement.href = CONTRACT_URLS.OFF_PREMISE;
    }
});
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
