import React, { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import { Link } from "react-router-dom";

const ShippingScreen = () => {
  const [isContinueButtonDisabled, setIsContinueButtonDisabled] =
    useState(true);
  const countries = [{ name: "India", value: "India" }];
  const states = [{ name: "Maharashtra", value: "Maharashtra" }];
  const cities = [{ name: "Pune", value: "Pune" }];
  const cart = useSelector((state: any) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "Pune");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "India");
  const [state, setState] = useState(shippingAddress?.state || "Maharashtra");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e: any) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({ address, city, postalCode, country, state })
    );
    navigate("/payment");
  };
  useEffect(() => {
    if (
      address !== "" &&
      city !== "" &&
      postalCode !== "" &&
      country !== "" &&
      state !== ""
    ) {
      setIsContinueButtonDisabled(false);
    } else {
      setIsContinueButtonDisabled(true);
    }
  }, [address, city, state, postalCode,country]);

  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        Go To Home
      </Link>
      <FormContainer comesfrom='false'>
        <CheckoutSteps step1 step2 />
        <h1>Shipping Address</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="country" className="my-2">
            <Form.Label>Country</Form.Label>
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
            <Form.Label>State</Form.Label>
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
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
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
            <Form.Label>Postal code</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => {
                setPostalCode(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          {/* <Form.Group controlId='country' className='my-2'>
                <Form.Label>Country</Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter Country'
                value={country}
                onChange={(e)=>{setCountry(e.target.value)}}
                >
                </Form.Control>
            </Form.Group> */}

          <Button
            type="submit"
            disabled={isContinueButtonDisabled}
            variant="primary"
            className="my-2"
          >
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
