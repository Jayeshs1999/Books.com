import React from "react";
import { useParams } from "react-router";
import { useGetOrderDetailsQuery } from "../slices/orderApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger" />
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>

              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
                {order.isPaid ? (
                <Message variant="success">
                  Paid on {order.paidAt}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}

            </ListGroup.Item>
            <ListGroup.Item>
                <h2>Order Ites</h2>
                {order.orderItems.map((item:any,index:any)=>(
                    <ListGroup.Item key={index}>
                        <Row>
                            <Col md={1}>
                                <Image src={item.image} alt={item.name} fluid rounded />
                            </Col>
                            <Col>
                                <Link to={`/product/${item.product}`}>
                                {item.name}
                                </Link>   
                            </Col>
                            <Col md={4}>
                          {item.qty} * ${item.price} = ${item.qty * item.price}
                        </Col>
                        </Row>
                    </ListGroup.Item>
                ))}

            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
            <Card>
                <ListGroup>
                    <ListGroup.Item>
                        <h2>Order Summary</h2>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Items</Col>
                            <Col>${order.itemsPrice}</Col>
                        </Row>
                        <Row>
                            <Col>Shipping</Col>
                            <Col>${order.shippingPrice}</Col>
                        </Row>
                        <Row>
                            <Col>Tax</Col>
                            <Col>${order.taxPrice}</Col>
                        </Row>
                        <Row>
                            <Col>Total</Col>
                            <Col>${order.totalPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    {/* { PAY ORDER PLACEHOLDER} */}
                    {/* { MARK AS DELEVERED  PLACEHOLDER} */}
                </ListGroup>
            </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
