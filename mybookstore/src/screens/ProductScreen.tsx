import {useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Card, Col, Form, FormLabel, Image, ListGroup, Row } from "react-bootstrap";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useCreateReviewMutation, useGetProductDetailsQuery } from "../slices/productsAPISlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";
import Meta from "../components/Meta";

const ProductScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] =useState(1);
  const { id: productId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);


  const [createReview, {isLoading: LoadingProductReview}] = useCreateReviewMutation();

  const {userInfo} = useSelector((state:any)=>state.auth)

  const addToCartHandler =() => {
    dispatch(addToCart({...product, qty}));
    navigate('/cart')
  }

  const submitHandler = async (e:any) => {
    e.preventDefault();
    try {
      await createReview({productId,rating,comment}).unwrap();
      refetch()
      toast.success("Review Submitted");
      setRating(0);
      setComment('')

    }catch(err) {
      toast.error("Error in prodcut screen")
    }
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
        <>
          <Meta title={product.name} />
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
        <Row className="review">
          <Col md={6}>
            <h2>Reviews</h2>
            {product.reviews.length===0 && <Message>No Reviews</Message>}
            <ListGroup variant="flush">
              {product.reviews.map((review:any)=>(
                <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} />
                  <p>{review.createdAt.substring(0,10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}

              <ListGroup.Item>
                <h2>Write a Customer Review</h2>
                {LoadingProductReview && <Loader />}
                {userInfo ? (<Form onSubmit={submitHandler}>
                  <Form.Group controlId="rating" className="my-2">
                    <FormLabel>Rating</FormLabel>
                    <Form.Control 
                    as='select'
                    value={rating}
                    onChange={(e)=> setRating(Number(e.target.value))}
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>

                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="comment" className="my-2">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                    >  
                    </Form.Control>
                  </Form.Group>
                  <Button 
                  disabled={LoadingProductReview}
                  type="submit"
                  variant="primary"
                  >
                    Submit
                  </Button>
                </Form>) : (
                  <Message>Please <Link to={'/login'}>Sing in</Link> to write a review</Message>
                )}
              </ListGroup.Item>
            </ListGroup>

          </Col>
        </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
