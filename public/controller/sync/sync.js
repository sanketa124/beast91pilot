let isAccountSyncWithoutError = true;
const initializeSync = async () => {
    let loginData =await loginDataFetch();
    await eventsFetch(loginData[0].username,loginData[0].password);
    //await issuesFetch(loginData[0].username,loginData[0].password);
    await accountFetch(loginData[0].username,loginData[0].password);
    await itemsFetch(loginData[0].username,loginData[0].password);
    await objectivePushHelper(loginData[0].username,loginData[0].password);
    await itemImagesFetch(loginData[0].username,loginData[0].password);
    await payOutSlabsFetch(loginData[0].username,loginData[0].password);
    await accountGoalsFetch(loginData[0].username,loginData[0].password);
    await marketInventoriesFetch(loginData[0].username,loginData[0].password);
    await reportFetch(loginData[0].username,loginData[0].xx);
};

const loginDataFetch = async () => {
    return await readAllData('login');
};

// const issuesFetch = async(username,password,nonSales) => {
//     try{
//     let cases = await readAllData('caseSync');
//     console.log(cases,"Issues List ::::::::::::::::::::::::::::::");
//     let res = await fetch('/issueList',{
//         method : 'POST',
//         headers : {
//             'Content-Type' : 'application/json'
//         },
//         body : JSON.stringify({
//             username : username,
//             password : password,
//             tasks : tasks,
//             nonSales : nonSales,
//             case:cases
//         })
//     });
//     let resJson = await res.json();
//     console.log(resJson, "::::::::::::::::::::::::::ISSUE LIST:::::::::::::::::::::::::::::::::::::::::::");
//     if(resJson.isError){
//         console.log(resJson.isError);
//         // Add Notification method here
//     }
//     else if(resJson.isError===false){
//         if(!resJson.isAuth){
//             clearAll();
//         }
//         else{
//             console.log('Isssyes syncing complete');
//             await clearAllData('case');
//             await clearAllData('caseSync');
//             await writeDataAll('case',resJson.issueList);
//         }
        
//     }
//     else{
//         console.log(e,"");
//         // Add Notification method here
//     }
//     showNotification({message : 'Issues sync complete!'});
//     }
//     catch(err){
//         showNotification({message : 'Error Occured Contact Adminstrator for more help!'})
//         console.log(err, "Erorororororororor");
//     }
// };


const accountFetch = async (username,password,syncDateTime) => {
    try{
        let contacts = await readAllData('contactsync');
        let newLeads = await readAllData('leadsync');
        let res = await fetch('/accountList',{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            username : username,
            password : password,
            syncDateTime : syncDateTime,
            contacts : contacts,
            leads : newLeads,
        })
        });
        
        let dataSent = false;
        let resStream = await res.body.getReader();
        let str = '';
        while(!dataSent){
            let uintData = await resStream.read();
            
            if(uintData.done){
                dataSent = true;
                // await parsingAccountData(dataStr);
            }
            if(uintData.value){
                str += await myConvertFunc(uintData.value);
                while(str.includes('$$$')){
                    let indexOfDollar = str.indexOf('$$$');
                    let tempStr = str.substring(0,str.indexOf('$$$'));
                    parsingAccountData(tempStr);
                    str = str.substring((indexOfDollar+3));
                }
            }
        }
        // await writeDataAll('account',JSON.parse(message));
        await clearAllData('contactsync');
        await clearAllData('leadsync');
        if(isAccountSyncWithoutError)
            showNotification({message : 'Account sync complete!'});
    }
    catch(e){
        showNotification({message : 'Issue in syncing account.Pl contact System Adminstrator for more help!'});
        console.log(e);
    }
    
};
function myConvertFunc(arr) {
    let str = "";
    for (var i=0; i<arr.byteLength; i++) {
      str += String.fromCharCode(arr[i]);
    }
  return str;
   
  };
const parsingAccountData = async (dataStr) => {
    let jsonData = JSON.parse(dataStr);
    for(let i of jsonData){
        if(i&&i.attributes&&i.attributes.type==='Account'){
            if(i.RecordType.DeveloperName==='Lead' && i.Lead_Status__c === 'Approved' ){
                await writeData('lead',i);
            }
            else{
                await deleteItemFromData('lead',i.Id);
                await writeData('account',i);
            }
        }
        else if(i&&i.attributes&&i.attributes.type==='Sales_Orders__c'){
            await writeData('salesOrderBackend',i);
        }
        else if(i&&i.attributes&&i.attributes.type==='Draft_Items__c') {
            await writeData('draftItems',i);
        }
        else if(i&&i.attributes&&i.attributes.type==='POSM_Line_Item__c') {
            await writeData('posmItems',i);
        }
        else if(i&&i.attributes&&i.attributes.type==='Product_Pre_Sales_Sampling_Child__c') {
            await writeData('samplingChilds',i);
        }
        else if(i&&i.attributes&&i.attributes.type==='Stock_Visibility_Survey_Child__c') {
            await writeData('stockChilds',i);
        }
        else {
            isAccountSyncWithoutError = false;
            showNotification({message : 'Issue in syncing account.Pl contact System Adminstrator for more help!'});
        }
    }
};


