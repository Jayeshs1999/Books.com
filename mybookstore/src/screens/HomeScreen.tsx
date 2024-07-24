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
import Meta from "../components/Meta";
import { useTranslation } from "react-i18next";
import useDeviceType from "../utils/DeviceType";

const HomeScreen = () => {
  const { t } = useTranslation();
  const deviceType = useDeviceType();
  const { pageNumber, keyword, categoryName } = useParams();

  const { data, isLoading, error, isFetching } = useGetProductsQuery({
    keyword,
    pageNumber,
    categoryName,
  });
  const { isOnline } = useSelector((state: any) => state.status);
  return (
    <>
      {!isOnline ? (
        <OnlineStatusChecker />
      ) : (
        <>
          <OnlineStatusChecker />
          {!keyword && !categoryName ? (
            <ProductCorousel />
          ) : (
            <Link to={"/"} className="btn btn-light mb-4">
              {t('go_back')}
            </Link>
          )}
          {isLoading || isFetching ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {t('something_went_wrong_please_refresh_the_page')}
            </Message>
          ) : (
            <>
              <Meta/>
              <h1>{t('latest_products')}</h1>
              {/* <Row>
                {data.products &&
                  data.products.map((product: any) => (
                    <Col
                      key={product && product["_id"]}
                      xs={6}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={3}
                    >
                      <Product product={product} />
                    </Col>
                  ))}
              </Row> */}

              <div
            style={{
              display: deviceType === "mobile" ? "grid" : "flex",
              gridTemplateColumns: deviceType === "mobile" ? "1fr 1fr" : "",
              flexWrap: deviceType === "mobile" ? "initial" : "wrap",
              justifyContent: deviceType === "mobile" ? "" : "center",
              padding: deviceType === "mobile" ? "6px" : "20px",
            }}
          >
            {data?.products.map((data: any) => (
              <Product product={data} />
              // <Card
              //   handleClick={() => {
              //     window.scroll(0, 0);
              //     navigate(`/productDetail/${data?._id}`);
              //   }}
              //   imageSrc={data?.image}
              //   heading={data?.name}
              //   subtitle={data?.price}
              //   address={data?.address}
              // />
            ))}
          </div>
              <Paginate
                comesFrom=""
                pages={data.pages}
                page={data.page}
                keyword={keyword ? keyword : ""}
                category={categoryName ? categoryName : ""}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default HomeScreen;
