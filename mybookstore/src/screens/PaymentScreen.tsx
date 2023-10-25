import React, { useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { savePaymentMethod } from "../slices/cartSlice";
import { t } from "i18next";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("CashOnDelivery");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state: any) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitPaymentHandler = (e: any) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer comesfrom="false">
      <CheckoutSteps step1 step2 step3 />
      <h1>{t("payment_method")}</h1>
      <Form onSubmit={submitPaymentHandler}>
        <Form.Group>
          <Form.Label as={"legend"}>{t("select_method")}</Form.Label>
          <Col>
            {/* <Form.Check
              type="radio"
              className="my-2"
              label="Paypal or Credit Card"
              id="PayPal"
              name='paymentMethod'
              value="Paypal"
              checked
              onChange={(e) => {
                setPaymentMethod(e.target.value);
              }}
            ></Form.Check> */}

            {["radio"].map((type) => (
              <div key={`inline-radio`} className="mb-3">
                <Form.Check
                  inline
                  label={t("cash_on_delivery")}
                  name="group1"
                  checked
                  type="radio"
                  value="CashOnDelivery"
                  id={`inline-${type}-2`}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                  }}
                />
                <Form.Check
                  className="mt-2"
                  inline
                  disabled
                  label={t("paypal")}
                  type="radio"
                  id={`inline-radio-3`}
                />
              </div>
            ))}
          </Col>
        </Form.Group>
        <Button type="submit" variant="primary">
          {t("continue")}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