const eventsFetch = async(username,password,nonSales) => {
    try{
    let tasks = await readAllData('taskSync');
    let cases = await readAllData('caseSync');
    //console.dir(cases,"::::::::::::::::::::TTTTTTTTTTT:::::::::::::");
    let res = await fetch('/eventList',{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            username : username,
            password : password,
            tasks : tasks,
            nonSales : nonSales,
            case:cases
        })
    });
    let resJson = await res.json();
    if(resJson.isError){
        console.log(resJson.isError);
        // Add Notification method here
    }
    else if(resJson.isError===false){
        if(!resJson.isAuth){
            clearAll();
        }
        else{
            console.log('Event syncing complete');
            await deleteItemFromData('utility','cluster');
            await writeData('utility',{
                'sobjectName' : 'stateClusterMapping',
                stateClusterList : resJson.stateClusterMapping,
            });
            await writeData('utility',{
                'sobjectName' : 'territoryRecords',
                territoryRecords : resJson.territoryRecords,
            });
            await clearAllData('standardEvents');
            await clearAllData('taskOriginal');
            await clearAllData('taskSync');
            await clearAllData('draftPreInstallationApproval');
            await writeDataAll('draftPreInstallationApproval',resJson.draftInstallationPendingApproval);
            await writeDataAll('taskOriginal',resJson.taskList);
            localStorage.setItem('lapsedAccount',JSON.stringify(resJson.lapsedAcc))
            localStorage.setItem('NBA',JSON.stringify(resJson.NBA))
            await clearAllData('case');
            await clearAllData('caseSync');
            console.log(resJson.issueList, ":::::::::::::::::::::::::::::KHATAl:::::::::::::::::::::::::::::");
            await writeDataAll('case',resJson.issueList);
            //localStorage.setItem('case',JSON.stringify(resJson.issueList))
            //await writeDataAll('events.lapsedAccount',resJson.lapsedAcc);
            await clearAllData('events');// Check to only delete not modified data
            await writeDataAll('events',resJson.events);
            await writeDataAll('standardEvents',resJson.standardEvents);
            await clearAllData('eventRecordTypes');
            await writeDataAll('eventRecordTypes',resJson.eventRecordTypes);
        }
        
    }
    else{
        //console.log(e);
        // Add Notification method here
    }
    showNotification({message : 'Events sync complete!'});
    }
    catch(err){
        showNotification({message : 'Issue in syncing events.Pl contact System Adminstrator for more help!'})
        console.log(err);
    }
};

const itemsFetch = async( username,password,syncDateTime,nonSales) => {
    try{
        let res = await fetch('/itemList',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                username : username,
                password : password,
                syncDateTime :syncDateTime,
                nonSales : nonSales
            })
        });
        let resJson = await res.json();
        if(resJson.isError){
            console.log(resJson.message);
            // Add Notification method here
        }
        else if(resJson.isError===false){
            if(!resJson.isAuth){
                clearAll();
            }
            else{
                
                // await clearAllData('itemMaster');// Check to only delete not modified data
                let productActive = resJson.items.filter(ele => {
                    if(ele.Product__c){
                        return ele.Product__r.IsActive;
                    }
                    else{
                        return false;
                    }
                });
                let productInActive = resJson.items.filter(ele => {
                    if(ele.Product__c){
                        return !ele.Product__r.IsActive;
                    }
                    else{
                        return false;
                    }
                });
                for(let i = 0;i<productInActive.length;i++){
                    await deleteItemFromData('itemMaster',productInActive[i].Id);
                }
                let clustLiquidMapping = {
                    sobjectName : 'clusterLiquid',
                    clusterLiquids : resJson.clusterLiquids
                };
                await clearAllData('top5SKU');
                await writeData('utility',clustLiquidMapping);
                await writeDataAll('itemMaster',productActive);
                await writeDataAll('top5SKU',resJson.top5SKU);
                await clearAllData('itemMasterCopy')
                await writeDataAll('itemMasterCopy',resJson.masterItems)
                await clearAllData('itemMasterRecordTypes')
                await writeDataAll('itemMasterRecordTypes',resJson.itemMasterRecordTypes)

                console.log('Item Master syncing complete');
            }
        }
        else{
            console.log(e);
            // Add Notification method here
        }
        showNotification({message : 'Items sync complete!'});
    }
    catch(err){
        console.log("Issue in items sync======>")
        showNotification({message : 'Issue in syncing events.Pl contact System Adminstrator for more help!'});
        console.log(err);
    }
    
};

