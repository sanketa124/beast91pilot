let contactMeetingData = {};
let eventId = localStorage.getItem('eventId');
(async function () {
    let urlParam = new URLSearchParams(window.location.search);
    var accountID = urlParam.get('accountId')
    const individual = urlParam.get('individual');
    const key = `${fetchCurrentDateIdStr()}-${accountID}`;
    let meetingDataArr = await getItemFromStore('contactMeeting', key);

    if (!meetingDataArr) {
        contactMeetingData.App_Id = `${fetchCurrentDateIdStr()}-${accountID}`;
        contactMeetingData.meetingData = [];
    }else{
        contactMeetingData = meetingDataArr;
    }
    if (individual == 'true') {
        $('#closeIco').hide();
        $('.arrowIcons').hide();
        $('.logoSection').css('width', '93%')
        $('#finishBtn').show();
    }
    $('[data-toggle="tooltip"]').tooltip();
    $('#contactsCard').empty();
    let accountDetail = await getItemFromStore('account', accountID);
    let existingContactsCount = accountDetail && accountDetail.Contacts && accountDetail.Contacts.records ? accountDetail.Contacts.records.length : 0
    $('#existingValue').html(existingContactsCount);
    
    //console.log('meetingDataArr',meetingDataArr)

    let temp = ''
    accountDetail.Contacts.records.forEach((ele, index) => {
        let hasMet = false;
        let checkedBox = '';
        if (meetingDataArr) {
            hasMet = meetingDataArr.meetingData.some(obj => obj.Contact__c === ele.Id);
            if(hasMet){
                checkedBox = 'checked';
            }
        }
        console.log('hasmet', hasMet)
        if (ele.Active__c) {
            temp += '<div class="row contactDetailsBorder">'
            temp += '<div class="col-xs-1">'
            temp += `<input class="form-check-input" type="checkbox" value="" id="${ele.Id}" name="contactMeetingChecks" onchange="manageContactMeeting('${ele.Id}')" ${checkedBox}>`
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

manageContactMeeting = (contactID) => {
    console.log('checked',contactMeetingData.meetingData)
    const updatedContact = contactMeetingData.meetingData.filter(obj => obj.Contact__c !== contactID);
    console.log('updatedContact',updatedContact)
    contactMeetingData.meetingData = updatedContact;
    
    const checkVal = $("#"+contactID).prop('checked');
    if(checkVal){
        contactMeetingData.meetingData.push({
            Event__c: eventId,
            Contact__c: contactID
        })
    }

    
}

finalSubmit = async () => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    const selectedMeetingsCount = [...document.querySelectorAll('input[name="contactMeetingChecks"]')].filter(checkbox => checkbox.checked).length;

    console.log('inputFields',selectedMeetingsCount)
    if (selectedMeetingsCount <= 0) {
        $('#contactMeetingSubmit').modal('show');
        $('#contactMeetingSubmit .modal-body').html('Please select the contacts that you have met');
        $('#contactMeetingSubmit .modal-footer .btn-success').css('display', 'none');
        $('#contactMeetingSubmit .modal-footer .btn-danger').html('Close');
    } else {
        await writeData('contactMeeting', contactMeetingData);
        window.location.href = `/view/sales/stockOutlet.html?accountId=${accountID}`
    }
}

openAddMeetAndGreet = () => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    const individual = urlParam.get('individual')
    if (individual == 'true') {
        window.location.href = `/view/meetAndGreets/meetAndGreetAdd/meetAndGreetAdd.html?accountId=${accountID}&individual=true`;
    } else {
        window.location.href = `/view/meetAndGreets/meetAndGreetAdd/meetAndGreetAdd.html?accountId=${accountID}`;
    }
}

onHandleEdit = (contactID) => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    const individual = urlParam.get('individual')
    if (individual == 'true') {
        window.location.href = `/view/meetAndGreets/meetAndGreetAdd/meetAndGreetAdd.html?accountId=${accountID}&contactId=${contactID}&individual=true`;
    } else {
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