import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useDeliverOrderMutation, useGetOrderDetailsQuery, useGetPayPalClientIdQuery, usePayOrderMutation } from "../slices/orderApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PayPalButtons, SCRIPT_LOADING_STATE, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const OrderScreen = () => {
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

  const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();
  const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();
  const [{isPending}, paypalDispatch] = usePayPalScriptReducer();
  const {data: paypal, isLoading:loadingPaypal, error: errorPaypal} =  useGetPayPalClientIdQuery('');

  const {userInfo} =useSelector((state:any)=> state.auth)

  useEffect(()=>{
    if(!errorPaypal && !loadingPaypal && paypal.clientId){
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'clientId':paypal.clientId,
            currency: 'USD',
          }
        });
        paypalDispatch({type: 'setLoadingStatus', value: SCRIPT_LOADING_STATE.PENDING})

      }
      if(order && !order.paid) {
        if(!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPaypal, errorPaypal])

  async function onApproveTest() {
    await payOrder({orderId, details:{payer: {} }});
    refetch();
    toast.success("Payment successful")

  }

  function onApprove(data:any,actions:any) {
    return actions.order.capture().then(async function (details:any) {
      try {
        await payOrder({orderId, details}).unwrap();
        refetch();
        toast.success("Payment successful")

      }catch(err) {
        toast.error('Error')
      }
    })
  }

  function createOrder(data: any,actions:any) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice,
          },
        }
      ]
    }).then((orderId:any) => {
      return orderId
    })
  }
  function onError(err:any) {
    toast.error(err.message)
    
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order delivered")
    }catch(error) {
      toast.error("Error in order screen")
    }
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">
    {error}
  </Message>
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
                    {!order.isPaid && (
                      <ListGroup.Item>
                        {loadingPay && <Loader />}
                        {isPending ? <Loader /> : (
                          <div>

                          
                            {/* <Button onClick={onApproveTest} style={{marginBottom:'10px'}}>
                              Text Pay Order
                              </Button> */}
                              <div>
                              <PayPalButtons
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onError}

                              >

                              </PayPalButtons>

                              </div>
                        
                              </div>
                        )}
                      </ListGroup.Item>
                    )}
                    {/* { MARK AS DELEVERED  PLACEHOLDER} */}
                    {loadingDeliver  && <Loader /> }
                    {userInfo && userInfo.isAdmin && order.isPaid && 
                    !order.isDelivered && (
                      <ListGroup.Item>
                        <Button type="button" className="btn btn-block"
                        onClick={deliverOrderHandler}
                        >
                          Mark As Delivered
                        </Button>
                      </ListGroup.Item>
                    )
                    }
                </ListGroup>
            </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
