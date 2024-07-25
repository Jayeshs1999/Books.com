import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CheckoutSteps from "../components/CheckoutSteps";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import Message from "../components/Message";
import { Link } from "react-router-dom";
import { useCreateOrderMutation } from "../slices/orderApiSlice";
import Loader from "../components/Loader";
import { clearCartItems } from "../slices/cartSlice";
import { toast } from "react-toastify";
import { t } from "i18next";

const PlaceOrdersScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {      
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        email_address: userInfo.email,    
      }).unwrap();
      dispatch(clearCartItems([]));
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error("Error");
    }
  };
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>{t("shipping_address")}</h2>
              <p>
                <strong>{t("address")} :&nbsp;&nbsp;</strong>
                {cart.shippingAddress.address},{cart.shippingAddress.city},
                {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
              </p>
              <p>
                <strong>{'Phone Number'} :&nbsp;&nbsp;</strong>
                {cart.shippingAddress.phoneNumber}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>{t("payment_method")}</h2>
              <strong>&nbsp;</strong>
              {cart.paymentMethod},
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>{t("order_items")}</h2>
              {cart.cartItems.length === 0 ? (
                <Message>{t("your_cart_is_empty")}</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item: any, index: number) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          ></Image>
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} * {t("rupees")} {item.price} ={" "}
                          {t("rupees")} {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>{t("order_summary")}</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col> {t("items")}:</Col>
                  <Col> Rs.{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col> {t("shipping_charges")}:</Col>
                  <Col>
                    {" "}
                    {t("rupees")} {cart.shippingPrice}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col> {t("tax")}:</Col>
                  <Col>
                    {" "}
                    {t("rupees")} {cart.taxPrice}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col> {t("total")}:</Col>
                  <Col>
                    {" "}
                    {t("rupees")} {cart.totalPrice}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems.length === 0 || isLoading}
                  onClick={placeOrderHandler}
                >
                  {t("continue")}
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrdersScreen;
