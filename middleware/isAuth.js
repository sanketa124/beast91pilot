// SF library for connection and authenticating user
const jsforce = require('jsforce');


module.exports = async (req,res,next) => {
    try{
        let username = req.body.username;
        let password = req.body.password;
        //let connectionUrl = process.env.SFURL || 'https://bira91--beastapp.sandbox.my.salesforce.com/';
       //let connectionUrl = process.env.SFURL || 'https://bira91--sirsandbox.sandbox.lightning.force.com/lightning/page/home';
       let connectionUrl = process.env.SFURL || 'https://bira91--s4.sandbox.my.salesforce.com';
        console.log(connectionUrl)
        const conn = new jsforce.Connection({
            loginUrl : connectionUrl,
            maxRequest : 100
        });
        await conn.login(username,password);
        req.conn = conn;
        next();
    }
    catch(e){
        console.log(e);
        res.status(401).json({isAuth : false,isError : false,message : e});
    }
};
