import React from "react";
import { useGetTopProductsQuery } from "../slices/productsAPISlice";
import Message from "./Message";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCorousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery("");
  return isLoading ? (
    <></>
  ) : error ? (
    <Message variant="danger">Failed to load Corousel</Message>
  ) : (
    <Carousel pause="hover" className="bg-primary mb-4">
      {products &&
        products.map((product: any) => (
          <Carousel.Item key={product._id}>
            <Link to={`product/${product._id}`}>
              <Image src={product.image} alt={product.name} />
              <Carousel.Caption className="carousel-caption">
                <h2>
                  {product.name} (Rs.{product.price})
                </h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
    </Carousel>
  );
};

export default ProductCorousel;
