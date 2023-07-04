
(async function () {
    let urlParam = new URLSearchParams(window.location.search);
    var accountID = urlParam.get('accountId')
    const individual = urlParam.get('individual')
    console.log(individual, 'individual')
    if(individual == 'true'){
      $('#closeIco').hide();
      $('.arrowIcons').hide();
      $('.logoSection').css('width','93%')
      $('#finishBtn').show();
    }
    $('[data-toggle="tooltip"]').tooltip();
    $('#contactsCard').empty();
    let accountDetail = await getItemFromStore('account', accountID);
    let existingContactsCount = accountDetail &&  accountDetail.Contacts &&  accountDetail.Contacts.records ? accountDetail.Contacts.records.length : 0
    $('#existingValue').html(existingContactsCount);
    let temp = ''
    accountDetail.Contacts.records.forEach((ele, index) => {
        console.log(ele)
        if (ele.Active__c) {
            temp += '<div class="row contactDetailsBorder">'
            temp += '<div class="col-xs-1">'
            temp += '<input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>'
            temp += ' </div>'
            temp += '<div class="col-xs-1">'
            temp += '<label class="contactDetailsTxt">' + ele.Salutation + '.</label>'
            temp += ' </div>'
            temp += '<div class="col-xs-4">'
            temp += ' <label class="contactDetailsTxt">' + ele.FirstName + '</label>'
            temp += '</div>'
            temp += '<div class="col-xs-2">'
            temp += '<label class="contactDetailsTxt">' + ele.LastName + '</label>'
            temp += '</div>'
            temp += '<div class="col-xs-3">'
            temp += '<label class="contactDetailsTxt">' + ele.Phone + '</label>'
            temp += '</div>'
            temp += '<div class="col-xs-1" style="margin-right:"5px">'
            temp += `<img onclick="onHandleEdit('${ele.Id}')" class="editIcon" src="/media/icons/editIcon.png" />`
            temp += '</div>'
            temp += '</div> '
        }
    })
    $("#contactsCard").prepend(temp);
})();

finalSubmit = () => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    window.location.href = `/view/accountLanding/accountLanding.html?accountId=${accountID}`
}

openAddMeetAndGreet = () => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    window.location.href = `/view/meetAndGreets/meetAndGreetAdd/meetAndGreetAdd.html?accountId=${accountID}&enroll=true`;
}

onHandleEdit = (contactID) => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    window.location.href = `/view/meetAndGreets/meetAndGreetAdd/meetAndGreetAdd.html?accountId=${accountID}&contactId=${contactID}&enroll=true`;
}
const initializeMeetAndGreetMainPage = async () => {
};


initializeMeetAndGreetMainPage()

goBack = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/sales/recomendation.html?accountId=${accountId}`
  }
  
  smsSuccess = () => {
    alert('SMS sent to user successfully')
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/sales/recomendation.html?accountId=${accountId}`
  }