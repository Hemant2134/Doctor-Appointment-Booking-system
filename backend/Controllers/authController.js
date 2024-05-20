import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (user, role) => {
    return jwt.sign({ id: user._id, role: role }, process.env.JWT_SECRET_KEY, { expiresIn: '15d' });
}

export const register = async (req, res) => {
    const { email, password, name, role, photo, gender } = req.body;

    try {
        let existingUser;

        if (role === 'patient') {
            existingUser = await User.findOne({ email });
        } else if (role === 'doctor') {
            existingUser = await Doctor.findOne({ email });
        }

        // Check if user exists
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        let newUser;

        if (role === 'patient') {
            newUser = new User({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role,
            });
        } else if (role === 'doctor') {
            newUser = new Doctor({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role,
            });
        }

        await newUser.save();
        res.status(200).json({ success: true, message: 'User successfully created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error. Please try again.' });
    }
};

export const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        let user = null;
        let role = null;

        const patient = await User.findOne({ email });
        const doctor = await Doctor.findOne({ email });

        if (patient) {
            user = patient;
            role = 'patient';
        }
        if (doctor) {
            user = doctor;
            role = 'doctor';
        }

        // Check if user exists
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password or email' });
        }

        // Generate token
        const token = generateToken(user, role);

        const { password: _, role: __, ...userData } = user._doc;

        res.status(200).json({ success: true, message: 'Successfully logged in', token, data: { ...userData }, role });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to login' });
    }
};
