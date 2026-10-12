
const Customer = require("../models/customer.model");
const bcrypt = require("bcrypt");

const registerCustomer = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }

       
        const existingCustomer = await Customer.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingCustomer) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const customer = await Customer.create({
            fullName,
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            phone
        });

        return res.status(201).json({
            success: true,
            message: "Customer registered successfully",
            customer: {
                _id: customer._id,
                fullName: customer.fullName,
                email: customer.email,
                phone: customer.phone
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        console.error("Registration error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const generateToken = require("../utils/generateToken");

const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const customer = await Customer.findOne({
            email: email.trim().toLowerCase()
        });

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            customer.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(customer._id.toString());

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getMyProfile = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            customer: {
                _id: req.user._id,
                fullName: req.user.fullName,
                email: req.user.email,
                phone: req.user.phone,
                createdAt: req.user.createdAt
            }
        });
    } catch (error) {
        console.error("Profile error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const logoutCustomer = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    return res.status(200).json({
        success: true,
        message: "Logout successful"
    });
};
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both passwords are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must contain at least 6 characters"
            });
        }

        const customer = await Customer.findById(req.user._id);

        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            customer.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        customer.password = await bcrypt.hash(newPassword, 10);
        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Change password error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = { registerCustomer, loginCustomer , getMyProfile, logoutCustomer, changePassword};