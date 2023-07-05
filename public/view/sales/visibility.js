$(document).ready(function () {
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  const individual = urlParam.get('individual')
  if (individual == 'true') {
    $('#closeIco').hide();
    $('.arrowIcons').hide();
    $('.logoSection').css('width', '93%')
    $('#finishBtn').show();
  }
})
let stockVisbility = {};
let accountDetail = {}

goBack = () => {
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  window.location.href = `/view/objectives/salesOrder/salesOrderLanding.html?accountId=${accountId}`
}

goForward = () => {
  saveVisibilityAndNext()
}

const initializeVisibilityPage = async () => {
  const draft = document.querySelector('.draftAccount');
  const qco = document.querySelector('.qcoAccount');
  const on_premises = document.querySelector('.onPremisesAccount');
  const off_premises = document.querySelector('.offPremisesAccount');

  let accountId = localStorage.getItem('accountId')
  accountDetail = await getItemFromStore('account', accountId);
  const key = `${fetchCurrentDateIdStr()}-${accountId}`;
  stockVisbility = await getItemFromStore('stockVisibility', key);
  const draft_status = accountDetail?.Draft_Status__c
  const qco_status = accountDetail?.QCO_Flag__c;
  const channel_type = accountDetail?.Channel__c;

  if (draft_status) {
    qco.classList.add('hide-element');
    on_premises.classList.add('hide-element');
    off_premises.classList.add('hide-element');
    populatePrevDetails(draft_status, qco_status, channel_type)
  } else if (qco_status) {
    draft.classList.add('hide-element');
    on_premises.classList.add('hide-element');
    off_premises.classList.add('hide-element');
    populatePrevDetails(draft_status, qco_status, channel_type)
  } else if (channel_type === 'On-Premise') {
    draft.classList.add('hide-element');
    off_premises.classList.add('hide-element');
    qco.classList.add('hide-element');
    populatePrevDetails(draft_status, qco_status, channel_type)
  } else if (channel_type === 'Off-Premise') {
    draft.classList.add('hide-element');
    on_premises.classList.add('hide-element');
    qco.classList.add('hide-element');
    populatePrevDetails(draft_status, qco_status, channel_type)
  }
};

//-----QCO Account----//
function handleToggleSwitchQCO() {
  let isActive_Z_2_Bira_91_LED_Signage__c = $("#Z_2_Bira_91_LED_Signage__c_qco").is(":checked");
  let isActive_Z_1_Facade_Signage__c = $("#Z_1_Facade_Signage__c_qco").is(":checked");
  let isActive_Z3_Menu_Listing__c = $("#Z3_Menu_Listing__c_qco").is(":checked");

  const get_camera_Z_2_Bira_91 = document.getElementById('Z_2_Bira_91_LED_Signage__c_qco_File');
  const get_camera_Z_1_Facade = document.getElementById('Z_1_Facade_Signage__c_qco_File');
  const get_camera_Z3_Menu_Listing = document.getElementById('Z3_Menu_Listing__c_qco_File');

  const checkBox_LED_NON_working = document.getElementById('LED_Non_working_Requires_Maintenance__c_qco');
  const checkBox_Facade_Non_working = document.getElementById('Facade_Non_working_Requires_Maintenance__c_qco');

  if (isActive_Z_2_Bira_91_LED_Signage__c) {
    get_camera_Z_2_Bira_91.classList.remove('hide-element');
    checkBox_LED_NON_working.classList.remove('hide-element')
    stockVisbility['Z_2_Bira_91_LED_Signage__c'] = isActive_Z_2_Bira_91_LED_Signage__c
  } else {
    get_camera_Z_2_Bira_91.classList.add('hide-element');
    checkBox_LED_NON_working.classList.add('hide-element')
    stockVisbility['Z_2_Bira_91_LED_Signage__c'] = isActive_Z_2_Bira_91_LED_Signage__c
    stockVisbility['LED_Non_working_Requires_Maintenance__c'] = false;
    document.getElementById('LED_Non_working_qco_check').checked = false
  }
  if (isActive_Z_1_Facade_Signage__c) {
    get_camera_Z_1_Facade.classList.remove('hide-element');
    checkBox_Facade_Non_working.classList.remove('hide-element')
    stockVisbility['Z_1_Facade_Signage__c'] = isActive_Z_1_Facade_Signage__c
  } else {
    get_camera_Z_1_Facade.classList.add('hide-element');
    checkBox_Facade_Non_working.classList.add('hide-element')
    stockVisbility['Z_1_Facade_Signage__c'] = isActive_Z_1_Facade_Signage__c
    stockVisbility['Facade_Non_working_Requires_Maintenance__c'] = false;
    document.getElementById('Facade_Non_working_qco_check').checked = false

  }
  if (isActive_Z3_Menu_Listing__c) {
    get_camera_Z3_Menu_Listing.classList.remove('hide-element');
    stockVisbility['Z3_Menu_Listing__c'] = isActive_Z3_Menu_Listing__c
  } else {
    get_camera_Z3_Menu_Listing.classList.add('hide-element');
    stockVisbility['Z3_Menu_Listing__c'] = isActive_Z3_Menu_Listing__c

  }

}

