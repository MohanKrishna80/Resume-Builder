import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../Models/Resume.js";

//Generating token for new user

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

// Controller for user Registration
//POST:/api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the details" });
    }

    //checking if user already exists

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists please use different email" });
    }

    //creating new user
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);
    newUser.password = undefined;

    return res
      .status(200)
      .json({ message: "User Created Successfully ", token, user: newUser });
  } catch (error) {
    console.log("Error while creating user", error);
    return res.status(400).json({ message: error.message });
  }
};

// Controller for user login
//POST:/api/users/login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the details" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    user.password = undefined;

    return res
      .status(200)
      .json({ message: "User login successful", token, user });
  } catch (error) {
    console.log("Error while login user", error);
    return res.status(400).json({ message: error.message });
  }
};

// Controller for getting user data
//GET:/api/users/data

export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;

    //checking if user exits

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json("User nOt found");
    }

    user.password = undefined;
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller for getting user resume's
//GET:/api/users/resumes

export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;

    const resumes = await Resume.find({ userId });
    return res.status(200).json({ resumes });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
