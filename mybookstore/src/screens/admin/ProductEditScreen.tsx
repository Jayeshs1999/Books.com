import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from "../../slices/productsAPISlice";
import { Link } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "../../utils/firebase";
import categories, { bookConditions } from "../../utils/objects";
import PhoneInput from "react-phone-number-input";
import { useSelector } from "react-redux";

const ProductEditScreen = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [loader, setLoader] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [category, setCategory] = useState("DefaultCategory");
  const [phoneNumber, setPhoneNumber] = useState<any>(
    userInfo.isAdmin ? "+918888585093" : ""
  );
  const [address, setAddress] = useState(
    userInfo.isAdmin ? "+918888585093" : ""
  );
  const [showButtonDisable, setShowButtonDisabled] = useState(true);
  const [bookType, setBookType] = useState("New Book");

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const navigate = useNavigate();
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price - (userInfo.isAdmin ? 0 : 50));
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setAddress(product.address);
      setBookType(product.bookType);
      setPhoneNumber(product.phoneNumber);
    }
  }, [product]);

  useEffect(() => {
    if (
      name !== "" &&
      price > 0 &&
      brand !== "" &&
      countInStock > 0 &&
      description !== "" &&
      category !== "" &&
      image !== "" &&
      address !== "" &&
      bookType !== "" &&
      phoneNumber !== undefined
    ) {
      setShowButtonDisabled(false);
    } else {
      setShowButtonDisabled(true);
    }
  }, [
    name,
    price,
    brand,
    countInStock,
    description,
    category,
    image,
    address,
    phoneNumber,
    bookType,
  ]);

  function hasError(
    obj: any
  ): obj is { error: FetchBaseQueryError | SerializedError } {
    return "error" in obj;
  }

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const updatedProduct = {
      _id: productId,
      name,
      price: price + (userInfo.isAdmin ? 0 : 50),
      image: imageURL || image,
      brand,
      category,
      countInStock,
      description,
      phoneNumber,
      address,
      bookType,
    };

    if (phoneNumber.length === 13) {
      const result = await updateProduct(updatedProduct);
      if (result && hasError(result)) {
        toast.error("Error in product edit screen");
      } else {
        toast.success("Product updated");
        navigate("/productlist");
      }
    } else {
      toast.error("Please Enter Valid Phone Number");
    }
  };

  const uploadFileHandler = async (e: any) => {
    if (image) {
      try {
        setLoader(true);
        const storageRef = ref(storage, `images/${e.target.files[0].name}`);
        await uploadBytes(storageRef, e.target.files[0]);
        const downloadURL = await getDownloadURL(storageRef);
        setImageURL(downloadURL);
        if (downloadURL) {
          toast.success("Image uploaded successfully!");
        }
        setLoader(false);
      } catch (error) {
        toast.error("Something went wrong");
      }
    } else {
      toast.success("No Image found");
    }
  };

  return (
    <>
      <Link to={"/productlist"} className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer comesfrom="false">
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price" className="my-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              ></Form.Control>
            </Form.Group>
            {!userInfo.isAdmin && (
              <>
                <span style={{ color: "red" }}>
                  <strong>Please Note:</strong>{" "}
                  <span>
                    We are adding Rs.50 to your original price for packing and
                    shipping
                  </span>
                </span>
                <div style={{ color: "green" }}>
                  <strong>Total book price:</strong>
                  <span>
                    {" "}
                    {price} + {50} = <strong>{price + 50}</strong>
                  </span>
                </div>
              </>
            )}
            {/* {Image input } */}

            <Form.Group controlId="image" className="my-2">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                readOnly
                placeholder="Enter Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type="file"
                // label="Choose file"
                onChange={uploadFileHandler}
              ></Form.Control>
            </Form.Group>
            {loader && <Loader />}

            <Form.Group controlId="brand" className="my-2">
              <Form.Label>Author's Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countinstock" className="my-2">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Count In Stock"
                value={countInStock}
                onChange={(e) => setCountInStock(Number(e.target.value))}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category" className="my-2">
              <Form.Label>Select Category</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((x) => (
                  <option key={x.name} value={x.name}>
                    {x.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="booktype" className="my-2">
              <Form.Label>Book Type</Form.Label>
              <Form.Control
                as="select"
                value={bookType}
                onChange={(e) => setBookType(e.target.value)}
              >
                {bookConditions.map((x) => (
                  <option key={x.name} value={x.name}>
                    {x.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea" // Set "as" prop to "textarea"
                rows={3} // Specify the number of visible rows (adjust as needed)
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="phonenumber" className="my-2">
              <Form.Label>
                Phone Number
                {/* Please Add your phone number again &#128528; */}
              </Form.Label>
              <PhoneInput
                readOnly={userInfo.isAdmin}
                defaultCountry="IN"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e: any) => {
                  setPhoneNumber(e);
                }}
              />
            </Form.Group>
            <Form.Group controlId="address" className="my-3">
              <Form.Label>Pickup Address</Form.Label>
              <Form.Control
                readOnly={userInfo.isAdmin}
                as="textarea" // Set "as" prop to "textarea"
                rows={3} // Specify the number of visible rows (adjust as needed)
                placeholder="Enter Pickup Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button
              className="mt-2"
              disabled={showButtonDisable}
              type="submit"
              variant="primary"
            >
              Update
            </Button>
            <Button
              className="mt-2"
              style={{ marginLeft: "10px" }}
              type="button"
              variant="outline-primary"
              onClick={() => {
                navigate("/productlist");
              }}
            >
              Cancel
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