const itemImagesFetch = async (username,password,syncDateTime) => {
    try{
        let items = await readAllData('itemMaster');
        let nonBeerItem = await readAllData('nonBeerItems');
        let itemIds = [];
        items.forEach(ele => {
            itemIds.push(ele.Product__c);
        });
        nonBeerItem.forEach(ele => {
            itemIds.push(ele.Id);
        });
        let res = await fetch('/itemImages',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                username : username,
                password : password,
                itemIds : itemIds,
                syncDateTime : syncDateTime
            })
        });
        let resJson = await res.json();
        if(resJson.isError){
            console.log(resJson.message);
            // Add Notification method here
        }
        else if(resJson.isError===false){
            if(!resJson.isAuth){
                clearAll();
            }
            else{
                const imagewritesample=await writeDataAll('itemMasterImages',resJson.images);
                console.log(`writeall item master`,imagewritesample)
            }
        }
        else{
            console.log(e);
            showNotification({message : 'Items Images sync complete!'});
            // Add Notification method here
        }
    }
    catch(err){
        showNotification({message : 'Issue in syncing Items Images.Pl contact System Adminstrator for more help!'});
        console.log(err);
    }
    
};



const reportFetch = async (username,password) => {
    try{
        let res = await fetch('/homePageDashboardFetch',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                username : username,
                password : password
            })
        });
        let dataSent = false;
        let resStream = await res.body.getReader();
        let str = '';
        while(!dataSent){
            let uintData = await resStream.read();
            if(uintData.done){
                dataSent = true;
                await parsingReportData(str);
                break;
            }
            if(uintData.value){
                str += await myConvertFunc(uintData.value);
            }
        }
        showNotification({message : 'Reports sync complete!'});
    }
    catch(err){
        showNotification({message : 'Issue in syncing reports.Pl contact System Adminstrator for more help!'});
        console.log(err);
    }
    
};
const parsingReportData =async (dataStr) => {
    const reportData = JSON.parse(dataStr);
    writeData('utility',{
        ...reportData,
        sobjectName : 'report'
    });
};

const clearAll =async () => {
    $('#loader-main').css('display', 'block');
    $('#logoutModal').modal('hide');
    // var navBar = document.getElementById("sideNav");
    // navBar.style.left = "-250px";
    // navBar.style.boxShadow = "0px 0px 0px 0px #000000";
    //document.getElementById("backdraw").style.left = "-100%";
    await deleteDatabase();// Un-install and install helper
    window.location.href = '/';
};



