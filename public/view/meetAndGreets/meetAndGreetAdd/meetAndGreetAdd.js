




onHandlePrevious = () => {
    window.location.href = '/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html';
}

const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

let contactRec = {};
let currentContactSelection = {}
let accountRec = {}

const initializeMeetAndGreetPage = async () => {
    let urlParam = new URLSearchParams(window.location.search);
    accountRec = await getItemFromStore('account', urlParam.get('accountId'));
    urlParam.get('accountId')
    let contactIndex = urlParam.get('index')
    currentContactSelection = accountRec.Contacts.records[contactIndex];
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

const handleSaveContact = () => {
    let urlParam = new URLSearchParams(window.location.search);

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
    contactRec["Salutation"] = contactTitle;
    contactRec["FirstName"] = contactFirstName;
    contactRec["LastName"] = contactLastName;
    contactRec["Role__c"] = contactRole;
    contactRec["Phone"] = contactPhone;
    contactRec["Email"] = contactEmail;
    contactRec["Active__c"] = isActive;
    if (urlParam.get('index')) {
        const contactID = currentContactSelection.Id
        contactRec["Id"] = contactID;
        handleUpdateSubmitContact()
    } else {
        contactRec["isSynced"] = false;
        contactRec["Id"] = accountRec.Contacts.records.length === 0 ? 0 : accountRec.Contacts.records.length;
        handleSaveSubmitContact()
    }

};


const handleUpdateSubmitContact = async () => {
    await writeData('contactsync', contactRec);
    let index = accountRec.Contacts.records.findIndex(ele => ele.Id === contactRec.Id);
    accountRec.Contacts.records.splice(index, 1, contactRec);
    await writeData('account', accountRec);
    window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html`
};

const handleSaveSubmitContact = async () => {
    await writeData('contactsync', contactRec);
    accountRec.Contacts.records.push(contactRec);
    await writeData('account', accountRec);
    window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html`
};

initializeMeetAndGreetPage()
