
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});


(async function () {
    $('#contactsCard').empty();
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    let accountDetail = await getItemFromStore('account', accountID);
    let existingContacts = accountDetail &&  accountDetail.Contacts &&  accountDetail.Contacts.records ? accountDetail.Contacts.records.length : 0
    $('#existingValue').html(existingContacts);
    let temp = ''
    accountDetail.Contacts.records.forEach((ele, index) => {
        if (ele.Active__c) {
            temp += '<div class="row contactDetailsBorder">'
            temp += '<div class="col-xs-1">'
            temp += '<input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>'
            temp += ' </div>'
            temp += '<div class="col-xs-1">'
            temp += '<label class="contactDetailsTxt">' + ele.Salutation + '.</label>'
            temp += ' </div>'
            temp += '<div class="col-xs-2">'
            temp += ' <label class="contactDetailsTxt">' + ele.FirstName + '</label>'
            temp += '</div>'
            temp += '<div class="col-xs-2">'
            temp += '<label class="contactDetailsTxt">' + ele.LastName + '</label>'
            temp += '</div>'
            temp += '<div class="col-xs-3">'
            temp += '<label class="contactDetailsTxt">' + ele.Role__c + '</label>'
            temp += '</div>'
            temp += '<div class="col-xs-2">'
            temp += `<img onclick="onHandleEdit('${index}')" class="editIcon" src="/media/icons/editIcon.png" />`
            temp += '</div>'
            temp += '</div> '
        }
    })
    $("#contactsCard").prepend(temp);
})();

openAddMeetAndGreet = () => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    window.location.href = `/view/meetAndGreets/meetAndGreetAdd/meetAndGreetAdd.html?accountId=${accountID}`;
}

onHandleEdit = (ID) => {
    let urlParam = new URLSearchParams(window.location.search);
    const accountID = urlParam.get('accountId')
    window.location.href = `/view/meetAndGreets/meetAndGreetAdd/meetAndGreetAdd.html?accountId=${accountID}&index=${ID}`;
}
const initializeMeetAndGreetMainPage = async () => {
};


initializeMeetAndGreetMainPage()
