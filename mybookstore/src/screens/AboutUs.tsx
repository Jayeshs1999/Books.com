import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const AboutUs = () => {
  return (
    <section id="about-us">
      <Container>
        <h2>About Us</h2>
        <Row>
          <Col md={6}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/bookbucket-5253e.appspot.com/o/images%2Fimage.jpeg?alt=media&token=68e004c3-4070-449c-b4a6-1ed50a707f5c&_gl=1*279wwo*_ga*MzcyMzM2MzI5LjE2OTI0NTY4ODU.*_ga_CW55HF8NVT*MTY5NzE5MDE5NC4xOC4xLjE2OTcxOTA0MTYuMjAuMC4w" // Replace with your image URL
                alt="About Us"
                className="img-fluid rounded-circle"
                style={{
                  boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)",
                }}
              />
              <h4 className="pt-3">Founder</h4>
              <h3>Jayesh k. Sevatkar</h3>
            </div>
          </Col>
          <Col md={6}>
            <h3>Welcome to our BookBucket.Com</h3>
            <h4>Contact us</h4>
            <p>+91 8888585093</p>
            <p>jayeshsevatkar55@gmail.com</p>
            <h4>Why we are here</h4>

            <p>
              We're passionate about bringing the joy of reading to book
              enthusiasts everywhere. Our bookshop offers a wide selection of
              both new and gently used books at affordable prices. Whether
              you're an avid reader or just looking for your next great read, we
              have something for everyone.
            </p>
            <p>
              We take pride in our work and always strive for excellence.
              Whether it's developing innovative solutions, providing top-notch
              customer support, or contributing to our community, we are
              committed to making a positive impact.
            </p>

            <h3>No Delivery Charges or Tax/GST</h3>
            <p>
              At our bookshop, we believe in making reading accessible to all.
              That's why we offer free delivery on all orders, and there are no
              hidden charges or taxes. Your total cost is what you see at
              checkout. Enjoy your book shopping experience without any
              surprises.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutUs;
