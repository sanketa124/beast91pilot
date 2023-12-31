const regex = /^(91\d{10}|\d{10})$/;
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
    if (accountDetail?.Contacts?.records?.length) {
        accountDetail.Contacts.records.forEach((ele, index) => {
          console.log(ele);
          if (ele.Active__c) {
            temp += '<div class="row contactDetailsBorder all-stars">';
            temp += '<div class="col-xs-1">';
            temp += `<input class="form-check-input" name="radio" type="radio" id="${ele.Phone ? ele.Phone: index }" onchange=" handleRadioChange(${ele?.Phone?ele?.Phone: index})" >`;
            temp += '</div>';
            temp += '<div class="col-xs-2">';
            temp += '<label class="contactDetailsTxt">' + ele.Salutation + '</label>';
            temp += '</div>';
            temp += '<div class="col-xs-3">';
            temp += '<label class="contactDetailsTxt">' + ele.FirstName + '</label>';
            temp += '</div>';
            temp += '<div class="col-xs-2">';
            temp += '<label class="contactDetailsTxt">' + ele.LastName + '</label>';
            temp += '</div>';
            temp += '<div class="col-xs-3">';
            temp += '<label class="contactDetailsTxt">' + (ele.Phone ? ele.Phone : '') + '</label>';
            temp += '</div>';
            temp += '<div class="col-xs-1" style="margin-right:"5px">';
            temp += `<img onclick="onHandleEdit('${ele.Id}')" class="editIcon" src="/media/icons/editIcon.png" />`;
            temp += '</div>';
            temp += '</div>';
          }
        });
        $("#contactsCard").prepend(temp);
      }
    else{
        console.log('Contacts not present')
    }
  
})();

finalSubmit = () => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    const selectedMeetingsCount = [...document.querySelectorAll('input[name="radio"]')].filter(radio => radio.checked).length;
    console.log(selectedMeetingsCount, 'selectedMeetingsCount')
    if(selectedMeetingsCount == 0){
        $('#contactMeetingSubmit').modal('show');
    }else{
      const mobile= localStorage.getItem('allstars-invite-mobile')
      if(regex.test(mobile)){
        $('#smsPopup').modal('show');
      }
      else{
        alert('Please select a user with valid mobile')
      }
    }
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
  
  smsSuccess =async () => {
    const mobile= localStorage.getItem('allstars-invite-mobile');
    await inviteUserSms(mobile||'')
    localStorage.removeItem('allstars-invite-mobile');
    alert('SMS sent to user successfully')
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/sales/recomendation.html?accountId=${accountId}`
  }

  handleRadioChange=(value)=>{
    localStorage.setItem('allstars-invite-mobile',value)
  }