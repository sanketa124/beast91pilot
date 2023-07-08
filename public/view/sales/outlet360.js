$('#gridTbl1 tbody tr:nth-child(n+6)').hide()
$('#gridTbl1 tbody tr:last-child').show()
$("#showGridTbl1").click(function(){
  $('#gridTbl1 tbody tr:nth-child(n+6)').toggle();
  $('#gridTbl1 tbody tr:last-child').show()
  $(this).toggleClass('addtrans')
})

$('#gridTbl2 tbody tr:nth-child(n+6)').hide()
$('#gridTbl2 tbody tr:last-child').show()
$("#showGridTbl2").click(function(){
  $('#gridTbl2 tbody tr:nth-child(n+6)').toggle();
  $('#gridTbl2 tbody tr:last-child').show()
  $(this).toggleClass('addtrans')
})


let urlParams = new URLSearchParams(window.location.search);
const accountId = localStorage.getItem('accountId')||urlParams.get('accountId');
const eventId =localStorage.getItem('eventId')|| urlParams.get('eventId');

  goBack = () => {
    window.location.href = `/view/checkIn/checkIn.html?accountId=${accountId}&eventId=${eventId}`
  }
  
  goForward = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountId}`
  }

  if(!(accountId && eventId)){
    window.location.href='/view/dashboard/todaysVisits/todaysVisits.html'
  }

  (async()=>{
        
    let outlet360Records= await getItemFromStore('outlet360',accountId)
    if(!outlet360Records){
    }

        /*****  Outlet-360 page 1 ****/

         let account= await getItemFromStore('account',accountId)
         let {Claims_Settled_Till_Date__c}=account
         Claims_Settled_Till_Date__c= Claims_Settled_Till_Date__c ? new Date(Claims_Settled_Till_Date__c).toLocaleDateString('en-IN', { month: '2-digit', year: 'numeric' }) : ''
         console.log('claim settled till date',Claims_Settled_Till_Date__c)

       /** i. Fetch retail Depeltion */
         let retailDepletionObject= await getItemFromStore('outlet360-rate-depletion',accountId)
         if(!(retailDepletionObject && retailDepletionObject.CE__c)){
         
         }

         /** ii. Fetch achievement from account goals*/
        let accountGoalObject= await getItemFromStore('outlet360-account-goals', accountId)
        if(!(accountGoalObject && accountGoalObject.expr0)){
        
        }         
        /** iii. Fetch event count of the event type salesPerson */
        const eventCountObject= await getItemFromStore('outlet360-events',accountId)
        if(!(eventCountObject && eventCountObject.expr0)){

        }

          /** iv. Visibility score of the latest Stock Visibility survery for a given account */
        let visibilityScoreObject= await getItemFromStore('outlet360-visibility-score',accountId)
        if(!(visibilityScoreObject && visibilityScoreObject.Visibility_Score__c)){

        }

         /** iv. Visibility score of the latest Stock Visibility survery for a given account */
          let postItemsObject= await getItemFromStore('outlet360-positems',accountId)
          if(!(postItemsObject && visibilityScoreObject.posmLineItems )){
   
          }

          const achievement=retailDepletionObject?.CE__c  ||0
          const target=accountGoalObject?.expr0 || 0  
          const eventCount=eventCountObject?.expr0 ||0
          const visibilityScore= parseFloat(visibilityScoreObject?.Visibility_Score__c||0) 
          const {Z3_Menu_Listing__c}=visibilityScoreObject
          const posLineItems= postItemsObject?.posmLineItems ||0
    

        /** 1. MTD Performance Bar */
        
        const parentDiv = document.querySelector('.progress');
        const progressBar = parentDiv.querySelector('#mtd-performance-bar');
        progressBar.style.width = `${Math.floor((achievement/(target||1))*100 )}%`;

        const mtoAchievementElement=document.getElementById('mtd-bar-achievement');
        mtoAchievementElement.textContent = `${achievement}`;
        const mtoTargetElement=document.getElementById('mtd-bar-target');
        mtoTargetElement.textContent = `${target}`;


         /*** 2. Visit Target */
         const visitTarget1= document.getElementById('visit-target-content')
         visitTarget1.textContent=`${(target-achievement)/(eventCount||1)}`


         /*** 3. B91 Insights and  competitor insights , Order Frequencies */
         if(outlet360Records && outlet360Records.children){
            const {children}=outlet360Records
            const biraInsights= children.find((item)=>{
              const condition=item && item.Name
              if(condition){
                const name= item.Name.toLowerCase()
                return( name.includes('b9') || name.includes('bira'))
              }
             return false
            })
            if(biraInsights){
              initializeBiraInsights(biraInsights)
            }
            populateCompetitorInsight(children)
            populateOrderFrequencies(children)
         }


          /*** 4. Visibility Score card bar */ 
          const visibilityProgressBar =  document.querySelector('#visibility-scorecard');
          visibilityProgressBar.style.width = `${Math.floor((visibilityScore/(target||1))*100 )}%`;

          const visibilityScoreCardAchieved=document.getElementById('visibility-scorecard-achieved');
          visibilityScoreCardAchieved.textContent = `${`Achv:${visibilityScore}`}(${Math.floor((visibilityScore/(target||1))*100)}%)`;
          const visibilityScoreCardTarget=document.getElementById('visibility-scorecard-target');
          visibilityScoreCardTarget.textContent = `Target:${target}`;


          /*** 5. Liquid Sales */

          const liquids={
            WHITE:'white',
            BLONDE:'blonde',
            RISE: 'rise',
            GOLD: 'gold',
            BOOM: 'boom'
             }
          const PACK_TYPES={
            BOTTLE330:'330',
            BOTTLE650:'650',
            CAN: 'can',
            KEG: 'keg'
           }
          const BILLING_HIGHLIGHT_COLORS={
            L1M:'colorGreen',
            L3M:'colorYellow',
            EVER_BILLED: 'colorRed',
            Never_BILLED: 'colorMerun'
          }
          const liquidNames=[liquids.BLONDE,liquids.BOOM,liquids.GOLD,liquids.RISE,liquids.WHITE]
          function findLiquidName(string) {
            const atIndex = string.indexOf('@');
            if(atIndex!==-1){
                const liquidName=string.substring(0, atIndex);
                const result=  liquidNames.find((item)=>liquidName.toLocaleLowerCase().includes(item)) || liquidName
                return result;
            }
            return '';
          }
  
          const resolveItemDetails=(billedLiquidString, color)=>{
            const packType =  billedLiquidString.includes(PACK_TYPES.CAN)?PACK_TYPES.CAN: billedLiquidString.includes(PACK_TYPES.KEG)? PACK_TYPES.KEG: billedLiquidString.includes(PACK_TYPES.BOTTLE330)?PACK_TYPES.BOTTLE330: PACK_TYPES.BOTTLE650;
            const liquidName= findLiquidName(billedLiquidString)
            return{
              packType,
              liquidName,
              color
            }
        }
  
           let {L1M_Billed_Liquid__c,L3M_Billed_Liquid__c, Ever_Billed_Liquid__c,Never_Billed_Liquid__c}=account
           L1M_Billed_Liquid__c=`White@Keg#500, Blonde@Can#500, Boom Strong@Can#500, White@Bottle#330, Blonde@Bottle#330`
           L3M_Billed_Liquid__c=`Blonde@Can#500, Boom Strong@Can#500`
           Ever_Billed_Liquid__c=`gold@Can#500, rise@bottle#330`
           L1M_Billed_Liquid__c= (`${L1M_Billed_Liquid__c||''}`).toLocaleLowerCase().split(',').map((billedLiquidString)=>{
              return resolveItemDetails(billedLiquidString,BILLING_HIGHLIGHT_COLORS.L1M)
           })
           L3M_Billed_Liquid__c=(`${L3M_Billed_Liquid__c||''}`).toLocaleLowerCase().split(',').map((billedLiquidString)=>{
              return resolveItemDetails(billedLiquidString,BILLING_HIGHLIGHT_COLORS.L3M)
           })
           Ever_Billed_Liquid__c=(`${Ever_Billed_Liquid__c||''}`).toLocaleLowerCase().split(',').map((billedLiquidString)=>{
            return resolveItemDetails(billedLiquidString,BILLING_HIGHLIGHT_COLORS.EVER_BILLED)
         })
  
           const CLUBBED_RESULTS=[...L1M_Billed_Liquid__c, ...L3M_Billed_Liquid__c,...Ever_Billed_Liquid__c].reduce((acc, obj) => {
            const { liquidName } = obj;
            if (!acc[liquidName]) {
              acc[liquidName] = [];
            }
            acc[liquidName].push(obj);
            return acc;
          }, {});


          const biraWhiteRowHtml= CLUBBED_RESULTS?.[liquids.WHITE]?populateLiquidSalesRow(CLUBBED_RESULTS[liquids.WHITE],liquids.WHITE):''
          const biraBlondeRowHtml=CLUBBED_RESULTS?.[liquids.BLONDE]?populateLiquidSalesRow(CLUBBED_RESULTS[liquids.BLONDE],liquids.BLONDE):''
          const biraRiseRowHtml=CLUBBED_RESULTS?.[liquids.RISE]?populateLiquidSalesRow(CLUBBED_RESULTS[liquids.RISE],liquids.RISE):''
          const biraGoldRowHtml=CLUBBED_RESULTS?.[liquids.GOLD]?populateLiquidSalesRow(CLUBBED_RESULTS[liquids.GOLD],liquids.GOLD):''
          const biraBoomRowHtml=CLUBBED_RESULTS?.[liquids.BOOM]?populateLiquidSalesRow(CLUBBED_RESULTS[liquids.BOOM],liquids.BOOM):''
          const liquidSalesBody = document.getElementById("liquid-sales");
          let liqSalesHtml=biraWhiteRowHtml+ biraBlondeRowHtml+biraRiseRowHtml+ biraGoldRowHtml+biraBoomRowHtml
          if(liqSalesHtml){
            liquidSalesBody.innerHTML=liqSalesHtml
          }
         
          /*** 6. Premium Visibility & Assets ,Customized branding */
          const premiumVisibilityElement = document.getElementById("premium-visibility-assets");
          const customizedBranding=document.getElementById("customized-branding")
          const posLineItemParent=(posLineItems||[]).reduce((acc, item) => {
            const itemSubCategory = item.Item_Sub_Category__c;
            if (!acc[itemSubCategory]) {
              acc[itemSubCategory] = [];
            }
            acc[itemSubCategory].push(item);
            return acc;
          }, {});

        const {Draft,Refrigerator,Signage}=posLineItemParent
        const Internal=posLineItemParent?.["Internal Custom Branding"]||[]
        const External=posLineItemParent?.["External Custom Branding"]||[]
    
        const draftHtml= populatePosItemTable('Draft',Draft)
        const coolerHtml=populatePosItemTable('Cooler',Refrigerator)
        const signageHtml=populatePosItemTable('Signage',Signage)
        premiumVisibilityElement.innerHTML=draftHtml+coolerHtml+signageHtml
        
        const internalCustomizedBrandingHtml=populatePosItemTable('Internal',Internal)
        const externalCustomizedBrandingHtml=populatePosItemTable('External',External)
        customizedBranding.innerHTML=internalCustomizedBrandingHtml+externalCustomizedBrandingHtml

        /*** Open Issues */
        const claimSettledTillDate=document.getElementById("claim-settled")
        claimSettledTillDate.innerHTML= Claims_Settled_Till_Date__c || 'NA'
        const issuesElement= document.getElementById("open-issues")
        const Issues=( (await readAllData('case'))||[]).filter((item)=>{
          return item.AccountId == accountId && item?.Issue_Resolved__c===false && item?.Issue_Type__c 
        })
        const issuesHtml=Issues.map((item)=>{
            return `<tr><td>${item?.Issue_Type__c || ''} </td><td> ${item.Settlement_Date__c} <i class="fas fa-calendar-alt"></i></td></tr>`
        }).join('')
        issuesElement.innerHTML=issuesHtml
  })();

  const initializeBiraInsights=(bira91Insights)=>{
         /*** B9 Volume MTD */
         let  b9VolumeOverall=document.getElementById("b9-volume-overall-mtd")
         b9VolumeOverall.innerHTML = bira91Insights.Volume_MTD__c?bira91Insights.Volume_MTD__c:0;
         let b9VolumePremium=document.getElementById("b9-volume-premium-mtd")
         b9VolumePremium.innerHTML=bira91Insights.Volume_MTD_Premium__c?bira91Insights.Volume_MTD__c:0;

          /*** B9 Market Share MTD */
          let  b9MarketShareOverall=document.getElementById("b9-market-share-overall-mtd")
          b9MarketShareOverall.innerHTML = Math.round(bira91Insights.Market_Share_MTD_Overall__c?bira91Insights.Market_Share_MTD_Overall__c:0)+'%';
          let b9MarketSharePremium=document.getElementById("b9-market-share-premium-mtd")
          b9MarketSharePremium.innerHTML=Math.round(bira91Insights.Market_Share_MTD_Premium__c?bira91Insights.Market_Share_MTD_Premium__c:0)+'%';

          /*** B9 Growth  MTD */
          let  b9GrowthOverall=document.getElementById("b9-growth-overall-mtd")
          b9GrowthOverall.innerHTML = bira91Insights.Growth_MTD_Overall__c  ?bira91Insights.Growth_MTD_Overall__c :0;
          let b9GrowthPremium=document.getElementById("b9-growth-premium-mtd")
          b9GrowthPremium.innerHTML=bira91Insights.Growth_MTD_Premium__c ?bira91Insights.Growth_MTD_Premium__c :0;
  }

  const initializeCompetitorInsights=(insightObject,competitorName)=>{
    document.getElementById(`${competitorName}-volume-mtd`).innerHTML= insightObject.Volume_MTD__c?insightObject.Volume_MTD__c:0;
    document.getElementById(`${competitorName}-volume-lm`).innerHTML= insightObject.Volume_LM__c?insightObject.Volume_LM__c:0;
    document.getElementById(`${competitorName}-market-share-lm`).innerHTML=Math.round( insightObject.Market_Share_LM__c?insightObject.Market_Share_LM__c:0);
    document.getElementById(`${competitorName}-premium-volume-lm`).innerHTML= insightObject.Premium_Volume_LM__c?insightObject.Premium_Volume_LM__c:0;
    document.getElementById(`${competitorName}-premium-market-share-lm`).innerHTML=Math.round( insightObject.Premium_Market_Share_LM__c?insightObject.Premium_Market_Share_LM__c:0);
  }

  const populateCompetitorInsight = (insights) => {
    const tableBody = document.getElementById("competitor-performance");
    if (tableBody) {
      let html = '';
      insights.forEach((insightObject) => {
        if(insightObject.Name){
          html += `<tr>
          <td>
              <strong>${insightObject && insightObject.Name ? insightObject.Name : ''}</strong>
          </td>
          <td>
              ${insightObject && insightObject.Volume_MTD__c ? insightObject.Volume_MTD__c : 0}
          </td>
          <td>
              ${insightObject && insightObject.Volume_LM__c ? insightObject.Volume_LM__c : 0}
          </td>
          <td>
              ${Math.round(insightObject && insightObject.Market_Share_LM__c ? insightObject.Market_Share_LM__c : 0)}%
          </td>
          <td>
              ${insightObject && insightObject.Premium_Volume_LM__c ? insightObject.Premium_Volume_LM__c : 0}
          </td>
          <td>
              ${Math.round(insightObject && insightObject.Premium_Market_Share_LM__c ? insightObject.Premium_Market_Share_LM__c : 0)}%
          </td>
        </tr>`;
        }
      
      });
  
      tableBody.innerHTML = html;
    } else {
      console.error("Element with ID 'competitor-performance' not found.");
    }
  };

  const populateOrderFrequencies=(insights)=>{
    const tableHeader = document.getElementById("order-frequencies-names");
    const tableBody = document.getElementById("order-frequencies");
    let tableheaderHtml=''
    let tableBodyHtml=''
    if(tableHeader && tableBody){
      insights.forEach((item)=>{
        tableheaderHtml+=`<th class="colorViolet">${item.Name}</th>`
        tableBodyHtml+=` <td> ${item.Order_Frequency_MTD__c} </td>`
      })
      tableHeader.innerHTML=tableheaderHtml
      tableBody.innerHTML=tableBodyHtml
    }
  }

  const populateLiquidSalesRow=(liquidSalesRow, liquidName)=>{
        const resolve330mlColumn= liquidSalesRow.find((item)=>{
            return item?.packType==='330'
        }) 
        const resolveCanColumn= liquidSalesRow.find((item)=>{
          return item?.packType==='can'
        }) 
        const resolve650mlColumn= liquidSalesRow.find((item)=>{
          return item?.packType==='650'
        })
        const resolveKegColumn= liquidSalesRow.find((item)=>{
          return item?.packType==='keg'
        })

      let resolve330mlHtml=`<td> <i class="fas${resolve330mlColumn?.color?` fa-check `+resolve330mlColumn.color:''}"></i></td>`
      let resolveCanHtml=`<td> <i class="fas${resolveCanColumn?.color?` fa-check `+resolveCanColumn.color:''}"></i></td>`
      let resolve650mlHtml=`<td> <i class="fas${resolve650mlColumn?.color?` fa-check `+resolve650mlColumn.color:''}"></i></td>`
      let resolveKegHtml=`<td> <i class="fas${resolveKegColumn?.color?` fa-check `+resolveKegColumn.color:''}"></i></td>` 
      let html=`<tr><td>${liquidName||'Sample SKU'}</td> ${resolve330mlHtml+resolveCanHtml+resolve650mlHtml+  resolveKegHtml}</tr><td>`
      return html

  }

  const populatePosItemTable=(itemName,positemArray)=>{
    return `<tr>
    <td>
        <strong>${itemName}</strong>
    </td>
    <td>
        ${positemArray?.[0]? positemArray[0]?.Product__r?.Name:''}
    </td>
    <td>
        ${positemArray?.[1]? positemArray[1]?.Product__r?.Name:''}
    </td>
    <td>
        ${positemArray?.[2]? positemArray[2]?.Product__r?.Name:''}
    </td>
    <td>
        ${positemArray?.[3]? positemArray[3]?.POSM_Requisition__r?.Name:''}
    </td>
    
</tr>`
  }