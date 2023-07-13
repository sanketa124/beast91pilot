const uploadFile = async (conn, imageBody, accountID) => {
    // console.log('imageBody',imageBody)
     try {
         let sfConnection = conn;
        //  const contentVersionData = imageBody.map(obj => {
        //      const updatedObj = { ...obj };
        //      return updatedObj;
        //  });
         
        // console.log('contentVersionData',imageBody)
         let createdFile = await sfConnection.sobject('ContentVersion').create(imageBody)
         //console.log("CreateFile", createdFile)
         if(createdFile.length > 0){
             let conDocIds = createdFile.map(ele =>{
                 return `'`+ele.id+`'`;
             }).join(',');
             console.log("conDocIds", conDocIds)
             const conDocIdData = await sfConnection.query(
                 `SELECT ContentDocumentId FROM ContentVersion WHERE Id IN (`+conDocIds+`)`
             );
             console.log('conDocIdData',conDocIdData);
             if(conDocIdData.records.length > 0){
                 let dataForContentDoc = [];
                 conDocIdData.records.forEach(ele =>{
                     const data = {
                         LinkedEntityId : accountID,
                         ContentDocumentId : ele.ContentDocumentId,
                         shareType : 'V'
                     }
                     dataForContentDoc.push(data);
                 });
                 await sfConnection.sobject('ContentDocumentLink').create(dataForContentDoc);
             }
         }
        
         console.log("CreatedFile", createdFile[1])
     }
     catch (e) {
         console.log(e);
     }
 
 };

 module.exports = {
    uploadFile,
  };