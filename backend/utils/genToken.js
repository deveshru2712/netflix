import jwt from "jsonwebtoken";

const genToken = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    res.cookie("authToken", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
  } catch (error) {
    console.log(`Error occurred in gen Token function:${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default genToken;