//--------ON Premises Account --------//
function handleToggleONPremises() {
  let isActive_Z_2_Bira_91_LED_Signage__c = $("#Z_2_Bira_91_LED_Signage__c").is(":checked");
  let isActive_Z_1_Easel_Stand__c = $("#Z_1_Easel_Stand__c").is(":checked");
  let isActive_Z_1_Facade_Signage__c = $("#Z_1_Facade_Signage__c").is(":checked");
  let isActive_Z_3_Coaster__c = $("#Z_3_Coaster__c ").is(":checked");
  let isActive_Z_3_Glassware__c = $("#Z_3_Glassware__c").is(":checked");
  let isActive_Z_2_Bar_Mats__c = $("#Z_2_Bar_Mats__c").is(":checked");
  let isActive_Z_2_Bucket__c = $("#Z_2_Bucket__c").is(":checked");
  let isActive_Z3_Menu_Listing__c = $("#Z3_Menu_Listing__c").is(":checked");
  let isActive_Z_3_Table_Tent__c = $("#Z_3_Table_Tent__c").is(":checked");

  const get_camera_Z_2_Bira_91 = document.getElementById('Z_2_Bira_91_LED_Signage__c_File');
  const get_camera_Z_1_Easel_Stand = document.getElementById('Z_1_Easel_Stand__c_File');
  const get_camera_Z_1_Facade_Signage = document.getElementById('Z_1_Facade_Signage__c_File');
  const get_camera_Z_3_Coaster = document.getElementById('Z_3_Coaster__c_File');
  const get_camera_Z_3_Glassware = document.getElementById('Z_3_Glassware__c_File');
  const get_camera_Z_2_Bar_Mats = document.getElementById('Z_2_Bar_Mats__c_File');
  const get_camera_Z_2_Bucket = document.getElementById('Z_2_Bucket__c_File');
  const get_camera_Z3_Menu_Listing = document.getElementById('Z3_Menu_Listing__c_File');
  const get_camera_Z_3_Table_Tent = document.getElementById('Z_3_Table_Tent__c_File');

  const checkBox_LED_NON_working = document.getElementById('LED_Non_working_Requires_Maintenance__c');
  const checkBox_Facade_Non_working = document.getElementById('Facade_Non_working_Requires_Maintenance__c');

  if (isActive_Z_2_Bira_91_LED_Signage__c) {
    get_camera_Z_2_Bira_91.classList.remove('hide-element');
    checkBox_LED_NON_working.classList.remove('hide-element')
    stockVisbility['Z_2_Bira_91_LED_Signage__c'] = isActive_Z_2_Bira_91_LED_Signage__c

  } else {
    get_camera_Z_2_Bira_91.classList.add('hide-element');
    checkBox_LED_NON_working.classList.add('hide-element')
    stockVisbility['Z_2_Bira_91_LED_Signage__c'] = isActive_Z_2_Bira_91_LED_Signage__c

  }
  if (isActive_Z_1_Easel_Stand__c) {
    get_camera_Z_1_Easel_Stand.classList.remove('hide-element');
    stockVisbility['Z_1_Easel_Stand__c'] = isActive_Z_1_Easel_Stand__c

  } else {
    get_camera_Z_1_Easel_Stand.classList.add('hide-element');
    stockVisbility['Z_1_Easel_Stand__c'] = isActive_Z_1_Easel_Stand__c
  }
  if (isActive_Z_1_Facade_Signage__c) {
    get_camera_Z_1_Facade_Signage.classList.remove('hide-element');
    checkBox_Facade_Non_working.classList.remove('hide-element')
    stockVisbility['Z_1_Facade_Signage__c'] = isActive_Z_1_Facade_Signage__c
  } else {
    get_camera_Z_1_Facade_Signage.classList.add('hide-element');
    checkBox_Facade_Non_working.classList.add('hide-element')
    stockVisbility['Z_1_Facade_Signage__c'] = isActive_Z_1_Facade_Signage__c
  }
  if (isActive_Z_3_Coaster__c) {
    get_camera_Z_3_Coaster.classList.remove('hide-element');
    stockVisbility['Z_3_Coaster__c'] = isActive_Z_3_Coaster__c
  } else {
    get_camera_Z_3_Coaster.classList.add('hide-element');
    stockVisbility['Z_3_Coaster__c'] = isActive_Z_3_Coaster__c
  }
  if (isActive_Z_3_Glassware__c) {
    get_camera_Z_3_Glassware.classList.remove('hide-element')
    stockVisbility['Z_3_Glassware__c'] = isActive_Z_3_Glassware__c
  } else {
    get_camera_Z_3_Glassware.classList.add('hide-element');
    stockVisbility['Z_3_Glassware__c'] = isActive_Z_3_Glassware__c
  }
  if (isActive_Z_2_Bar_Mats__c) {
    get_camera_Z_2_Bar_Mats.classList.remove('hide-element');
    stockVisbility['Z_2_Bar_Mats__c'] = isActive_Z_2_Bar_Mats__c
  } else {
    get_camera_Z_2_Bar_Mats.classList.add('hide-element');
    stockVisbility['Z_2_Bar_Mats__c'] = isActive_Z_2_Bar_Mats__c
  }
  if (isActive_Z_2_Bucket__c) {
    get_camera_Z_2_Bucket.classList.remove('hide-element');
    stockVisbility['Z_2_Bucket__c'] = isActive_Z_2_Bucket__c
  } else {
    get_camera_Z_2_Bucket.classList.add('hide-element');
    stockVisbility['Z_2_Bucket__c'] = isActive_Z_2_Bucket__c
  }
  if (isActive_Z3_Menu_Listing__c) {
    get_camera_Z3_Menu_Listing.classList.remove('hide-element');
    stockVisbility['Z3_Menu_Listing__c'] = isActive_Z3_Menu_Listing__c
  } else {
    get_camera_Z3_Menu_Listing.classList.add('hide-element');
    stockVisbility['Z3_Menu_Listing__c'] = isActive_Z3_Menu_Listing__c
  }
  if (isActive_Z_3_Table_Tent__c) {
    get_camera_Z_3_Table_Tent.classList.remove('hide-element');
    stockVisbility['Z_3_Table_Tent__c'] = isActive_Z_3_Table_Tent__c
  } else {
    get_camera_Z_3_Table_Tent.classList.add('hide-element');
    stockVisbility['Z_3_Table_Tent__c'] = isActive_Z_3_Table_Tent__c
  }
}


