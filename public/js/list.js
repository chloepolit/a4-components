const { useState, useEffect } = React;

function priorityLevelColor(priority) {
  switch (priority) {
    case 'urgent': return 'bg-danger';
    case 'high': return 'bg-warning text-dark';
    case 'medium': return 'bg-info text-dark';
    case 'low': return 'bg-secondary';
    default: return 'bg-light text-dark';
  }
}

function categoryColor(category) {
  switch (category) {
    case 'classes': return 'bg-primary';
    case 'work': return 'bg-danger';
    case 'personal': return 'bg-success';
    default: return 'bg-secondary';
  }
}

function ToDoRow({ item, onDelete, onSave }) {
  const [editing, setEditing] = useState(false);
  const [task, setTask] = useState(item.task);
  const [category, setCategory] = useState(item.category);
  const [creationDate, setCreationDate] = useState(item.creationDate);
  const [deadline, setDeadline] = useState(item.deadline);

  if (editing) {
    return (
      <tr>
        <td><input className="form-control" value={task} onChange={e => setTask(e.target.value)} /></td>
        <td><input className="form-control" value={category} onChange={e => setCategory(e.target.value)} /></td>
        <td><input type="datetime-local" className="form-control" value={creationDate} onChange={e => setCreationDate(e.target.value)} /></td>
        <td><input type="datetime-local" className="form-control" value={deadline} onChange={e => setDeadline(e.target.value)} /></td>
        <td>—</td>
        <td>
          <button
            className="btn btn-success"
            onClick={() => {
              onSave(item._id, { task, category, creationDate, deadline });
              setEditing(false);
            }}
          >
            Save
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{item.task}</td>
      <td><span className={`badge ${categoryColor(item.category)}`}>{item.category}</span></td>
      <td>{item.creationDate}</td>
      <td>{item.deadline}</td>
      <td><span className={`badge ${priorityLevelColor(item.priority)}`}>{item.priority}</span></td>
      <td>
        <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit</button>
        <button className="btn btn-danger ms-1" onClick={() => onDelete(item._id)}>Delete</button>
      </td>
    </tr>
  );
}

function ToDoList() {
  const [items, setItems] = useState([]);

  const loadList = async () => {
    const response = await fetch('/data');
    const appdata = await response.json();
    setItems(appdata);
  };

  useEffect(() => { loadList(); }, []);

  const handleDelete = async (id) => {
    await fetch('/data', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    loadList();
  };

  const handleSave = async (id, fields) => {
    await fetch('/data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...fields })
    });
    loadList();
  };

  if (items.length === 0) {
  return <tr><td colSpan="6" className="text-center text-muted">No tasks yet</td></tr>;
  }

  return items.map(item => (
    <ToDoRow key={item._id} item={item} onDelete={handleDelete} onSave={handleSave} />
  ));
}

const root = ReactDOM.createRoot(document.getElementById('list-body'));
root.render(<ToDoList />);