import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import TodoItem from "../components/TodoItem";

export default function Home() {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [adding, setAdding] = useState(false);

  const fetchTodos = async () => {
    try {
      const { data } = await api.get("/todos");
      setTodos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    try {
      const { data } = await api.post("/todos", {
        title,
        description,
        priority,
      });
      setTodos([data, ...todos]);
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await api.patch(`/todos/${id}/toggle`);
      setTodos(todos.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="todo-page">
      <header className="header">
        <div className="header-inner">
          <div className="logo">✓ Todo App</div>
          <div className="user-info">
            <span>{user?.name}</span>
            <button className="btn btn-secondary btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <form className="add-form" onSubmit={handleAdd}>
          <h2>Add New Todo</h2>
          <div className="form-row">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <select
              className="priority-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 12 }}>
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={adding}>
            {adding ? "Adding..." : "Add Todo"}
          </button>
        </form>

        <div className="stats">
          <span>Total: {todos.length}</span>
          <span>Done: {completedCount}</span>
          <span>Left: {todos.length - completedCount}</span>
        </div>

        {loading ? (
          <div className="loading">Loading todos...</div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <h3>No todos yet</h3>
            <p>Add your first task above</p>
          </div>
        ) : (
          <div className="todo-list">
            {todos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
