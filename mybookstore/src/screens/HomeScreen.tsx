import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsAPISlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useParams } from "react-router";
import Paginate from "../components/Paginate";
import { Link } from "react-router-dom";
import ProductCorousel from "../components/ProductCorousel";
import { useSelector } from "react-redux";
import OnlineStatusChecker from "../utils/OnlineStatusChecker";

const HomeScreen = () => {

  const {pageNumber, keyword} = useParams();

  const {data, isLoading, error} = useGetProductsQuery({keyword, pageNumber});
  const {isOnline} = useSelector((state:any)=> state.status);
  return (
    <>
    {!isOnline ? (
      <OnlineStatusChecker />
    ) : (
      <>
        <OnlineStatusChecker />
        {!keyword ? (
          <ProductCorousel />
        ) : (
          <Link to={'/'} className="btn btn-light mb-4">
            Go Back
          </Link>
        )}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>Something went wrong, Please refresh the page</Message>
        ) : (
          <>
            <h1>Latest Products</h1>
            <Row>
              {data.products && data.products.map((product:any) => (
                <Col key={product && product['_id']} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
            <Paginate
              pages={data.pages}
              page={data.page}
              keyword={keyword ? keyword : ''}
            />
          </>
        )}
      </>
    )}
  </>
  );
};

export default HomeScreen;