import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Image, Spinner, Alert, Button } from "react-bootstrap";
import './ProductDetails .css'
interface ProductDetail {
  id: number;
  name: string;
  image_url: string;
  price: number;
  created_at: string;
  updated_at: string;
}

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-GB");
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://web-production-3ca4c.up.railway.app/api/items/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        setProduct(res.data);
      } catch (err: any) {
        setError("Failed to fetch product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Spinner animation="border" className="mt-5 d-block mx-auto" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!product) return <Alert variant="warning">Product not found</Alert>;

  return (
    <Container className="mt-5">
      <Row className="mb-2">
        <Col>
          <Button
            className="border-0"
            variant="outline-dark"
            onClick={() => navigate(-1)}
          >
            <img src="/public/images/goBack.png" width={40} alt="go back" />
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <h1 className="text-start product-name">{product.name}</h1>
        </Col>
      </Row>

      <Row className="justify-content-center my-4">
        <Col xs={12} md="auto">
          <Image
            src={product.image_url}
            alt={product.name}
            fluid
            className="product-img-responsive"
          />
        </Col>
      </Row>

      <Row className="justify-content-between text-center mb-3">
        <Col xs={12} md={6} className="text-start mb-2 mb-md-0">
          <h4 className="product-details">
            Price: <span className="text-secondary fw-normal fs-1">{product.price}$</span>
          </h4>
        </Col>
        <Col xs={12} md={6} className="text-end">
          <h4 className="product-details">
            Added At: <span className="text-secondary fw-normal fs-1">{formatDate(product.created_at)}</span>
          </h4>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md="auto" className="text-center">
          <h4 className="product-details">
            Updated At: <span className="text-secondary fw-normal fs-1">{formatDate(product.updated_at)}</span>
          </h4>
        </Col>
      </Row>
    </Container>
  );
}
