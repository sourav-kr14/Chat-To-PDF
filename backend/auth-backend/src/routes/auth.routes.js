import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

const router=express.Router();

router.get("/me",authMiddleware,(req,res)=>
{
    res.json({
        uid:req.user.uid,
        email:req.user.email,
        provider:req.user.firebase.sign_in_provider,
    })
})


export default router;