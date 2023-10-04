import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import Rating from "../components/Rating";
import axios from "axios";

const ProductScreen = () => {
  const  [product, setProduct] =useState();
  const { id: productId } = useParams();

  useEffect(()=>{
    const fetchProduct = async () => {
      const {data} = await axios.get(`/api/products/${productId}`)
      setProduct(data)
    }
    fetchProduct();

  },[productId])

  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src={product && product['image']} alt={product && product['name']} fluid />
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product && product['name']}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product && product['rating']}
                text={`${product && product['numReviews']} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product && product['price']}</ListGroup.Item>
            <ListGroup.Item>Description: {product && product['description']}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product && product['price']}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    <strong>
                      {product && product['countInStock'] > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={product && product['countInStock'] === 0}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
