const issueList = document.querySelector('.issueList');

function addElement() {
  const issues = document.querySelector('.form-control');
  const datevalue = document.querySelector('.getdate');
  const checkboxdata = document.querySelector('.checkboxValue');

  //   Parent Div Items container
  const ParentDiv = document.createElement('div');
  ParentDiv.classList.add('content-wrapper');

  const IssueTypeDiv = document.createElement('div');
  const SettlementDateDiv = document.createElement('div');
  const ResolvedDiv = document.createElement('div');

  IssueTypeDiv.innerText = 'My Issue';
  SettlementDateDiv.innerText = '2022-03-07';
  ResolvedDiv.innerHTML = '<input type="checkbox" value="true">';

  IssueTypeDiv.classList.add('content-wrapper-primary-inside');
  SettlementDateDiv.classList.add('content-wrapper-primary-inside');
  ResolvedDiv.classList.add('content-wrapper-secondary-inside');

  ParentDiv.appendChild(IssueTypeDiv);
  ParentDiv.appendChild(SettlementDateDiv);
  ParentDiv.appendChild(ResolvedDiv);

  //   Add Parent Div into Page Layout content
  issueList.appendChild(ParentDiv);
}

//../followUp/followUpPage.html
const IntializeIssues = async () => {
  
  const issueContainer = document.querySelector('#issueContainer');
  var issues =  await readAllData('case')
  //var issues = localStorage.getItem('case');
  //issues = JSON.parse(issues)
  // let issues1 = localStorage.getItem('case');
  // issues1 = JSON.parse(issues1)
  // let issues2 = await readAllData('case')
  // let issues = [{...issues1}, ...issues2]
  // console.log(issues,"::::::::::::::::>>>>>>>>>>>>>>>>>>>>");
  // console.log(issues,"issues");
  issues.map(issue => {
    issueContainer.innerHTML += `<div class="content-wrapper">
    <div class="content-wrapper-primary-inside">${issue.Issue_Type__c}</div>
    <div class="content-wrapper-primary-inside">${issue.Settlement_Date__c}</div>
    <div class="content-wrapper-secondary-inside"><input type="checkbox" class="defaultCheckBox" value="true"></div>
</div>`
  })
};
IntializeIssues()

const createIssues = async () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  let issue_date = $('#issue_date').val()
  let issue_type = $('#issue_type').val()
  let eventId = localStorage.getItem('eventId')
  //let date = $().val()
  //var issuesList = await readAllData('case')
  let issues = await readAllData('case')
  // let issues1 = localStorage.getItem('case');
  // issues1 = JSON.parse(issues1)
  // console.log("::::::::::::::issues1::::::::::::::::",issues1);
  // let issues2 = await readAllData('case')
  // let issues = [{...issues1}, ...issues2]
  // console.log(issues,"::::::::::::::::>>>>>>>>>>>>>>>>>>>>");
  
  issues = {
    ...issues,
    Id:`${new Date().getTime()}`,
    AccountId:accountId,
    Event__c: eventId,
    Issue_Resolved__c:true,
    Settlement_Date__c: issue_date,
    Issue_Type__c: issue_type
    //isSynced: false,
};
  //let result = [{...issues}, ...issuesList]
  //localStorage.setItem('cases',JSON.stringify(issues))
  console.log(issues,"ppppppppppppppppp");
  await writeData('case', issues);
  await writeData('caseSync', issues);
  console.log(issues, "issue_dateissue_dateissue_dateissue_dateissue_dateissue_dateissue_dateissue_dateissue_dateissue_dateissue_dateissue_dateissue_date");
  
  window.location.href = `/view/followUp/followUpPage.html?accountId=${accountId}`
}

goBack = () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  window.location.href = `/view/objectives/competitorInsights/competitionInsightsPage3.html?accountId=${accountId}`
}


