import React from "react";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Message from "../components/Message";
import { Link, useSearchParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { useTranslation } from "react-i18next";

const CartScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const cart = useSelector((state: any) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product: any, qty: any) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandle = async (id: number) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <Link
        to={`${
          searchParams.get("comesFrom") === "productDetails"
            ? `/product/${searchParams.get("productId")}`
            : `/`
        }`}
        className="btn btn-light my-3"
      >
        {t("go_back")}
      </Link>
      <Row>
        <Col md={8}>
          <h1 style={{ marginBottom: "20px" }}>{t("shopping_cart")}</h1>
          {cartItems.length === 0 ? (
            <Message>
              {t("your_cart_is_empty")}
              <Link to="/"> {t("go_back")}</Link>
            </Message>
          ) : (
            <>
              <ListGroup variant="flush">
                {cartItems.map((item: any) => (
                  <ListGroup.Item
                    key={item._id}
                    style={{ backgroundColor: "#f4f4f4" }}
                  >
                    <Row>
                      <Col md={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </Col>
                      <Col md={2}>
                        {t("rupees")} {item.price}
                      </Col>
                      <Col md={2}>
                        <Form.Control
                          as="select"
                          value={item.qty}
                          onChange={(e) =>
                            addToCartHandler(item, Number(e.target.value))
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => removeFromCartHandle(item._id)}
                        >
                          <FaTrash />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>
                  {t("sub_total")} (
                  {cartItems.reduce((acc: any, item: any) => acc + item.qty, 0)}
                  ) {t("items")}
                </h2>
                {t("rupees")}
                {cartItems
                  .reduce(
                    (acc: any, item: any) => acc + item.qty * item.price,
                    0
                  )
                  .toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </Button>
              </ListGroup.Item>
              {/* <h1 style={{ color: "red" }}>
                Sorry Currently Webiste is in Development Phase. Very soon we
                will inform you
              </h1> */}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CartScreen;
