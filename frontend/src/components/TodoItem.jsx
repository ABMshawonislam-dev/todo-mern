export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div
        className={`checkbox ${todo.completed ? "checked" : ""}`}
        onClick={() => onToggle(todo._id)}
      />
      <div className="todo-content">
        <div className="todo-title">{todo.title}</div>
        {todo.description && (
          <div className="todo-desc">{todo.description}</div>
        )}
        <div className="todo-meta">
          <span className={`badge badge-${todo.priority}`}>
            {todo.priority}
          </span>
        </div>
      </div>
      <div className="todo-actions">
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(todo._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
