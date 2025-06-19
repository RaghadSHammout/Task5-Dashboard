import { useEffect, useState } from "react";
import { Container, Row, Col, Pagination, Modal } from "react-bootstrap";
import axios from "axios";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductSection.css";
import { useNavigate } from "react-router-dom";
import MainBtn from "../AddBtn/MainBtn";

interface Product {
  id: number;
  name: string;
  image_url: string;
}

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const productsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://web-production-3ca4c.up.railway.app/api/items", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          Accept: "application/json",
        },
      })
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleCardClick = (id: number) => navigate(`/dashboard/products/${id}`);
  const openDeleteModal = (id: number) => {
    setSelectedProductId(id);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = () => {
    if (!selectedProductId) return;
    const token = localStorage.getItem("token");
    axios
      .delete(
        `https://web-production-3ca4c.up.railway.app/api/items/${selectedProductId}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      )
      .then(() => {
        setProducts(prev => prev.filter(p => p.id !== selectedProductId));
        setShowDeleteModal(false);
        setSelectedProductId(null);
      })
      .catch(err => {
        console.error("Error deleting product:", err);
        alert(
          `An error occurred while deleting: ${err.response?.data?.message || err.message}`
        );
      });
  };
  const handleEditProduct = (id: number) => navigate(`/dashboard/products/edit/${id}`);
  const handleAddProduct = () => navigate("/dashboard/products/add");

  return (
    <Container fluid>
      <div className="d-flex align-items-center justify-content-end mb-5 me-5">
        <MainBtn text="Add product" onClick={handleAddProduct} />
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {currentProducts.map(product => (
          <Col
            key={product.id}
            className="mb-4"
            onClick={() => handleCardClick(product.id)}
            style={{ cursor: "pointer" }}
          >
            <ProductCard
              name={product.name}
              image_url={product.image_url}
              onDelete={() => openDeleteModal(product.id)}
              handleEdit={() => handleEditProduct(product.id)}
            />
          </Col>
        ))}
      </Row>

      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        <Pagination.Item
          active={currentPage === 1}
          onClick={() => setCurrentPage(1)}
          className="rounded-circle"
        >
          1
        </Pagination.Item>

        {currentPage > 3 && <Pagination.Ellipsis disabled />}

        {[...Array(totalPages)]
          .map((_, i) => i + 1)
          .filter(page => page > 1 && page < totalPages && Math.abs(page - currentPage) <= 1)
          .map(page => (
            <Pagination.Item
              key={page}
              active={currentPage === page}
              onClick={() => setCurrentPage(page)}
              className="rounded-circle d-flex align-items-center justify-content-center"
            >
              {page}
            </Pagination.Item>
          ))}

        {currentPage < totalPages - 2 && <Pagination.Ellipsis disabled />}

        {totalPages > 1 && (
          <Pagination.Item
            active={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="rounded-circle"
          >
            {totalPages}
          </Pagination.Item>
        )}

        <Pagination.Next
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
      </Pagination>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        dialogClassName="border-0"
        contentClassName="border-0"
      >
        <Modal.Body className="text-center">
          Are you sure you want to delete the product?
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-around border-0">
          <MainBtn text="Yes" onClick={handleConfirmDelete} />
          <MainBtn text="No" onClick={() => setShowDeleteModal(false)} />
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
