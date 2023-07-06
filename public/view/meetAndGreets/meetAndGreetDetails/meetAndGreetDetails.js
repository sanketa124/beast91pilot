let contactMeetingData = {};
(async function () {
    let urlParam = new URLSearchParams(window.location.search);
    var accountID = urlParam.get('accountId')
    const individual = urlParam.get('individual')
    contactMeetingData.App_Id = `${fetchCurrentDateIdStr()}-${accountID}`;
    contactMeetingData.meetingData = [];
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
        if (ele.Active__c) {
            temp += '<div class="row contactDetailsBorder">'
            temp += '<div class="col-xs-1">'
            temp += `<input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"  onchange="manageContactMeeting('${ele.Id}')">`
            temp += ' </div>'
            temp += '<div class="col-xs-2">'
            temp += '<label class="contactDetailsTxt">' + ele.Salutation + '</label>'
            temp += ' </div>'
            temp += '<div class="col-xs-3">'
            temp += ' <label class="contactDetailsTxt">' + ele.FirstName + '</label>'
            temp += '</div>'
            temp += '<div class="col-xs-2">'
            temp += '<label class="contactDetailsTxt">' + ele.LastName + '</label>'
            temp += '</div>'
            temp += '<div class="col-xs-3">'
            temp += '<label class="contactDetailsTxt">' + ele.Role__c + '</label>'
            temp += '</div>'
            temp += '<div class="col-xs-1" style="margin-right:"5px">'
            temp += `<img onclick="onHandleEdit('${ele.Id}')" class="editIcon" src="/media/icons/editIcon.png" />`
            temp += '</div>'
            temp += '</div> '
        }
    })
    $("#contactsCard").prepend(temp);
})();

manageContactMeeting = (contactID) =>{
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    let eventId = localStorage.getItem('eventId')
    contactMeetingData.meetingData.push({
        Event__c : eventId,
        Contact__c : contactID
    })
}

finalSubmit = async() => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    await writeData('contactMeeting', contactMeetingData);
    console.log('contactMeetingData',contactMeetingData);
    window.location.href = `/view/sales/stockOutlet.html?accountId=${accountID}`
}

openAddMeetAndGreet = () => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    const individual = urlParam.get('individual')
    if(individual == 'true'){
        window.location.href = `/view/meetAndGreets/meetAndGreetAdd/meetAndGreetAdd.html?accountId=${accountID}&individual=true`;
    }else{
        window.location.href = `/view/meetAndGreets/meetAndGreetAdd/meetAndGreetAdd.html?accountId=${accountID}`;
    }
}

onHandleEdit = (contactID) => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    const individual = urlParam.get('individual')
    if(individual == 'true'){
        window.location.href = `/view/meetAndGreets/meetAndGreetAdd/meetAndGreetAdd.html?accountId=${accountID}&contactId=${contactID}&individual=true`;
    }else{
        window.location.href = `/view/meetAndGreets/meetAndGreetAdd/meetAndGreetAdd.html?accountId=${accountID}&contactId=${contactID}`;
    }
}
const initializeMeetAndGreetMainPage = async () => {
};


initializeMeetAndGreetMainPage()

goBack = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/sales/outlet360.html?accountId=${accountId}`
  }
  
  goForward = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/sales/stockOutlet.html?accountId=${accountId}`
  }