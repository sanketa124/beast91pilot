let task={};
let urlParams = new URLSearchParams(window.location.search);
let taskId=urlParams.get('Id');
(async()=>{

    task= await getItemFromStore('taskOriginal',taskId)
    console.log(task)
    /** Subject */
    const subjectElement=document.getElementById('subject')
    subjectElement.value=task?.Subject ||''

    /** Account */
    const accountElement=document.getElementById('account')
    accountElement.value=task?.AccountName ||''

    /** Duedate */
    const dueDateElement=document.getElementById('due-date')
    dueDateElement.value=task?.ActivityDate 

    /** Priority */
    const priorityElement=document.getElementById('priority')
    priorityElement.value=task?.Priority

    /***closed tag */
    const closed= document.getElementById("close-task")
    closed.checked=task?.Status==='Completed'?true:false;
    closed.addEventListener('change',  (event) => {
        if(event.target.checked){
            task=   {...task,Status: "Completed"}
        }
        else{
            task=   {...task,Status: "Open"}
        }
    
    })


})();

submitForms = async() =>{
    $('#submitForm').modal('hide');
    if(task?.Id){
        await writeData('taskOriginal',task)
    }
    window.location.href = 'followupTasks.html'
}
gotofollowUpTasks = () => {
    $('#cancelModal').modal('hide');
    window.location.href = 'followupTasks.html'
}

