$(document).ready(function(){
  let urlParam = new URLSearchParams(window.location.search);
  const accountID = urlParam.get('accountId')
  const individual = urlParam.get('individual')
  console.log(individual, 'individual')
  if(individual == 'true'){
    $('#closeIco').hide();
    $('.arrowIcons').hide();
    $('.logoSection').css('width','93%')
    $('#finishBtn').show();
  }
})
const fileInput = async (event) => {
  const key = event.id;
  const fileInput = event.files[0];
  var options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  const compressedFile = await imageCompression(fileInput, options);
  uploadBase64Value(key, compressedFile);
};

const uploadBase64Value = async (key, fileInput) => {
  const newKey = key.split('+')[0] + '_' + key.split('+')[1] + '_File';
  draftInstallation[newKey] = await toBase64(fileInput);
  for (let i of draftInstallation.items) {
    if (i.typeId === key.split('+')[0]) {
      draftInstallation[newKey + '_Name'] =
        i.items[key.split('+')[1]].ProductName;
      break;
    }
  }
  fileAttachedBackgroundChange(key.split('+')[0] + '_' + key.split('+')[1]);
};

const fileAttachedBackgroundChange = (key) => {
  let iconKey = key;

  //    let icon = document.querySelector(`#${iconKey}`);
  let icon = $('.' + iconKey);

  icon.css('color', '#5cb85c');
};
// first
let switch_one = document.getElementById('switch-1').checked;
const camera_container_one = document.getElementById('get-camera-container-1');
const check_box_wrapper_one = document.getElementById('check-box-wrapper-1');
// second
let switch_two = document.getElementById('switch-two').checked;
const camera_container_two = document.getElementById('get-camera-container-2');
// third
let switch_three = document.getElementById('switch-three').checked;
const camera_container_three = document.getElementById(
  'get-camera-container-3'
);
const check_box_wrapper_three = document.getElementById('check-box-wrapper-3');
// four
let switch_four = document.getElementById('switch-four').checked;
const camera_container_four = document.getElementById('get-camera-container-4');
// five
let switch_five = document.getElementById('switch-five').checked;
const camera_container_five = document.getElementById('get-camera-container-5');
// six
let switch_six = document.getElementById('switch-six').checked;
const camera_container_six = document.getElementById('get-camera-container-6');
// seven
let switch_seven = document.getElementById('switch-seven').checked;
const camera_container_seven = document.getElementById(
  'get-camera-container-7'
);
// eight
let switch_eight = document.getElementById('switch-eight').checked;
const camera_container_eight = document.getElementById(
  'get-camera-container-8'
);
// Type one
function handleToggle(state) {
  if (switch_one && state === 1) {
    camera_container_one.classList.add('hide-element');
    check_box_wrapper_one.classList.add('hide-element');
    switch_one = false;
  } else if (!switch_one && state === 1) {
    camera_container_one.classList.remove('hide-element');
    check_box_wrapper_one.classList.remove('hide-element');
    switch_one = true;
  }

  if (switch_two && state === 2) {
    camera_container_two.classList.add('hide-element');
    switch_two = false;
  } else if (!switch_two && state === 2) {
    camera_container_two.classList.remove('hide-element');
    switch_two = true;
  }

  if (switch_three && state === 3) {
    camera_container_three.classList.add('hide-element');
    check_box_wrapper_three.classList.add('hide-element');
    switch_three = false;
  } else if (!switch_three && state === 3) {
    camera_container_three.classList.remove('hide-element');
    check_box_wrapper_three.classList.remove('hide-element');
    switch_three = true;
  }

  if (switch_four && state === 4) {
    camera_container_four.classList.add('hide-element');
    switch_four = false;
  } else if (!switch_four && state === 4) {
    camera_container_four.classList.remove('hide-element');
    switch_four = true;
  }

  if (switch_five && state === 5) {
    camera_container_five.classList.add('hide-element');
    switch_five = false;
  } else if (!switch_five && state === 5) {
    camera_container_five.classList.remove('hide-element');
    switch_five = true;
  }

  if (switch_six && state === 6) {
    camera_container_six.classList.add('hide-element');
    switch_six = false;
  } else if (!switch_six && state === 6) {
    camera_container_six.classList.remove('hide-element');
    switch_six = true;
  }

  if (switch_seven && state === 7) {
    camera_container_seven.classList.add('hide-element');
    switch_seven = false;
  } else if (!switch_seven && state === 7) {
    camera_container_seven.classList.remove('hide-element');
    switch_seven = true;
  }

  if (switch_eight && state === 8) {
    camera_container_eight.classList.add('hide-element');
    switch_eight = false;
  } else if (!switch_eight && state === 8) {
    camera_container_eight.classList.remove('hide-element');
    switch_eight = true;
  }
}
// type 2 QCO
let switch_qco_one = document.getElementById('switch-qco-one').checked;
const get_camera_container_qco_one = document.getElementById(
  'get-camera-container-qco-1'
);
const check_box_wrapper_qco_one = document.getElementById(
  'check-box-qco-wrapper-1'
);
let switch_qco_two = document.getElementById('switch-qco-two').checked;
const get_camera_container_qco_two = document.getElementById(
  'get-camera-container-qco-2'
);
const check_box_wrapper_qco_two = document.getElementById(
  'check-box-qco-wrapper-2'
);
// third switch
let switch_qco_three = document.getElementById('switch-qco-three').checked;
const get_camera_container_qco_three = document.getElementById(
  'get-camera-container-qco-3'
);
const check_box_wrapper_qco_three = document.getElementById(
  'check-box-qco-wrapper-4'
);

