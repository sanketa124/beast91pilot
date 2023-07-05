

const initializeFollowUps = async() => {
    let cardSection = document.querySelector('.cardSectionList');
    let lapsedAcc = localStorage.getItem('lapsedAccount')
    lapsedAcc = JSON.parse(lapsedAcc)
    lapsedAcc.records.map(ele => {
        let DepletionDate,VisitDate
        if(ele.Recent_Retail_Depletion__c){
            DepletionDate = FormatDate(ele.Recent_Retail_Depletion__c)
            console.log(ele.Recent_Retail_Depletion__c,"DepletionDate");
        }
        if(ele.Recent_Activity_Date_Time__c){
            VisitDate = FormatDate(ele.Recent_Activity_Date_Time__c)
        }
        let tmp,draftImg = "";
        if (ele.QCO_Flag__c == true && ele.Beacon_Flag__c == true) {
        tmp = '<img src="/media/icon12.png" alt="icon" />';
        }
        if (ele.QCO_Flag__c == true && ele.Beacon_Flag__c == false) {
        tmp = '<img src="/media/icon13.png" alt="icon" />';
        }
        if (ele.QCO_Flag__c == false && ele.Beacon_Flag__c == true) {
        tmp = '<img src="/media/icon12.png" alt="icon" />';
        }

        if(ele.Draft_Status__c == true){
            draftImg=`<img src="/media/icon11.png" alt="icon" />`
        }
        let temp1;
        if(ele.Industry_Segment__c == 'P0'){
            temp1 = `<strong class="p0">P0</strong>`
        }else  if(ele.Industry_Segment__c == 'P1'){
        temp1 = `<strong class="p1">P1</strong>`
        }else if(ele.Industry_Segment__c == 'P2'){
            temp1 = `<strong class="p2">P2</strong>`
        }else  if(ele.Industry_Segment__c == 'P3'){
            temp1 = `<strong class="p3">P3</strong>`
        }else  if(ele.Industry_Segment__c == 'P4'){
            temp1 = `<strong class="p4">P4</strong>`
        }
        cardSection.innerHTML +=`<div class="card">
    <div class="card-body">
        <div class="row">
            <div class="col-xs-8">
                <h4 onclick="gotoAccountPage('${ele?.Id}')">${(ele.Name)?ele.Name:""}</h4>
                <label>${(ele.Channel__c) ?ele.Channel__c :""}/ ${(ele.Sub_Channel__c)?ele.Sub_Channel__c :""}</label>
                <label> <strong>Order: </strong> <span>${(DepletionDate)?DepletionDate: ""}</span> <span>|</span>  <strong>Visit: </strong> <span>${(VisitDate)?VisitDate : ""}</span></label>
                <label>${(ele.BillingStreet)?ele.BillingStreet:""}</label>
            </div>
            <div class="col-xs-4 pl-0 text-right">
                <ul>
                    <li>
                       ${temp1}
                      
                    </li>
                    <li>
                        ${draftImg}
                    </li>
                    <li>
                        ${(tmp)?tmp :""}
                    </li>
                </ul>
            </div>
        </div>
        
    </div>
</div>`
    })
    
}

function FormatDate(date){
    let dateValue = new Date(date).toLocaleString('en-us',{day:'numeric', month:'short', year:'numeric'})
    dateValue = dateValue.split(',')
    dateValue = dateValue[0].split( ' ' )
    console.log(`${dateValue[1]}-${dateValue[0]}`,"dateValue[1]-dateValue[0]");
    return `${dateValue[1]}-${dateValue[0]}`
}

initializeFollowUps()

gotoAccountPage = (id) => {
    window.location.href = `/view/accountLanding/accountLanding.html?accountId=${id}`;
}

