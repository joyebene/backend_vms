import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({username});

    if(admin && (await admin.matchPassword(password))){
        res.json({
            _id: admin._id,
            username: admin.username,
            token: generateToken(admin._id),
        });
    } else {
        res.status(401).json({error: "Invalid credentials"});
    }
};