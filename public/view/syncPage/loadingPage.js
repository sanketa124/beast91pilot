
const initializeLoadingPage = async() => {
  if(navigator.onLine){
    const nonSales = await isTechnicianAuditorFuncHelper();
    let loginData = await loginDataFetch();
      await itemsFetch(loginData[0].username,loginData[0].password,loginData[0].syncDateTime,nonSales);
      // showNotification({message : 'Items sync complete!'});
      progressBarLoad(20);
      await objectivePushHelper(loginData[0].username,loginData[0].password,loginData[0].syncDateTime,nonSales);
      // showNotification({message : 'Objectives sync complete!'});
      progressBarLoad(30);
      await accountFetch(loginData[0].username,loginData[0].password,loginData[0].syncDateTime);
      // showNotification({message : 'Account sync complete!'});
      progressBarLoad(40);
      await itemImagesFetch(loginData[0].username,loginData[0].password,loginData[0].syncDateTime);
      // showNotification({message : 'Items Images sync complete!'});
      progressBarLoad(50);
      await eventsFetch(loginData[0].username,loginData[0].password,nonSales);
      // showNotification({message : 'Events sync complete!'});
      progressBarLoad(60);
      if(nonSales.isSales){
        await reportFetch(loginData[0].username,loginData[0].password);
        // showNotification({message : 'Reports sync complete!'});
        progressBarLoad(70);
      }
      await payOutSlabsFetch(loginData[0].username,loginData[0].password);
      await accountGoalsFetch(loginData[0].username,loginData[0].password);
      await marketInventoriesFetch(loginData[0].username,loginData[0].password);
      // showNotification({message : 'Events sync complete!'});
      progressBarLoad(80);
      
      await libraryFilesFetch(loginData[0].username,loginData[0].password,loginData[0].syncDateTime);
     
     /** Recommendations and Samples */
      await pushApprovedRecommendationObjects(loginData[0].username,loginData[0].password);
      await syncSamples(loginData[0].username,loginData[0].password);
      await fetchRecommendations(loginData[0].username,loginData[0].password);
      await fetchAllLiquids(loginData[0].username,loginData[0].password);
      progressBarLoad(100);
      

      loginData[0].syncDateTime = new Date((new Date().setMinutes(new Date().getMinutes() - 10)));
      loginData[0].reminderDateTime = new Date((new Date().setMinutes(new Date().getMinutes() - 10)));
      await writeData('login',loginData[0]);

    
  }
  else{
    showNotification({message : 'Device offline cannot Sync!'});
  }
  setTimeout(async () => {
    const nonSales = await isTechnicianAuditorFuncHelper();
    if(!nonSales.isSales){
     // window.location.href = '/view/homePageTechnician/homePageTechnician.html';
     window.location.href = '/view/homePage/homePage.html';
    }
    else{
      window.location.href = '/view/homePage/homePage.html';
    }
    
  },500);
  
};
showNotification = (data) =>{
  $("#notification").fadeIn("slow");
  $("#notification span").html(data.message);
  setTimeout(function(){ $("#notification").fadeOut("slow"); }, 3000);
};

const progressBarLoad = (percentage) => {
  
  let progressBar = document.querySelector('.progress-bar');
  progressBar.style.minWidth =`${percentage}%`;
  progressBar.innerHTML = `${percentage}%`;
};

initializeLoadingPage();

