import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsAPISlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useParams } from "react-router";
import Paginate from "../components/Paginate";
import { Link } from "react-router-dom";
import ProductCorousel from "../components/ProductCorousel";

const HomeScreen = () => {

  const {pageNumber, keyword} = useParams();

  const {data, isLoading, error} = useGetProductsQuery({keyword, pageNumber});
  return (
    <>

    {!keyword ? <ProductCorousel/> : <Link to={'/'} className="btn btn-light mb-4">go Back</Link>}
    {isLoading ? (<Loader/>): error? (<Message variant='danger'>Something Went Wrong</Message>) :(
      <>
      <h1>Latest Product</h1>
      <Row>
        {data.products && data.products.map((product:any) => (
          <Col key={product && product['_id']} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
      <Paginate
      pages= {data.pages}
      page={data.page}
      keyword= {keyword ? keyword: ''}
      />
      </>
    )}
    </>
  );
};

export default HomeScreen;