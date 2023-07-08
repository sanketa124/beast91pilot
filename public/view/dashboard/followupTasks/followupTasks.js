gotoAddTasks = (Id) => {
    window.location.href = `addTasks.html?Id=${Id}`
}
let cardSection = document.querySelector('.cardSectionList')

let urlParam = new URLSearchParams(window.location.search);
const eventId = urlParam.get('eventId')
const accountId =  urlParam.get('accountId')

const initializeFollowUps = async() => {
    tasks = await readAllData('taskOriginal');
    console.log(tasks, 'tasks')
    tasks.sort(function(a, b) {
            var c = new Date(a.ActivityDate);
            var d = new Date(b.ActivityDate);
            return c-d;
    });
    if(accountId){
        tasks = tasks.filter((task) => task?.What?.Id == accountId);
    }
     //console.log(newTasks, 'tasnewTasksks')
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



