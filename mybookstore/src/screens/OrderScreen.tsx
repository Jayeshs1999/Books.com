import React, { useEffect } from "react";
import { useParams } from "react-router";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
} from "../slices/orderApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  PayPalButtons,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import sendEmail from "../utils/sendEmail";

const OrderScreen = () => {
  const apiKey = process.env.REACT_APP_PUBLIC_ID;

  // enum SCRIPT_LOADING_STATE {
  //   PENDING = 'pending',
  //   LOADED = 'loaded',
  //   ERROR = 'error',
  // }
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPaypal,
    error: errorPaypal,
  } = useGetPayPalClientIdQuery("");

  const { userInfo } = useSelector((state: any) => state.auth);
  useEffect(() => emailjs.init(`UGWfAbgi4R_2THHA0`), []);

  useEffect(() => {
    if (!errorPaypal && !loadingPaypal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            clientId: paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      };
      if (order && !order.paid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPaypal, errorPaypal]);

  async function onApproveTest(e:any) {
    e.preventDefault();
    const isPaidSuccessfully = await payOrder({ orderId, details: { email_address: userInfo.email , payer: {} } });
    localStorage.removeItem('cart')
    refetch();
    toast.success("Payment successful");
    try {
      if('data' in isPaidSuccessfully) {
        const updatedData = isPaidSuccessfully && isPaidSuccessfully?.data?.updatedAt;
        const paymentMethod =  'Cash On Delivery';
        const address = `${isPaidSuccessfully?.data.shippingAddress?.address} 
        ${isPaidSuccessfully?.data.shippingAddress?.postalCode} ${isPaidSuccessfully?.data.shippingAddress?.city} 
        ${isPaidSuccessfully?.data.shippingAddress?.state} ${isPaidSuccessfully?.data.shippingAddress?.country} `

        //Reciever email here


        sendEmail({
          name: userInfo.name,
          email: userInfo.email,
          senderName: "BookBucket",
          titleMessage: `Congratulations!, ${userInfo.name}`,
          message: 'Congratulations! Your order has been confirmed successfully. we will deliver your order soon.',
          subMessage: 'Order Summary',
          otp:'',
          currentDate: `Current Date: ${updatedData}`,
          paymentMethod: `Payment method: ${paymentMethod}`,
          shippingAddress: `Shipping Address: ${address}`,
        });

        //Sender email here
         await emailjs.send(`${process.env.REACT_APP_SERVICE_ID}`, `${process.env.REACT_APP_SENDER_TEMPLATE_ID}`, {
          name:"Admin BookBucket",
           recipient: 'jayesh.sevatkar10@gmail.com',
           orderMadeBy: userInfo.name,
           whoMakeOrder: userInfo.email,
           currentDate: updatedData,
           paymentMethod: paymentMethod,
           shippingAddress : address

         },`${process.env.REACT_APP_PUBLIC_ID}`);
      }
    } catch (error) {
      console.log("error",error);
    }
  }

  function onApprove(data: any, actions: any) {
    return actions.order.capture().then(async function (details: any) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        if(order.paymentMethod==='CashOnDelivery'){
          toast.success("Thank You! Your order confirm successfully ");
        }
        toast.success("Payment successful");
      } catch (err) {
        toast.error("Error");
      }
    });
  }

  function createOrder(data: any, actions: any) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId: any) => {
        return orderId;
      });
  }
  function onError(err: any) {
    toast.error(err.message);
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order delivered");
    } catch (error) {
      toast.error("Error in order screen");
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
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
                <strong>Method:&nbsp;&nbsp;</strong>
                 {order.paymentMethod}
              </p>
              {order.paymentMethod==='CashOnDelivery' &&
               order.isPaid ? <Message variant="success">Order Confirm! </Message>:
               <Message variant="danger">Order Not Confirm (click on Place order button to confirm ) </Message>
              }
              { order.paymentMethod==='paypal' && ( order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>)
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item: any, index: any) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} * Rs.{item.price} = Rs.{item.qty * item.price}
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
                  <Col>Rs.{order.itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>Shipping</Col>
                  <Col>Rs.{order.shippingPrice}</Col>
                </Row>
                <Row>
                  <Col>Tax</Col>
                  <Col>Rs.{order.taxPrice}</Col>
                </Row>
                <Row>
                  <Col>Total</Col>
                  <Col>Rs.{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* { PAY ORDER PLACEHOLDER} */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      <Button
                        onClick={(e)=> onApproveTest(e)}
                        style={{ marginBottom: "10px" }}
                      >
                        Cash On Delivery Pay Order
                      </Button>
                      {/* <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div> */}
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {/* { MARK AS DELEVERED  PLACEHOLDER} */}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverOrderHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
