

handlePageRedirect = async(page) => {
    if(page ==='Detail'){
        window.location.href ='/view/accountDetail/accountDetailConsumer/accountDetailConsumerDetail.html?Id='+accountRec.Id;
    }
    else if(page ==='Related'){
        window.location.href ='/view/accountDetail/accountDetailConsumer/accountDetailConsumerRelated.html?Id='+accountRec.Id;
    }
    else if(page ==='Home'){
        let nonSales = await isTechnicianAuditorFuncHelper();
        if(nonSales.isSales)
            window.location.href ='/view/accountDetail/accountDetailConsumer/accountDetailConsumerLanding.html?Id='+accountRec.Id;
        else if(nonSales.isAudit)
            window.location.href ='/view/accountDetailLandingAuditor/accountDetailLandingAuditor.html?accountId='+accountRec.Id;
        else if(nonSales.isTech)
            window.location.href ='/view/accountDetailLandingTechnician/accountDetailLandingTechnician.html?accountId='+accountRec.Id;
        
    }
    else{
        window.location.href ='/view/accountDetail/accountDetailConsumer/accountDetailConsumerMedia.html?Id='+accountRec.Id;
    }
};

   
showLoader = () =>{
    $('.loader-div').css('display','block');
};

hideLoader = () =>{
    $('.loader-div').css('display','none');
};
