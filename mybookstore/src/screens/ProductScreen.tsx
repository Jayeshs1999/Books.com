import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Form,
  FormLabel,
  Image,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  useCreateReviewMutation,
  useGetProductDetailsQuery,
} from "../slices/productsAPISlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";
import Meta from "../components/Meta";
import OnlineStatusChecker from "../utils/OnlineStatusChecker";
import { useTranslation } from "react-i18next";

const ProductScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const { id: productId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);
  const { isOnline } = useSelector((state: any) => state.status);

  const [createReview, { isLoading: LoadingProductReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state: any) => state.auth);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate(`/cart?comesFrom=productDetails&productId=${productId}`);
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review Submitted");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error("Review already submitted");
    }
  };

  const handleCloseVerificationPopup = () => {
    setShowVerificationPopup(false)
  };

  const openReviewPopup = () => {
    setShowVerificationPopup(true);
  }

  return (
    <>
      {!isOnline ? (
        <OnlineStatusChecker />
      ) : (
        <>
          <OnlineStatusChecker />
          <Link to="/" className="btn btn-light my-3">
            {t('go_back')}
          </Link>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{t('something_went_wrong_please_refresh_the_page')}</Message>
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
                      {t('price')}: {t('rupees')} {product && product["price"]}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      {t('description')}: {product && product["description"]}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={3}>
                  <Card>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <Row>
                          <Col>{t('price')}:</Col>
                          <Col>
                            <strong>{t('rupees')} {product && product["price"]}</strong>
                          </Col>
                        </Row>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <Row>
                          <Col>{t('status')}:</Col>
                          <Col>
                            <strong>
                              {product && product["countInStock"] > 0
                                ? t('in_stock')
                                : t('out_of_stock')}
                            </strong>
                          </Col>
                        </Row>
                      </ListGroup.Item>

                      {product.countInStock > 0 && (
                        <ListGroup.Item>
                          <Row>
                            <Col>{t('qty')}</Col>
                            <Col>
                              <Form.Control
                                as="select"
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                              >
                                {[...Array(product.countInStock).keys()].map(
                                  (x) => (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  )
                                )}
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
                          {t('add_to_cart')}
                        </Button>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>
              </Row>
              <Row className="review">
                <Col md={6}>
                  <h2>Reviews</h2>
                  {product.reviews.length === 0 && (
                    <Message>No Reviews</Message>
                  )}
                  <ListGroup variant="flush">
                    {product.reviews.length > 0 && (
                      <ListGroup.Item key={product.reviews[0]._id}>
                        <strong>{product.reviews[0].name}</strong>
                        <Rating value={product.reviews[0].rating} />
                        <p>{product.reviews[0].createdAt.substring(0, 10)}</p>
                        <p>{product.reviews[0].comment}</p>
                      </ListGroup.Item>
                    )}
                    {product.reviews.length > 1 && <Button
                      type="submit"
                      variant="danger"
                      onClick={openReviewPopup}
                    >
                      See all reviews
                    </Button>}

                    <ListGroup.Item>
                      <h2>{t('write_a_customer_review')}</h2>
                      {LoadingProductReview && <Loader />}
                      {userInfo ? (
                        <Form onSubmit={submitHandler}>
                          <Form.Group controlId="rating" className="my-2">
                            <FormLabel>{t('rating')}</FormLabel>
                            <Form.Control
                              as="select"
                              value={rating}
                              onChange={(e) =>
                                setRating(Number(e.target.value))
                              }
                            >
                              <option value="">{t('select')}...</option>
                              <option value="1">1 - {t('poor')}</option>
                              <option value="2">2 - {t('fair')}</option>
                              <option value="3">3 - {t('good')}</option>
                              <option value="4">4 - {t('very_good')}</option>
                              <option value="5">5 - {t('excellent')}</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="comment" className="my-2">
                            <Form.Label>{t('comment')}</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                          <Button
                            disabled={LoadingProductReview}
                            type="submit"
                            variant="primary"
                          >
                            {t('submit')}
                          </Button>
                        </Form>
                      ) : (
                        <Message>
                          Please <Link to={"/login"}>Sign in</Link> to write a
                          review
                        </Message>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>

              {/* Drawer  */}
              <Modal  size='lg'
                show={showVerificationPopup}
                onHide={handleCloseVerificationPopup}
              >

                <Modal.Header closeButton>
                  <Modal.Title>Reviews</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{height:'60vh', overflow:'auto'}}>
                  <>
                  <Row>
                    <Col>
                    {product.reviews.map((review: any,index:number) => (
                      <ListGroup.Item key={review._id}>
                        <div style={{display:'flex',}}>
                          <div>
                            <strong>{index+1}.</strong>&nbsp;
                          </div>
                          <div>
                          <strong>{review.name}</strong>
                        <Rating value={review.rating} />
                        <p>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>

                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                    </Col>
                  </Row>
                    
                  </>
                </Modal.Body>
              </Modal>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ProductScreen;
