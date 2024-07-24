import React from "react";
import { useGetTopProductsQuery } from "../slices/productsAPISlice";
import Message from "./Message";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import bookBucket from "../assets/bookbucket.png";


const ProductCorousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery("");
  return isLoading ? (
    <></>
  ) : error ? (
    <Message variant="danger">
      Failed to load Corousel, Please refresh the page
    </Message>
  ) : (
    <Carousel pause="hover" className="bg-error mb-4 carousel-background">
      {/* {products &&
        products.map((product: any) => (
          <Carousel.Item key={product._id} className="custom-carousel-item">
            <Link to={`product/${product._id}`}>
              <Image 
                src={product.image}
                alt={product.name}
                className="custom-image"
              />
              
              <Carousel.Caption className="carousel-caption">
                <h2>
                  {product.name} (Rs.{product.price})
                </h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))} */}
       
          <Carousel.Item  className="custom-carousel-item">
            <Link to={`#`}>
              <Image 
                src={bookBucket}
                alt={'bookbucket-banner'}
                className="custom-image"
              />
              
              {/* <Carousel.Caption className="carousel-caption">
                <h2>
                  {product.name} (Rs.{product.price})
                </h2>
              </Carousel.Caption> */}
            </Link>
          </Carousel.Item>
    </Carousel>
  );
};

export default ProductCorousel;