//--------OFF Premises Account --------//
function handleToggleOffPremises() {
  let isActive_Z_2_Bira_91_LED_Signage__c_off = $("#Z_2_Bira_91_LED_Signage__c_off").is(":checked");
  let isActive_Z_1_Facade_Signage__c_off = $("#Z_1_Facade_Signage__c_off").is(":checked");
  let isActive_Z_1_One_way_Vision__c_off = $("#Z_1_One_way_Vision__c_off").is(":checked");
  let isActive_VisiCooler__c_off = $("#VisiCooler__c_off ").is(":checked");
  let isActive_Z_3_Planogram_Adherence__c_off = $("#Z_3_Planogram_Adherence__c_off").is(":checked");
  let isActive_Chiller_Re_Stocked__c_off = $("#Chiller_Re_Stocked__c_off").is(":checked");
  let isActive_Z_3_Island_Unit__c_off = $("#Z_3_Island_Unit__c_off").is(":checked");
  let isActive_Z_3_Floor_Standing_Unit__c_off = $("#Z_3_Floor_Standing_Unit__c_off").is(":checked");

  const get_camera_Z_2_Bira_91_off = document.getElementById('Z_2_Bira_91_LED_Signage__c_off_File');
  const get_camera_Z_1_Facade_Signage_off = document.getElementById('Z_1_Facade_Signage__c_off_File');
  const get_camera_Z_1_One_way_Vision_off = document.getElementById('Z_1_One_way_Vision__c_off_File');
  const get_camera_VisiCooler__c_off = document.getElementById('VisiCooler__c_off_File');
  const get_camera_Z_3_Planogram_Adherence_off = document.getElementById('Z_3_Planogram_Adherence__c_off_File');
  const get_camera_Chiller_Re_Stocked__c_off = document.getElementById('Chiller_Re_Stocked__c_off_File');
  const get_camera_Z_3_Island_Unit__c_off = document.getElementById('Z_3_Island_Unit__c_off_File');
  const get_camera_Z_3_Floor_Standing_Unit__c_off = document.getElementById('Z_3_Floor_Standing_Unit__c_off_File');

  const checkBox_LED_NON_working = document.getElementById('LED_Non_working_Requires_Maintenance__c_off');
  const checkBox_Facade_Non_working = document.getElementById('Facade_Non_working_Requires_Maintenance__c_off');


  const checkBox_One_way_vision_Non_working = document.getElementById('One_way_vision_Non_working__c_off');
  const checkBox_cooler_Non_working = document.getElementById('cooler_Non_working_Requires_Maintenance__c_off');

  const checkBox_Island_Unit_Non_working = document.getElementById('Island_Unit_Non_working__c_off');
  const checkBox_FSU_Non_working = document.getElementById('FSU_Non_working_Requires_Maintenance__c_off');

  if (isActive_Z_2_Bira_91_LED_Signage__c_off) {
    get_camera_Z_2_Bira_91_off.classList.remove('hide-element');
    checkBox_LED_NON_working.classList.remove('hide-element')
    stockVisbility['Z_2_Bira_91_LED_Signage__c'] = isActive_Z_2_Bira_91_LED_Signage__c_off
  } else {
    get_camera_Z_2_Bira_91_off.classList.add('hide-element');
    checkBox_LED_NON_working.classList.add('hide-element')
    stockVisbility['Z_2_Bira_91_LED_Signage__c'] = isActive_Z_2_Bira_91_LED_Signage__c_off
  }
  if (isActive_Z_1_Facade_Signage__c_off) {
    get_camera_Z_1_Facade_Signage_off.classList.remove('hide-element');
    checkBox_Facade_Non_working.classList.remove('hide-element')
    stockVisbility['Z_1_Facade_Signage__c'] = isActive_Z_1_Facade_Signage__c_off
  } else {
    get_camera_Z_1_Facade_Signage_off.classList.add('hide-element');
    checkBox_Facade_Non_working.classList.add('hide-element')
    stockVisbility['Z_1_Facade_Signage__c'] = isActive_Z_1_Facade_Signage__c_off

  }
  if (isActive_Z_1_One_way_Vision__c_off) {
    get_camera_Z_1_One_way_Vision_off.classList.remove('hide-element');
    checkBox_One_way_vision_Non_working.classList.remove('hide-element')
    stockVisbility['Z_1_One_way_Vision__c'] = isActive_Z_1_One_way_Vision__c_off
  } else {
    get_camera_Z_1_One_way_Vision_off.classList.add('hide-element');
    checkBox_One_way_vision_Non_working.classList.add('hide-element')
    stockVisbility['Z_1_One_way_Vision__c'] = isActive_Z_1_One_way_Vision__c_off
  }
  if (isActive_VisiCooler__c_off) {
    get_camera_VisiCooler__c_off.classList.remove('hide-element');
    checkBox_cooler_Non_working.classList.remove('hide-element')
    stockVisbility['VisiCooler__c'] = isActive_VisiCooler__c_off
  } else {
    get_camera_VisiCooler__c_off.classList.add('hide-element');
    checkBox_cooler_Non_working.classList.add('hide-element')
    stockVisbility['VisiCooler__c'] = isActive_VisiCooler__c_off
  }
  if (isActive_Z_3_Planogram_Adherence__c_off) {
    get_camera_Z_3_Planogram_Adherence_off.classList.remove('hide-element');
    stockVisbility['Z_3_Planogram_Adherence__c'] = isActive_Z_3_Planogram_Adherence__c_off
  } else {
    get_camera_Z_3_Planogram_Adherence_off.classList.add('hide-element');
    stockVisbility['Z_3_Planogram_Adherence__c'] = isActive_Z_3_Planogram_Adherence__c_off
  }

  if (isActive_Chiller_Re_Stocked__c_off) {
    get_camera_Chiller_Re_Stocked__c_off.classList.remove('hide-element');
    stockVisbility['Chiller_Re_Stocked__c'] = isActive_Chiller_Re_Stocked__c_off
  } else {
    get_camera_Chiller_Re_Stocked__c_off.classList.add('hide-element');
    stockVisbility['Chiller_Re_Stocked__c'] = isActive_Chiller_Re_Stocked__c_off
  }

  if (isActive_Z_3_Island_Unit__c_off) {
    get_camera_Z_3_Island_Unit__c_off.classList.remove('hide-element');
    checkBox_Island_Unit_Non_working.classList.remove('hide-element')
    stockVisbility['Z_3_Island_Unit__c'] = isActive_Z_3_Island_Unit__c_off
  } else {
    get_camera_Z_3_Island_Unit__c_off.classList.add('hide-element');
    checkBox_Island_Unit_Non_working.classList.add('hide-element')
    stockVisbility['Z_3_Island_Unit__c'] = isActive_Z_3_Island_Unit__c_off
  }
  if (isActive_Z_3_Floor_Standing_Unit__c_off) {
    get_camera_Z_3_Floor_Standing_Unit__c_off.classList.remove('hide-element');
    checkBox_FSU_Non_working.classList.remove('hide-element')
    stockVisbility['Z_3_Floor_Standing_Unit__c'] = isActive_Z_3_Floor_Standing_Unit__c_off
  } else {
    get_camera_Z_3_Floor_Standing_Unit__c_off.classList.add('hide-element');
    checkBox_FSU_Non_working.classList.add('hide-element')
    stockVisbility['Z_3_Floor_Standing_Unit__c'] = isActive_Z_3_Floor_Standing_Unit__c_off
  }
}

