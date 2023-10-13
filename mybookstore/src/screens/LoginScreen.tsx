import React, { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state: any) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error: any) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <FormContainer comesfrom='true'>
      <Card className="mt-5" style={{ display: "flex", borderRadius: "10px" }}>
        <Card.Body>
          <h1 className="text-center">Sign In</h1>
          <Form onSubmit={submitHandler}>
            <FormGroup controlId="email" className="my-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>

            <FormGroup controlId="password" className="my-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>
            <div className="text-center">
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="mt-2 w-100"
              >
                Sign In
              </Button>
              <div style={{ display: "flex", justifyContent: "end", marginTop:'5px' }}>
                <Link to={"/forgetpassword"} className="text-end">
                  Forget Password
                </Link>
              </div>
            </div>

            {isLoading && <Loader />}
          </Form>
        </Card.Body>

        <Row className="py-3">
          <Col className="text-center">
            New User?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              Register
            </Link>
          </Col>
        </Row>
      </Card>
    </FormContainer>
  );
};

export default LoginScreen;
