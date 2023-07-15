const uploadFile = async (conn, imageBody, accountID) => {
    try {
        let sfConnection = conn;
        let createdFile = await sfConnection.sobject('ContentVersion').create(imageBody)
        if (createdFile.length > 0) {
            let conDocIds = createdFile.map(ele => {
                return `'` + ele.id + `'`;
            }).join(',');

            const conDocIdData = await sfConnection.query(
                `SELECT ContentDocumentId FROM ContentVersion WHERE Id IN (` + conDocIds + `)`
            );

            if (conDocIdData.records.length > 0) {
                let dataForContentDoc = [];
                conDocIdData.records.forEach(ele => {
                    const data = {
                        LinkedEntityId: accountID,
                        ContentDocumentId: ele.ContentDocumentId,
                        shareType: 'V'
                    }
                    dataForContentDoc.push(data);
                });
                await sfConnection.sobject('ContentDocumentLink').create(dataForContentDoc);
            }
        }
    }
    catch (e) {
        console.log(e);
    }
};

module.exports = {
    uploadFile,
};