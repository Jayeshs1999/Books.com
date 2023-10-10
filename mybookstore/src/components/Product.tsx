import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }: any) => {
  return (
    <div>
      <Card className="my-3 p-3 rounded" style={{display:'flex', flexDirection:'column', height:'100%'}}>
        <div>
        <Link to={`/product/${product._id}`}>
          <Card.Img src={product.image} variant="top" style={{width:'100%', height:'200px', objectFit:'contain', borderRadius: '8px'}}></Card.Img>
        </Link>
        </div>
        <Card.Body>
          <Link to={`/product/${product._id}`}>
            <Card.Title as="div" className="product-title">
              <strong>{product.name}</strong>
            </Card.Title>
          </Link>
          <Card.Text as="div">
            <Rating
              value={product.rating}
              text={`${product.numReviews}`}
              reviews
            ></Rating>
          </Card.Text>
          <Card.Text as="h3">Rs.{product.price}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Product;
