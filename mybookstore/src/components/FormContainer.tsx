import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import image from '../assets/bg4.jpg';
import image2 from '../assets/bg5.jpg';
import image3 from '../assets/bg1.jpg';
import image4 from '../assets/bg2.jpg';
import image5 from '../assets/bg3.jpg';

const FormContainer = ({children} :any) => {
  const [backgroundImage, setBackgroundImage] = useState('../assets/booksbackground.jpg');
  const backgroundImages = [
    image,
    image2,
    image3,
    image4,
    image5
  ];
  const changeBackground = () => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBackgroundImage(backgroundImages[randomIndex]);
  };

  useEffect(() => {
    // Change the background image every 5 seconds (5000 milliseconds)
    const interval = setInterval(changeBackground, 2000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  return (
    <Container  style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', borderRadius:'10px'}}>
        <Row className='justify-content-md-center pb-5'>
            <Col xs={12} md={6}>
                {children}
            </Col>        
            </Row>

    </Container>
  )
}

export default FormContainer
