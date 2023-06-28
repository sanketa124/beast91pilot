$(function () {
    $("#selectSearch").select2();
  });
  
  $(function () {
    $("#selectSearch1").select2();
  });

  const fileInput = async (event) => {
    const key = event.id;
    const fileInput = event.files[0];
    var options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    const compressedFile = await imageCompression(fileInput, options);
    uploadBase64Value(key, compressedFile);
    
  };

  const uploadBase64Value = async (key, fileInput) => {
    
    const newKey = key.split('+')[0]+'_'+key.split('+')[1]+'_File';
    draftInstallation[newKey] =  await toBase64(fileInput);
    for(let i of draftInstallation.items){
        if(i.typeId===key.split('+')[0]){
            draftInstallation[newKey+'_Name'] = i.items[key.split('+')[1]].ProductName;
            break;
        }
    }
    fileAttachedBackgroundChange(key.split('+')[0]+'_'+key.split('+')[1]);
    
  };
  
  const fileAttachedBackgroundChange = (key) => {
    let iconKey = key;
  
    //    let icon = document.querySelector(`#${iconKey}`);
    let icon = $('.' + iconKey);
  
    icon.css('color', '#5cb85c');
  };
  