import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Card,
  Alert,
} from "react-bootstrap";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import AppNavbar from "../components/Navbar";

const ProjectDetails = () => {
  const { id } = useParams(); // Get Project ID from URL
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
    assigned_to: "",
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchProjectData();
    fetchTasks();
    if (user?.role === "Admin") fetchUsers();
  }, [id]);

  const fetchProjectData = async () => {
    const { data } = await API.get("/projects");
    const currentProject = data.find((p) => p.id === id);
    setProject(currentProject);
  };

  const fetchTasks = async () => {
    try {
      const { data } = await API.get(`/tasks/project/${id}`);
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks");
    }
  };

  // const fetchUsers = async () => {
  //     // Simple trick: in a real app, you'd have an /api/users endpoint.
  //     // For this assignment, we'll fetch them when needed.
  //     const { data } = await API.get('/auth/users'); // Ensure you have this or skip assignment logic for simplicity
  // };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/auth/users");
      setUsers(data); // Add this line to update the state
    } catch (err) {
      console.error("User fetch failed");
    }
  };

  // const handleCreateTask = async (e) => {
  //     e.preventDefault();
  //     try {
  //         await API.post('/tasks', { ...newTask, project_id: id });
  //         setShowModal(false);
  //         setNewTask({ title: '', description: '', due_date: '', assigned_to: '' });
  //         fetchTasks();
  //     } catch (err) { alert("Failed to create task"); }
  // };
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      // We explicitly structure the data to ensure no extra fields are sent
      const payload = {
        title: newTask.title,
        description: newTask.description,
        due_date: newTask.due_date,
        project_id: id,
        status: "To-Do", // Default status
      };

      await API.post("/tasks", payload);
      setShowModal(false);
      setNewTask({ title: "", description: "", due_date: "", assigned_to: "" });
      fetchTasks();
    } catch (err) {
      // This will tell you if it's a "403 Forbidden" (RLS) or "400 Bad Request"
      console.error("Task Error:", err.response?.data);
      alert(
        "Error: " +
          (err.response?.data?.error || "Check Supabase RLS Policies"),
      );
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks(); // Refresh list
    } catch (err) {
      alert("Update failed");
    }
  };

  const isOverdue = (date) => {
    return (
      new Date(date) < new Date() &&
      new Date(date).toDateString() !== new Date().toDateString()
    );
  };

  return (
    <>
      <AppNavbar />
      <div className="mb-4">
        <Button
          variant="link"
          onClick={() => window.history.back()}
          className="p-0 mb-2"
        >
          ← Back to Projects
        </Button>
        {/* <h2>{project?.name} <small className="text-muted">Tasks</small></h2> */}
        <h2 className="fw-bold mb-4" style={{ color: "black" }}>
          {project?.name} Tasks
        </h2>
      </div>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Task List</h5>
            {user?.role === "Admin" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowModal(true)}
              >
                + Add Task
              </Button>
            )}
          </div>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <strong>{task.title}</strong>
                    <div className="text-muted small">{task.description}</div>
                  </td>
                  <td>
                    <Badge
                      bg={task.status === "Completed" ? "success" : "warning"}
                    >
                      {task.status}
                    </Badge>
                  </td>
                  <td>
                    <span
                      className={
                        isOverdue(task.due_date) && task.status !== "Completed"
                          ? "text-danger fw-bold"
                          : ""
                      }
                    >
                      {task.due_date}{" "}
                      {isOverdue(task.due_date) &&
                        task.status !== "Completed" &&
                        "(Overdue)"}
                    </span>
                  </td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={task.status}
                      onChange={(e) => updateStatus(task.id, e.target.value)}
                    >
                      <option value="To-Do">To-Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Create Task Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateTask}>
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) =>
                  setNewTask({ ...newTask, due_date: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100">
              Create Task
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProjectDetails;
