


class userdashboardController{
    // user dashboard
async dashboard(req,res){
    try{
        if(req.user.isDeleted==true){
            return res.status(400).json({
                message: "You are not authenticate user"
            })
        }
        res.status(200).json({
            message:`Welcome back, ${req.user.name}! Here’s your dashboard.`,
            data:req.user
        })

    }catch(err){
        res.status(400).json({
            message: "Dashboard access failed !!",
            error:err.message||err

        })
    }
}
}

module.exports = new userdashboardController();