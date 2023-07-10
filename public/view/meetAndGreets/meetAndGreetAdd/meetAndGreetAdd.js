
let contactRec = {};
let currentContactSelection = {}
let accountRec = {}
let accountId = '';
let contactId = '';
let urlParams = new URLSearchParams(window.location.search);
const enroll = urlParams.get('enroll');
if(enroll == 'true'){
    $('#title').html('Add contacts for Allstars')
}else{
    $('#title').html('Meet and Greet Add')
}


onHandlePrevious = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    const enroll = urlParams.get('enroll');
    const individual = urlParams.get('individual')
    if (enroll == 'true') {
        window.location.href = `/view/sales/enroll.html?accountId=${accountId}`
    }else if (individual == 'true') {
        window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountId}&individual=true`;
    } else {
        window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountId}`;
    }
}

goBack = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const enroll = urlParams.get('enroll');
    const individual = urlParams.get('individual')
    if (enroll == 'true') {
        window.location.href = `/view/sales/enroll.html?accountId=${accountId}`
    } else if (individual == 'true') {
        window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountId}&individual=true`
    } else {
        window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountId}`
    }
}

const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const initializeMeetAndGreetPage = async () => {
    let urlParams = new URLSearchParams(window.location.search);
    accountId = urlParams.get('accountId');
    contactId = urlParams.get('contactId');
    const individual = urlParams.get('individual')
    // if(individual == 'true'){
    //   $('#closeIco').hide();
    //   $('.arrowIcons').hide();
    //   $('.logoSection').css('width','93%')
    // }

    accountRec = await getItemFromStore('account', accountId);
    if (accountRec && accountRec.Contacts && accountRec.Contacts.records) {
        contactRec = accountRec.Contacts.records.filter(ele => {
            return ele.Id === contactId;
        })[0]

    }
    currentContactSelection = contactRec
    populateContactModal()
};

const populateContactModal = () => {
    $('#contactTitle').prop('value', currentContactSelection.Salutation ? currentContactSelection.Salutation : "");
    $('#contactFirstName').prop('value', currentContactSelection.FirstName ? currentContactSelection.FirstName : "");
    $('#contactLastName').prop('value', currentContactSelection.LastName ? currentContactSelection.LastName : "");
    $('#contactPhone').prop('value', currentContactSelection.Phone ? currentContactSelection.Phone : "");
    $('#contactEmail').prop('value', currentContactSelection.Email ? currentContactSelection.Email : "");
    $('#contactRole').prop('value', currentContactSelection.Role__c ? currentContactSelection.Role__c : "");
    $('#flexCheckChecked').prop('value', currentContactSelection.Active__c ? currentContactSelection.Active__c : "");

};

const handleMeetSaveContact = () => {
    let mobileError = document.getElementById('mobileError');
    let emailError = document.getElementById('emailError');
    let isEmailValid = true;
    if ($('#contactEmail').val()) {
        if (!validateEmail($('#contactEmail').val())) {
            emailError.classList.remove('hide-element');
            isEmailValid = false;
            return;
        }
        else {
            emailError.classList.add('hide-element');
            isEmailValid = true;
        }
    }
    const contactTitle = $('#contactTitle').val();
    const contactFirstName = $('#contactFirstName').val();
    const contactLastName = $('#contactLastName').val();
    const contactPhone = $('#contactPhone').val();
    const contactEmail = $('#contactEmail').val()
    const contactRole = $('#contactRole').val();
    var isActive = $("#flexCheckChecked").is(":checked");
    if (!contactId) {
        contactRec = {}
    }
    contactRec["Salutation"] = contactTitle;
    contactRec["FirstName"] = contactFirstName;
    contactRec["LastName"] = contactLastName;
    contactRec["Role__c"] = contactRole;
    contactRec["Phone"] = contactPhone;
    contactRec["Email"] = contactEmail;
    contactRec["Active__c"] = isActive;
    if (contactTitle && contactFirstName && contactLastName && contactRole && contactPhone && isEmailValid) {
        if (contactPhone.length === 10) {
            mobileError.classList.add('hide-element');
            if (contactId) {
                handleUpdateSubmitContact()
            } else {
                handleNewSaveSubmitContact()
            }
        } else {
            mobileError.classList.remove('hide-element');
        }
    } else {
        alert('Please enter the required details')
    }
};

const handleUpdateSubmitContact = async () => {
    await writeData('contact', contactRec);
    await writeData('contactsync', contactRec);
    let index = accountRec.Contacts.records.findIndex(ele => ele.Id === contactId);
    accountRec.Contacts.records.splice(index, 1, contactRec);
    await writeData('account', accountRec);
    let urlParams = new URLSearchParams(window.location.search);
    const enroll = urlParams.get('enroll');
    const individual = urlParams.get('individual')
    if (enroll == 'true') {
        window.location.href = `/view/sales/enroll.html?accountId=${accountId}`
    } else if (individual == 'true') {
        window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountId}&individual=true`
    }
    else {
        window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountId}`
    }

};

const handleNewSaveSubmitContact = async () => {
    contactRec['Id'] = `${new Date().getTime()}`;
    contactRec['AccountId'] = accountId;
    contactRec['newContact'] = true;
    await writeData('contact', contactRec);
    await writeData('contactsync', contactRec);
    if (accountRec && accountRec.Contacts && accountRec.Contacts.records) {
        accountRec.Contacts.records.push(contactRec);
    } else {
        accountRec.Contacts = []
        accountRec.Contacts.records = []
        accountRec.Contacts.records.push(contactRec);
    }
    await writeData('account', accountRec);
    let urlParams = new URLSearchParams(window.location.search);
    const enroll = urlParams.get('enroll');
    const individual = urlParams.get('individual')

    if (enroll == 'true') {
        window.location.href = `/view/sales/enroll.html?accountId=${accountId}`
    } else if (individual == 'true') {
        window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountId}&individual=true`
    } else {
        window.location.href = `/view/meetAndGreets/meetAndGreetDetails/meetAndGreetDetails.html?accountId=${accountId}`
    }
};

initializeMeetAndGreetPage()
