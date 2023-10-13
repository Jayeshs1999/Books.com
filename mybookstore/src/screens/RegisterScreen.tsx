import React, { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Card, Col, Form, FormGroup, Modal, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import generateOTP from "../utils/generateOtp";
import CryptoJS from "crypto-js";
import sendEmail from "../utils/sendEmail";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationCodeCorrect, setIsVerificationCodeCorrect] =
    useState(false);
  const [isFormDateDisabled, setIsFormDateDisabled] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state: any) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  const passwordPattern = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{8,}$/;

  useEffect(() => {
    if (email !== "" && name !== "" && password !== "" && confirmPassword !== "") {
      setIsFormDateDisabled(false);
    } else {
      setIsFormDateDisabled(true);
    }
  }, [name, email, password, confirmPassword]);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else if (password.match(passwordPattern)) {
      try {
        setShowVerificationPopup(true);

        //encrypt id using private key
        const otp = generateOTP();
        const ciphertext = CryptoJS.AES.encrypt(
          String(otp),
          `${process.env.ENCRYPTION_KEY}`
        ).toString();
        localStorage.setItem("bookBucketId", ciphertext);
        const otpSendSuccessfully = sendEmail({
          name: name,
          email: email,
          senderName: "BookBucket",
          titleMessage: "BookBucket Verify OTP",
          message: "Please Verify OTP",
          subMessage: "",
          otp: otp,
          currentDate: "",
          paymentMethod: "",
          shippingAddress: "",
        });
        if ((await otpSendSuccessfully).status) {
          toast.success("OTP Sent Successfully");
        }
      } catch (error) {
        console.log("error", error);
      }
    } else {
      toast.error("Password must contain number,char, sybmol Ex. book&100");
    }
  };

  const handleCloseVerificationPopup = () => {
    setShowVerificationPopup(false);
    setIsVerificationCodeCorrect(false);
  };

  const handleVerificationSubmit = async (e: any) => {
    e.preventDefault();

    //deycrypt id using private key
    const bytes = CryptoJS.AES.decrypt(
      String(localStorage.getItem("bookBucketId")),
      `${process.env.ENCRYPTION_KEY}`
    );
    const originalKey = bytes.toString(CryptoJS.enc.Utf8);

    // Replace this with your verification logic
    // For this example, we assume the correct code is "1234"
    if (verificationCode === originalKey) {
      toast.success("OTP Verified Successfully!");
      localStorage.removeItem("bookBucketId");
      setIsVerificationCodeCorrect(true);
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Register Successfully");
        navigate(redirect);
      } catch (error: any) {
        toast.error(error?.data?.message || error.error);
      }
      setShowVerificationPopup(false);
    } else {
      toast.error("OTP is not match");
    }
  };

  return (
    <>
      <FormContainer comesfrom='true'>
      <Card className="mt-5" style={{display:'flex', borderRadius:'10px'}}>
      <Card.Body>
        <h1 className="text-center">Sign Up</h1>
        <Form onSubmit={submitHandler}>
          <FormGroup controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </FormGroup>

          <FormGroup controlId="email" className="my-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </FormGroup>

          <FormGroup controlId="password" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </FormGroup>

          <FormGroup controlId="confirmPassword" className="my-3">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </FormGroup>

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || isFormDateDisabled}
            className="mt-2 w-100"
          >
            Register
          </Button>

          {isLoading && <Loader />}
        </Form>
        </Card.Body>
        <Row className="py-3 text-center">
          <Col>
            Already have an account?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Login
            </Link>
          </Col>
        </Row>
        </Card>
      </FormContainer>
      <Modal
        show={showVerificationPopup}
        onHide={handleCloseVerificationPopup}
        backdrop="static" // This prevents closing when clicking outside the modal
        keyboard={false} // This prevents closing when pressing the Esc key
      >
        <Modal.Header closeButton>
          <Modal.Title>Email Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isVerificationCodeCorrect ? (
            <p>Verification successful!</p>
          ) : (
            <>
              <p>
                Please enter the 4-digit verification code sent to your email.
              </p>
              <Form onSubmit={handleVerificationSubmit}>
                <Form.Group controlId="verificationCode">
                  <Form.Control
                    type="text"
                    placeholder="Enter code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={4}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-4">
                  Verify
                </Button>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RegisterScreen;
