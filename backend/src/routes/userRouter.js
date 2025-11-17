const userRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const comPass = require("../utils/comparePass");
const prisma = require("../db/prisma-client");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

//user registration
userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed_password = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed_password,
      },
    });
    res.status(200).send(newUser);
  } catch (e) {
    res.status(500).send("internal server error");
    console.log(e);
  }
});

// user login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // fetch user by email to confirm existence
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(400).send("invalid login credentials");
    }
    // step-2: compare passwords
    const isMatch = comPass(password, user.password);
    if (!isMatch) {
      res.status(404).send("invalid login credentials");
    }
    // generate tokens for the user
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    // save refresh token to cookie
    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({ accessToken, theUser: { ...user } });
  } catch (e) {
    res.status(500).send("server error");
  }
});

module.exports = userRouter;
