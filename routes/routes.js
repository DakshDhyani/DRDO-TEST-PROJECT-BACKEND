// First we have to make a router for that we need a instance of express
const express = require("express");
const router = express.Router();


// To make the routes we must import the controllers
const {login ,signup,update ,deleted} = require("../controllers/auth");

const{auth, isAdmin, isTestManager ,IsTester} = require("../middlewares/Auth");


// Now make the routes and map them with the controllers
router.post("/login",login);
router.post("/signup",signup);

// Testing route for the authorization


router.get("/test",auth,(req,res) =>{
    res.status(200).json({
        success: true,
        message:"Congratulations! you are successfully authorized for test route.",
    });
});


// Protected Route for the Admin
router.get("/admin", auth , isAdmin, (req,res) =>{
    res.json({
        success: true,
        message: "Hey Admin , Welcome to the portal",
    });
});


// Protected Route for the Test Manager
router.get("/testmanager", auth , isTestManager, (req,res) =>{
    res.json({
        success: true,
        message: "Hey Test Manager , Welcome to the portal",
    });
});

// Protected Route for the Tester
router.get("/tester", auth , IsTester, (req,res) =>{
    res.json({
        success: true,
        message: "Hey  Tester , Welcome to the portal",
    });
});

// Routes For Updation  and Deletion of the user

router.put("/update/:id",auth,isAdmin, update);  // so that only admin can update. The req body must have token and role.

router.delete("/delete/:id",auth,isAdmin,deleted ); 
module.exports = router;