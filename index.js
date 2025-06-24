import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import formRoutes from './routes/formRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
import deviceRoutes from './routes/deviceRoutes.js';
import trainingRoutes from "./routes/trainingRoutes.js";
import analyticsRoutes from './routes/analyticsRoutes.js';


dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
connectDB();

// ✅ Correct middleware order
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/devices', deviceRoutes);
app.use('/api', trainingRoutes);
app.use('/api/analytics', analyticsRoutes);

// ✅ Server
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
