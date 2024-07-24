import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Rating from "./Rating";
import { t } from "i18next";
import useDeviceType from "../utils/DeviceType";
import './Product.css';

const Product = ({ product }: any) => {
    // return (
    //   <div>
    //     <Card className="my-3 p-3 rounded card-background-gradient" style={{display:'flex', flexDirection:'column', height:'100%'}}>
    //       <div>
            
    //       <Link to={`/product/${product._id}`}>
         
    //         <Card.Img src={product.image || 'https://firebasestorage.googleapis.com/v0/b/bookbucket-5253e.appspot.com/o/images%2F256x256.png?alt=media&token=60298d59-36d4-4965-9b05-3a9a9d219d93&_gl=1*yafxoz*_ga*MzcyMzM2MzI5LjE2OTI0NTY4ODU.*_ga_CW55HF8NVT*MTY5NzIwMTA1Mi4yMC4xLjE2OTcyMDEwNzguMzQuMC4w'} variant="top" style={{width:'100%', height:'200px', objectFit:'fill', borderRadius: '8px'}}></Card.Img>
    //       </Link>
    //       </div>
    //       <Card.Body>
    //         <Link to={`/product/${product._id}`}>
    //           <Card.Title as="div" className="product-title">
    //             <strong>{product.name}</strong>
    //           </Card.Title>
    //         </Link>
    //         <Card.Text as="div">
    //           <Rating
    //             value={product.rating}
    //             text={`${product.numReviews}`}
    //             reviews
    //           ></Rating>
    //         </Card.Text>
    //         <Card.Text as="h3">{t('rupees')} {product.price}</Card.Text>
    //       </Card.Body>
    //     </Card>
    //   </div>
    // );

    const deviceType = useDeviceType();
    const navigate = useNavigate();

    const handleClick = () => {
      navigate(`/product/${product._id}`)
    }
  return (
    <div
      className="gold-card"
      style={{
        cursor: "pointer",
        width: deviceType === "mobile" ? "initial" : "300px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        transition: "transform 0.3s ease",
        margin: deviceType === "mobile" ? "8px" : "20px",
      }}
      onClick={handleClick}
    >
      <img
        src={product.image}
        alt={product.name + "-image"}
        className="gold-card-image"
        style={{
          width: "100%",
          height: deviceType === "mobile" ? "110px" : "200px",
          objectFit: "fill",
        }}
      />
      <div className="gold-card-content">
        <h2
          className="gold-card-heading"
          style={{
            margin: "0",
            fontSize: deviceType === "mobile" ? "15px" : "24px",
            color: "#333",
          }}
        >
          {product.name?.length >= 20 ? `${product.name?.substring(0, 20)}...` : product.name}
        </h2>
        <Card.Text as="div">
              <Rating
                value={product.rating}
                text={`${product.numReviews}`}
                reviews
              ></Rating>
            </Card.Text>
            <p style={{marginBottom: deviceType==='mobile'? 0: '12px', fontSize: deviceType==='mobile'? '15px': '20px'  , fontWeight:'bold'}}>{t('rupees')} {product.price}</p>
           </div>
    </div>
  );
  };

export default Product;
