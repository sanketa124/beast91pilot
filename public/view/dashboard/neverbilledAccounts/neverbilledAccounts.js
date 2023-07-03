localStorage.getItem('NBA');
const initializeFollowUps = async() => {
    let cardSection = document.querySelector('.cardSectionList');
    let NeverBillAcc = localStorage.getItem('NBA');
    NeverBillAcc = JSON.parse(NeverBillAcc)
    console.log(NeverBillAcc,"NeverBillAcc")
    NeverBillAcc.records.map(ele => {
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
        cardSection.innerHTML +=`<div class="card">
    <div class="card-body">
        <div class="row">
            <div class="col-xs-8">
                <h4>${(ele.Name)?ele.Name:"N/A"}</h4>
                <label>${(ele.Channel__c) ?ele.Channel__c :"N/A"}/ ${(ele.Sub_Channel__c)?ele.Sub_Channel__c :"N/A"}</label>
                <label> <strong>Order: </strong> <span>${(DepletionDate)?DepletionDate: ""}</span> <span>|</span>  <strong>Visit: </strong> <span>${(VisitDate)?VisitDate : "N/A"}</span></label>
                <label>${(ele.BillingStreet)?ele.BillingStreet:"N/A"}</label>
            </div>
            <div class="col-xs-4 pl-0 text-right">
                <ul>
                    <li>
                        <strong>${(ele.Industry_Segment__c)?ele.Industry_Segment__c:"N/A"}</strong>
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