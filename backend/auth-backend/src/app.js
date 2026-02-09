import express from 'express';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';

const app=express();

app.use(cors());

app.use(express.json());


app.use("/api/auth",authRoutes);

app.get("/api/health",(req,res)=>
{
    res.json({status:"ok",service:"auth-backend"})
})


export default app;
