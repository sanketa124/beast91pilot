$(document).ready(function(){
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  const individual = urlParam.get('individual')
  console.log(individual, 'individual')
  if(individual == 'true'){
    $('#closeIco').hide();
    $('.arrowIcons').hide();
    $('.logoSection').css('width','93%')
    $('#finishBtn').show();
  }
})

// let accountId=localStorage.getItem('accountId') || '001Bi000007JSMPIA4'
// let eventId=localStorage.getItem('eventId') ||'a0KBi000003NchCMAS'
let accountId=localStorage.getItem('accountId')
let eventId=localStorage.getItem('eventId')
const recommendationId= localStorage.getItem('recommendationId')
const liquidLayerId=localStorage.getItem('liquidLayerId')

/** Schema Names */
const UNSYNCED_SAMPLE_ITEM_SCHEMA="Unsynced_Sample_Items"
const UNSYNCED_SAMPLE_SCHEMA="Unsynced_Sample"

if(!(accountId && eventId && recommendationId )){
window.location.href='/view/dashboard/todaysVisits/todaysVisits.html'
}

const updateSampleLineItem=async(sampleParent,sampleLineItem)=>{
   let {children}= sampleParent
   let updatechildren= children?.length>=0?children:[]
   const existingIndex = updatechildren.findIndex(item => item?.sampleTag === sampleLineItem?.sampleTag);
    if (existingIndex !== -1) {
     updatechildren[existingIndex] = sampleLineItem;
    } else {
     updatechildren.push(sampleLineItem);
    }
    await writeData(UNSYNCED_SAMPLE_ITEM_SCHEMA, sampleLineItem);
    await writeData(`${UNSYNCED_SAMPLE_SCHEMA}`, {...sampleParent,children: updatechildren});
  }

const createSampleLineItem=async()=>{
  /*** get Liquid Name and Packtype (i.e 330ml, 500ml, 650ml ...) */
  const recommendation= await getItemFromStore('recommendations',recommendationId)
  const liquidName=recommendation?.Recommended_SKU__r?.Liquid_Layer__r?.Name
  const packType=recommendation?.Recommended_SKU__r?.Size_ID__r.Volume_Unit__c +" ml"
  const liquidLayerId=recommendation?.Recommended_SKU__r?.Liquid_Layer__c
  if(!liquidName && packType && liquidLayerId){
    window.location.href='/view/dashboard/todaysVisits/todaysVisits.html'
  }

 /*** Find or create a sample Line Item for the Parent sample*/
  const sampleTag=`sample-${accountId}-${eventId}`
  const sampleLineItemTag= `lineItem-${accountId}-${eventId}-${liquidLayerId}`
  let sampleItem= await getItemFromStore(`${UNSYNCED_SAMPLE_SCHEMA}`, sampleTag)
  //move back to the recommendations in the event the sample parent is not present
  if(!sampleItem?.sampleTag){
    window.location.href='/view/sales/productDetail.html'
  }
  let children=  sampleItem?.children || []
  let sampleLineItem= children.find((item)=>{
    return item?.sampleTag===sampleLineItemTag
  }) ??{
    sampleTag:sampleLineItemTag,
    Product_Sampling_Done__c: false,
    If_Sample_Liked__c: false,
    Interested__c: false,
    Level_of_Interest__c: null,
    Any_other_feedback__c: null,
    Aroma__c: false,
    Bitterness__c: false,
    Liked__c: false,
    Mouth_Feel__c: false,
    Quantity__c: 0,
    Liquid_Layer__c: `${liquidLayerId}`,
  }
  if(!sampleLineItem?.Type__c){

    /** Set Default Value as sampling */
    sampleLineItem={...sampleLineItem,Type__c: 'Tasting'}
    children.push(sampleLineItem)
    await writeData(`${UNSYNCED_SAMPLE_SCHEMA}`,{...sampleItem,children})
    await writeData(`${UNSYNCED_SAMPLE_ITEM_SCHEMA}`,sampleLineItem)
  }

  return {sampleItem,sampleLineItem,liquidName,packType}
}

const deleteSampleLineItem= async()=>{
   /*** get Liquid Name and Packtype (i.e 330ml, 500ml, 650ml ...) */
   const recommendation= await getItemFromStore('recommendations',recommendationId)
   const liquidName=recommendation?.Recommended_SKU__r?.Liquid_Layer__r?.Name
   const packType=recommendation?.Recommended_SKU__r?.Size_ID__r.Volume_Unit__c +" ml"
   const liquidLayerId=recommendation?.Recommended_SKU__r?.Liquid_Layer__c
   if(!liquidName && packType && liquidLayerId){
     window.location.href='/view/dashboard/todaysVisits/todaysVisits.html'
   }
 
  /*** Delete sample Line Item for the Parent sample*/
   const sampleTag=`sample-${accountId}-${eventId}`
   const sampleLineItemTag= `lineItem-${accountId}-${eventId}-${liquidLayerId}`
   let sampleItem= await getItemFromStore(`${UNSYNCED_SAMPLE_SCHEMA}`, sampleTag)
  //move back to the recommendations in the event the sample parent is not present
  if(sampleItem?.children?.length){
    let children= sampleItem.children.filter((item)=>{
        return item.sampleTag===sampleLineItemTag
    })
    await writeData(`${UNSYNCED_SAMPLE_SCHEMA}`,{...sampleItem,children})
    await deleteItemFromData(`${UNSYNCED_SAMPLE_ITEM_SCHEMA}`,sampleLineItemTag)
    alert('Deleted Line item')
  }
}





