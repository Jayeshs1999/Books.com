import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }: any) => {
  return (
    <div>
      <Card className="my-3 p-3 rounded card-background-gradient" style={{display:'flex', flexDirection:'column', height:'100%'}}>
        <div>
        <Link to={`/product/${product._id}`}>
          <Card.Img src={product.image || 'https://firebasestorage.googleapis.com/v0/b/bookbucket-5253e.appspot.com/o/images%2F256x256.png?alt=media&token=60298d59-36d4-4965-9b05-3a9a9d219d93&_gl=1*yafxoz*_ga*MzcyMzM2MzI5LjE2OTI0NTY4ODU.*_ga_CW55HF8NVT*MTY5NzIwMTA1Mi4yMC4xLjE2OTcyMDEwNzguMzQuMC4w'} variant="top" style={{width:'100%', height:'200px', objectFit:'contain', borderRadius: '8px'}}></Card.Img>
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
