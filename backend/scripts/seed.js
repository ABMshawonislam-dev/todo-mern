import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import Todo from "../src/models/Todo.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await User.deleteMany();
    await Todo.deleteMany();

    const user = await User.create({
      name: "Demo User",
      email: "demo@todo.com",
      password: "hello123",
    });

    await Todo.create([
      {
        title: "Learn MERN Stack",
        description: "Complete the todo app project",
        priority: "high",
        user: user._id,
      },
      {
        title: "Deploy to AWS EC2",
        description: "Follow the step-by-step guide",
        priority: "medium",
        user: user._id,
      },
      {
        title: "Buy groceries",
        description: "Milk, eggs, bread",
        priority: "low",
        completed: true,
        user: user._id,
      },
    ]);

    console.log("Seed completed!");
    console.log("Login with: demo@todo.com / hello123");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
