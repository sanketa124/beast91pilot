
const fetchSellSheets=async(liquidName)=>{
    let loginData = (await loginDataFetch())[0];
    const {username,password}=loginData
    try{
        let res = await fetch('/sell-sheet',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                username : username,
                password : password,
                liquidName
            })
        });
        if (res.ok) {
            let data = await res.json();
            const sellSheet=(data?.sellSheet?.records?.[0] ||false)
            const imageUrl=sellSheet?.DistributionPublicUrl
            return imageUrl;
           
        } else {
            console.error("Error: " + res.status);
            return false;
          }
    }
    catch(err){
        console.log(err)
        return false;
    }
}