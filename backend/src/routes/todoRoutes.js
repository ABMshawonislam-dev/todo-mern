import express from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleComplete,
} from "../controllers/todoController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTodos).post(createTodo);
router.route("/:id").put(updateTodo).delete(deleteTodo);
router.patch("/:id/toggle", toggleComplete);

export default router;
