import { useState } from "react";
import axios from "axios";
import { Form, Button, Col, Row, Alert, Container } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MainBtn = ({ text, type }: { text: string; type: "submit" | "button" }) => {
    return (
        <Button
            type={type}
            className="px-5 py-2 fw-semibold text-white border-0"
            style={{
                backgroundColor: '#F59E0B',
                borderRadius: '8px',
                fontSize: '18px',
            }}
        >
            {text}
        </Button>
    );
};

export default function AddItemForm() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

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

        if (!name || !price || !image) {
            setError("Please fill out all fields and upload an image.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("image", image);

        const token = localStorage.getItem("token");

        try {
            await axios.post(
                "https://web-production-3ca4c.up.railway.app/api/items",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            setSuccess("Product added successfully.");
            setName("");
            setPrice("");
            setImage(null);
            setPreviewUrl(null);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add product.");
        }
    };

    return (
        <Container fluid className="py-5 px-5" style={{ minHeight: '100vh' }}>
            <Form onSubmit={handleSubmit}>
                {/* زر الرجوع */}
                <Button
                    variant="light"
                    onClick={() => navigate(-1)}
                    className="d-flex align-items-center justify-content-center border mb-4 rounded-circle"
                    style={{ width: '48px', height: '48px', backgroundColor: 'white' }}
                >
                    <ArrowLeft size={20} color="#666" />
                </Button>

                <h2 className="fw-bold my-5">ADD NEW ITEM</h2>

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
                                className="d-flex align-items-center justify-content-center bg-light rounded "
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
                                    onChange={handleImageChange}
                                    accept="image/*"
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
                                        <img src="/images/upload.png" alt="Upload" height={60} />
                                    )}
                                </label>
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                {/* زر الحفظ */}
                <div className="d-flex justify-content-center mt-5">
                    <MainBtn text="Save" type="submit" />
                </div>
            </Form>
        </Container>
    );
}