const objectivePushHelper =async (username,password,syncDateTime,nonSales)  => {
    try{
        let competitorInsights = await readAllData('competitorInsight');
        let dailyTracker = await readAllData('dailyTracker');
        let eventsSync = await readAllData('eventsSync');
        let kycDetail = await readAllData('kycDetail');
        let salesOrderSync = await readAllData('salesOrderSync');
        let caseSync = await readAllData('caseSync');
        let stockVisibility = await readAllData('stockVisibility');
        let contactMeeting = await readAllData('contactMeeting');
        let productSampling = await readAllData('productSampling');
        let posm = await readAllData('posm');
        let draftSignup = await readAllData('draft_Signup');
        let draftPreInstallation = await readAllData('draftPreInstallation');
        let scheduleVisit = await readAllData('scheduleVisit');
        let draftInstallation = await readAllData('draftInstallation');
        let machineCommissioning = await readAllData('machineCommissioning');
        let training = await readAllData('training');
        let draftSanitization = await readAllData('draftSanitization');
        let preventiveMaintenance = await readAllData('preventiveMaintainance');
        let draftPullout = await readAllData('draftPullout');
        let auditorObjective = await readAllData('auditorObjective');
        let draftPreInstallationApproval = await readAllData('draftPreInstallationApproval');
        let draftPreInstallationApprovalHelper = [];
        eventsSync = eventsSync.filter(ele => {
            return !ele.isSynced;
        });
        dailyTracker = dailyTracker.filter(ele => {
            return !ele.isSynced;
        }); 
        competitorInsights = competitorInsights.filter(ele => {
            return !ele.isSynced;
        }); 
        kycDetail = kycDetail.filter(ele => {
            return !ele.isSynced;
        }); 
        salesOrderSync = salesOrderSync.filter(ele => {
            return !ele.isSynced;
        }); 

        caseSync = caseSync.filter(ele => {
            return !ele.isSynced;
        });
        caseSync
        productSampling = productSampling.filter(ele => {
            return !ele.isSynced;
        }); 
        
        stockVisibility = stockVisibility.filter(ele => {
            return !ele.isSynced;
        }); 
        contactMeeting = contactMeeting.filter(ele => {
            return !ele.isSynced;
        }); 
        posm = posm.filter(ele => {
            return !ele.isSynced && ele.isCheckedOut;
        }); 
        draftSignup = draftSignup.filter(ele => {
            return !ele.isSynced && ele.isCheckedOut;
        }); 
        draftPreInstallation = draftPreInstallation.filter(ele => {
            return !ele.isSynced && ele.isCheckedOut;
        }); 
        draftInstallation = draftInstallation.filter(ele => {
            return !ele.isSynced && ele.isCheckedOut;
        }); 
        machineCommissioning = machineCommissioning.filter(ele => {
            return !ele.isSynced && ele.isCheckedOut;
        }); 
        training = training.filter(ele => {
            return !ele.isSynced && ele.isCheckedOut;
        }); 
        draftSanitization = draftSanitization.filter(ele => {
            return !ele.isSynced && ele.isCheckedOut;
        }); 
        preventiveMaintenance = preventiveMaintenance.filter(ele => {
            return !ele.isSynced && ele.isCheckedOut;
        }); 
        draftPullout = draftPullout.filter(ele => {
            return !ele.isSynced  && ele.isCheckedOut;
        }); 
        auditorObjective = auditorObjective.filter(ele => {
            return !ele.isSynced;
        });
        
        draftPreInstallationApproval = JSON.parse(JSON.stringify(draftPreInstallationApproval));
        draftPreInstallationApprovalHelper = draftPreInstallationApproval.filter(ele => {
            return !ele.isSynced;
        }); 
       
        draftPreInstallationApprovalHelper = JSON.parse(JSON.stringify(draftPreInstallationApprovalHelper));
        draftPreInstallationApprovalHelper = draftPreInstallationApprovalHelper.map(ele => {
            delete ele.isSynced;
            delete ele.Account__r;
            delete ele.Machine_Id_Not_Sign_Up__c;
            delete ele.Account__c;
            delete ele.App_Id__c;
            delete ele.Confirmed_with_the_outlet_owner_for_inst__c;
            delete ele.Draft_Sign_up__r;
            delete ele.Location_of_Draft_machine__c;
            delete ele.Over_the_counter_space_required__c;
            delete ele.Reason_for_Change__c;
            delete ele.Recommended_Machine_type__c;
            delete ele.Recommended_Tower_Type__c;
            delete ele.attributes;
            delete ele.Under_the_counter_space_required__c;
            return ele;
        }); 
       
        let res = await fetch('/objectiveSync',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                username : username,
                password : password,
                salesOrder : salesOrderSync,
                kycDetail : kycDetail,
                stockVisibility : stockVisibility,
                contactMeeting : contactMeeting,
                events :eventsSync,
                cases:caseSync,
                competitorInsight :competitorInsights,
                dailyTracker : dailyTracker,
                syncDateTime : syncDateTime,
                productSampling : productSampling,
                posm : posm,
                draftSignup : draftSignup,
                nonSales : nonSales,
                draftPreInstallation : draftPreInstallation,
                scheduleVisit : scheduleVisit,
                draftInstallation : draftInstallation,
                machineCommissioning : machineCommissioning,
                training : training,
                draftSanitization : draftSanitization,
                preventiveMaintenance : preventiveMaintenance,
                draftPullout : draftPullout,
                auditorObjective : auditorObjective,
                draftPreInstallationApproval :draftPreInstallationApprovalHelper,
            })
        });
        
        let resJson = await res.json();
        console.log('resJson',resJson)
        if(resJson.isError){
            console.log(resJson.message);
            // Add Notification method here
        }
        else if(resJson.isError===false){
            if(!resJson.isAuth){
                clearAll();
            }
            else{
                await clearAllData('nonBeerItems');
                await clearAllData('scheduleVisit');
                await storingLastVisitDealerWise(resJson.competitorInsightJSON,resJson.StockVisibilityJSON);
                await writeData('utility',{sobjectName : 'draftStarterKit',draftStarterKit : resJson.draftStarterKit});
                await writeDataAll('nonBeerItems',resJson.nonBeerProducts);
                await writeData('utility',{sobjectName : 'licenseType',licenseTypes : resJson.licenseType});
                await writeData('utility',{sobjectName : 'posmSettings' , posmSetting  :resJson.posmSetting.filter(ele => ele.DeveloperName==='POSM_App_Setup')});
                await writeData('utility',{sobjectName : 'draftSettings' , draftSetting  :resJson.posmSetting.filter(ele => ele.DeveloperName==='Draft_App_Setting')});
                eventsSync = eventsSync.map(ele => {
                    ele.isSynced = true;
                    return ele;
                });
                dailyTracker = dailyTracker.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                competitorInsights = competitorInsights.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                kycDetail = kycDetail.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                salesOrderSync = salesOrderSync.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                caseSync = caseSync.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                stockVisibility = stockVisibility.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                contactMeeting = contactMeeting.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                productSampling = productSampling.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                posm = posm.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                draftSignup = draftSignup.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                draftPreInstallation = draftPreInstallation.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                draftInstallation = draftInstallation.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                machineCommissioning =machineCommissioning.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                training  =training.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                draftSanitization  =draftSanitization.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                preventiveMaintenance  =preventiveMaintenance.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                draftPullout  =draftPullout.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                auditorObjective  =auditorObjective.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                }); 
                draftPreInstallationApproval = draftPreInstallationApproval.filter(ele => {
                    ele.isSynced = true;
                    return ele;
                });
                await writeDataAll('eventsSync',eventsSync);
                await writeDataAll('stockVisibility',stockVisibility);
                await writeDataAll('contactMeeting',contactMeeting);
                await writeDataAll('salesOrderSync',salesOrderSync);
                await writeDataAll('caseSync',caseSync);
                await writeDataAll('kycDetail',kycDetail);
                await writeDataAll('competitorInsight',competitorInsights);
                await writeDataAll('productSampling',productSampling);
                await writeDataAll('dailyTracker',dailyTracker);
                await writeDataAll('posm',posm);
                await writeDataAll('draft_Signup',draftSignup);
                await writeDataAll('draftPreInstallation',draftPreInstallation);
                await writeDataAll('draftInstallation',draftInstallation);
                await writeDataAll('machineCommissioning',machineCommissioning);
                await writeDataAll('training',training);
                await writeDataAll('draftSanitization',draftSanitization);
                await writeDataAll('preventiveMaintainance',preventiveMaintenance);
                await writeDataAll('draftPullout',draftPullout);
                await writeDataAll('auditorObjective',auditorObjective);
                await writeDataAll('draftPreInstallationApproval',draftPreInstallationApproval);
            }
            showNotification({message : 'Objectives sync complete!'});
        }
        else{
            console.log(e);
            showNotification({message : 'Issue in syncing Objectives.Pl contact System Adminstrator for more help!'});
            // Add Notification method here
        }
    }
    catch(err){
        showNotification({message : 'Issue in syncing Objectives.Pl contact System Adminstrator for more help!'});
        console.log(err);
    }
    
       
};


