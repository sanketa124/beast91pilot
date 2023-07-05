gotoAddTasks = (Id) => {
    window.location.href = `addTasks.html?Id=${Id}`
}
let cardSection = document.querySelector('.cardSectionList')

const initializeFollowUps = async() => {
    tasks = await readAllData('taskOriginal');
    console.log(tasks, 'tasks')
    for(task of tasks){
        cardSection.innerHTML +=`<div class="card">
        <div class="card-body">
            <div class="row">
                <div class="col-xs-8">
                    <h4 onclick="gotoAddTasks('${task?.Id}')">${task.Subject}</h4>
                    <label>Account: <span>${task?.AccountName}</span></label>
                    <label>Due Date: <span>${task?.ActivityDate}</span></label>
                    <label>Priority: <span>${task?.Priority}</span></label>
                </div>
            </div>
            
        </div>
    </div>`
    }
};
initializeFollowUps();