// fourth switch
let switch_qco_four = document.getElementById('switch-qco-four').checked;
const get_camera_container_qco_four = document.getElementById(
  'get-camera-container-qco-4'
);
const check_box_wrapper_qco_four = document.getElementById(
  'check-box-qco-wrapper-4'
);
// fifth switch
let switch_qco_five = document.getElementById('switch-qco-five').checked;
const get_camera_container_qco_five = document.getElementById(
  'get-camera-container-qco-5'
);

// sixth switch
let switch_qco_six = document.getElementById('switch-qco-six').checked;
const get_camera_container_qco_six = document.getElementById(
  'get-camera-container-qco-6'
);

// seventh switch
let switch_qco_seven = document.getElementById('switch-qco-seven').checked;
const get_camera_container_qco_seven = document.getElementById(
  'get-camera-container-qco-7'
);
const check_box_wrapper_qco_five = document.getElementById(
  'check-box-qco-wrapper-5'
);

// eighth switch
let switch_qco_eight = document.getElementById('switch-qco-eight').checked;
const get_camera_container_qco_eight = document.getElementById(
  'get-camera-container-qco-8'
);
const check_box_wrapper_qco_six = document.getElementById(
  'check-box-qco-wrapper-6'
);

function handleTypeQCO(state) {
  if (switch_qco_one && state === 1) {
    get_camera_container_qco_one.classList.add('hide-element');
    check_box_wrapper_qco_one.classList.add('hide-element');
    switch_qco_one = false;
  } else if (!switch_qco_one && state === 1) {
    get_camera_container_qco_one.classList.remove('hide-element');
    check_box_wrapper_qco_one.classList.remove('hide-element');
    switch_qco_one = true;
  }

  if (switch_qco_two && state === 2) {
    get_camera_container_qco_two.classList.add('hide-element');
    check_box_wrapper_qco_two.classList.add('hide-element');
    switch_qco_two = false;
  } else if (!switch_qco_two && state === 2) {
    get_camera_container_qco_two.classList.remove('hide-element');
    check_box_wrapper_qco_two.classList.remove('hide-element');
    switch_qco_two = true;
  }

  if (switch_qco_three && state === 3) {
    get_camera_container_qco_three.classList.add('hide-element');
    check_box_wrapper_qco_three.classList.add('hide-element');
    switch_qco_three = false;
  } else if (!switch_qco_three && state === 3) {
    get_camera_container_qco_three.classList.remove('hide-element');
    check_box_wrapper_qco_three.classList.remove('hide-element');
    switch_qco_three = true;
  }

  if (switch_qco_four && state === 4) {
    get_camera_container_qco_four.classList.add('hide-element');
    check_box_wrapper_qco_four.classList.add('hide-element');
    switch_qco_four = false;
  } else if (!switch_qco_three && state === 4) {
    get_camera_container_qco_four.classList.remove('hide-element');
    check_box_wrapper_qco_four.classList.remove('hide-element');
    switch_qco_four = true;
  }

  if (switch_qco_five && state === 5) {
    get_camera_container_qco_five.classList.add('hide-element');
    switch_qco_five = false;
  } else if (!switch_qco_five && state === 5) {
    get_camera_container_qco_five.classList.remove('hide-element');
    switch_qco_five = true;
  }

  if (switch_qco_six && state === 6) {
    get_camera_container_qco_six.classList.add('hide-element');
    switch_qco_six = false;
  } else if (!switch_qco_six && state === 6) {
    get_camera_container_qco_six.classList.remove('hide-element');
    switch_qco_six = true;
  }

  if (switch_qco_seven && state === 7) {
    get_camera_container_qco_seven.classList.add('hide-element');
    check_box_wrapper_qco_five.classList.add('hide-element');
    switch_qco_seven = false;
  } else if (!switch_qco_seven && state === 7) {
    get_camera_container_qco_seven.classList.remove('hide-element');
    check_box_wrapper_qco_five.classList.remove('hide-element');
    switch_qco_seven = true;
  }

  if (switch_qco_eight && state === 8) {
    get_camera_container_qco_eight.classList.add('hide-element');
    check_box_wrapper_qco_six.classList.add('hide-element');
    switch_qco_eight = false;
  } else if (!switch_qco_seven && state === 8) {
    get_camera_container_qco_eight.classList.remove('hide-element');
    check_box_wrapper_qco_six.classList.remove('hide-element');
    switch_qco_eight = true;
  }
}
let switch_onpremises_one = document.getElementById(
  'switch-onpremises-one'
).checked;
const get_camera_container_onpremises_one = document.getElementById(
  'get-camera-container-onpremises-1'
);
const check_box_wrapper_onpremises_one = document.getElementById(
  'check-box-onpremises-wrapper-1'
);
let switch_onpremises_two = document.getElementById(
  'switch-onpremises-two'
).checked;
const get_camera_container_onpremises_two = document.getElementById(
  'get-camera-container-onpremises-2'
);
// third on presimes switch
let switch_onpremises_three = document.getElementById(
  'switch-onpremises-three'
).checked;
const get_camera_container_onpremises_three = document.getElementById(
  'get-camera-container-onpremises-3'
);
const check_box_wrapper_onpremises_two = document.getElementById(
  'check-box-onpremises-wrapper-2'
);
// switch four
let switch_onpremises_four = document.getElementById(
  'switch-onpremises-four'
).checked;
const get_camera_container_onpremises_four = document.getElementById(
  'get-camera-container-onpremises-4'
);

