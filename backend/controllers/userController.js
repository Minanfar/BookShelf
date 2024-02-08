import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import "dotenv/config"

const JWT_SECRET = process.env.JWT_SECRET

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).send("Invalid username or password");
    }
    const accessToken = jwt.sign({ username: user.username }, JWT_SECRET);
    const refreshToken = jwt.sign({ username: user.username }, JWT_SECRET);

    res.cookie("token", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  const userPassword = req.body.password;
  const hashedPass = await bcrypt.hash(userPassword, 10);

  const newUser = new User({
    username: req.body.email,
    password: hashedPass,
  });
  try {
    await newUser.save();
    res.status(201).send("You are Registerd!");
  } catch (error) {
    console.error(error);
    console.log("error in register backend");
    res.status(500).send("Internal Server Error");
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("refreshToken");

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const username = decodedToken.username;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json({
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
