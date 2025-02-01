import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are Unauthorized and not token found",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_KEY);
    if (!decode) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(`Error in protect route: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default protectRoute;
