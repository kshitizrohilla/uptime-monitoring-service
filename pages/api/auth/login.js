import connectMongo from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { email, password } = req.body;

  try {
    await connectMongo();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 86400,
      path: '/',
      sameSite: 'strict'
    }));

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}