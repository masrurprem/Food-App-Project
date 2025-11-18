const adminRouter = require("express").Router();
const prisma = require("../db/prisma-client");
const bcryt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// admin login route to dashboard
adminRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user || user.role !== "ADMIN") {
      return res.status(403).send("unauthorized access denied");
    }
    // compare password
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).send("invalid credentials");
    }
    //generate token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({ accessToken, admin: { ...user } });
  } catch (e) {
    res.status(500).send("internal server error");
  }
});
