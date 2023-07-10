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
    stockVisbility['Z_2_Bira_91_LED_Signage'] = isActive_Z_2_Bira_91_LED_Signage__c
  } else {
    get_camera_Z_2_Bira_91.classList.add('hide-element');
    checkBox_LED_NON_working.classList.add('hide-element')
    stockVisbility['Z_2_Bira_91_LED_Signage'] = isActive_Z_2_Bira_91_LED_Signage__c
    stockVisbility['LED_Non_working_Requires_Maintenance'] = false;
    document.getElementById('LED_Non_working_qco_check').checked = false
    document.getElementById('Z_2_Bira_91_LED_Signage__c_qco_File').value = null
    stockVisbility['Z_2_Bira_91_LED_Signage_File'] = null
    removeBackgroundColor('Z_2_Bira_91_LED_Signage_File')
  }
  if (isActive_Z_1_Facade_Signage__c) {
    get_camera_Z_1_Facade.classList.remove('hide-element');
    checkBox_Facade_Non_working.classList.remove('hide-element')
    stockVisbility['Z_1_Facade_Signage'] = isActive_Z_1_Facade_Signage__c
  } else {
    get_camera_Z_1_Facade.classList.add('hide-element');
    checkBox_Facade_Non_working.classList.add('hide-element')
    stockVisbility['Z_1_Facade_Signage'] = isActive_Z_1_Facade_Signage__c
    stockVisbility['Facade_Non_working_Requires_Maintenance'] = false;
    document.getElementById('Facade_Non_working_qco_check').checked = false
    document.getElementById('Z_1_Facade_Signage__c_qco_File').value = null
    stockVisbility['Z_1_Facade_Signage_File'] = null
    removeBackgroundColor('Z_1_Facade_Signage_File')
  }
  if (isActive_Z3_Menu_Listing__c) {
    get_camera_Z3_Menu_Listing.classList.remove('hide-element');
    stockVisbility['Z3_Menu_Listing'] = isActive_Z3_Menu_Listing__c
  } else {
    get_camera_Z3_Menu_Listing.classList.add('hide-element');
    stockVisbility['Z3_Menu_Listing'] = isActive_Z3_Menu_Listing__c
    document.getElementById('Z3_Menu_Listing__c_qco_File').value = null
    stockVisbility['Z3_Menu_Listing_File'] = null
    removeBackgroundColor('Z3_Menu_Listing_File')
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
    stockVisbility['Z_2_Bira_91_LED_Signage'] = isActive_Z_2_Bira_91_LED_Signage__c
  } else {
    get_camera_Z_2_Bira_91.classList.add('hide-element');
    checkBox_LED_NON_working.classList.add('hide-element')
    stockVisbility['Z_2_Bira_91_LED_Signage'] = isActive_Z_2_Bira_91_LED_Signage__c
    stockVisbility['LED_Non_working_Requires_Maintenance'] = false
    document.getElementById('LED_Non_working_Requires_Maintenance__c').checked = false
    document.getElementById('Z_2_Bira_91_LED_Signage__c_File').value = null
    stockVisbility['Z_2_Bira_91_LED_Signage_File'] = null
    removeBackgroundColor('Z_2_Bira_91_LED_Signage_File')
  }
  if (isActive_Z_1_Easel_Stand__c) {
    get_camera_Z_1_Easel_Stand.classList.remove('hide-element');
    stockVisbility['Z_1_Easel_Stand'] = isActive_Z_1_Easel_Stand__c

  } else {
    get_camera_Z_1_Easel_Stand.classList.add('hide-element');
    stockVisbility['Z_1_Easel_Stand'] = isActive_Z_1_Easel_Stand__c
    document.getElementById('Z_1_Easel_Stand__c_File').value = null
    stockVisbility['Z_1_Easel_Stand_File'] = null
    removeBackgroundColor('Z_1_Easel_Stand_File')
  }
  if (isActive_Z_1_Facade_Signage__c) {
    get_camera_Z_1_Facade_Signage.classList.remove('hide-element');
    checkBox_Facade_Non_working.classList.remove('hide-element')
    stockVisbility['Z_1_Facade_Signage'] = isActive_Z_1_Facade_Signage__c
  } else {
    get_camera_Z_1_Facade_Signage.classList.add('hide-element');
    checkBox_Facade_Non_working.classList.add('hide-element')
    stockVisbility['Z_1_Facade_Signage'] = isActive_Z_1_Facade_Signage__c
    stockVisbility['Z_1_Facade_Signage'] = false;
    document.getElementById('Facade_Non_working_Requires_Maintenance__c').checked = false
    document.getElementById('Z_1_Facade_Signage__c_File').value = null
    stockVisbility['Z_1_Facade_Signage_File'] = null
    removeBackgroundColor('Z_1_Facade_Signage_File')
  }
  if (isActive_Z_3_Coaster__c) {
    get_camera_Z_3_Coaster.classList.remove('hide-element');
    stockVisbility['Z_3_Coaster'] = isActive_Z_3_Coaster__c
  } else {
    get_camera_Z_3_Coaster.classList.add('hide-element');
    stockVisbility['Z_3_Coaster'] = isActive_Z_3_Coaster__c
    document.getElementById('Z_3_Coaster__c_File').value = null
    stockVisbility['Z_3_Coaster_File'] = null
    removeBackgroundColor('Z_3_Coaster_File')
  }
  if (isActive_Z_3_Glassware__c) {
    get_camera_Z_3_Glassware.classList.remove('hide-element')
    stockVisbility['Z_3_Glassware'] = isActive_Z_3_Glassware__c
  } else {
    get_camera_Z_3_Glassware.classList.add('hide-element');
    stockVisbility['Z_3_Glassware'] = isActive_Z_3_Glassware__c
    document.getElementById('Z_3_Glassware__c_File').value = null
    stockVisbility['Z_3_Glassware_File'] = null
    removeBackgroundColor('Z_3_Glassware_File')
  }
  if (isActive_Z_2_Bar_Mats__c) {
    get_camera_Z_2_Bar_Mats.classList.remove('hide-element');
    stockVisbility['Z_2_Bar_Mats'] = isActive_Z_2_Bar_Mats__c
  } else {
    get_camera_Z_2_Bar_Mats.classList.add('hide-element');
    stockVisbility['Z_2_Bar_Mats'] = isActive_Z_2_Bar_Mats__c
    document.getElementById('Z_2_Bar_Mats__c_File').value = null
    stockVisbility['Z_2_Bar_Mats_File'] = null
    removeBackgroundColor('Z_2_Bar_Mats_File')
  }
  if (isActive_Z_2_Bucket__c) {
    get_camera_Z_2_Bucket.classList.remove('hide-element');
    stockVisbility['Z_2_Bucket'] = isActive_Z_2_Bucket__c
  } else {
    get_camera_Z_2_Bucket.classList.add('hide-element');
    stockVisbility['Z_2_Bucket'] = isActive_Z_2_Bucket__c
    document.getElementById('Z_2_Bucket__c_File').value = null
    stockVisbility['Z_2_Bucket_File'] = null
    removeBackgroundColor('Z_2_Bucket_File')
  }
  if (isActive_Z3_Menu_Listing__c) {
    get_camera_Z3_Menu_Listing.classList.remove('hide-element');
    stockVisbility['Z3_Menu_Listing'] = isActive_Z3_Menu_Listing__c
  } else {
    get_camera_Z3_Menu_Listing.classList.add('hide-element');
    stockVisbility['Z3_Menu_Listing'] = isActive_Z3_Menu_Listing__c
    document.getElementById('Z3_Menu_Listing__c_File').value = null
    stockVisbility['Z3_Menu_Listing_File'] = null
    removeBackgroundColor('Z3_Menu_Listing_File')
  }
  if (isActive_Z_3_Table_Tent__c) {
    get_camera_Z_3_Table_Tent.classList.remove('hide-element');
    stockVisbility['Z_3_Table_Tent'] = isActive_Z_3_Table_Tent__c
  } else {
    get_camera_Z_3_Table_Tent.classList.add('hide-element');
    stockVisbility['Z_3_Table_Tent'] = isActive_Z_3_Table_Tent__c
    document.getElementById('Z_3_Table_Tent__c_File').value = null
    stockVisbility['Z_3_Table_Tent_File'] = null
    removeBackgroundColor('Z_3_Table_Tent_File')
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
    stockVisbility['Z_2_Bira_91_LED_Signage'] = isActive_Z_2_Bira_91_LED_Signage__c_off
  } else {
    get_camera_Z_2_Bira_91_off.classList.add('hide-element');
    checkBox_LED_NON_working.classList.add('hide-element')
    stockVisbility['Z_2_Bira_91_LED_Signage'] = isActive_Z_2_Bira_91_LED_Signage__c_off
    stockVisbility['LED_Non_working_Requires_Maintenance'] = false;
    document.getElementById('LED_Non_working_off').checked = false
    document.getElementById('Z_2_Bira_91_LED_Signage__c_off_File').value = null
    stockVisbility['Z_2_Bira_91_LED_Signage_File'] = null
    removeBackgroundColor('Z_2_Bira_91_LED_Signage_File')
  }
  if (isActive_Z_1_Facade_Signage__c_off) {
    get_camera_Z_1_Facade_Signage_off.classList.remove('hide-element');
    checkBox_Facade_Non_working.classList.remove('hide-element')
    stockVisbility['Z_1_Facade_Signage'] = isActive_Z_1_Facade_Signage__c_off
  } else {
    get_camera_Z_1_Facade_Signage_off.classList.add('hide-element');
    checkBox_Facade_Non_working.classList.add('hide-element')
    stockVisbility['Z_1_Facade_Signage'] = isActive_Z_1_Facade_Signage__c_off
    stockVisbility['Z_1_Facade_Signage'] = false;
    document.getElementById('Facade_Non_working_off').checked = false
    document.getElementById('Z_1_Facade_Signage__c_off_File').value = null
    stockVisbility['Z_1_Facade_Signage_File'] = null
    removeBackgroundColor('Z_1_Facade_Signage_File')
  }
  if (isActive_Z_1_One_way_Vision__c_off) {
    get_camera_Z_1_One_way_Vision_off.classList.remove('hide-element');
    checkBox_One_way_vision_Non_working.classList.remove('hide-element')
    stockVisbility['Z_1_One_way_Vision'] = isActive_Z_1_One_way_Vision__c_off
  } else {
    get_camera_Z_1_One_way_Vision_off.classList.add('hide-element');
    checkBox_One_way_vision_Non_working.classList.add('hide-element')
    stockVisbility['Z_1_One_way_Vision'] = isActive_Z_1_One_way_Vision__c_off
    stockVisbility['One_way_vision_Non_working'] = false;
    document.getElementById('One_way_vision_Non_working_off').checked = false
    document.getElementById('Z_1_One_way_Vision__c_off_File').value = null
    stockVisbility['Z_1_One_way_Vision_File'] = null
    removeBackgroundColor('Z_1_One_way_Vision_File')
  }
  if (isActive_VisiCooler__c_off) {
    get_camera_VisiCooler__c_off.classList.remove('hide-element');
    checkBox_cooler_Non_working.classList.remove('hide-element')
    stockVisbility['VisiCooler'] = isActive_VisiCooler__c_off
  } else {
    get_camera_VisiCooler__c_off.classList.add('hide-element');
    checkBox_cooler_Non_working.classList.add('hide-element')
    stockVisbility['VisiCooler'] = isActive_VisiCooler__c_off
    stockVisbility['cooler_Non_working_Requires_Maintenance'] = false;
    document.getElementById('cooler_Non_working_off').checked = false
    document.getElementById('VisiCooler__c_off_File').value = null
    stockVisbility['VisiCooler_File'] = null
    removeBackgroundColor('VisiCooler_File')
  }
  if (isActive_Z_3_Planogram_Adherence__c_off) {
    get_camera_Z_3_Planogram_Adherence_off.classList.remove('hide-element');
    stockVisbility['Z_3_Planogram_Adherence'] = isActive_Z_3_Planogram_Adherence__c_off
  } else {
    get_camera_Z_3_Planogram_Adherence_off.classList.add('hide-element');
    stockVisbility['Z_3_Planogram_Adherence'] = isActive_Z_3_Planogram_Adherence__c_off
    document.getElementById('Z_3_Planogram_Adherence__c_off_File').value = null
    stockVisbility['Z_3_Planogram_Adherence_File'] = null
    removeBackgroundColor('Z_3_Planogram_Adherence_File')
  }

  if (isActive_Chiller_Re_Stocked__c_off) {
    get_camera_Chiller_Re_Stocked__c_off.classList.remove('hide-element');
    stockVisbility['Chiller_Re_Stocked'] = isActive_Chiller_Re_Stocked__c_off
  } else {
    get_camera_Chiller_Re_Stocked__c_off.classList.add('hide-element');
    stockVisbility['Chiller_Re_Stocked'] = isActive_Chiller_Re_Stocked__c_off
    document.getElementById('Chiller_Re_Stocked__c_off_File').value = null
    stockVisbility['Chiller_Re_Stocked_File'] = null
    removeBackgroundColor('Chiller_Re_Stocked_File')
  }

  if (isActive_Z_3_Island_Unit__c_off) {
    get_camera_Z_3_Island_Unit__c_off.classList.remove('hide-element');
    checkBox_Island_Unit_Non_working.classList.remove('hide-element')
    stockVisbility['Z_3_Island_Unit'] = isActive_Z_3_Island_Unit__c_off
  } else {
    get_camera_Z_3_Island_Unit__c_off.classList.add('hide-element');
    checkBox_Island_Unit_Non_working.classList.add('hide-element')
    stockVisbility['Z_3_Island_Unit'] = isActive_Z_3_Island_Unit__c_off
    stockVisbility['Island_Unit_Non_working'] = false;
    document.getElementById('Island_Unit_Non_working_off').checked = false
    document.getElementById('Z_3_Island_Unit__c_off_File').value = null
    stockVisbility['Z_3_Island_Unit_File'] = null
    removeBackgroundColor('Z_3_Island_Unit_File')
  }
  if (isActive_Z_3_Floor_Standing_Unit__c_off) {
    get_camera_Z_3_Floor_Standing_Unit__c_off.classList.remove('hide-element');
    checkBox_FSU_Non_working.classList.remove('hide-element')
    stockVisbility['Z_3_Floor_Standing_Unit'] = isActive_Z_3_Floor_Standing_Unit__c_off
  } else {
    get_camera_Z_3_Floor_Standing_Unit__c_off.classList.add('hide-element');
    checkBox_FSU_Non_working.classList.add('hide-element')
    stockVisbility['Z_3_Floor_Standing_Unit'] = isActive_Z_3_Floor_Standing_Unit__c_off
    stockVisbility['FSU_Non_working_Requires_Maintenance'] = false;
    document.getElementById('FSU_Non_working_off').checked = false
    document.getElementById('Z_3_Floor_Standing_Unit__c_off_File').value = null
    stockVisbility['Z_3_Floor_Standing_Unit_File'] = null
    removeBackgroundColor('Z_3_Floor_Standing_Unit_File')
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


  const checkBox_LED_NON_working = document.getElementById('LED_Non_working_Requires_Maintenance__c_draft');
  const checkBox_Facade_Non_working = document.getElementById('Facade_Non_working_Requires_Maintenance__c_draft');
  const checkBox_Medallions_only_Non_working = document.getElementById('Medallions_only_Non_working__c_draft');



  if (isActive_Z_2_Bira_91_LED_Signage__c_draft) {
    get_camera_Z_2_Bira_91_draft.classList.remove('hide-element');
    checkBox_LED_NON_working.classList.remove('hide-element')
    stockVisbility['Z_2_Bira_91_LED_Signage'] = isActive_Z_2_Bira_91_LED_Signage__c_draft

  } else {
    get_camera_Z_2_Bira_91_draft.classList.add('hide-element');
    checkBox_LED_NON_working.classList.add('hide-element')
    stockVisbility['Z_2_Bira_91_LED_Signage'] = isActive_Z_2_Bira_91_LED_Signage__c_draft
    document.getElementById('Z_2_Bira_91_LED_Signage__c_draft_File').value = null
    document.getElementById('LED_Non_working_Requires_Maintenance__c_draft').value = null
    stockVisbility['Z_2_Bira_91_LED_Signage_File'] = null
    removeBackgroundColor('Z_2_Bira_91_LED_Signage_File')
  }
  if (isActive_Z_1_Easel_Stand__c_draft) {
    get_cameraZ_1_Easel_Stand__c_draft.classList.remove('hide-element');
    stockVisbility['Z_1_Easel_Stand'] = isActive_Z_1_Easel_Stand__c_draft

  } else {
    get_cameraZ_1_Easel_Stand__c_draft.classList.add('hide-element');
    stockVisbility['Z_1_Easel_Stand'] = isActive_Z_1_Easel_Stand__c_draft
    document.getElementById('Z_1_Easel_Stand__c_draft_File').value = null
    stockVisbility['Z_1_Easel_Stand_File'] = null
    removeBackgroundColor('Z_1_Easel_Stand_File')
  }
  if (isActive_Z_1_Facade_Signage__c_draft) {
    get_camera_Z_1_Facade_Signage__c_draft.classList.remove('hide-element');
    checkBox_Facade_Non_working.classList.remove('hide-element');
    stockVisbility['Z_1_Facade_Signage'] = isActive_Z_1_Facade_Signage__c_draft

  } else {
    get_camera_Z_1_Facade_Signage__c_draft.classList.add('hide-element');
    checkBox_Facade_Non_working.classList.add('hide-element');
    stockVisbility['Z_1_Facade_Signage'] = isActive_Z_1_Facade_Signage__c_draft
    stockVisbility['Z_1_Facade_Signage'] = false
    document.getElementById('Facade_Non_working_draft').checked = false
    document.getElementById('Z_1_Facade_Signage__c_draft_File').value = null
    stockVisbility['Z_1_Facade_Signage_File'] = null
    removeBackgroundColor('Z_1_Facade_Signage_File')
  }
  if (isActive_Z_3_Coaster__c_draft) {
    get_camera_Z_3_Coaster__c_draft.classList.remove('hide-element');
    stockVisbility['Z_3_Coaster'] = isActive_Z_3_Coaster__c_draft

  } else {
    get_camera_Z_3_Coaster__c_draft.classList.add('hide-element');
    stockVisbility['Z_3_Coaster'] = isActive_Z_3_Coaster__c_draft
    document.getElementById('Z_3_Coaster__c_draft_File').value = null
    stockVisbility['Z_3_Coaster_File'] = null
    removeBackgroundColor('Z_3_Coaster_File')
  }
  if (isActive_Z_3_Glassware__c_draft) {
    get_camera_Z_3_Glassware__c_draft.classList.remove('hide-element');
    stockVisbility['Z_3_Glassware'] = isActive_Z_3_Glassware__c_draft

  } else {
    get_camera_Z_3_Glassware__c_draft.classList.add('hide-element');
    stockVisbility['Z_3_Glassware'] = isActive_Z_3_Glassware__c_draft
    document.getElementById('Z_3_Glassware__c_draft_File').value = null
    stockVisbility['Z_3_Glassware_File'] = null
    removeBackgroundColor('Z_3_Glassware_File')
  }
  if (isActive_Z_2_Bar_Mats__c_draft) {
    get_camera_Z_2_Bar_Mats__c_draft.classList.remove('hide-element');
    stockVisbility['Z_2_Bar_Mats'] = isActive_Z_2_Bar_Mats__c_draft

  } else {
    get_camera_Z_2_Bar_Mats__c_draft.classList.add('hide-element');
    stockVisbility['Z_2_Bar_Mats'] = isActive_Z_2_Bar_Mats__c_draft
    document.getElementById('Z_2_Bar_Mats__c_draft_File').value = null
    stockVisbility['Z_2_Bar_Mats_File'] = null
    removeBackgroundColor('Z_2_Bar_Mats_File')
  }
  if (isActive_Z_2_Bucket__c_draft) {
    get_camera_Z_2_Bucket__c_draft.classList.remove('hide-element');
    stockVisbility['Z_2_Bucket'] = isActive_Z_2_Bucket__c_draft

  } else {
    get_camera_Z_2_Bucket__c_draft.classList.add('hide-element');
    stockVisbility['Z_2_Bucket'] = isActive_Z_2_Bucket__c_draft
    document.getElementById('Z_2_Bucket__c_draft_File').value = null
    stockVisbility['Z_2_Bucket_File'] = null
    removeBackgroundColor('Z_2_Bucket_File')
  }
  if (isActive_Z3_Menu_Listing__c_draft) {
    get_camera_Z3_Menu_Listing__c_draft.classList.remove('hide-element');
    stockVisbility['Z3_Menu_Listing'] = isActive_Z3_Menu_Listing__c_draft
  } else {
    get_camera_Z3_Menu_Listing__c_draft.classList.add('hide-element');
    stockVisbility['Z3_Menu_Listing'] = isActive_Z3_Menu_Listing__c_draft
    document.getElementById('Z3_Menu_Listing__c_draft_File').value = null
    stockVisbility['Z3_Menu_Listing_File'] = null
    removeBackgroundColor('Z3_Menu_Listing_File')
  }
  if (isActive_Z_3_Table_Tent__c_draft) {
    get_camera_Z_3_Table_Tent__c_draft.classList.remove('hide-element');
    stockVisbility['Z_3_Table_Tent'] = isActive_Z_3_Table_Tent__c_draft

  } else {
    get_camera_Z_3_Table_Tent__c_draft.classList.add('hide-element');
    stockVisbility['Z_3_Table_Tent'] = isActive_Z_3_Table_Tent__c_draft
    document.getElementById('Z_3_Table_Tent__c_draft_File').value = null
    stockVisbility['Z_3_Table_Tent_File'] = null
    removeBackgroundColor('Z_3_Table_Tent_File')
  }
  if (isActive_Z_2_Tap_Handles__c_draft) {
    get_camera_Z_2_Tap_Handles__c_draft.classList.remove('hide-element');
    stockVisbility['Z_2_Tap_Handles'] = isActive_Z_2_Tap_Handles__c_draft
  } else {
    get_camera_Z_2_Tap_Handles__c_draft.classList.add('hide-element');
    stockVisbility['Z_2_Tap_Handles'] = isActive_Z_2_Tap_Handles__c_draft
    document.getElementById('Z_2_Tap_Handles__c_draft_File').value = null
    stockVisbility['Z_2_Tap_Handles_File'] = null
    removeBackgroundColor('Z_2_Tap_Handles_File')
  }
  if (isActive_Z_2_Medallions__c_draft) {
    get_camera_Z_2_Medallions__c_draft.classList.remove('hide-element');
    checkBox_Medallions_only_Non_working.classList.remove('hide-element')
    stockVisbility['Z_2_Medallions'] = isActive_Z_2_Medallions__c_draft
  } else {
    get_camera_Z_2_Medallions__c_draft.classList.add('hide-element');
    checkBox_Medallions_only_Non_working.classList.add('hide-element')
    stockVisbility['Z_2_Medallions'] = isActive_Z_2_Medallions__c_draft
    stockVisbility['Medallions_only_Non_working'] = false
    document.getElementById('Medallions_only_Non_working_draft').checked = false
    document.getElementById('Z_2_Medallions__c_draft_File').value = null
    stockVisbility['Z_2_Medallions_File'] = null
    removeBackgroundColor('Z_2_Medallions_File')

  }
  if (isActive_Z_2_Growler__c_draft) {
    get_camera_Z_2_Growler__c_draft.classList.remove('hide-element');
    stockVisbility['Z_2_Growler'] = isActive_Z_2_Growler__c_draft
  } else {
    get_camera_Z_2_Growler__c_draft.classList.add('hide-element');
    stockVisbility['Z_2_Growler'] = isActive_Z_2_Growler__c_draft
    document.getElementById('Z_2_Growler__c_draft_File').value = null
    stockVisbility['Z_2_Growler_File'] = null
    removeBackgroundColor('Z_2_Growler_File')
  }
  if (isActive_Z_2_Pitcher__c_draft) {
    get_camera_Z_2_Pitcher__c_draft.classList.remove('hide-element');
    stockVisbility['Z_2_Pitcher'] = isActive_Z_2_Pitcher__c_draft
  } else {
    get_camera_Z_2_Pitcher__c_draft.classList.add('hide-element');
    stockVisbility['Z_2_Pitcher'] = isActive_Z_2_Pitcher__c_draft
    document.getElementById('Z_2_Pitcher__c_draft_File').value = null
    stockVisbility['Z_2_Pitcher_File'] = null
    removeBackgroundColor('Z_2_Pitcher_File')
  }
  if (isActive_Empty_Kegs__c_draft) {
    get_camera_Empty_Kegs__c_draft.classList.remove('hide-element');
    stockVisbility['Empty_Kegs'] = isActive_Empty_Kegs__c_draft
  } else {
    get_camera_Empty_Kegs__c_draft.classList.add('hide-element');
    stockVisbility['Empty_Kegs'] = isActive_Empty_Kegs__c_draft
    document.getElementById('Empty_Kegs__c_draft_File').value = null
    stockVisbility['Empty_Kegs_File'] = null
    removeBackgroundColor('Empty_Kegs_File')
  }
}

