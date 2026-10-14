import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const todo = await Todo.create({
      title,
      description,
      priority,
      user: req.user._id,
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await todo.deleteOne();
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleComplete = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
