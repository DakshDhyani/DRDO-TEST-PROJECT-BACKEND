// We need to write 4 middlewares for this project

require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.auth = async(req,res,next) =>{

    try{

        // first step is to fetch the token
        const token = req.cookies.token||req.body.token;
        console.log(req.cookies.token);
        if(!token || token == undefined)
        {
            res.status(400).json({
                success: false,
                message:"Token is not present"
            });
        }
        
        // After that we need to verify the token
        try
        {
            const decode = jwt.verify(token , process.env.SECRET_KEY);
            // Store the result in the request 
            req.user = decode;
            
        }  catch(error){
            res.status(401).json({
                success: false,
                message: "Token is Invalid",
            });
        }
        next();
        

    }  catch(error){
        res.status(401).json({
            success: false,
            message : "Something went wrong verifying token",
            error:error.message,
        });
    }
}

exports.isAdmin = async(req,res,next) =>{

    try{

        // Check the role if it's suitable or not
        if(req.user.role !== "admin")
        {
            return res.status(400).json({
                success:false,
                message: "Sorry you cant enter as it is a protected route for admins only.",
            })
        }

        next();

    }  catch(error){

        res.status(400).json({
            success: false,
            message:"Sorry Unable to login , Kindly try it later..",
        })


    }

}



exports.isTestManager = async(req,res,next) =>{

    try{

        // Check the role if it's suitable or not
        if(req.user.role !== "testmanager")
        {
            return res.status(400).json({
                success:false,
                message: "Sorry you cant enter as it is a protected route for Test Managers  only.",
            })
        }

        next();

    }  catch(error){

        res.status(400).json({
            success: false,
            message:"Sorry Unable to login , Kindly try it later..",
        })


    }

}


exports.IsTester = async(req,res,next) =>{

    try{

        // Check the role if it's suitable or not
        if(req.user.role !== "tester")
        {
            return res.status(400).json({
                success:false,
                message: "Sorry you cant enter as it is a protected route for Testers only.",
            })
        }
        next();

    }  catch(error){

        res.status(400).json({
            success: false,
            message:"Sorry Unable to login , Kindly try it later..",
        })


    }

}