const issueList = document.querySelector('.issueList');
const newIssueList = document.querySelector('#NewIssueContainer')
console.log(newIssueList,"newIssueList");
let count = 0;
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;
$('#issue_date').attr('min',today);  

function addElement() {
  count = count + 1;
  $('#no_issues_container').hide()
  newIssueList.innerHTML +=`<div class="add-issues content-wrapper">
                    <div class="content-wrapper-primary-inside">
                        <select class="form-control" id="issue_type_${count}">
                            <option>select issue type</option>
                            <option>POSM/ Asset Delivery Pending</option>
                            <option>Pending Settlement</option>
                            <option>Require Reconciliation of Accounts</option>
                        </select>
                    </div>
                    <div class="getdate content-wrapper-primary-inside">
                        <input class="date-picker" type="date" id="issue_date_${count}">
                    </div>
                    <div class="checkboxValue content-wrapper-secondary-inside"><input class="defaultCheckBox" id="is_resolved_${count}" type="checkbox" value="${count}">
                    </div>
                  </div>`
}

const IntializeIssues = async () => {
  const issueContainer = document.querySelector('#issueContainer');
  const accountId = localStorage.getItem('accountId');
  let issues =  await readAllData('case')
  if(issues.length > 0){
      $('#no_issues_container').hide()
      issues = issues.filter(issue => issue.AccountId == accountId);
      issues.map(issue => {
        issueContainer.innerHTML += `<div class="content-wrapper">
        <div class="content-wrapper-primary-inside">${issue.Issue_Type__c}</div>
        <div class="content-wrapper-primary-inside">${issue.Settlement_Date__c}</div>
        <div class="content-wrapper-secondary-inside"><input type="checkbox" id="is_resolved_${issue.Id}" class="defaultCheckBox" value="${issue.Id}"></div>
    </div>`
    })
  }else{
    $('#no_issues_container').show()
  }
};
IntializeIssues() 

const createIssues = async () => {
  let resolvedIssues = [];
  let un_resolvedIssues = [];
  let updated_issue = []
  let new_issues;
  let prev_issues = await readAllData('case')
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = localStorage.getItem('accountId');

  let eventId = localStorage.getItem('eventId')
  prev_issues = prev_issues.filter(issue => issue.AccountId == accountId);
  $(":checkbox:checked").each(function() {
    resolvedIssues.push(this.value);
  });
  $(":checkbox:not(:checked)").each(function() {
    un_resolvedIssues.push(this.value);
  });
  
  
  
  if(resolvedIssues.length > 0){
    for (resIssue of resolvedIssues){
      let issue_date = $(`#issue_date_${resIssue}`).val()
      let issue_type = $(`#issue_type_${resIssue}`).val()
      if(prev_issues.length > 0){
        for(issue of prev_issues){
          if(resIssue == issue.Id ){
            let obj = {
              Id:issue.Id,
              AccountId:issue.AccountId,
              Event__c: issue.Event__c,
              Issue_Resolved__c:issue.Issue_Resolved__c,
              Settlement_Date__c: issue.Settlement_Date__c,
              Issue_Type__c: issue.Issue_Type__c,
              Issue_Resolved__c: true,
              Origin:'Sales Rep Visit'
            }
            updated_issue.push(obj)
          }else{
            if(issue_date && issue_type ){
              new_issues = {
                Id:`${new Date().getTime()}${resIssue}`,
                Unique_Identifier__c:`${new Date().getTime()}${resIssue}`,
                AccountId:accountId,
                Event__c: eventId,
                Settlement_Date__c: issue_date,
                Issue_Type__c: issue_type,
                Issue_Resolved__c: true,
                Origin:'Sales Rep Visit'
              }
              updated_issue.push(new_issues)
            }
          }
        }
      }else{
        new_issues = {
          Id:`${new Date().getTime()}${resIssue}`,
          Unique_Identifier__c:`${new Date().getTime()}`,
          AccountId:accountId,
          Event__c: eventId,
          Issue_Resolved__c:true,
          Settlement_Date__c: issue_date,
          Issue_Type__c: issue_type,
          Origin:'Sales Rep Visit'
        }
        updated_issue.push(new_issues)
         
      }
    }

  }

  if(un_resolvedIssues.length > 0){
    console.log("UnResolved !!");
    for (resIssue of un_resolvedIssues){
      let issue_date = $(`#issue_date_${resIssue}`).val()
      let issue_type = $(`#issue_type_${resIssue}`).val()
      if(prev_issues.length > 0){
        for(issue of prev_issues){
          if(resIssue == issue.Id ){
            let obj = {
              Id:issue.Id,
              AccountId:issue.AccountId,
              Event__c: issue.Event__c,
              Issue_Resolved__c:issue.Issue_Resolved__c,
              Settlement_Date__c: issue.Settlement_Date__c,
              Issue_Type__c: issue.Issue_Type__c,
              Issue_Resolved__c: false,
              Origin:'Sales Rep Visit'
            }
            updated_issue.push(obj)
          }else{
            if(issue_date && issue_type ){
              new_issues = {
                Id:`${new Date().getTime()}${resIssue}`,
                Unique_Identifier__c:`${new Date().getTime()}${resIssue}`,
                AccountId:accountId,
                Event__c: eventId,
                Settlement_Date__c: issue_date,
                Issue_Type__c: issue_type,
                Issue_Resolved__c: false,
                Origin:'Sales Rep Visit'
              }
              updated_issue.push(new_issues)
            }
          }
        }
      }else{
        console.log("HERE I GO",resIssue);
        if(issue_date && issue_type ){
          new_issues = {
            Id:`${new Date().getTime()}${resIssue}`,
            Unique_Identifier__c:`${new Date().getTime()}${resIssue}`,
            AccountId:accountId,
            Event__c: eventId,
            Settlement_Date__c: issue_date,
            Issue_Type__c: issue_type,
            Issue_Resolved__c: false,
            Origin:'Sales Rep Visit'
          }
        }
        updated_issue.push(new_issues)
      }
    }
  }


  console.log("Updated Issues===>",updated_issue);
  await clearAllData('caseSync'); 
  //await clearAllData('case'); 
  await writeDataAll('case', updated_issue);
  await writeDataAll('caseSync', updated_issue);
  window.location.href = `/view/followUp/followUpPage.html?accountId=${accountId}`
}

goBack = () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  window.location.href = `/view/objectives/competitorInsights/competitionInsightsPage3.html?accountId=${accountId}`
}


