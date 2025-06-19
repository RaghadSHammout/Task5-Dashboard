import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Col, Row, Alert, Container } from "react-bootstrap";
import MainBtn from "../AddBtn/MainBtn";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


export default function EditItemForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(
          `https://web-production-3ca4c.up.railway.app/api/items/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            }
          }
        );
        const { name, price, image_url } = response.data;
        setName(name);
        setPrice(price.toString());
        setPreviewUrl(image_url);
      } catch (err: any) {
        setError("Failed to load product data.");
      }
    };

    fetchItem();
  }, [id, token]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !price.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    if (image) {
      formData.append("image", image);
    }
    formData.append("_method", "PUT");

    try {
      await axios.post(
        `https://web-production-3ca4c.up.railway.app/api/items/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      setSuccess("Product updated successfully.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update product.");
    }
  };

  return (
    <Container fluid className="py-5 px-5" style={{ minHeight: '100vh' }}>
      <Form onSubmit={handleSubmit}>
        <Button
                    variant="light"
                    onClick={() => navigate(-1)}
                    className="d-flex align-items-center justify-content-center border mb-4 rounded-circle"
                    style={{ width: '48px', height: '48px', backgroundColor: 'white' }}
                >
                    <ArrowLeft size={20} color="#666" />
                </Button>
        <h2 className="fw-bold my-5">EDIT ITEM</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Row className="mb-5">
          <Col md={6}>
            <Form.Group controlId="formName" className="mb-4">
              <Form.Label className="fs-3 fw-semibold text-secondary">Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control border rounded bg-white"
                style={{ height: '56px', fontSize: '16px' }}
              />
            </Form.Group>

            <Form.Group controlId="formPrice">
              <Form.Label className="fs-3 fw-semibold text-secondary">Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the product price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="form-control border rounded bg-white"
                style={{ height: '56px', fontSize: '16px' }}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formImage">
              <Form.Label className="fs-3 fw-semibold text-secondary">Image</Form.Label>
              <div
                className="d-flex align-items-center justify-content-center bg-light rounded"
                style={{
                  height: '200px',
                  cursor: 'pointer',
                  position: 'relative',
                  borderStyle: "dashed",
                  borderColor: "#BFC5EA"
                }}
              >
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="imageUpload"
                  className="w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ cursor: "pointer" }}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="img-fluid h-100"
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <img src="/images/upload.png" alt="upload" height={60} />
                  )}
                </label>
              </div>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-center mt-5">
          <MainBtn text="Save" type="submit" />
        </div>
      </Form>
    </Container>
  );
}
