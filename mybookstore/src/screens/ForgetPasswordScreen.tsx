import React, { useEffect, useState } from 'react'
import FormContainer from '../components/FormContainer'
import { Button, Card, Col, Form, FormGroup, Row } from 'react-bootstrap'
import { useCheckUserExistMutation, useForgetPasswordMutation } from '../slices/usersApiSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import generateOTP from '../utils/generateOtp';
import CryptoJS from "crypto-js";
import sendEmail from '../utils/sendEmail';

const ForgetPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);
  const navigate = useNavigate();
  const [isFormDateDisabled, setIsFormDateDisabled] = useState(true);
  const passwordPattern = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{8,}$/;
  const [verificationCode, setVerificationCode] = useState("");

  const [checkUserExist, {isLoading,error}] = useCheckUserExistMutation();
  const [forgetPassword, {isLoading: submitButtonLoading,error:forgetPasswordError}] = useForgetPasswordMutation();
  const submitHandler = async(e:any) => {
    e.preventDefault();
    const checkEmail = await checkUserExist({email}).unwrap();
    if(checkEmail.email!==''){
      setCheckEmail(true)
      const otp = generateOTP();
      const ciphertext = CryptoJS.AES.encrypt(
        String(otp),
        `${process.env.ENCRYPTION_KEY}`
      ).toString();
      localStorage.setItem("forgetPasswordOtp", ciphertext);
      const otpSendSuccessfully = sendEmail({
        name:'Dear',
        email: email,
        senderName: "BookBucket",
        titleMessage: "BookBucket Verify OTP",
        message: "Please Confirm OTP",
        subMessage: "",
        otp: otp,
        currentDate: "",
        paymentMethod: "",
        shippingAddress: "",
      });
      if ((await otpSendSuccessfully).status) {
        toast.success("OTP Sent Successfully");
      }else {
        toast.error("OTP Sent Failed");
      }
    }else {
      setCheckEmail(false)
    }
  }

  const handleUpdatePassword = async (e:any) => {
    e.preventDefault();
     //deycrypt id using private key
     const bytes = CryptoJS.AES.decrypt(
      String(localStorage.getItem("forgetPasswordOtp")),
      `${process.env.ENCRYPTION_KEY}`
    );
    const originalKey = bytes.toString(CryptoJS.enc.Utf8);
    if(password.match(passwordPattern)) {
      if(verificationCode===originalKey){
        try {
          await forgetPassword({email,password})
          toast.success("Password change successfully")
          localStorage.removeItem('forgetPasswordOtp')
          navigate('/login')
        }catch(error) {
          toast.error("Something went wrong")
        }

      }else {
        toast.error("Please Enter valid OTP")
      }
    }else {
        toast.error("Password should contain 0-9,a-z,!,@,# ")
    }
  }

  useEffect(() => {
    if (email !== "" && password !== "") {
      setIsFormDateDisabled(false);
    } else {
      setIsFormDateDisabled(true);
    }
  }, [email, password, verificationCode]);

  return (
    <FormContainer comesfrom='true'>
    <Card className="mt-5" style={{display:'flex', borderRadius:'10px'}}>
      <Card.Body>
        <h1 className="text-center">Forget password</h1>
        <Form>
          <FormGroup controlId="email" className="my-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              readOnly={checkEmail}
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>

          {checkEmail && <>
            <Form.Group controlId="verificationCode">
            <Form.Label style={{color:'green', fontWeight:'bold'}}>OTP sended to your email account</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={4}
                  />
                </Form.Group>
          
          <FormGroup controlId="password" className="my-3">
            <Form.Label>Add new password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          {submitButtonLoading ? <Loader />: forgetPasswordError? (<Message variant='danger'>Something went wrong</Message>):''}
          <Button 
            type="button"
            variant="primary"
            disabled={isFormDateDisabled || submitButtonLoading}
            onClick={handleUpdatePassword}
            className="mt-2 w-100"
          >
            Submit
          </Button>
          </> 
          }
          <div className="text-center">
            {isLoading ? <Loader />: error? (<Message variant='danger'>Something went wrong</Message>):''}
          {!checkEmail && <Button 
            type="button"
            variant="primary"
            disabled= {isLoading}
            onClick={submitHandler}
            className="mt-2 w-100"
          >
            Verify email
          </Button>}
          </div>
        </Form>
      </Card.Body>
      <Row className="py-3">
          <Col className="text-center">
            Back to &nbsp;
            <Link
              to={"/login"}
            >
              Login
            </Link>
          </Col>
        </Row>
    </Card>
  </FormContainer>
  )
}

export default ForgetPasswordScreen
