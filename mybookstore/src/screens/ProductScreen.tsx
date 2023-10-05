import {useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Card, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetProductDetailsQuery } from "../slices/productsAPISlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";

const ProductScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] =useState(1);
  const { id: productId } = useParams();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const addToCartHandler =() => {
    dispatch(addToCart({...product, qty}));
    navigate('/cart')
  }

  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {isLoading ? (
        <Loader/>
      ) : error ? (
        <Message variant='danger'>Something Went Wrong</Message>
      ) : (
        <Row>
          <Col md={5}>
            <Image
              src={product && product["image"]}
              alt={product && product["name"]}
              fluid
            />
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product && product["name"]}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product && product["rating"]}
                  text={`${product && product["numReviews"]} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>
                Price: ${product && product["price"]}
              </ListGroup.Item>
              <ListGroup.Item>
                Description: {product && product["description"]}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product && product["price"]}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      <strong>
                        {product && product["countInStock"] > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock> 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                      <Form.Control
                      as='select'
                      value= {qty}
                      onChange={(e)=>setQty(Number(e.target.value))}
                      >
                        {[...Array(product.countInStock).keys()].map((x)=>(
                          <option key={x+1} value={x+1}>
                            {x+1}
                          </option>
                        ))}
                      </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    type="button"
                    disabled={product && product["countInStock"] === 0}
                    onClick={addToCartHandler}
                  >
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;
