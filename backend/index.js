import express, {urlencoded} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from './utils/db.js';
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import messageRoute from './routes/messageRoute.js';

import dotenv from 'dotenv';
dotenv.config({});

const app = express();

const PORT = process.env.PORT || 8000;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions = {
   origin: 'http://localhost:5173',
   credentials:true
};
app.use(cors(corsOptions));

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.listen(PORT, () => {
   connectDB();
   console.log(`Server listen at http://localhost:${PORT}`);
});