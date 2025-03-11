import connectMongo from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { fullName, email, password } = req.body;

  try {
    await connectMongo();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });

    await newUser.save();
    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}