//---------Draft Account ------------//
function handleToggleSwitchDraft() {
  let isActive_Z_2_Bira_91_LED_Signage__c_draft = $("#Z_2_Bira_91_LED_Signage__c_draft").is(":checked");
  let isActive_Z_1_Easel_Stand__c_draft = $("#Z_1_Easel_Stand__c_draft").is(":checked");
  let isActive_Z_1_Facade_Signage__c_draft = $("#Z_1_Facade_Signage__c_draft").is(":checked");
  let isActive_Z_3_Coaster__c_draft = $("#Z_3_Coaster__c_draft").is(":checked");
  let isActive_Z_3_Glassware__c_draft = $("#Z_3_Glassware__c_draft").is(":checked");
  let isActive_Z_2_Bar_Mats__c_draft = $("#Z_2_Bar_Mats__c_draft").is(":checked");
  let isActive_Z_2_Bucket__c_draft = $("#Z_2_Bucket__c_draft").is(":checked");
  let isActive_Z3_Menu_Listing__c_draft = $("#Z3_Menu_Listing__c_draft").is(":checked");
  let isActive_Z_3_Table_Tent__c_draft = $("#Z_3_Table_Tent__c_draft").is(":checked");
  let isActive_Z_2_Tap_Handles__c_draft = $("#Z_2_Tap_Handles__c_draft").is(":checked");
  let isActive_Z_2_Medallions__c_draft = $("#Z_2_Medallions__c_draft").is(":checked");
  let isActive_Z_2_Pitcher__c_draft = $("#Z_2_Pitcher__c_draft").is(":checked");
  let isActive_Z_2_Growler__c_draft = $("#Z_2_Growler__c_draft").is(":checked");
  let isActive_Empty_Kegs__c_draft = $("#Empty_Kegs__c_draft").is(":checked");


  const get_camera_Z_2_Bira_91_draft = document.getElementById('Z_2_Bira_91_LED_Signage__c_draft_File');
  const get_cameraZ_1_Easel_Stand__c_draft = document.getElementById('Z_1_Easel_Stand__c_draft_File');
  const get_camera_Z_1_Facade_Signage__c_draft = document.getElementById('Z_1_Facade_Signage__c_draft_File');
  const get_camera_Z_3_Coaster__c_draft = document.getElementById('Z_3_Coaster__c_draft_File');
  const get_camera_Z_3_Glassware__c_draft = document.getElementById('Z_3_Glassware__c_draft_File');
  const get_camera_Z_2_Bar_Mats__c_draft = document.getElementById('Z_2_Bar_Mats__c_draft_File');
  const get_camera_Z_2_Bucket__c_draft = document.getElementById('Z_2_Bucket__c_draft_File');
  const get_camera_Z3_Menu_Listing__c_draft = document.getElementById('Z3_Menu_Listing__c_draft_File');
  const get_camera_Z_3_Table_Tent__c_draft = document.getElementById('Z_3_Table_Tent__c_draft_File');
  const get_camera_Z_2_Tap_Handles__c_draft = document.getElementById('Z_2_Tap_Handles__c_draft_File');
  const get_camera_Z_2_Medallions__c_draft = document.getElementById('Z_2_Medallions__c_draft_File');
  const get_camera_Z_2_Pitcher__c_draft = document.getElementById('Z_2_Pitcher__c_draft_File');
  const get_camera_Z_2_Growler__c_draft = document.getElementById('Z_2_Growler__c_draft_File');
  const get_camera_Empty_Kegs__c_draft = document.getElementById('Empty_Kegs__c_draft_File');


  // const checkBox_LED_NON_working = document.getElementById('LED_Non_working_Requires_Maintenance__c_draft');
  const checkBox_Facade_Non_working = document.getElementById('Facade_Non_working_Requires_Maintenance__c_draft');
  const checkBox_Medallions_only_Non_working = document.getElementById('Medallions_only_Non_working__c_draft');




  if (isActive_Z_2_Bira_91_LED_Signage__c_draft) {
    get_camera_Z_2_Bira_91_draft.classList.remove('hide-element');
    // checkBox_LED_NON_working.classList.remove('hide-element')
    stockVisbility['Z_2_Bira_91_LED_Signage__c'] = isActive_Z_2_Bira_91_LED_Signage__c_draft

  } else {
    get_camera_Z_2_Bira_91_draft.classList.add('hide-element');
    // checkBox_LED_NON_working.classList.add('hide-element')
    stockVisbility['Z_2_Bira_91_LED_Signage__c'] = isActive_Z_2_Bira_91_LED_Signage__c_draft

  }
  if (isActive_Z_1_Easel_Stand__c_draft) {
    get_cameraZ_1_Easel_Stand__c_draft.classList.remove('hide-element');
    stockVisbility['Z_1_Easel_Stand__c'] = isActive_Z_1_Easel_Stand__c_draft

  } else {
    get_cameraZ_1_Easel_Stand__c_draft.classList.add('hide-element');
    stockVisbility['Z_1_Easel_Stand__c'] = isActive_Z_1_Easel_Stand__c_draft

  }
  if (isActive_Z_1_Facade_Signage__c_draft) {
    get_camera_Z_1_Facade_Signage__c_draft.classList.remove('hide-element');
    checkBox_Facade_Non_working.classList.remove('hide-element');
    stockVisbility['Z_1_Facade_Signage__c'] = isActive_Z_1_Facade_Signage__c_draft

  } else {
    get_camera_Z_1_Facade_Signage__c_draft.classList.add('hide-element');
    checkBox_Facade_Non_working.classList.add('hide-element');
    stockVisbility['Z_1_Facade_Signage__c'] = isActive_Z_1_Facade_Signage__c_draft

  }
  if (isActive_Z_3_Coaster__c_draft) {
    get_camera_Z_3_Coaster__c_draft.classList.remove('hide-element');
    stockVisbility['Z_3_Coaster__c'] = isActive_Z_3_Coaster__c_draft

  } else {
    get_camera_Z_3_Coaster__c_draft.classList.add('hide-element');
    stockVisbility['Z_3_Coaster__c'] = isActive_Z_3_Coaster__c_draft

  }
  if (isActive_Z_3_Glassware__c_draft) {
    get_camera_Z_3_Glassware__c_draft.classList.remove('hide-element');
    stockVisbility['Z_3_Glassware__c'] = isActive_Z_3_Glassware__c_draft

  } else {
    get_camera_Z_3_Glassware__c_draft.classList.add('hide-element');
    stockVisbility['Z_3_Glassware__c'] = isActive_Z_3_Glassware__c_draft

  }
  if (isActive_Z_2_Bar_Mats__c_draft) {
    get_camera_Z_2_Bar_Mats__c_draft.classList.remove('hide-element');
    stockVisbility['Z_2_Bar_Mats__c'] = isActive_Z_2_Bar_Mats__c_draft

  } else {
    get_camera_Z_2_Bar_Mats__c_draft.classList.add('hide-element');
    stockVisbility['Z_2_Bar_Mats__c'] = isActive_Z_2_Bar_Mats__c_draft

  }
  if (isActive_Z_2_Bucket__c_draft) {
    get_camera_Z_2_Bucket__c_draft.classList.remove('hide-element');
    stockVisbility['Z_2_Bucket__c'] = isActive_Z_2_Bucket__c_draft

  } else {
    get_camera_Z_2_Bucket__c_draft.classList.add('hide-element');
    stockVisbility['Z_2_Bucket__c'] = isActive_Z_2_Bucket__c_draft

  }
  if (isActive_Z3_Menu_Listing__c_draft) {
    get_camera_Z3_Menu_Listing__c_draft.classList.remove('hide-element');
    stockVisbility['Z3_Menu_Listing__c'] = isActive_Z3_Menu_Listing__c_draft

  } else {
    get_camera_Z3_Menu_Listing__c_draft.classList.add('hide-element');
    stockVisbility['Z3_Menu_Listing__c'] = isActive_Z3_Menu_Listing__c_draft

  }
  if (isActive_Z_3_Table_Tent__c_draft) {
    get_camera_Z_3_Table_Tent__c_draft.classList.remove('hide-element');
    stockVisbility['Z_3_Table_Tent__c'] = isActive_Z_3_Table_Tent__c_draft

  } else {
    get_camera_Z_3_Table_Tent__c_draft.classList.add('hide-element');
    stockVisbility['Z_3_Table_Tent__c'] = isActive_Z_3_Table_Tent__c_draft
  }
  if (isActive_Z_2_Tap_Handles__c_draft) {
    get_camera_Z_2_Tap_Handles__c_draft.classList.remove('hide-element');
    stockVisbility['Z_2_Tap_Handles__c'] = isActive_Z_2_Tap_Handles__c_draft
  } else {
    get_camera_Z_2_Tap_Handles__c_draft.classList.add('hide-element');
    stockVisbility['Z_2_Tap_Handles__c'] = isActive_Z_2_Tap_Handles__c_draft
  }
  if (isActive_Z_2_Medallions__c_draft) {
    get_camera_Z_2_Medallions__c_draft.classList.remove('hide-element');
    checkBox_Medallions_only_Non_working.classList.remove('hide-element')
    stockVisbility['Z_2_Medallions__c'] = isActive_Z_2_Medallions__c_draft
  } else {
    get_camera_Z_2_Medallions__c_draft.classList.add('hide-element');
    checkBox_Medallions_only_Non_working.classList.add('hide-element')
    stockVisbility['Z_2_Medallions__c'] = isActive_Z_2_Medallions__c_draft
  }
  if (isActive_Z_2_Growler__c_draft) {
    get_camera_Z_2_Growler__c_draft.classList.remove('hide-element');
    stockVisbility['Z_2_Growler__c'] = isActive_Z_2_Growler__c_draft
  } else {
    get_camera_Z_2_Growler__c_draft.classList.add('hide-element');
    stockVisbility['Z_2_Growler__c'] = isActive_Z_2_Growler__c_draft
  }
  if (isActive_Z_2_Pitcher__c_draft) {
    get_camera_Z_2_Pitcher__c_draft.classList.remove('hide-element');
    stockVisbility['Z_2_Pitcher__c'] = isActive_Z_2_Pitcher__c_draft
  } else {
    get_camera_Z_2_Pitcher__c_draft.classList.add('hide-element');
    stockVisbility['Z_2_Pitcher__c'] = isActive_Z_2_Pitcher__c_draft
  }
  if (isActive_Empty_Kegs__c_draft) {
    get_camera_Empty_Kegs__c_draft.classList.remove('hide-element');
    stockVisbility['Empty_Kegs__c'] = isActive_Empty_Kegs__c_draft
  } else {
    get_camera_Empty_Kegs__c_draft.classList.add('hide-element');
    stockVisbility['Empty_Kegs__c'] = isActive_Empty_Kegs__c_draft
  }
}

