// import { auth } from "firebase-admin";
import admin from "../config/firebaseAdmin.js";

const authMiddleware=async(req,res,next)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"Token missing"});
    }

    const token = authHeader.split("") [1];
    try{
        const decodedToken=await admin.auth().verifyIdToken(token);
        req.user=decodedToken;
        next();

    }
    catch(e)
    {
        return res.status(401).json({message:"Invalid token"});
    }
}

export default authMiddleware;
