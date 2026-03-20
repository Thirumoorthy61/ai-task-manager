import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000';

export default function App() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPriority = (text) => {
    const normalized = text.toLowerCase();
    if (/(urgent|asap)/.test(normalized)) {
      return 'High';
    }
    if (/later/.test(normalized)) {
      return 'Low';
    }
    return 'Medium';
  };

  const addTask = async () => {
    const rawText = taskText.trim();
    if (!rawText) return;

    const taskPriority = getPriority(rawText);

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: rawText, priority: taskPriority })
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload?.error || 'Failed to add task');
      }

      const createdTask = await response.json();
      setTasks((prev) => [...prev, createdTask]);
      setTaskText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/tasks`);
      if (!response.ok) throw new Error('Failed to load tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app-container">
      <h1>Task Manager</h1>

      <div className="form-row">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Enter task"
        />

        <button type="button" onClick={addTask}>
          Add Task
        </button>
      </div>

      {error && <div className="error">Error: {error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <div className="task-grid">
        {!loading && tasks.length === 0 && <div className="empty">No tasks yet</div>}
        {tasks.map((task) => (
          <div key={task.id} className={`task-card ${task.priority.toLowerCase()}`}>
            <div>
              <div className="task-name">{task.text}</div>
              <span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
            </div>
            <button className="remove" onClick={() => removeTask(task.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
