
$("#showGridTbl1").on('click',function(){
  alert('hi')
 
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

         /** iv. pos items */
          let postItemsObject= await getItemFromStore('outlet360-positems',accountId)
          if(!(postItemsObject && visibilityScoreObject.posmLineItems )){
   
          }

           /** v. visibility score board target */
           let visibilityScoreCardTargetObject= await getItemFromStore('outlet360-visibility-score-target',accountId)
           if(!(visibilityScoreCardTargetObject && visibilityScoreObject.expr0 )){
    
           }
          const achievement=Math.floor(retailDepletionObject?.CE__c  ||0)
          const target=Math.floor(accountGoalObject?.expr0 || 0 )
          const eventCount=eventCountObject?.expr0 ||0
          const visibilityScore= parseFloat(visibilityScoreObject?.Visibility_Score__c||0) 
          const Z3_Menu_Listing__c=visibilityScoreObject?.Z3_Menu_Listing__c||0
          const posLineItems= postItemsObject?.posmLineItems ||0
          const visibilityScoreBoardTarget=visibilityScoreCardTargetObject?.expr0 ||0
         

        /** 1. MTD Performance Bar */
        
        const parentDiv = document.querySelector('.progress');
        const progressBar = parentDiv.querySelector('#mtd-performance-bar');
        let achievedPercent=`${Math.floor((achievement/(target||1))*100 )}%`
        progressBar.style.width =achievedPercent ;

        const mtoAchievementElement=document.getElementById('mtd-bar-achievement');
        mtoAchievementElement.textContent =`${Math.round(achievement)} (${achievedPercent}) CE  `;
        const mtoTargetElement=document.getElementById('mtd-bar-target');
        mtoTargetElement.textContent = `${Math.round(target)} CE`


         /*** 2. Visit Target */
         //Removed industry segement value decided based on P0, P1, P2, P3
         const industrySegementValue=eventCount
         const visitTarget1= document.getElementById('visit-target-content')
         const targetVal = ((target-achievement)/(industrySegementValue||1))
         const visitTargetValue=!isNaN(Math.round(targetVal)) ? Math.round(targetVal) :0
         visitTarget1.textContent= `${visitTargetValue>0? visitTargetValue+ ' CE': ''} `


         /*** 3. B91 Insights and  competitor insights , Order Frequencies, lapsedKegs */
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
          // const visibilityProgressBar =  document.querySelector('#visibility-scorecard');
          // visibilityProgressBar.style.width = `${Math.floor((visibilityScore/(visibilityScoreBoardTarget||1))*100 )}%`;

          // const visibilityScoreCardAchieved=document.getElementById('visibility-scorecard-achieved');
          // visibilityScoreCardAchieved.textContent = `${`Achv:${visibilityScore}`}(${Math.floor((visibilityScore/(visibilityScoreBoardTarget||1))*100)}%)`;
          // const visibilityScoreCardTarget=document.getElementById('visibility-scorecard-target');
          // visibilityScoreCardTarget.textContent = `Target:${visibilityScoreBoardTarget}`;


          /*** 5. Liquid Sales */

          const liquids={
            WHITE:'white',
            BLONDE:'blonde',
            RISE: 'rise',
            GOLD: 'gold',
            BOOM: 'boom strong'
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
            NEVER_BILLED: 'colorMerun'
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
           L1M_Billed_Liquid__c= (`${L1M_Billed_Liquid__c||''}`).toLocaleLowerCase().split(',').map((billedLiquidString)=>{
              return resolveItemDetails(billedLiquidString.trim(),BILLING_HIGHLIGHT_COLORS.L1M)
           })
           L3M_Billed_Liquid__c=(`${L3M_Billed_Liquid__c||''}`).toLocaleLowerCase().split(',').map((billedLiquidString)=>{
              return resolveItemDetails(billedLiquidString.trim(),BILLING_HIGHLIGHT_COLORS.L3M)
           })
           Ever_Billed_Liquid__c=(`${Ever_Billed_Liquid__c||''}`).toLocaleLowerCase().split(',').map((billedLiquidString)=>{
            return resolveItemDetails(billedLiquidString.trim(),BILLING_HIGHLIGHT_COLORS.EVER_BILLED)
            })

         Never_Billed_Liquid__c=(`${Never_Billed_Liquid__c||''}`).toLocaleLowerCase().split(',').map((billedLiquidString)=>{
          return resolveItemDetails(billedLiquidString.trim(),BILLING_HIGHLIGHT_COLORS.NEVER_BILLED)
          })

        
       /** Find all lapsed kegs from Ever Billed and L3M */
       const lapsedKegs= findLapsedKegs([...Ever_Billed_Liquid__c,...L3M_Billed_Liquid__c])
       const lapsedKegsElement= document.getElementById("lapsed-kegs")
       lapsedKegsElement.textContent=lapsedKegs

    
       const CLUBBED_RESULTS=[...L1M_Billed_Liquid__c, ...L3M_Billed_Liquid__c,...Ever_Billed_Liquid__c,...Never_Billed_Liquid__c].reduce((acc, obj) => {
            const { liquidName } = obj;
            if (!acc[liquidName]) {
              acc[liquidName] = [];
            }
            acc[liquidName].push(obj);
            return acc;
          }, {});

          const biraWhiteRowHtml= CLUBBED_RESULTS?.[liquids.WHITE]?populateLiquidSalesRow(CLUBBED_RESULTS[liquids.WHITE],liquids.WHITE):`<tr><td>${capitalizeWords(liquids.WHITE)}</td><td><i class="fas "></i></td>   <td> <i class="fas "></i></td>  <td> <i class="fas "></i></td> <td></td></tr>`
          const biraBlondeRowHtml=CLUBBED_RESULTS?.[liquids.BLONDE]?populateLiquidSalesRow(CLUBBED_RESULTS[liquids.BLONDE],liquids.BLONDE):`<tr><td>${capitalizeWords(liquids.BLONDE)}</td><td><i class="fas "></i></td>   <td> <i class="fas "></i></td>  <td> <i class="fas "></i></td> <td></td></tr>`
          const biraRiseRowHtml=CLUBBED_RESULTS?.[liquids.RISE]?populateLiquidSalesRow(CLUBBED_RESULTS[liquids.RISE],liquids.RISE):`<tr><td>${capitalizeWords(liquids.RISE)}</td><td><i class="fas "></i></td>   <td> <i class="fas "></i></td>  <td> <i class="fas "></i></td> <td></td></tr>`
          const biraGoldRowHtml=CLUBBED_RESULTS?.[liquids.GOLD]?populateLiquidSalesRow(CLUBBED_RESULTS[liquids.GOLD],liquids.GOLD):`<tr><td>${capitalizeWords(liquids.GOLD)}</td><td><i class="fas "></i></td>   <td> <i class="fas "></i></td>  <td> <i class="fas "></i></td> <td></td></tr>`
          const biraBoomRowHtml=CLUBBED_RESULTS?.[liquids.BOOM]?populateLiquidSalesRow(CLUBBED_RESULTS[liquids.BOOM],liquids.BOOM):`<tr><td>${capitalizeWords(liquids.BOOM)}</td><td><i class="fas "></i></td>   <td> <i class="fas "></i></td>  <td> <i class="fas "></i></td> <td></td></tr>`
      
          // Filter out liquids that are not Fixed i.e white, blonde, rise , gold or boom strong
         const CLUBBED_RESULT_KEYS=Object.keys(CLUBBED_RESULTS)
         const FILTERED_KEYS= CLUBBED_RESULT_KEYS.filter(key => !liquidNames.includes(key) && key!=='')
          
         const otherLiquidsHtml=FILTERED_KEYS.map((key)=>{
           return CLUBBED_RESULTS?.[key]? populateLiquidSalesRow(CLUBBED_RESULTS[key],key):`<tr><td>${capitalizeWords(key)}</td><td><i class="fas "></i></td>   <td> <i class="fas "></i></td>  <td> <i class="fas "></i></td> <td></td></tr>`
         }).join('')
          const liquidSalesBody = document.getElementById("liquid-sales");
          let liqSalesHtml=biraWhiteRowHtml+ biraBlondeRowHtml+biraRiseRowHtml+ biraGoldRowHtml+biraBoomRowHtml+otherLiquidsHtml
          
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

        // Menu Listing
        const menuElement=document.getElementById('menu-listing')
        menuElement.textContent=Z3_Menu_Listing__c? 'Yes': 'No'

        /*** Open Issues */
        const claimSettledTillDate=document.getElementById("claim-settled")
        claimSettledTillDate.innerHTML= Claims_Settled_Till_Date__c || ''
        const issuesElement= document.getElementById("open-issues")
        const Issues=( (await readAllData('case'))||[]).filter((item)=>{
          return item.AccountId == accountId && item?.Issue_Resolved__c===false && item?.Subject 
        })
        const issuesHtml=Issues.map((item)=>{
            return `<tr><td>${item?.Subject || ''} </td><td> ${item.Settlement_Date__c} <i class="fas fa-calendar-alt"></i></td></tr>`
        }).join('')
        issuesElement.innerHTML=issuesHtml
        // $('#gridTbl1 tbody tr:nth-child(n+6)').hide()
        // //$('#gridTbl1 tbody tr:last-child').show()
        // $("#showGridTbl1").on('click',function(){
        //   alert('hi')
        //   //$('#gridTbl1 tbody tr:nth-child(n+6)').toggle();
        //  // $('#gridTbl1 tbody tr:last-child').show()
        //   //$(this).toggleClass('addtrans')
        // })
        // let lastChild = `<tr>
        //                       <td>Innovation</td>
        //                       <td>
        //                           <i class="fa fa-sort-down sortClick" id="showGridTbl1"></i>
        //                       </td>
        //                       <td></td>
        //                       <td></td>
        //                       <td></td>
        //                   </tr>`
        //   $('#gridTbl1 tbody').append(lastChild)
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
          let  biraOverAllGrowth=  bira91Insights.Growth_MTD_Overall__c  ?bira91Insights.Growth_MTD_Overall__c :0;
          if(biraOverAllGrowth>0){
            b9GrowthOverall.classList.add("colorGreen");
          }else{
            b9GrowthOverall.classList.add("colorRed");
          }
          b9GrowthOverall.innerHTML= biraOverAllGrowth

          let b9GrowthPremium=document.getElementById("b9-growth-premium-mtd")
          let biraPremiumValue=bira91Insights.Growth_MTD_Premium__c ?bira91Insights.Growth_MTD_Premium__c :0;
          if(biraPremiumValue>0){
            b9GrowthPremium.classList.add("colorGreen");
          }
          else{
            b9GrowthPremium.classList.add("colorRed");
          }
          b9GrowthPremium.innerHTML=biraPremiumValue;
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
    const individualInsightClosure=(insightObject,defaultName)=>{
     return `<tr>
          <td>
              <strong>${insightObject && insightObject.Name ? insightObject.Name : defaultName}</strong>
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
        </tr>`
    }

    const ABIObject= insights.find((item)=>{
      return item.Name==='ABI'
    })

    const HeinekenObject= insights.find((item)=>{
      return item.Name==='Heineken'
    })

    const CarlsbergObject= insights.find((item)=>{
      return item.Name==='Carlsberg'
    })

    const B9Object= insights.find((item)=>{
      return item.Name==='B9'
    })
    if (tableBody) {
      let abiHtml=individualInsightClosure(ABIObject,"ABI")
      let heinekenHtml=individualInsightClosure(HeinekenObject,"Heineken")
      let carlsbergHtml= individualInsightClosure(CarlsbergObject,"Carlsberg")
      let b9Html= individualInsightClosure(B9Object,"B9")
      tableBody.innerHTML= abiHtml+heinekenHtml+carlsbergHtml+b9Html
    } else {
      console.error("Element with ID 'competitor-performance' not found.");
    }
  };

  const populateOrderFrequencies=(insights)=>{
    const tableHeader = document.getElementById("order-frequencies-names");
    const tableBody = document.getElementById("order-frequencies");
    const ABIObject= insights.find((item)=>{
      return item.Name==='ABI'
    })

    const HeinekenObject= insights.find((item)=>{
      return item.Name==='Heineken'
    })

    const CarlsbergObject= insights.find((item)=>{
      return item.Name==='Carlsberg'
    })

    const B9Object= insights.find((item)=>{
      return item.Name==='B9'
    })
    const orderFrequencyHeaderClosure=(item,defaultName)=>{
       return `<th class="colorViolet">${item?.Name || defaultName}</th>`

    }
    const orderFrequencyContentClosure=(item,defaultName)=>{
        return ` <td> ${item?.Order_Frequency_MTD__c || "0"} </td>`
   }
    if(tableHeader && tableBody){
      let abiHtml=orderFrequencyContentClosure(ABIObject,"ABI")
      let heinekenHtml=orderFrequencyContentClosure(HeinekenObject,"Heineken")
      let carlsbergHtml= orderFrequencyContentClosure(CarlsbergObject,"Carlsberg")
      let b9Html= orderFrequencyContentClosure(B9Object,"B9")

      let abiHtmlHeaderHtml=orderFrequencyHeaderClosure(ABIObject,"ABI")
      let heinekenHeaderHtml=orderFrequencyHeaderClosure(HeinekenObject,"Heineken")
      let carlsbergHeaderHtml= orderFrequencyHeaderClosure(CarlsbergObject,"Carlsberg")
      let b9HeaderHtml= orderFrequencyHeaderClosure(B9Object,"B9")
      tableHeader.innerHTML=abiHtmlHeaderHtml+heinekenHeaderHtml+carlsbergHeaderHtml+b9HeaderHtml
      tableBody.innerHTML=abiHtml+ heinekenHtml+ carlsbergHtml+b9Html
  
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

      let resolve330mlHtml=`<td> <i class="fas${resolve330mlColumn?.color? ` fa-check `+resolve330mlColumn.color  :''}"></i></td>`
      let resolveCanHtml=`<td> <i class="fas${resolveCanColumn?.color? ` fa-check `+resolveCanColumn.color :''}"></i></td>`
      let resolve650mlHtml=`<td> <i class="fas${resolve650mlColumn?.color? ` fa-check `+resolve650mlColumn.color :''}"></i></td>`
      let resolveKegHtml=`<td> <i class="fas${resolveKegColumn?.color?  ` fa-check `+resolveKegColumn.color:''}"></i></td>` 
      let html=`<tr><td>${capitalizeWords(liquidName||'Sample SKU')}</td> ${resolve330mlHtml+resolveCanHtml+resolve650mlHtml+  resolveKegHtml}</tr>`
      return html

  }

  const populatePosItemTable=(itemName,positemArray)=>{
    return `<tr>
    <td>
        <strong>${itemName || ''}</strong>
    </td>
    <td>
        ${ positemArray?.[0]?.Product__r?.Name|| ''}
    </td>
    <td>
        ${positemArray?.[1]?.Product__r?.Name ||''}
    </td>
    <td>
        ${ positemArray?.[2]?.Product__r?.Name || ''}
    </td>
    <td>
        ${positemArray?.[3]?.POSM_Requisition__r?.Name || ''}
    </td>
    
</tr>`
  }

  const findLapsedKegs=(items)=>{
    let lapsedKegsString=items.filter((item)=>{
        return item?.packType==='keg'
    }).map((item)=>{
        return capitalizeWords(item?.liquidName ||'')
    }).join(', ')
    return lapsedKegsString
  }

  /** Util Functions */
  function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }

  $(".sortClick").on('click',function(){
    alert('hi')
   
  })