function saveVisibilityAndNext() {
  const draft_status = accountDetail?.Draft_Status__c
  const qco_status = accountDetail?.QCO_Flag__c;
  const channel_type = accountDetail?.Channel__c;
  if (draft_status) {
    const checkBox_Facade_Non_working = $("#Facade_Non_working_draft").is(":checked");
    const checkBox_Medallions_only_Non_working = $("#Medallions_only_Non_working_draft").is(":checked");
    const checkBox_Led_Non_working = $("#Led_Non_working_Draft").is(":checked");
    stockVisbility['Facade_Non_working_Requires_Maintenance'] = checkBox_Facade_Non_working;
    stockVisbility['Medallions_only_Non_working'] = checkBox_Medallions_only_Non_working;
    stockVisbility['LED_Non_working_Requires_Maintenance'] = checkBox_Led_Non_working;  
  } else if (qco_status) {
    let checkBox_Led_Non_Working_Status = $("#LED_Non_working_qco_check").is(":checked");
    let checkBox_Facade_Non_working_Status = $("#Facade_Non_working_qco_check").is(":checked");
    stockVisbility['LED_Non_working_Requires_Maintenance'] = checkBox_Led_Non_Working_Status;
    stockVisbility['Facade_Non_working_Requires_Maintenance'] = checkBox_Facade_Non_working_Status;
  } else if (channel_type === 'On-Premise') {
    let checkBox_Led_Non_Working_Status = $("#LED_Non_working_Requires_Maintenance__c_on").is(":checked");
    let checkBox_Facade_Non_working_Status = $("#Facade_Non_working_Requires_Maintenance__c_on").is(":checked");
    stockVisbility['LED_Non_working_Requires_Maintenance'] = checkBox_Led_Non_Working_Status;
    stockVisbility['Facade_Non_working_Requires_Maintenance'] = checkBox_Facade_Non_working_Status;
  } else if (channel_type === 'Off-Premise') {
    let Chiller_Purity__c_off_Value = $('#Chiller_Purity__c_off').val();
    const checkBox_LED_NON_working = $("#LED_Non_working_off").is(":checked");
    const checkBox_Facade_Non_working = $("#Facade_Non_working_off").is(":checked");
    const checkBox_One_way_vision_Non_working = $("#One_way_vision_Non_working_off").is(":checked");
    const checkBox_cooler_Non_working = $("#cooler_Non_working_off").is(":checked");
    const checkBox_Island_Unit_Non_working = $("#Island_Unit_Non_working_off").is(":checked");
    const checkBox_FSU_Non_working = $("#FSU_Non_working_off").is(":checked");
    stockVisbility['LED_Non_working_Requires_Maintenance'] = checkBox_LED_NON_working;
    stockVisbility['Facade_Non_working_Requires_Maintenance'] = checkBox_Facade_Non_working;
    stockVisbility['One_way_vision_Non_working'] = checkBox_One_way_vision_Non_working;
    stockVisbility['cooler_Non_working_Requires_Maintenance'] = checkBox_cooler_Non_working;
    stockVisbility['Island_Unit_Non_working'] = checkBox_Island_Unit_Non_working;
    stockVisbility['FSU_Non_working_Requires_Maintenance'] = checkBox_FSU_Non_working;
    stockVisbility['Chiller_Purity'] = Chiller_Purity__c_off_Value;
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
    $('#stockSubmit').modal('hide');
    handleStockVisibilitySubmit()
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
  key = key + '_File'
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
  let iconKey = key.substring(0, key.length - 5);
  let icon = $('.' + iconKey);
  icon.css('color', '#5cb85c');
};
const removeBackgroundColor = (key) => {
  let iconKey = key.substring(0, key.length - 5);
  let icon = $('.' + iconKey);
  icon.css('color', '#000');
};


const populatePrevDetails = (draft_status, qco_status, channel_type) => {
  if (draft_status) {
    document.getElementById('Z_2_Bira_91_LED_Signage__c_draft').checked = stockVisbility['Z_2_Bira_91_LED_Signage']
    document.getElementById('Z_1_Easel_Stand__c_draft').checked = stockVisbility['Z_1_Easel_Stand']
    document.getElementById('Z_1_Facade_Signage__c_draft').checked = stockVisbility['Z_1_Facade_Signage']
    document.getElementById('Z_3_Coaster__c_draft').checked = stockVisbility['Z_3_Coaster']
    document.getElementById('Z_3_Glassware__c_draft').checked = stockVisbility['Z_3_Glassware']
    document.getElementById('Z_2_Bar_Mats__c_draft').checked = stockVisbility['Z_2_Bar_Mats']
    document.getElementById('Z_2_Bucket__c_draft').checked = stockVisbility['Z_2_Bucket']
    document.getElementById('Z3_Menu_Listing__c_draft').checked = stockVisbility['Z3_Menu_Listing']
    document.getElementById('Z_3_Table_Tent__c_draft').checked = stockVisbility['Z_3_Table_Tent']
    document.getElementById('Z_2_Tap_Handles__c_draft').checked = stockVisbility['Z_2_Tap_Handles']
    document.getElementById('Z_2_Medallions__c_draft').checked = stockVisbility['Z_2_Medallions']
    document.getElementById('Z_2_Pitcher__c_draft').checked = stockVisbility['Z_2_Pitcher']
    document.getElementById('Z_2_Growler__c_draft').checked = stockVisbility['Z_2_Growler']
    document.getElementById('Empty_Kegs__c_draft').checked = stockVisbility['Empty_Kegs']

    document.getElementById('Z_2_Bira_91_LED_Signage__c_draft_File').value = stockVisbility['Z_2_Bira_91_LED_Signage_File']
    if (stockVisbility['Z_2_Bira_91_LED_Signage_File']) {
      fileAttachedBackgroundChange('Z_2_Bira_91_LED_Signage_File')
    }
    document.getElementById('Z_1_Easel_Stand__c_draft_File').value = stockVisbility['Z_1_Easel_Stand_File']
    if (stockVisbility['Z_1_Easel_Stand_File']) {
      fileAttachedBackgroundChange('Z_1_Easel_Stand_File')
    }
    document.getElementById('Z_1_Facade_Signage__c_draft_File').value = stockVisbility['Z_1_Facade_Signage_File']
    if (stockVisbility['Z_1_Facade_Signage_File']) {
      fileAttachedBackgroundChange('Z_1_Facade_Signage_File')
    }
    document.getElementById('Z_3_Coaster__c_draft_File').value = stockVisbility['Z_3_Coaster_File']
    if (stockVisbility['Z_3_Coaster_File']) {
      fileAttachedBackgroundChange('Z_3_Coaster_File')
    }
    document.getElementById('Z_3_Glassware__c_draft_File').value = stockVisbility['Z_3_Glassware_File']
    if (stockVisbility['Z_3_Glassware_File']) {
      fileAttachedBackgroundChange('Z_3_Glassware_File')
    }
    document.getElementById('Z_2_Bar_Mats__c_draft_File').value = stockVisbility['Z_2_Bar_Mats_File']
    if (stockVisbility['Z_2_Bar_Mats_File']) {
      fileAttachedBackgroundChange('Z_2_Bar_Mats_File')
    }
    document.getElementById('Z_2_Bucket__c_draft_File').value = stockVisbility['Z_2_Bucket_File']
    if (stockVisbility['Z_2_Bucket_File']) {
      fileAttachedBackgroundChange('Z_2_Bucket_File')
    }
    document.getElementById('Z3_Menu_Listing__c_draft_File').value = stockVisbility['Z3_Menu_Listing_File']
    if (stockVisbility['Z3_Menu_Listing_File']) {
      fileAttachedBackgroundChange('Z3_Menu_Listing_File')
    }

    document.getElementById('Z_3_Table_Tent__c_draft_File').value = stockVisbility['Z_3_Table_Tent_File']
    if (stockVisbility['Z_3_Table_Tent_File']) {
      fileAttachedBackgroundChange('Z_3_Table_Tent_File')
    }
    document.getElementById('Z_2_Tap_Handles__c_draft_File').value = stockVisbility['Z_2_Tap_Handles_File']
    if (stockVisbility['Z_2_Tap_Handles_File']) {
      fileAttachedBackgroundChange('Z_2_Tap_Handles_File')
    }
    document.getElementById('Z_2_Medallions__c_draft_File').value = stockVisbility['Z_2_Medallions_File']
    if (stockVisbility['Z_2_Medallions_File']) {
      fileAttachedBackgroundChange('Z_2_Medallions_File')
    }
    document.getElementById('Z_2_Pitcher__c_draft_File').value = stockVisbility['Z_2_Pitcher_File']
    if (stockVisbility['Z_2_Pitcher_File']) {
      fileAttachedBackgroundChange('Z_2_Pitcher_File')
    }
    document.getElementById('Z_2_Growler__c_draft_File').value = stockVisbility['Z_2_Growler_File']
    if (stockVisbility['Z_2_Growler_File']) {
      fileAttachedBackgroundChange('Z_2_Growler_File')
    }
    document.getElementById('Empty_Kegs__c_draft_File').value = stockVisbility['Empty_Kegs_File']
    if (stockVisbility['Empty_Kegs_File']) {
      fileAttachedBackgroundChange('Empty_Kegs_File')
    }
    document.getElementById('Medallions_only_Non_working_draft').checked = stockVisbility['Medallions_only_Non_working']
    document.getElementById('Facade_Non_working_draft').checked = stockVisbility['Facade_Non_working_Requires_Maintenance']
    document.getElementById('Led_Non_working_Draft').checked = stockVisbility['LED_Non_working_Requires_Maintenance']


    handleToggleSwitchDraft()
  } else if (qco_status) {
    document.getElementById('Z_2_Bira_91_LED_Signage__c_qco').checked = stockVisbility['Z_2_Bira_91_LED_Signage']
    document.getElementById('Z_1_Facade_Signage__c_qco').checked = stockVisbility['Z_1_Facade_Signage']
    document.getElementById('Z3_Menu_Listing__c_qco').checked = stockVisbility['Z3_Menu_Listing']

    document.getElementById('Z_2_Bira_91_LED_Signage__c_qco_File').value = stockVisbility['Z_2_Bira_91_LED_Signage_File']
    if (stockVisbility['Z_2_Bira_91_LED_Signage_File']) {
      fileAttachedBackgroundChange('Z_2_Bira_91_LED_Signage_File')

    }
    document.getElementById('Z_1_Facade_Signage__c_qco_File').value = stockVisbility['Z_1_Facade_Signage_File']
    if (stockVisbility['Z_1_Facade_Signage_File']) {
      fileAttachedBackgroundChange('Z_1_Facade_Signage_File')

    }
    document.getElementById('Z3_Menu_Listing__c_qco_File').value = stockVisbility['Z3_Menu_Listing_File']
    if (stockVisbility['Z3_Menu_Listing_File']) {
      fileAttachedBackgroundChange('Z3_Menu_Listing_File')

    }

    document.getElementById('LED_Non_working_qco_check').checked = stockVisbility['LED_Non_working_Requires_Maintenance']
    document.getElementById('Facade_Non_working_qco_check').checked = stockVisbility['Facade_Non_working_Requires_Maintenance']
    handleToggleSwitchQCO()
  } else if (channel_type === 'On-Premise') {
    document.getElementById('Z_2_Bira_91_LED_Signage__c').checked = stockVisbility['Z_2_Bira_91_LED_Signage']
    document.getElementById('Z_1_Easel_Stand__c').checked = stockVisbility['Z_1_Easel_Stand']
    document.getElementById('Z_1_Facade_Signage__c').checked = stockVisbility['Z_1_Facade_Signage']
    document.getElementById('Z_3_Coaster__c').checked = stockVisbility['Z_3_Coaster']
    document.getElementById('Z_3_Glassware__c').checked = stockVisbility['Z_3_Glassware']
    document.getElementById('Z_2_Bar_Mats__c').checked = stockVisbility['Z_2_Bar_Mats']
    document.getElementById('Z_2_Bucket__c').checked = stockVisbility['Z_2_Bucket']
    document.getElementById('Z3_Menu_Listing__c').checked = stockVisbility['Z3_Menu_Listing']
    document.getElementById('Z_3_Table_Tent__c').checked = stockVisbility['Z_3_Table_Tent']

    document.getElementById('Z_2_Bira_91_LED_Signage__c_File').value = stockVisbility['Z_2_Bira_91_LED_Signage_File']
    if (stockVisbility['Z_2_Bira_91_LED_Signage_File']) {
      fileAttachedBackgroundChange('Z_2_Bira_91_LED_Signage_File')
    }
    document.getElementById('Z_1_Easel_Stand__c_File').value = stockVisbility['Z_1_Easel_Stand_File']
    if (stockVisbility['Z_1_Easel_Stand_File']) {
      fileAttachedBackgroundChange('Z_1_Easel_Stand_File')
    }
    document.getElementById('Z_1_Facade_Signage__c_File').value = stockVisbility['Z_1_Facade_Signage_File']
    if (stockVisbility['Z_1_Facade_Signage_File']) {
      fileAttachedBackgroundChange('Z_1_Facade_Signage_File')
    }
    document.getElementById('Z_3_Coaster__c_File').value = stockVisbility['Z_3_Coaster_File']
    if (stockVisbility['Z_3_Coaster_File']) {
      fileAttachedBackgroundChange('Z_3_Coaster_File')
    }
    document.getElementById('Z_3_Glassware__c_File').value = stockVisbility['Z_3_Glassware_File']
    if (stockVisbility['Z_3_Glassware_File']) {
      fileAttachedBackgroundChange('Z_3_Glassware_File')
    }
    document.getElementById('Z_2_Bar_Mats__c_File').value = stockVisbility['Z_2_Bar_Mats_File']
    if (stockVisbility['Z_2_Bar_Mats_File']) {
      fileAttachedBackgroundChange('Z_2_Bar_Mats_File')
    }
    document.getElementById('Z_2_Bucket__c_File').value = stockVisbility['Z_2_Bucket_File']
    if (stockVisbility['Z_2_Bucket_File']) {
      fileAttachedBackgroundChange('Z_2_Bucket_File')
    }
    document.getElementById('Z3_Menu_Listing__c_File').value = stockVisbility['Z3_Menu_Listing_File']
    if (stockVisbility['Z3_Menu_Listing_File']) {
      fileAttachedBackgroundChange('Z3_Menu_Listing_File')
    }
    document.getElementById('Z_3_Table_Tent__c_File').value = stockVisbility['Z_3_Table_Tent_File']
    if (stockVisbility['Z_3_Table_Tent_File']) {
      fileAttachedBackgroundChange('Z_3_Table_Tent_File')
    }

    document.getElementById('LED_Non_working_Requires_Maintenance__c_on').checked = stockVisbility['LED_Non_working_Requires_Maintenance']
    document.getElementById('Facade_Non_working_Requires_Maintenance__c_on').checked = stockVisbility['Facade_Non_working_Requires_Maintenance']
    handleToggleONPremises()
  } else if (channel_type === 'Off-Premise') {
    document.getElementById('Z_2_Bira_91_LED_Signage__c_off').checked = stockVisbility['Z_2_Bira_91_LED_Signage']
    document.getElementById('Z_1_Facade_Signage__c_off').checked = stockVisbility['Z_1_Facade_Signage']
    document.getElementById('Z_1_One_way_Vision__c_off').checked = stockVisbility['Z_1_One_way_Vision']
    document.getElementById('VisiCooler__c_off').checked = stockVisbility['VisiCooler']
    document.getElementById('Z_3_Planogram_Adherence__c_off').checked = stockVisbility['Z_3_Planogram_Adherence']
    document.getElementById('Chiller_Re_Stocked__c_off').checked = stockVisbility['Chiller_Re_Stocked']
    document.getElementById('Z_3_Island_Unit__c_off').checked = stockVisbility['Z_3_Island_Unit']
    document.getElementById('Z_3_Floor_Standing_Unit__c_off').checked = stockVisbility['Z_3_Floor_Standing_Unit']
    document.getElementById('Chiller_Purity__c_off').value = stockVisbility['Chiller_Purity']

    document.getElementById('Z_2_Bira_91_LED_Signage__c_off_File').value = stockVisbility['Z_2_Bira_91_LED_Signage_File']
    if (stockVisbility['Z_2_Bira_91_LED_Signage_File']) {
      fileAttachedBackgroundChange('Z_2_Bira_91_LED_Signage_File')

    }
    document.getElementById('Z_1_Facade_Signage__c_off_File').value = stockVisbility['Z_1_Facade_Signage_File']
    if (stockVisbility['Z_1_Facade_Signage_File']) {
      fileAttachedBackgroundChange('Z_1_Facade_Signage_File')

    }

    document.getElementById('Z_1_One_way_Vision__c_off_File').value = stockVisbility['Z_1_One_way_Vision_File']
    if (stockVisbility['Z_1_One_way_Vision_File']) {
      fileAttachedBackgroundChange('Z_1_One_way_Vision_File')

    }

    document.getElementById('VisiCooler__c_off_File').value = stockVisbility['VisiCooler_File']
    if (stockVisbility['VisiCooler_File']) {
      fileAttachedBackgroundChange('VisiCooler_File')

    }

    document.getElementById('Z_3_Planogram_Adherence__c_off_File').value = stockVisbility['Z_3_Planogram_Adherence_File']
    if (stockVisbility['Z_3_Planogram_Adherence_File']) {
      fileAttachedBackgroundChange('Z_3_Planogram_Adherence_File')
    }

    document.getElementById('Chiller_Re_Stocked__c_off_File').value = stockVisbility['Chiller_Re_Stocked_File']
    if (stockVisbility['Chiller_Re_Stocked_File']) {
      fileAttachedBackgroundChange('Chiller_Re_Stocked_File')

    }

    document.getElementById('Z_3_Island_Unit__c_off_File').value = stockVisbility['Z_3_Island_Unit_File']
    if (stockVisbility['Z_3_Island_Unit_File']) {
      fileAttachedBackgroundChange('Z_3_Island_Unit_File')
    }

    document.getElementById('Z_3_Floor_Standing_Unit__c_off_File').value = stockVisbility['Z_3_Floor_Standing_Unit_File']
    if (stockVisbility['Z_3_Floor_Standing_Unit_File']) {
      fileAttachedBackgroundChange('Z_3_Floor_Standing_Unit_File')

    }

    document.getElementById('LED_Non_working_off').checked = stockVisbility['LED_Non_working_Requires_Maintenance']
    document.getElementById('Facade_Non_working_off').checked = stockVisbility['Facade_Non_working_Requires_Maintenance']
    document.getElementById('One_way_vision_Non_working_off').checked = stockVisbility['One_way_vision_Non_working']
    document.getElementById('cooler_Non_working_off').checked = stockVisbility['cooler_Non_working_Requires_Maintenance']
    document.getElementById('Island_Unit_Non_working_off').checked = stockVisbility['Island_Unit_Non_working']
    document.getElementById('FSU_Non_working_off').checked = stockVisbility['FSU_Non_working_Requires_Maintenance']

    handleToggleOffPremises()

  }

}
initializeVisibilityPage();
