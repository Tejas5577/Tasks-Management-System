import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Modal, Form, Badge } from "react-bootstrap";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import AppNavbar from "../components/Navbar";

const Dashboard = () => {
    const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects");
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projects", newProject);
      setShowModal(false);
      setNewProject({ name: "", description: "" });
      fetchProjects(); // Refresh list
    } catch (err) {
      alert("Only Admins can create projects");
    }
  };

  return (
    <>
      <AppNavbar />
      <div className="d-flex justify-content-between align-items-center mb-4" >
        <h2>Projects</h2>
        {/* ROLE-BASED ACCESS: Only show button for Admins */}
        {user?.role === "Admin" && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + New Project
          </Button>
        )}
      </div>

      <Row>
        {projects.map((project) => (
          <Col md={4} key={project.id} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <Card.Title>{project.name}</Card.Title>
                <Card.Text className="text-muted small">
                  {project.description}
                </Card.Text>
                <Badge bg="info">By: {project.users?.name || "Admin"}</Badge>
              </Card.Body>
              <Card.Footer className="bg-white border-0">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="w-100"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  View Tasks
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Creating Project */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateProject}>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100">
              Create
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Dashboard;
