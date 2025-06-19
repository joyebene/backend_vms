import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import formRoutes from './routes/formRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js'


dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
connectDB();

app.use(cors()); 
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/admin', adminRoutes); 



app.listen(PORT, () => console.log(`Server running at port ${PORT}`))