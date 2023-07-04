exports.fetchAllLiquids=async(req,res,next)=>{
    const conn= req.conn
    try{
        /*** Fetch Recommendations, Samples */
        const result= (await conn.sobject('Liquid_Layer__c').find({}))||[]
        res.status(200).json({isError : false,isAuth : true,liquidLayer :result });
    }catch(err){
        console.log(err)
        res.status(500).json({isError : true,isAuth :true,message : err});
    }
  
}