function saveVisibilityAndNext() {
  const draft_status = accountDetail?.Draft_Status__c
  const qco_status = accountDetail?.QCO_Flag__c;
  const channel_type = accountDetail?.Channel__c;
  if (draft_status) {
    const checkBox_Facade_Non_working = $("#Facade_Non_working_draft").is(":checked");
    const checkBox_Medallions_only_Non_working = $("#Medallions_only_Non_working_draft").is(":checked");
    stockVisbility['Facade_Non_working_Requires_Maintenance__c'] = checkBox_Facade_Non_working;
    stockVisbility['Medallions_only_Non_working__c'] = checkBox_Medallions_only_Non_working;
  } else if (qco_status) {
    let checkBox_Led_Non_Working_Status = $("#LED_Non_working_qco_check").is(":checked");
    let checkBox_Facade_Non_working_Status = $("#Facade_Non_working_qco_check").is(":checked");
    stockVisbility['LED_Non_working_Requires_Maintenance__c'] = checkBox_Led_Non_Working_Status;
    stockVisbility['Facade_Non_working_Requires_Maintenance__c'] = checkBox_Facade_Non_working_Status;
  } else if (channel_type === 'On-Premise') {
    let checkBox_Led_Non_Working_Status = $("#LED_Non_working_Requires_Maintenance__c_on").is(":checked");
    let checkBox_Facade_Non_working_Status = $("#Facade_Non_working_Requires_Maintenance__c_on").is(":checked");
    stockVisbility['LED_Non_working_Requires_Maintenance__c'] = checkBox_Led_Non_Working_Status;
    stockVisbility['Facade_Non_working_Requires_Maintenance__c'] = checkBox_Facade_Non_working_Status;
  } else if (channel_type === 'Off-Premise') {
    let Chiller_Purity__c_off_Value = $('#Chiller_Purity__c_off').val();
    const checkBox_LED_NON_working = $("#LED_Non_working_off").is(":checked");
    const checkBox_Facade_Non_working = $("#Facade_Non_working_off").is(":checked");
    const checkBox_One_way_vision_Non_working = $("#One_way_vision_Non_working_off").is(":checked");
    const checkBox_cooler_Non_working = $("#cooler_Non_working_off").is(":checked");
    const checkBox_Island_Unit_Non_working = $("#Island_Unit_Non_working_off").is(":checked");
    const checkBox_FSU_Non_working = $("#FSU_Non_working_off").is(":checked");
    stockVisbility['LED_Non_working_Requires_Maintenance__c'] = checkBox_LED_NON_working;
    stockVisbility['Facade_Non_working_Requires_Maintenance__c'] = checkBox_Facade_Non_working;
    stockVisbility['One_way_vision_Non_working__c'] = checkBox_One_way_vision_Non_working;
    stockVisbility['cooler_Non_working_Requires_Maintenance__c'] = checkBox_cooler_Non_working;
    stockVisbility['Island_Unit_Non_working__c'] = checkBox_Island_Unit_Non_working;
    stockVisbility['FSU_Non_working_Requires_Maintenance__c'] = checkBox_FSU_Non_working;
    stockVisbility['Chiller_Purity__c'] = Chiller_Purity__c_off_Value;
  }
  saveStockVisibilityData()
}

