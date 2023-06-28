
const openMeetAndGreet = () => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    window.location.href = `../meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountID}`
}

function showAccountDetails() {
  const accountId = localStorage.getItem('accountId');
  window.location.href = `/view/accountDetail/accountDetailOnPremiseGeneral/accountDetailOnPremiseGeneralDetail.html?Id=${accountId}`;
}
gotoCheckin = () => {
    sessionStorage.setItem('checkinPlace','secondCheckin')
    window.location.href = '/view/checkIn/checkIn.html';
}
