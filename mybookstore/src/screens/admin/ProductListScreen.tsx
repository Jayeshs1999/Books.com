import React from "react";
import {
  useCreateProductMutation,
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../slices/productsAPISlice";
import { Button, Col, Row, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import Paginate from "../../components/Paginate";
import { useSelector } from "react-redux";
import notfoundbooksicons from "../../assets/notfoundbooks.png";
import { Link } from "react-router-dom";

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const { userInfo } = useSelector((state: any) => state.auth);
  const { data, isLoading, refetch, error, isFetching } = useGetProductsQuery({
    pageNumber,
    userId: !Boolean(userInfo.isAdmin) ? userInfo._id : "",
  });
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id: any) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteProduct(id);
        refetch();
        toast.success("Product deleted successfully");
      } catch (err) {
        toast.error("Error in product list screen");
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("Are You sure you want to create a new product?")) {
      try {
        await createProduct("");
        refetch();
      } catch (err) {
        toast.error("Error in product list screen");
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Books</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3" onClick={createProductHandler}>
            <FaEdit />
            Create Books
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading || isFetching ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Link to={"/"} className="btn btn-light my-3">
            Go Back to home
          </Link>
          {data.products.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img style={{ width: "25%" }} src={notfoundbooksicons} alt="" />
              <h2>Books Not Found</h2>
              <span>Please click on <strong>"Create Books"</strong> to add your book</span>
            </div>
          ) : (
            <>
              <Table striped hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>PRICE</th>
                    <th>CATEGORY</th>
                    <th>BRAND</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map((product: any) => (
                    <tr key={product._id}>
                      <td>{product._id}</td>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>
                        <LinkContainer
                          to={`/admin/product/${product._id}/edit`}
                        >
                          <Button variant="light" className="btn-sm mx-2">
                            <FaEdit />
                          </Button>
                        </LinkContainer>
                        <Button
                          variant="danger"
                          style={{ color: "white" }}
                          className="btn-sm"
                          onClick={() => deleteHandler(product._id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Paginate
                page={data.page}
                pages={data.pages}
                isAdmin={false}
                comesFrom="productlist"
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default ProductListScreen;
