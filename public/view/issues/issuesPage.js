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