const deletePreviousObjectiveHelper = async () => {
    let competitorInsights = await readAllData('competitorInsight');
    let dailyTracker = await readAllData('dailyTracker');
    let eventsSync = await readAllData('eventsSync');
    let kycDetail = await readAllData('kycDetail');
    let salesOrderSync = await readAllData('salesOrderSync');
    let caseSync = await readAllData('caseSync');
    let stockVisibility = await readAllData('stockVisibility');
    let contactMeeting = await readAllData('contactMeeting');
    let productSampling = await readAllData('productSampling');
    let posm = await readAllData('posm');
    let draftSignup = await readAllData('draft_Signup');
    let draftPreInstallation = await readAllData('draftPreInstallation');
    let draftInstallation = await readAllData('draftInstallation');
    let machineCommissioning = await readAllData('machineCommissioning');
    let training = await readAllData('training');
    let draftSanitization = await readAllData('draftSanitization');
    let preventiveMaintenance = await readAllData('preventiveMaintainance');
    let draftPullout = await readAllData('draftPullout');
    let auditorObjective = await readAllData('auditorObjective');
    eventsSync = eventsSync.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    });
    dailyTracker = dailyTracker.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    }); 
    competitorInsights = competitorInsights.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    }); 
    kycDetail = kycDetail.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    }); 
    salesOrderSync = salesOrderSync.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    }); 
    
    caseSync = caseSync.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    }); 
    stockVisibility = stockVisibility.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    });
    contactMeeting = contactMeeting.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    });
    productSampling = productSampling.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    });
    posm = posm.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    });
    draftSignup = draftSignup.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    });
    draftPreInstallation = draftPreInstallation.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    });
    draftInstallation = draftInstallation.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    });
    machineCommissioning = machineCommissioning.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    });
    training = training.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    });
    draftSanitization = draftSanitization.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    });
    preventiveMaintenance = preventiveMaintenance.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    });
    draftPullout = draftPullout.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    });
    auditorObjective = auditorObjective.filter(ele => {
        let storedDate = ele.Created_Date.setHours(0,0,0,0);
        let currentDate = new Date().setHours(0,0,0,0);
        return ele.isSynced&&(currentDate!==storedDate);
    });
    
    
    for(let i=0;i<eventsSync.length;i++){
        await deleteItemFromData('eventsSync',eventsSync[i].App_Id);
    }
    for(let i=0;i<dailyTracker.length;i++){
        await deleteItemFromData('dailyTracker',dailyTracker[i].App_Id);
    }
    for(let i=0;i<kycDetail.length;i++){
        await deleteItemFromData('kycDetail',kycDetail[i].App_Id);
    }
    for(let i=0;i<salesOrderSync.length;i++){
        await deleteItemFromData('salesOrderSync',salesOrderSync[i].App_Id);
    }
    for(let i=0;i<caseSync.length;i++){
        await deleteItemFromData('caseSync',caseSync[i].App_Id);
    }
    for(let i=0;i<stockVisibility.length;i++){
        await deleteItemFromData('stockVisibility',stockVisibility[i].App_Id);
    }
    for(let i=0;i<contactMeeting.length;i++){
        await deleteItemFromData('contactMeeting',contactMeeting[i].App_Id);
    }
    for(let i=0;i<productSampling.length;i++){
        await deleteItemFromData('productSampling',productSampling[i].App_Id);
    }
    for(let i=0;i<posm.length;i++){
        await deleteItemFromData('posm',posm[i].App_Id__c);
    }
    for(let i=0;i<draftSignup.length;i++){
        await deleteItemFromData('draft_Signup',draftSignup[i].App_Id__c);
    }
    for(let i=0;i<draftPreInstallation.length;i++){
        await deleteItemFromData('draftPreInstallation',draftPreInstallation[i].App_Id__c);
    }
    for(let i=0;i<draftInstallation.length;i++){
        await deleteItemFromData('draftInstallation',draftInstallation[i].App_Id__c);
    }
    for(let i=0;i<machineCommissioning.length;i++){
        await deleteItemFromData('machineCommissioning',machineCommissioning[i].App_Id__c);
    }
    for(let i=0;i<training.length;i++){
        await deleteItemFromData('training',training[i].App_Id__c);
    }
    for(let i=0;i<draftSanitization.length;i++){
        await deleteItemFromData('draftSanitization',draftSanitization[i].App_Id__c);
    }
    for(let i=0;i<preventiveMaintenance.length;i++){
        await deleteItemFromData('preventiveMaintainance',preventiveMaintenance[i].App_Id__c);
    }
    for(let i=0;i<draftPullout.length;i++){
        await deleteItemFromData('draftPullout',draftPullout[i].App_Id__c);
    }
    for(let i=0;i<auditorObjective.length;i++){
        await deleteItemFromData('draftPullout',auditorObjective[i].App_Id__c);
    }
  //  await clearAllData('draftPreInstallationApproval');
};