// switch five
let switch_onpremises_five = document.getElementById(
  'switch-onpremises-five'
).checked;
const get_camera_container_onpremises_five = document.getElementById(
  'get-camera-container-onpremises-5'
);

// switch six
let switch_onpremises_six = document.getElementById(
  'switch-onpremises-six'
).checked;
const get_camera_container_onpremises_six = document.getElementById(
  'get-camera-container-onpremises-6'
);
// switch seven
let switch_onpremises_seven = document.getElementById(
  'switch-onpremises-seven'
).checked;
const get_camera_container_onpremises_seven = document.getElementById(
  'get-camera-container-onpremises-7'
);
// switch eight
let switch_onpremises_eight = document.getElementById(
  'switch-onpremises-eight'
).checked;
const get_camera_container_onpremises_eight = document.getElementById(
  'get-camera-container-onpremises-8'
);
// switch nine
let switch_onpremises_nine = document.getElementById(
  'switch-onpremises-nine'
).checked;
const get_camera_container_onpremises_nine = document.getElementById(
  'get-camera-container-onpremises-9'
);

// switch ten
let switch_onpremises_ten = document.getElementById(
  'switch-onpremises-ten'
).checked;
const get_camera_container_onpremises_ten = document.getElementById(
  'get-camera-container-onpremises-10'
);
const check_box_wrapper_onpremises_three = document.getElementById(
  'check-box-wrapper-onpremises-three'
);

// switch eleven
let switch_onpremises_eleven = document.getElementById(
  'switch-onpremises-eleven'
).checked;
const get_camera_container_onpremises_eleven = document.getElementById(
  'get-camera-container-onpremises-11'
);

// switch eleven
let switch_onpremises_twelve = document.getElementById(
  'switch-onpremises-twelve'
).checked;
const get_camera_container_onpremises_twelve = document.getElementById(
  'get-camera-container-onpremises-12'
);

// switch thirteen
let switch_onpremises_thirteen = document.getElementById(
  'switch-onpremises-thirteen'
).checked;
const get_camera_container_onpremises_thirteen = document.getElementById(
  'get-camera-container-onpremises-13'
);

