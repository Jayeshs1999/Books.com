import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsAPISlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const HomeScreen = () => {

  const {data: products, isLoading, error} = useGetProductsQuery('');
  return (
    <>
    {isLoading ? (<Loader/>): error? (<Message variant='danger'>Something Went Wrong</Message>) :(
      <>
      <h1>Latest Product</h1>
      <Row>
        {products && products.map((product:any) => (
          <Col key={product && product['_id']} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row></>
    )}
    </>
  );
};

export default HomeScreen;

  // <h1>Latest Product</h1>
  //     <Row>
  //       {products && products.map((product) => (
  //         <Col key={product && product['_id']} sm={12} md={6} lg={4} xl={3}>
  //           <Product product={product} />
  //         </Col>
  //       ))}
  //     </Row>