const storingLastVisitDealerWise =async (competitorInsights,stockVisibility) => {
    await writeDataAll('recentCompetitorInsightDealerWise',competitorInsights ? competitorInsights : []);
    await writeDataAll('recentStockVisibilityDealerWise',stockVisibility ? stockVisibility : []);
};


// Helper Method for checking errors
const errorCheckingHelper = (responseJSON) => {
    if(responseJSON.isError){
        console.log(responseJSON.message);
        showNotification({message : 'Server Error due to '+responseJSON.message});
        return false;
        // Add Notification method here
    }
    else if(!responseJSON.isAuth){
        clearAll();
        // Add Notification - Authentication Failure
        showNotification({message : 'Authentication Failure'});
        return false;
    }

    return true;
};

const libraryFilesFetch =async (username,password,syncDateTime) => {
    // Fetch the below Content Version Array dynamically using a query.
    // const contentVersionArr = ['0684p000006uVSxAAM','0684p000006ueEzAAI','0684p000006ueFEAAY','0684p000006ueG2AAI','0684p000006ueG7AAI','06846000000xoRKAAY','06846000002DoVVAA0','06846000003IERwAAO','06846000003IERxAAO','0684p000005feZ3AAI','0684p000005feZ5AAI'];
    try{
        let response = await fetch('/sellingToolsContentVersionIds',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                username:username,
                password : password,
                syncDateTime : syncDateTime
            })
        });
        let responseJSON = await response.json();
        if(errorCheckingHelper(responseJSON)){
            if(responseJSON.contentVersionIds &&responseJSON.contentVersionIds.length>0 ){
                let contentVersionArr = responseJSON.contentVersionIds;
                for(let i of contentVersionArr){
                    await fileFetch(username,password,i);
                }
            }
        }
        showNotification({message : 'Files Sync Complete sync complete!'});
      
    }
    catch(err){
        showNotification({message : 'Issue in syncing Files.Pl contact System Adminstrator for more help!'});
        console.log(err);
    }
   
};
const fileFetch = async(username,password,contentVersionRecord) => {
    
    let res = await fetch('/sellingToolsFiles',{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            username : username,
            password : password,
            contentVersionId : contentVersionRecord.Id,
            
        })
    });
    let dataSent = false;
    let dataStr = '';
    

    let resStream = await res.body.getReader();
    
    while(!dataSent){
        let uintData = await resStream.read();
        if(uintData.done){
            dataSent = true;
            await parsingContentFiles(dataStr,contentVersionRecord);
        }
        let temp = (new TextDecoder("utf-8").decode(uintData.value));
        
        dataStr += temp;
    }
};


