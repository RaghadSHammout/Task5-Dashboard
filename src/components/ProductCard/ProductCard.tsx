import { Card, Button } from "react-bootstrap";
import "./ProductCard.css";

interface ProductCardProps {
  name: string;
  image_url: string;
  onDelete: () => void;
  handleEdit: () => void;
  onClick: () => void;
}

export default function ProductCard({
  name,
  image_url,
  onDelete,
  handleEdit,
  onClick,
}: ProductCardProps) {
  return (
    <Card
      className="product-card border-0"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <Card.Img
        variant="top"
        src={image_url}
        className="product-image"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/images/defaultImgProduct.png";
        }}
      />
      <div className="overlay">
        <h5 className="product-title fs-2">{name}</h5>
        <div className="button-group">
          <Button
            variant="warning"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
