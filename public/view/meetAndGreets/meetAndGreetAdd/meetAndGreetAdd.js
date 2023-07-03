
let contactRec = {};
let currentContactSelection = {}
let accountRec = {}
let accountId = '';
let contactId = '';
onHandlePrevious = () => {
    window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountId}`;
}

const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const initializeMeetAndGreetPage = async () => {
    let urlParams = new URLSearchParams(window.location.search);
    accountId = urlParams.get('accountId');
    contactId = urlParams.get('contactId');
    accountRec = await getItemFromStore('account', accountId);
    contactRec = (accountRec.Contacts.records.filter(ele => {
        return ele.Id === contactId;
     }))[0];
    
    currentContactSelection = contactRec
    populateContactModal()
};

const populateContactModal = () => {
    $('#contactTitle').prop('value', currentContactSelection.Salutation ? currentContactSelection.Salutation : "");
    $('#contactFirstName').prop('value', currentContactSelection.FirstName ? currentContactSelection.FirstName : null);
    $('#contactLastName').prop('value', currentContactSelection.LastName ? currentContactSelection.LastName : null);
    $('#contactPhone').prop('value', currentContactSelection.Phone ? currentContactSelection.Phone : null);
    $('#contactEmail').prop('value', currentContactSelection.Email ? currentContactSelection.Email : null);
    $('#contactRole').prop('value', currentContactSelection.Role__c ? currentContactSelection.Role__c : "");
    $('#flexCheckChecked').prop('value', currentContactSelection.Active__c ? currentContactSelection.Active__c : "");
};

const handleMeetSaveContact = () => {
    if ($('#contactEmail').val()) {
        if (!validateEmail($('#contactEmail').val())) {
            $('.emailConReq').css('display', 'block');
            alert('Email is invalid');
            return;
        }
        else {
            $('.emailConReq').css('display', 'none');
        }
    }
    const contactTitle = $('#contactTitle').val();
    const contactFirstName = $('#contactFirstName').val();
    const contactLastName = $('#contactLastName').val();
    const contactPhone = $('#contactPhone').val();
    const contactEmail = $('#contactEmail').val()
    const contactRole = $('#contactRole').val();
    var isActive = $("#flexCheckChecked").is(":checked");
    if(!contactId){
        contactRec = {}
    }
    contactRec["Salutation"] = contactTitle;
    contactRec["FirstName"] = contactFirstName;
    contactRec["LastName"] = contactLastName;
    contactRec["Role__c"] = contactRole;
    contactRec["Phone"] = contactPhone;
    contactRec["Email"] = contactEmail;
    contactRec["Active__c"] = isActive;
    
    if (contactId) {
        handleUpdateSubmitContact()
    } else {
        handleNewSaveSubmitContact()
    }

};

const handleUpdateSubmitContact = async () => {
    await writeData('contact',contactRec);
    await writeData('contactsync',contactRec);
    let index = accountRec.Contacts.records.findIndex(ele => ele.Id===contactId);
    accountRec.Contacts.records.splice(index,1,contactRec);
    await writeData('account',accountRec);
    window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountId}`
};

const handleNewSaveSubmitContact = async () => {
    contactRec['Id'] = `${new Date().getTime()}`;
    contactRec['AccountId'] = accountId;
    contactRec['newContact'] = true;
    await writeData('contact', contactRec);
    await writeData('contactsync', contactRec);
    accountRec.Contacts.records.push(contactRec);
    await writeData('account', accountRec);
    window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountId}`
};

initializeMeetAndGreetPage()