const parsingContentFiles = async (dataStr,contentVersionRecord) => {
    contentVersionRecord.VersionData  = dataStr;
    await writeData('sellingTools',contentVersionRecord);
    
};


/*** Start of Recommendation Controllers */
const fetchRecommendations=async(username,password)=>{

    try{
        let res = await fetch('/recommendations',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                username : username,
                password : password,
            })
        });
        if (res.ok) {
            let data = await res.json();
            const recommendations=(data?.recommendations ||[]);
            await clearAllData('recommendations');
            await writeDataAll('recommendations',recommendations);
        } else {
            console.error("Error: " + res.status);
          }
    }
    catch(err){
        console.log(err)
    }
   
  
}
const fetchAllLiquids=async(username,password)=>{
    try{
        let res = await fetch('/liquid-layer',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                username : username,
                password : password,
            })
        });
        if (res.ok) {
            let data = await res.json();
            const liquids=(data?.liquidLayer ||[])
            await writeDataAll('Liquid_Layer__c',liquids);
        } else {
            console.error("Error: " + res.status);
          }
    }
    catch(err){
        console.log(err)
    }
}
const pushApprovedRecommendationObjects=async(username, password)=>{
    /*** Push Approved Recommendations/Promotions to sfdc*/
    try{

        let promotions = await readAllData('activated_promotions');
        console.log('active promotions')
        console.log(promotions)
        let recommendations= await readAllData('accepted_recommendations');
        console.log('recommendations')
        console.log(recommendations)
        let items=[...promotions,...recommendations];
        let res = await fetch('/sfdc/push-recommendations',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                username : username,
                password : password,
                items
            })
        });
        if (res.ok) {
            let data = await res.json();
            await clearAllData('activated_promotions');
            await clearAllData('accepted_recommendations');
        } else {
            console.error("Error: " + res.status);
            await clearAllData('activated_promotions');
            await clearAllData('accepted_recommendations');
          }
    }
    catch(err){
        await clearAllData('activated_promotions');
        await clearAllData('accepted_recommendations');
        console.log(err)
    }
}
const syncSamples=async(username, password)=>{
/**  Push Sample Parent and Sample Line Items to sfdc */
    try{

        console.log('Inside sync samples')
        let items = await readAllData('Unsynced_Sample');
        if(!items?.length){
            console.log('no Sample items present to be processed')
        }
        else{
            let res = await fetch('/sfdc/push-samples',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    username : username,
                    password : password,
                    items
                })
            });
            if (res.ok) {
                let data = await res.json();
                await clearAllData('Unsynced_Sample');
                await clearAllData('Unsynced_Sample_Items');
                console.log(data?.proccessedamples)
            } else {
                console.error("Error: " + res.status);
                await clearAllData('Unsynced_Sample');
                await clearAllData('Unsynced_Sample_Items');
              }
        }
     
    }
    catch(err){
        console.log(err)
        await clearAllData('Unsynced_Sample');
        await clearAllData('Unsynced_Sample_Items');
    }

}
/*** End of Recommendation Controllers */

