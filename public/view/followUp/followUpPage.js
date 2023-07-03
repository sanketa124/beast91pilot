//../checkOut/checkOut.html
$('#FollowUpsContent').hide()
let followUpTask;
$('#isFollowUp').click(function() {
    followUpTask = $(this).is(':checked')
    validate(followUpTask)
  });

async function validate(followUpTask){
    if(followUpTask){
        $('#FollowUpsContent').show()
    }else{
        $('#FollowUpsContent').hide()
    }
    return followUpTask
}
const SubmitTask = async() => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    let isFollowTaskEnabled = await validate(followUpTask)
    if(isFollowTaskEnabled){
        postData()
    }else{
        window.location.href = `/view/checkOut/checkOut.html?accountId=${accountId}`
    }
};


const postData = async () =>{
    const Subject = $('#Subject').val();
    const Priority = $('#Priority').val();
    const ActivityDate = new Date($('#ActivityDate').val());
    if(!ActivityDate || !Subject){
        alert("Please fill the required data")
        return;
    }
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    let eventId = localStorage.getItem('eventId')
    let accountRec = await getItemFromStore('account', accountId);
    let taskRec = {
        Unique_Identifier__c : `${new Date().getTime()}`,
        Subject,
        Priority,
        ActivityDate,
        WhatId : accountRec.Id,
        Status : 'Open'
    };
    await writeData('taskOriginal',taskRec);
    await writeData('taskSync',taskRec);
    window.location.href = `/view/checkOut/checkOut.html?accountId=${accountId}`
}


goBack = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    window.location.href = `/view/issues/issues.html?accountId=${accountId}`
  }
  