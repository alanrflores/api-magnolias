const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Resend } = require("resend");

require('dotenv').config();

const DEFAULT_RESEND = process.env.RESEND

const resend = new Resend(DEFAULT_RESEND);

const generateToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

const sendPasswordResetEmail = async (email, token) => {
  if (!email) {
    throw new Error("Email and reset token are required");
  }
  

const urlBase = "http://localhost:3001";
const URL_BASE_PROD = "https://magnolias-api.vercel.app"
const resetLink = `${URL_BASE_PROD}/request/${token}`;
  const { data, error } = await resend.emails.send({
    from: "Magnolias admin <admin@resend.dev>",
    to: [email],
    subject: "Reestablecer contraseña",
    html: `<p>Click aca <a href="${resetLink}">link</a> para reiniciar su contraseña</p>`,
  });

  if (error) {
    return console.error({ error });
  }

  // console.log(data);
  return data;
};

const findAllUsers = async (filters) => {
  try {
    return await User.find(filters);
  } catch (err) {
    throw new Error(err.message);
  }
};

const findUserById = async (userId) => {
  try {
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    }
  } catch (err) {
    console.log({ err });

    throw new Error("Error fetching user by ID");
  }
};

const findUserByUsername = async (username) => {
  try {
    if (username) {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    }
  } catch (err) {
    throw new Error("Error fetching user by username");
  }
};

const findUserByEmail = async (userEmail) => {
  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

const createUser = async (userData) => {
  const { name, email, role, username, password } = userData;
  try {
    const saltRounds = 10;
    const existingUserEmail = await User.findOne({ email });
    const existingUserName = await User.findOne({ username });

    if (existingUserEmail) throw new Error("Email already exists");
    if (existingUserName) throw new Error("Username already exists");

    
     const existingAdmin = await User.findOne({ role: 'ADMIN' });
     if (existingAdmin && role === 'ADMIN') {
       throw new Error("Un usuario con el rol de ADMIN ya existe");
     }
 
     const userRole = role || 'EMPLEADO';

    const passHashed = bcrypt.hashSync(password, saltRounds);

    return await User.create({
      name,
      username,
      email,
      password: passHashed,
      role: userRole,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

const loginUser = async (email, password) => {
  try {
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");

    const user = await User.findOne({ email });

    if (!user) throw new Error("User not found");

    // Verifica si el usuario tiene una contraseña definida
    if (!user.password)
      throw new Error("User does not have a password defined");

    const passMatch = bcrypt.compareSync(password, user.password);

    if (!passMatch) throw new Error("Password does not match");

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUser = async (id, userData) => {
  try {
    const { password } = userData;
    if (password) {
      const saltRounds = 10;
      const passHashed = bcrypt.hashSync(password, saltRounds);
      userData = { ...userData, password: passHashed };
    }
    return await User.findOneAndUpdate({ _id: id }, userData);
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  findAllUsers,
  findUserById,
  findUserByUsername,
  findUserByEmail,
  createUser,
  updateUser,
  loginUser,
  sendPasswordResetEmail,
};