/** Outlet-360 sync methods */
const outlet360Records=async(username,password)=>{
    try{
        let res = await fetch('/outlet-360/records',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body :JSON.stringify({
                    username : username,
                    password : password,
                })
            });
            if (res.ok) {
                let data = await res.json();
                const {records}=data
                await clearAllData('outlet360');
                await writeDataAll('outlet360',records);
            }
    }
    catch(err){
        console.log(err)
        await clearAllData('outlet360');
    }
}
const outlet360RetailDepletion=async(username,password)=>{
    try{
        let res = await fetch('/outlet-360/rate-depletion',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    username : username,
                    password : password,
                })
            });
            if (res.ok) {
                let data = await res.json();
                const {retailDepletion}=data
                await clearAllData('outlet360-rate-depletion');
                await writeDataAll('outlet360-rate-depletion',retailDepletion);
            }
    }
    catch(err){
        console.log(err)
        await clearAllData('outlet360-rate-depletion');
    }
}
const outlet360AccountGoals=async(username,password)=>{
    try{
        let res = await fetch('/outlet-360/account-goals',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    username : username,
                    password : password,
                    recordTypeName: 'SKU'
                })
            });
            if (res.ok) {
                let data = await res.json();
                const {accountGoals}=data
                await clearAllData('outlet360-account-goals');
                await writeDataAll('outlet360-account-goals',accountGoals);
            }
    }
    catch(err){
    }
}
const outlet360Events=async(username,password)=>{
    try{
        let res = await fetch('/outlet-360/events',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    username : username,
                    password : password,
                })
            });
            if (res.ok) {
                let data = await res.json();
                const {events}=data
                await clearAllData('outlet360-events');
                await writeDataAll('outlet360-events',events);
            }
    }
    catch(err){
        console.log(err)
    }
}

const outlet360VisibilityScores=async(username,password)=>{
    try{
        let res = await fetch('/outlet-360/visibility-scores',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    username : username,
                    password : password,
                })
            });
            if (res.ok) {
                let data = await res.json();
                const {visibilityScores}=data
                await clearAllData('outlet360-visibility-score');
                await writeDataAll('outlet360-visibility-score',visibilityScores);
            }
    }
    catch(err){
        console.log(err)
    }
}

const outlet360PosItemRequisition=async(username,password)=>{
    try{
        let res = await fetch('/outlet-360/posm-items',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    username : username,
                    password : password,
                })
            });
            if (res.ok) {
                let data = await res.json();
                const {posLineItems}=data
                await clearAllData('outlet360-positems');
                await writeDataAll('outlet360-positems',posLineItems);
            }
    }
    catch(err){
        console.log(err)
    }
}

/** End of Outlet-360 event methods */

const payOutSlabsFetch = async(username,password) => {
    try{
    let slabs = await readAllData('payOutSlabs')
    let res = await fetch('/salesOrderPayOut',{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            username : username,
            password : password
        })
    });    
    let resJson = await res.json();
    console.log("Slabs Data====>",resJson)
    if(resJson.isError){
        console.log(resJson.isError);
        // Add Notification method here
    }
    else if(resJson.isError===false){
        if(!resJson.isAuth){
            clearAll();
        }
        else{
            console.log('Pay Out Slabs sync complete');
            await clearAllData('payOutSlabs');
            await writeDataAll('payOutSlabs',resJson.slabs);
        }
        
    }
    showNotification({message : 'PayOutSlabs sync complete!'});
    }
    catch(err){
        showNotification({message : 'Issue in syncing events.Pl contact System Adminstrator for more help!'})
        console.log(err);
    }
};

const accountGoalsFetch = async(username,password) => {
    try{
    let goals = await readAllData('accountGoals')
    let res = await fetch('/accountGoals',{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            username : username,
            password : password
        })
    });
    let resJson = await res.json();
    if(resJson.isError){
        console.log(resJson.isError);
        // Add Notification method here
    }
    else if(resJson.isError===false){
        if(!resJson.isAuth){
            clearAll();
        }
        else{
            console.log('Account Goals Sync Complete');
            await clearAllData('accountGoals');
            await writeDataAll('accountGoals',resJson.goals);
        }
        
    }
    showNotification({message : 'Account Goals sync complete!'});
    }
    catch(err){
        showNotification({message : 'Issue in syncing events.Pl contact System Adminstrator for more help!'})
        console.log(err);
    }
};

const marketInventoriesFetch = async(username,password) => {
    try{
    let goals = await readAllData('marketInventory')
    let res = await fetch('/distributorInventory',{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            username : username,
            password : password
        })
    });
    let resJson = await res.json();
    if(resJson.isError){
        console.log(resJson.isError);
        // Add Notification method here
    }
    else if(resJson.isError===false){
        if(!resJson.isAuth){
            clearAll();
        }
        else{
            console.log('Market Inventories Sync Complete');
            await clearAllData('marketInventory');
            await writeDataAll('marketInventory',resJson.data);
        }
        
    }
    showNotification({message : 'Market Inventories sync complete!'});
    }
    catch(err){
        showNotification({message : 'Issue in syncing events.Pl contact System Adminstrator for more help!'})
        console.log(err);
    }
};


