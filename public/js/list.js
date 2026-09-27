const { useState, useEffect } = React;

function ToDoRow({ item, onDelete, onSave }) {
  const [editing, setEditing] = useState(false);
  const [task, setTask] = useState(item.task);
  const [category, setCategory] = useState(item.category);
  const [creationDate, setCreationDate] = useState(item.creationDate);
  const [deadline, setDeadline] = useState(item.deadline);

  function priorityLevel(priority) {
  switch (priority) {
    case 'urgent': return 'bg-danger';
    case 'high': return 'bg-warning text-dark';
    case 'medium': return 'bg-info text-dark';
    case 'low': return 'bg-secondary';
    default: return 'bg-light text-dark';
  }
}

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
      <td>{item.category}</td>
      <td>{item.creationDate}</td>
      <td>{item.deadline}</td>
      <td><span className={`badge ${priorityLevel(item.priority)}`}>{item.priority}</span></td>
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

  return items.map(item => (
    <ToDoRow key={item._id} item={item} onDelete={handleDelete} onSave={handleSave} />
  ));
}

const root = ReactDOM.createRoot(document.getElementById('list-body'));
root.render(<ToDoList />);