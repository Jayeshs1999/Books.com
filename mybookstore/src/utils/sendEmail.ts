import emailjs from "@emailjs/browser";

export interface sendEmailProps {
  name:string, 
  email:string,
  senderName:string,
  titleMessage:string,
  message:string,
  subMessage:string,
  otp:any,
  currentDate:any,
  paymentMethod:any,
  shippingAddress :any
}

const sendEmail = async ({name,email,senderName,titleMessage,message,subMessage,otp,currentDate,paymentMethod,shippingAddress }: sendEmailProps)=>{
  const data =  await emailjs.send(`${process.env.REACT_APP_SERVICE_ID}`, `${process.env.REACT_APP_RECEIVER_TEMPLATE_ID}`,
  {
    userName: name,
    recipient: email,
    senderName: senderName,
    titleMessage: titleMessage,
    message: message,
    subMessage: subMessage,
    emailOtp: otp,
    currentDate: currentDate,
    paymentMethod: paymentMethod,
    shippingAddress : shippingAddress
   },
   `${process.env.REACT_APP_PUBLIC_ID}`);

   return data;

}

export default sendEmail;