function saveStockVisibilityData() {
  let isValid = true;
  for (let i in stockVisbility) {
    if (typeof stockVisbility[i] === 'boolean' && stockVisbility[i] === true) {
      if (!stockVisbility[`${i}_File`] && !(i.includes('Non_working'))) {
        isValid = false;
        break;
      }
    }
  }

  if (!isValid) {
    $('#stockSubmit').modal('show');
    $('#stockSubmit .modal-body').html('Images are mandatory where elements are present! Press Toggle off if image is not available');
    $('.modal-footer .btn-success').css('display', 'none');
    $('.modal-footer .btn-danger').html('Close');
  }
  else {
    $('#stockSubmit').modal('show');
    $('.modal-footer .btn').css('display', '');
    $('#stockSubmit .modal-body').html('Are you sure you want to submit ? ');
    $('.modal-footer .btn-danger').html('No');
  }
}

const handleStockVisibilitySubmit = async () => {
  await writeData('stockVisibility', stockVisbility);
  let urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('accountId');
  window.location.href = `/view/sales/posm.html?accountId=${accountId}`

}


const fileInput = async (event) => {
  let key = event.id;
  key = key + '__c_File'
  const fileInput = event.files[0];
  var options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  const compressedFile = await imageCompression(fileInput, options);
  uploadBase64Value(key, compressedFile);
};

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const uploadBase64Value = async (key, fileInput) => {
  stockVisbility[key] = await toBase64(fileInput);
  fileAttachedBackgroundChange(key);
};


const fileAttachedBackgroundChange = (key) => {
  let iconKey = key.substring(0, key.length - 8);
  let icon = $('.' + iconKey);
  icon.css('color', '#5cb85c');
};



