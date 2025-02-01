import bcrypt from "bcryptjs";
import genToken from "../utils/genToken.js";

import User from "../models/user.model.js";

export const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "Username already associated with another account",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already associated with another account",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const img = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

    const profileImg = img[Math.floor(Math.random() * img.length)];

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profileImg,
    });

    genToken(newUser._id, res);

    return res.status(201).json({ user: { ...newUser._doc, password: "" } });
  } catch (error) {
    console.log(`An error occurred in the signup controller:${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    genToken(user._id, res);

    return res.status(200).json({
      user: { ...user._doc, password: "" },
    });
  } catch (error) {
    console.log(`Error occurred in the login controller:${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("authToken", "", {
      expires: new Date(0),
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logout successfully",
    });
  } catch (error) {
    console.log(`Error occurred in the logout controller:${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Interval Server Error",
    });
  }
};

export const authCheck = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
