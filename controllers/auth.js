//  Adding bcrypt for the hashing of the password
const bcrypt = require("bcrypt");

// import the model for the controller to interact with the database
const User = require("../models/user");

// Get the env data for the secret key
require("dotenv").config();

// We want Jwt token also so 
const jwt = require("jsonwebtoken");



// Writing the controller for the signup

exports.signup = async(req,res)=>{

    try{
        // first step is to fetch all the details
        const{name,email,password,role} = req.body;

        // Check if the user already exists i.e. trying to signup again
        const existinguser  = await User.findOne({email});

        if(existinguser)
        {
            return res.status(400).json(
                {
                    success:false,
                    message:"Sorry User already exists"
                }
            );
        }

        let hashedPassword;
        
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err) {
            return res.status(500).json({
                success:false,
                message:'Error in hashing Password',
            });
        }
        // Now as the password is hashed , now we need to create a user in the dataase
        const  user = await User.create({name,email,password:hashedPassword,role}) // u have to give like password:hashedPassword
        return res.status(200).json({
            success:true,
            message:'User Created Successfully',
        });

    } catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later',
            
        });
    }
}


// Now we need to write a control flow for the login
exports.login = async(req,res)=>{

    try{
        //first fetch the details
        const {email,password} = req.body;
        
        
        // Check the validation for email and password
        if(!email || !password)
        {
            return res.status(400).json({
                message:"Enter the email id and password."
            });
        }
        

        // Check for the email in the database
        let existingUser = await User.findOne({email});  //always use let here const will give error

        // if the email is there then ok if not then return error
        if(!existingUser)
        {
            return res.status(500).json({
                message:"The user don't exist please signup"
            });
        }

        // If the user is already there then login
        const payload ={
            email: existingUser.email,
            id: existingUser.id,
            role : existingUser.role
        };

        // Verify the password and generate a JWT token or cookies.
        if(await bcrypt.compare(password , existingUser.password))
        {
            // it means that the password is correct so we will create a Jwt token for it 
            let token = jwt.sign(payload,process.env.SECRET_KEY,{
                expiresIn:"8h",
            });

            existingUser = existingUser.toObject();    
            // We are making this change in the user object not in the database

            existingUser.token = token;  // Inserting token in the user object body
            existingUser.password = undefined; // hiding the password in the user body.

            // We can create a cookie also for that dont forget to add cookie-parser
            const options = {
                expires: new Date( Date.now() + 3*24*60*60*1000),
                httpOnly:true,  // makes cookies inaccesible at the client side
            }

            res.cookie("token" , token, options).status(200).json({      // here name of the cookie name must be token when u do req.body.token
                success:true, 
                token,
                existingUser,
                message: "User logged in successfully",
            });

            // If we dont give cookie then we can send a normal response also , then no need of cookie.

            // res.status(200).json({
            //     success:true,
            //     token,
            //     existingUser,
            //     message: "User logged in successfully",

            // });

        }
        else
        {
            res.status(400).json({
                success:false,
                message:"Incorrect Password kindly , check it again",
            });
        }

    }catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure',
        });
    }
}

exports.update = async(req,res) =>{

    try{

        const {id} = req.params;
        const{token ,role} = req.body;

        const updated_entry = await User.findByIdAndUpdate(
            {_id:id},
            {role:role}
        )

        res.status(200).json({
            success:true,
            message:"Updated Successfully",
            updated_entry,
        })

    }  catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'You are not allowed to update or Not updated Successfully',
        });
    }
}

exports.deleted = async(req,res) =>{
    try{

        const {id} = req.params;
        
        deleted_user = await User.findByIdAndDelete({_id:id});
        deleted_user.password = undefined;

        res.status(200).json({
            success: true,
            message:"User Deleted Successfully",
            deleted_user,
        })

    }  catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'You are not allowed to update or Not Deleted Successfully',
        });
    }
}