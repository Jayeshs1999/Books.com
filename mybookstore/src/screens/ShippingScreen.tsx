import React, { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ShippingScreen = () => {
  const { t } = useTranslation();
  const digitPattern = /^\d*$/;
  const [isContinueButtonDisabled, setIsContinueButtonDisabled] =
    useState(true);
  const countries = [{ name: "India", value: "India" }];
  const states = [{ name: "Maharashtra", value: "Maharashtra" }];
  const cities = [{ name: "Pune", value: "Pune" }];
  const cart = useSelector((state: any) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "Pune");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress?.phoneNumber || ""
  );
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "India");
  const [state, setState] = useState(shippingAddress?.state || "Maharashtra");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (
      address !== "" &&
      city !== "" &&
      postalCode !== "" &&
      country !== "" &&
      state !== "" &&
      phoneNumber !== ""
    ) {
      setIsContinueButtonDisabled(false);
    } else {
      setIsContinueButtonDisabled(true);
    }
  }, [address, city, state, postalCode, country, phoneNumber]);

  const handlePhoneNumberChange = (e: any) => {
    const value = e.target.value;

    // Use a regular expression to match only digits
    const digitPattern = /^\d*$/;

    if (digitPattern.test(value) && value.length <= 10) {
      // If it contains only digits and is 10 characters or fewer, update the state
      setPhoneNumber(value);
    }
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (digitPattern.test(phoneNumber) && phoneNumber.length === 10) {
      dispatch(
        saveShippingAddress({
          address,
          city,
          postalCode,
          country,
          state,
          phoneNumber,
        })
      );
      navigate("/payment");
    } else {
      toast.error("Phone Number is Invalid");
    }
  };

  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        {t("go_to_home")}
      </Link>
      <FormContainer comesfrom="false">
        <CheckoutSteps step1 step2 />
        <h1>{t("shipping_address")}</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="country" className="my-2">
            <Form.Label>{t("country")}</Form.Label>
            <Form.Control
              as="select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.map((x) => (
                <option key={x.value}>{x.name}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="state" className="my-2">
            <Form.Label>{t("state")}</Form.Label>
            <Form.Control
              as="select"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              {states.map((x) => (
                <option key={x.value}>{x.name}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="city" className="my-2">
            <Form.Label>City</Form.Label>
            <Form.Control
              as="select"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              {cities.map((x) => (
                <option key={x.value}>{x.name}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="address" className="my-2">
            <Form.Label>{t("address")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("enter_address")}
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          {/* <Form.Group controlId='city' className='my-2'>
                <Form.Label>City</Form.Label>
                <Form.Control
                type='city'
                placeholder='Enter City'
                value={city}
                onChange={(e)=>{setCity(e.target.value)}}
                >
                </Form.Control>
            </Form.Group> */}

          <Form.Group controlId="postalCode" className="my-2">
            <Form.Label>{t("postal_code")}</Form.Label>
            <Form.Control
              type="number"
              placeholder={t("enter_pin_code")}
              value={postalCode}
              onChange={(e) => {
                setPostalCode(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="phonenumber" className="my-2">
            <Form.Label>{t("phone_number")}</Form.Label>
            <Form.Control
              type="number"
              placeholder={t("enter_phone_number")}
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            ></Form.Control>
          </Form.Group>
          <Button
            type="submit"
            disabled={isContinueButtonDisabled}
            variant="primary"
            className="my-2"
          >
            {t("continue")}
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
