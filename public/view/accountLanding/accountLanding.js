
const openMeetAndGreet = () => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    window.location.href = `../meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountID}&individual=true`
}

const openGeoLocation = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  window.location.href = `../geoLocation/geoLocationAdd.html?accountId=${accountID}`
}

gotoSalesOrder = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  window.location.href = `../objectives/salesOrder/salesOrderLanding.html?accountId=${accountID}&individual=true`
}
gotoStockOutlet = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  window.location.href = `../sales/stockOutlet.html?accountId=${accountID}&individual=true`
}
gotoSampleTesting = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  window.location.href = `../sales/sampleTasting.html?accountId=${accountID}&individual=true`
}
gotoVisibility = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  window.location.href = `../sales/visibility.html?accountId=${accountID}&individual=true`
}
gotoPosm = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  window.location.href = `../sales/posm.html?accountId=${accountID}&individual=true`
}
gotoInsights = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  window.location.href = `../objectives/competitorInsights/competitionInsightsPage1.html?accountId=${accountID}&individual=true`
}

gotoFollowupPage = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  window.location.href = `/view/dashboard/followupTasks/followupTasks.html?accountId=${accountID}`
}


gotoOrderHistory = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  window.location.href = `/view/accountDetail/accountDetailOnPremiseHotel/accountDetailOnPremiseHotelRelated.html?Id=${accountID}&order=true`
}

gotoStock = () =>{
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  window.location.href = `/view/accountDetail/accountDetailOnPremiseHotel/accountDetailOnPremiseHotelRelated.html?Id=${accountID}&stock=true`
} 

gotoDraft = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  window.location.href = `/view/accountDetail/accountDetailOnPremiseHotel/accountDetailOnPremiseHotelRelated.html?Id=${accountID}&draft=true`
}

gotoContacts = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  window.location.href = `/view/accountDetail/accountDetailOnPremiseHotel/accountDetailOnPremiseHotelRelated.html?Id=${accountID}&contact=true`
}

gotoFiles = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  window.location.href = `/view/accountDetail/accountDetailOnPremiseHotel/accountDetailOnPremiseHotelMedia.html?Id=${accountID}&files=true`
}



function showAccountDetails() {
  const accountId = localStorage.getItem('accountId');
  window.location.href = `/view/accountDetail/accountDetailOnPremiseGeneral/accountDetailOnPremiseGeneralDetail.html?Id=${accountId}`;
}
gotoCheckin = () => {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
    sessionStorage.setItem('checkinPlace','secondCheckin')
    window.location.href = `/view/checkIn/checkIn.html?accountId=${accountID}`;
}