const handleSamplingData = async (parentSample,result, liquidName, packType) => {
  let updatedResult = result;
  let productQuantity = result?.Quantity__c || 1;
  let initialValue = 0;

  /**Dropdown Options */
  $(document).ready(function() {
    const TYPES = ['Sampling', 'Tasting'];
    const selectElement = $('#sampling-type');
    // Handle Type Dropdown
    TYPES.forEach(function(type) {
      var option = $('<option>').val(type).text(type);
      selectElement.append(option);
    });
  
    selectElement.val(updatedResult?.Type__c);
  
    selectElement.on('change', async function() {
      var selectedValue = $(this).val();
      updatedResult = {
        ...updatedResult,
        Type__c: selectedValue
      };
      await updateSampleLineItem(parentSample, updatedResult);
    });
  });
  

  /** Set liquidName and packtype value  */
  const liquidTag = document.getElementById('liquidName');
  liquidTag.innerText = liquidName;

  const packTypeTag = document.getElementById('packType');
  packTypeTag.innerText = packType;

  /**Handle Sampling Types */
  const inputField = document.getElementById('sample-child-item-values-qty');
  inputField.value = productQuantity;
  inputField.addEventListener('change', async (event) => {
    let newValue = event.target.value;
    newValue = parseInt(newValue.replace(/\D/g, '') || 0);
    inputField.value = newValue || initialValue;
    updatedResult = {
      ...updatedResult,
      Quantity__c: newValue || initialValue
    };
    await updateSampleLineItem(parentSample,updatedResult);
  });


  /*** Handle Mouth Feel (or not) Switch */
  const mouthFeel = document.getElementById('mouth-feel');
  mouthFeel.checked = updatedResult?.Mouth_Feel__c;
  mouthFeel.addEventListener('change', async (event) => {
    updatedResult = {
      ...updatedResult,
      Mouth_Feel__c: event.target.checked
    };
    await updateSampleLineItem(parentSample,updatedResult);
  });

  /*** Handle Bitterness Switch */
  const bitternes = document.getElementById('bitternes');
  bitternes.checked = updatedResult?.Bitterness__c;
  bitternes.addEventListener('change', async (event) => {
    updatedResult = {
      ...updatedResult,
      Bitterness__c: event.target.checked
    };
    await updateSampleLineItem(parentSample,updatedResult);
  });

  /*** Handle Aroma Switch*/
  const aroma = document.getElementById('aroma');
  aroma.checked = updatedResult?.Aroma__c;
  aroma.addEventListener('change', async (event) => {
    updatedResult = {
      ...updatedResult,
      Aroma__c: event.target.checked
    };
    await updateSampleLineItem(parentSample,updatedResult);
  });


  /** Handle Feedback */
  const feedback = document.getElementById('feedback');
  feedback.value = updatedResult?.Any_other_feedback__c || '';
  feedback.addEventListener('change', async (event) => {
    updatedResult = {
      ...updatedResult,
      Any_other_feedback__c: event.target.value
    };
    await updateSampleLineItem(parentSample,updatedResult);
  });

    /*** Handle Liked (or not) Switch */
    const likedField = document.getElementById('liked');
    likedField.checked = updatedResult?.Liked__c;
    likedField.addEventListener('change', async (event) => {

      if(event.target.checked){
        updatedResult = {
          ...updatedResult,
          Liked__c: event.target.checked,
          Interested__c: event.target.checked
        };  
      }
      else {
        updatedResult = {
          ...updatedResult,
          Liked__c:  event.target.checked,
          Interested__c: event.target.checked,
          Aroma__c:  event.target.checked,
          Bitterness__c: event.target.checked,
          Mouth_Feel__c: event.target.checked
        };  
        aroma.checked = false; 
        bitternes.checked=false
        mouthFeel.checked=false
      }
      await updateSampleLineItem(parentSample,updatedResult);
    });
  
};


(async()=>{


  const {sampleItem,sampleLineItem,liquidName,packType}=await createSampleLineItem();
  await handleSamplingData(sampleItem,sampleLineItem,liquidName,packType);


  const quantity=sampleLineItem.Quantity__c
  const elementsToHide = document.querySelectorAll('[id^="hide"]');
  const isSamplingRequired=document.getElementById("sample-tasting-required")
  isSamplingRequired.checked= quantity?true:false
  if (!quantity) {
    elementsToHide.forEach(element => {
      element.style.display = 'none'; // Hide the element
    });
  } else {
    elementsToHide.forEach(element => {
      element.style.display = 'block'; // Display the element
    });
  }
  isSamplingRequired.addEventListener('change', async (event) => {
    const checkedVal = event.target.checked;
    if (checkedVal) {
      await updateSampleLineItem(sampleItem,{...sampleLineItem,Quantity__c:quantity});
      elementsToHide.forEach(element => {
        element.style.display = ''; // Show the element
      });
    } else {
      await updateSampleLineItem(sampleItem,{...sampleLineItem,Quantity__c:0});
      elementsToHide.forEach(element => {
        element.style.display = 'none'; // Hide the element
      });
    }
  });


})();



goBack = () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  window.location.href = `/view/sales/productDetail.html?accountId=${accountId}`
}

goForward = () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  window.location.href = `/view/sales/placeOrder.html?acountId=${accountId}`
}