const populatePrevDetails = (draft_status, qco_status, channel_type) => {
  if (draft_status) {
    document.getElementById('Z_2_Bira_91_LED_Signage__c_draft').checked = stockVisbility['Z_2_Bira_91_LED_Signage__c']
    document.getElementById('Z_1_Easel_Stand__c_draft').checked = stockVisbility['Z_1_Easel_Stand__c']
    document.getElementById('Z_1_Facade_Signage__c_draft').checked = stockVisbility['Z_1_Facade_Signage__c']
    document.getElementById('Z_3_Coaster__c_draft').checked = stockVisbility['Z_3_Coaster__c']
    document.getElementById('Z_3_Glassware__c_draft').checked = stockVisbility['Z_3_Glassware__c']
    document.getElementById('Z_2_Bar_Mats__c_draft').checked = stockVisbility['Z_2_Bar_Mats__c']
    document.getElementById('Z_2_Bucket__c_draft').checked = stockVisbility['Z_2_Bucket__c']
    document.getElementById('Z3_Menu_Listing__c_draft').checked = stockVisbility['Z3_Menu_Listing__c']
    document.getElementById('Z_3_Table_Tent__c_draft').checked = stockVisbility['Z_3_Table_Tent__c']
    document.getElementById('Z_2_Tap_Handles__c_draft').checked = stockVisbility['Z_2_Tap_Handles__c']
    document.getElementById('Z_2_Medallions__c_draft').checked = stockVisbility['Z_2_Medallions__c']
    document.getElementById('Z_2_Pitcher__c_draft').checked = stockVisbility['Z_2_Pitcher__c']
    document.getElementById('Z_2_Growler__c_draft').checked = stockVisbility['Z_2_Growler__c']
    document.getElementById('Empty_Kegs__c_draft').checked = stockVisbility['Empty_Kegs__c']

    document.getElementById('Z_2_Bira_91_LED_Signage__c_draft_File').value = stockVisbility['Z_2_Bira_91_LED_Signage__c_File']
    if(stockVisbility['Z_2_Bira_91_LED_Signage__c_File']){
      fileAttachedBackgroundChange('Z_2_Bira_91_LED_Signage__c_File')
    }
    document.getElementById('Z_1_Easel_Stand__c_draft_File').value = stockVisbility['Z_1_Easel_Stand__c_File']
    if(stockVisbility['Z_1_Easel_Stand__c_File']){
      fileAttachedBackgroundChange('Z_1_Easel_Stand__c_File')
    }
    document.getElementById('Z_1_Facade_Signage__c_draft_File').value = stockVisbility['Z_1_Facade_Signage__c_File']
    if(stockVisbility['Z_1_Facade_Signage__c_File']){
      fileAttachedBackgroundChange('Z_1_Facade_Signage__c_File')
    }
    document.getElementById('Z_3_Coaster__c_draft_File').value = stockVisbility['Z_3_Coaster__c_File']
    if(stockVisbility['Z_3_Coaster__c_File']){
      fileAttachedBackgroundChange('Z_3_Coaster__c_File')
    }
    document.getElementById('Z_3_Glassware__c_draft_File').value = stockVisbility['Z_3_Glassware__c_File']
    if(stockVisbility['Z_3_Glassware__c_File']){
      fileAttachedBackgroundChange('Z_3_Glassware__c_File')
    }
    document.getElementById('Z_2_Bar_Mats__c_draft_File').value = stockVisbility['Z_2_Bar_Mats__c_File']
    if(stockVisbility['Z_2_Bar_Mats__c_File']){
      fileAttachedBackgroundChange('Z_2_Bar_Mats__c_File')
    }
    document.getElementById('Z_2_Bucket__c_draft_File').value = stockVisbility['Z_2_Bucket__c_File']
    if(stockVisbility['Z_2_Bucket__c_File']){
      fileAttachedBackgroundChange('Z_2_Bucket__c_File')
    }
    document.getElementById('Z3_Menu_Listing__c_draft_File').value = stockVisbility['Z3_Menu_Listing__c_File']
    if(stockVisbility['Z3_Menu_Listing__c_File']){
      fileAttachedBackgroundChange('Z3_Menu_Listing__c_File')
    }

    document.getElementById('Z_3_Table_Tent__c_draft_File').value = stockVisbility['Z_3_Table_Tent__c_File']
    if(stockVisbility['Z_3_Table_Tent__c_File']){
      fileAttachedBackgroundChange('Z_3_Table_Tent__c_File')
    }
    document.getElementById('Z_2_Tap_Handles__c_draft_File').value = stockVisbility['Z_2_Tap_Handles__c_File']
    if(stockVisbility['Z_2_Tap_Handles__c_File']){
      fileAttachedBackgroundChange('Z_2_Tap_Handles__c_File')
    }
    document.getElementById('Z_2_Medallions__c_draft_File').value = stockVisbility['Z_2_Medallions__c_File']
    if(stockVisbility['Z_2_Medallions__c_File']){
      fileAttachedBackgroundChange('Z_2_Medallions__c_File')
    }
    document.getElementById('Z_2_Pitcher__c_draft_File').value = stockVisbility['Z_2_Pitcher__c_File']
    if(stockVisbility['Z_2_Pitcher__c_File']){
      fileAttachedBackgroundChange('Z_2_Pitcher__c_File')
    }
    document.getElementById('Z_2_Growler__c_draft_File').value = stockVisbility['Z_2_Growler__c_File']
    if(stockVisbility['Z_2_Growler__c_File']){
      fileAttachedBackgroundChange('Z_2_Growler__c_File')
    }
    document.getElementById('Empty_Kegs__c_draft_File').value = stockVisbility['Empty_Kegs__c_File']
    if(stockVisbility['Empty_Kegs__c_File']){
      fileAttachedBackgroundChange('Empty_Kegs__c_File')
    }
    document.getElementById('Medallions_only_Non_working_draft').checked = stockVisbility['Medallions_only_Non_working__c']
    document.getElementById('Facade_Non_working_draft').checked = stockVisbility['Facade_Non_working_Requires_Maintenance__c']

    handleToggleSwitchDraft()
  } else if (qco_status) {
    document.getElementById('Z_2_Bira_91_LED_Signage__c_qco').checked = stockVisbility['Z_2_Bira_91_LED_Signage__c']
    document.getElementById('Z_1_Facade_Signage__c_qco').checked = stockVisbility['Z_1_Facade_Signage__c']
    document.getElementById('Z3_Menu_Listing__c_qco').checked = stockVisbility['Z3_Menu_Listing__c']

    document.getElementById('Z_2_Bira_91_LED_Signage__c_qco_File').value = stockVisbility['Z_2_Bira_91_LED_Signage__c_File']
    if(stockVisbility['Z_2_Bira_91_LED_Signage__c_File']){
      fileAttachedBackgroundChange('Z_2_Bira_91_LED_Signage__c_File')

    }
    document.getElementById('Z_1_Facade_Signage__c_qco_File').value = stockVisbility['Z_1_Facade_Signage__c_File']
    if(stockVisbility['Z_1_Facade_Signage__c_File']){
      fileAttachedBackgroundChange('Z_1_Facade_Signage__c_File')

    }
    document.getElementById('Z3_Menu_Listing__c_qco_File').value = stockVisbility['Z3_Menu_Listing__c_File']
    if(stockVisbility['Z3_Menu_Listing__c_File']){
      fileAttachedBackgroundChange('Z3_Menu_Listing__c_File')

    }

    document.getElementById('LED_Non_working_qco_check').checked = stockVisbility['LED_Non_working_Requires_Maintenance__c']
    document.getElementById('Facade_Non_working_qco_check').checked = stockVisbility['Facade_Non_working_Requires_Maintenance__c']
    handleToggleSwitchQCO()
  } else if (channel_type === 'On-Premise') {
    document.getElementById('Z_2_Bira_91_LED_Signage__c').checked = stockVisbility['Z_2_Bira_91_LED_Signage__c']
    document.getElementById('Z_1_Easel_Stand__c').checked = stockVisbility['Z_1_Easel_Stand__c']
    document.getElementById('Z_1_Facade_Signage__c').checked = stockVisbility['Z_1_Facade_Signage__c']
    document.getElementById('Z_3_Coaster__c').checked = stockVisbility['Z_3_Coaster__c']
    document.getElementById('Z_3_Glassware__c').checked = stockVisbility['Z_3_Glassware__c']
    document.getElementById('Z_2_Bar_Mats__c').checked = stockVisbility['Z_2_Bar_Mats__c']
    document.getElementById('Z_2_Bucket__c').checked = stockVisbility['Z_2_Bucket__c']
    document.getElementById('Z3_Menu_Listing__c').checked = stockVisbility['Z3_Menu_Listing__c']
    document.getElementById('Z_3_Table_Tent__c').checked = stockVisbility['Z_3_Table_Tent__c']

    document.getElementById('Z_2_Bira_91_LED_Signage__c_File').value = stockVisbility['Z_2_Bira_91_LED_Signage__c_File']
    if(stockVisbility['Z_2_Bira_91_LED_Signage__c_File']){
      fileAttachedBackgroundChange('Z_2_Bira_91_LED_Signage__c_File')
    }
    document.getElementById('Z_1_Easel_Stand__c_File').value = stockVisbility['Z_1_Easel_Stand__c_File']
    if(stockVisbility['Z_1_Easel_Stand__c_File']){
      fileAttachedBackgroundChange('Z_1_Easel_Stand__c_File')
    }
    document.getElementById('Z_1_Facade_Signage__c_File').value = stockVisbility['Z_1_Facade_Signage__c_File']
    if(stockVisbility['Z_1_Facade_Signage__c_File']){
      fileAttachedBackgroundChange('Z_1_Facade_Signage__c_File')
    }
    document.getElementById('Z_3_Coaster__c_File').value = stockVisbility['Z_3_Coaster__c_File']
    if(stockVisbility['Z_3_Coaster__c_File']){
      fileAttachedBackgroundChange('Z_3_Coaster__c_File')
    }
    document.getElementById('Z_3_Glassware__c_File').value = stockVisbility['Z_3_Glassware__c_File']
    if(stockVisbility['Z_3_Glassware__c_File']){
      fileAttachedBackgroundChange('Z_3_Glassware__c_File')
    }
    document.getElementById('Z_2_Bar_Mats__c_File').value = stockVisbility['Z_2_Bar_Mats__c_File']
    if(stockVisbility['Z_2_Bar_Mats__c_File']){
      fileAttachedBackgroundChange('Z_2_Bar_Mats__c_File')
    }
    document.getElementById('Z_2_Bucket__c_File').value = stockVisbility['Z_2_Bucket__c_File']
    if(stockVisbility['Z_2_Bucket__c_File']){
      fileAttachedBackgroundChange('Z_2_Bucket__c_File')
    }
    document.getElementById('Z3_Menu_Listing__c_File').value = stockVisbility['Z3_Menu_Listing__c_File']
    if(stockVisbility['Z3_Menu_Listing__c_File']){
      fileAttachedBackgroundChange('Z3_Menu_Listing__c_File')
    }
    document.getElementById('Z_3_Table_Tent__c_File').value = stockVisbility['Z_3_Table_Tent__c_File']
    if(stockVisbility['Z_3_Table_Tent__c_File']){
      fileAttachedBackgroundChange('Z_3_Table_Tent__c_File')
    }

    document.getElementById('LED_Non_working_Requires_Maintenance__c_on').checked = stockVisbility['LED_Non_working_Requires_Maintenance__c']
    document.getElementById('Facade_Non_working_Requires_Maintenance__c_on').checked = stockVisbility['Facade_Non_working_Requires_Maintenance__c']
    handleToggleONPremises()
  } else if (channel_type === 'Off-Premise') {
    document.getElementById('Z_2_Bira_91_LED_Signage__c_off').checked = stockVisbility['Z_2_Bira_91_LED_Signage__c']
    document.getElementById('Z_1_Facade_Signage__c_off').checked = stockVisbility['Z_1_Facade_Signage__c']
    document.getElementById('Z_1_One_way_Vision__c_off').checked = stockVisbility['Z_1_One_way_Vision__c']
    document.getElementById('VisiCooler__c_off').checked = stockVisbility['VisiCooler__c']
    document.getElementById('Z_3_Planogram_Adherence__c_off').checked = stockVisbility['Z_3_Planogram_Adherence__c']
    document.getElementById('Chiller_Re_Stocked__c_off').checked = stockVisbility['Chiller_Re_Stocked__c']
    document.getElementById('Z_3_Island_Unit__c_off').checked = stockVisbility['Z_3_Island_Unit__c']
    document.getElementById('Z_3_Floor_Standing_Unit__c_off').checked = stockVisbility['Z_3_Floor_Standing_Unit__c']
    document.getElementById('Chiller_Purity__c_off').value = stockVisbility['Chiller_Purity__c']

    document.getElementById('Z_2_Bira_91_LED_Signage__c_off_File').value = stockVisbility['Z_2_Bira_91_LED_Signage__c_File']
    if(stockVisbility['Z_2_Bira_91_LED_Signage__c_File']){
      fileAttachedBackgroundChange('Z_2_Bira_91_LED_Signage__c_File')

    }
    document.getElementById('Z_1_Facade_Signage__c_off_File').value = stockVisbility['Z_1_Facade_Signage__c_File']
    if(stockVisbility['Z_1_Facade_Signage__c_File']){
      fileAttachedBackgroundChange('Z_1_Facade_Signage__c_File')

    }

    document.getElementById('Z_1_One_way_Vision__c_off_File').value = stockVisbility['Z_1_One_way_Vision__c_File']
    if(stockVisbility['Z_1_One_way_Vision__c_File']){
      fileAttachedBackgroundChange('Z_1_One_way_Vision__c_File')

    }

    document.getElementById('VisiCooler__c_off_File').value = stockVisbility['VisiCooler__c_File']
    if(stockVisbility['VisiCooler__c_File']){
      fileAttachedBackgroundChange('VisiCooler__c_File')

    }

    document.getElementById('Z_3_Planogram_Adherence__c_off_File').value = stockVisbility['Z_3_Planogram_Adherence__c_File']
    if(stockVisbility['Z_3_Planogram_Adherence__c_File']){
    fileAttachedBackgroundChange('Z_3_Planogram_Adherence__c_File')
    }

    document.getElementById('Chiller_Re_Stocked__c_off_File').value = stockVisbility['Chiller_Re_Stocked__c_File']
    if(stockVisbility['Chiller_Re_Stocked__c_File']){
      fileAttachedBackgroundChange('Chiller_Re_Stocked__c_File')

    }

    document.getElementById('Z_3_Island_Unit__c_off_File').value = stockVisbility['Z_3_Island_Unit__c_File']
    if(stockVisbility['Z_3_Island_Unit__c_File']){
      fileAttachedBackgroundChange('Z_3_Island_Unit__c_File')
    }

    document.getElementById('Z_3_Floor_Standing_Unit__c_off_File').value = stockVisbility['Z_3_Floor_Standing_Unit__c_File']
    if(stockVisbility['Z_3_Floor_Standing_Unit__c_File']){
      fileAttachedBackgroundChange('Z_3_Floor_Standing_Unit__c_File')

    }

    document.getElementById('LED_Non_working_off').checked = stockVisbility['LED_Non_working_Requires_Maintenance__c']
    document.getElementById('Facade_Non_working_off').checked = stockVisbility['Facade_Non_working_Requires_Maintenance__c']
    document.getElementById('One_way_vision_Non_working_off').checked = stockVisbility['One_way_vision_Non_working__c']
    document.getElementById('cooler_Non_working_off').checked = stockVisbility['cooler_Non_working_Requires_Maintenance__c']
    document.getElementById('Island_Unit_Non_working_off').checked = stockVisbility['Island_Unit_Non_working__c']
    document.getElementById('FSU_Non_working_off').checked = stockVisbility['FSU_Non_working_Requires_Maintenance__c']

    handleToggleOffPremises()

  }

}
initializeVisibilityPage();
