
const inviteUserSms=async(mobile)=>{
    let loginData = (await loginDataFetch())[0];
    const {username,password}=loginData
    try{
        let res = await fetch('/recommendation/send-sms',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                username : username,
                password : password,
                mobile
            })
        });
        if (res.ok) {
            let data = await res.json();
            const result= data && data.result? data.result : {};
            return result;    
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