function handleToggleSwitchOnPremises(state) {
  if (switch_onpremises_one && state === 1) {
    get_camera_container_onpremises_one.classList.add('hide-element');
    check_box_wrapper_onpremises_one.classList.add('hide-element');
    switch_onpremises_one = false;
  } else if (!switch_onpremises_one && state === 1) {
    get_camera_container_onpremises_one.classList.remove('hide-element');
    check_box_wrapper_onpremises_one.classList.remove('hide-element');
    switch_onpremises_one = true;
  }

  if (switch_onpremises_two && state === 2) {
    get_camera_container_onpremises_two.classList.add('hide-element');
    switch_onpremises_two = false;
  } else if (!switch_onpremises_two && state === 2) {
    get_camera_container_onpremises_two.classList.remove('hide-element');
    switch_onpremises_two = true;
  }

  if (switch_onpremises_three && state === 3) {
    get_camera_container_onpremises_three.classList.add('hide-element');
    check_box_wrapper_onpremises_two.classList.add('hide-element');
    switch_onpremises_three = false;
  } else if (!switch_onpremises_one && state === 3) {
    get_camera_container_onpremises_three.classList.remove('hide-element');
    check_box_wrapper_onpremises_two.classList.remove('hide-element');
    switch_onpremises_three = true;
  }

  if (switch_onpremises_four && state === 4) {
    get_camera_container_onpremises_four.classList.add('hide-element');
    switch_onpremises_four = false;
  } else if (!switch_onpremises_four && state === 4) {
    get_camera_container_onpremises_four.classList.remove('hide-element');
    switch_onpremises_four = true;
  }

  if (switch_onpremises_five && state === 5) {
    get_camera_container_onpremises_five.classList.add('hide-element');
    switch_onpremises_five = false;
  } else if (!switch_onpremises_five && state === 5) {
    get_camera_container_onpremises_five.classList.remove('hide-element');
    switch_onpremises_five = true;
  }

  if (switch_onpremises_six && state === 6) {
    get_camera_container_onpremises_six.classList.add('hide-element');
    switch_onpremises_six = false;
  } else if (!switch_onpremises_six && state === 6) {
    get_camera_container_onpremises_six.classList.remove('hide-element');
    switch_onpremises_six = true;
  }

  if (switch_onpremises_seven && state === 7) {
    get_camera_container_onpremises_seven.classList.add('hide-element');
    switch_onpremises_seven = false;
  } else if (!switch_onpremises_seven && state === 7) {
    get_camera_container_onpremises_seven.classList.remove('hide-element');
    switch_onpremises_seven = true;
  }
  if (switch_onpremises_eight && state === 8) {
    get_camera_container_onpremises_eight.classList.add('hide-element');
    switch_onpremises_eight = false;
  } else if (!switch_onpremises_eight && state === 8) {
    get_camera_container_onpremises_eight.classList.remove('hide-element');
    switch_onpremises_eight = true;
  }
  if (switch_onpremises_nine && state === 9) {
    get_camera_container_onpremises_nine.classList.add('hide-element');
    switch_onpremises_nine = false;
  } else if (!switch_onpremises_nine && state === 9) {
    get_camera_container_onpremises_nine.classList.remove('hide-element');
    switch_onpremises_nine = true;
  }

  if (switch_onpremises_ten && state === 10) {
    get_camera_container_onpremises_ten.classList.add('hide-element');
    check_box_wrapper_onpremises_three.classList.add('hide-element');
    switch_onpremises_ten = false;
  } else if (!switch_onpremises_ten && state === 10) {
    get_camera_container_onpremises_ten.classList.remove('hide-element');
    check_box_wrapper_onpremises_three.classList.remove('hide-element');
    switch_onpremises_ten = true;
  }

  if (switch_onpremises_eleven && state === 11) {
    get_camera_container_onpremises_eleven.classList.add('hide-element');
    switch_onpremises_eleven = false;
  } else if (!switch_onpremises_eleven && state === 11) {
    get_camera_container_onpremises_eleven.classList.remove('hide-element');
    switch_onpremises_eleven = true;
  }

  if (switch_onpremises_twelve && state === 12) {
    get_camera_container_onpremises_twelve.classList.add('hide-element');
    switch_onpremises_twelve = false;
  } else if (!switch_onpremises_twelve && state === 12) {
    get_camera_container_onpremises_twelve.classList.remove('hide-element');
    switch_onpremises_twelve = true;
  }

  if (switch_onpremises_thirteen && state === 13) {
    get_camera_container_onpremises_thirteen.classList.add('hide-element');
    switch_onpremises_thirteen = false;
  } else if (!switch_onpremises_thirteen && state === 13) {
    get_camera_container_onpremises_thirteen.classList.remove('hide-element');
    switch_onpremises_thirteen = true;
  }
}

const initialize = async () => {
  const draft = document.querySelector('.type1');
  const qco = document.querySelector('.type2');
  const on_premises = document.querySelector('.type3');
  const off_premises = document.querySelector('.type4');
  let accountDetail = await getItemFromStore('account', '001Bi0000074zc6IAA');
  const draft_status = accountDetail.Draft_Status__c;
  const qco_status = accountDetail.QCO_Flag__c;
  const channel_type = accountDetail.Channel__c;
  if (draft_status) {
    qco.classList.add('hide-element');
    on_premises.classList.add('hide-element');
    off_premises.classList.add('hide-element');
  } else if (qco_status) {
    draft.classList.add('hide-element');
    on_premises.classList.add('hide-element');
    off_premises.classList.add('hide-element');
  } else if (channel_type === 'On-Premise') {
    draft.classList.add('hide-element');
    off_premises.classList.add('hide-element');
    qco.classList.add('hide-element');
  } else if (channel_type === 'off-Premise') {
    draft.classList.add('hide-element');
    on_premises.classList.add('hide-element');
    qco.classList.add('hide-element');
  }
};

initialize();
