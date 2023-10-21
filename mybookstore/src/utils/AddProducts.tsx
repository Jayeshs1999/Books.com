import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Loader from "../components/Loader";
import categories, { bookConditions } from "./objects";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import storage from "./firebase";
import { toast } from "react-toastify";
import { useCreateProductMutation } from "../slices/productsAPISlice";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const AddProducts = (props: any) => {
  const prevProductLocation = localStorage.getItem("product_added_location");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<any>();
  const [address, setAddress] = useState(
    prevProductLocation ? prevProductLocation : ""
  );
  const [bookType,setBookType] = useState("New Book");
  const [loader, setLoader] = useState(false);
  const [category, setCategory] = useState("Adventure stories");
  const [showButtonDisable, setShowButtonDisabled] = useState(true);
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const handleClosePopup = () => {
    props.handleDialog(false);
  };
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
    bookType
  ]);

  const uploadFileHandler = async (e: any) => {
    try {
      setLoader(true);
      const storageRef = ref(storage, `images/${e.target.files[0].name}`);
      await uploadBytes(storageRef, e.target.files[0]);
      const downloadURL = await getDownloadURL(storageRef);
      // setImageURL(downloadURL);
      setImage(downloadURL);
      if (downloadURL) {
        toast.success("Image uploaded successfully!");
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      toast.error("Something went wrong");
    }
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const updatedProduct = {
      name,
      price: price + 50,
      image: image,
      brand,
      category,
      countInStock,
      description,
      address,
      phoneNumber,
      bookType
    };
    localStorage.setItem("product_added_location", address);

    if (phoneNumber.length === 13) {
      const result = await createProduct(updatedProduct);
      if (result) {
        // navigate('/productlist')
        props.handleDialog(false);
        toast.success("Book added Successfully");
      } else {
        toast.error("Something went wrong");
      }
    } else {
      toast.error("Please Enter valid Phone Number");
    }
  };

  return (
    <Modal
      show={true}
      size="lg"
      onHide={handleClosePopup}
      backdrop="static" // This prevents closing when clicking outside the modal
      keyboard={false} // This prevents closing when pressing the Esc key
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "30em", overflow: "auto" }}>
        <>
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
            <span style={{ color: "red" }}>
              <strong>Please Note:</strong>{" "}
              <span>
                We are adding Rs.50 to your original price for packing and
                shipping
              </span>
            </span>
            <div>
              <strong style={{ color: "green" }}>
                Total book price: {price} + {50} = {price + 50}
              </strong>
            </div>
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
              <Form.Label>Author's Names</Form.Label>
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
              <Form.Label>Phone Number</Form.Label>
              <PhoneInput
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
                as="textarea" // Set "as" prop to "textarea"
                rows={3} // Specify the number of visible rows (adjust as needed)
                placeholder="Enter Pickup Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button
              className="mt-2"
              style={{ marginRight: "10px" }}
              disabled={showButtonDisable}
              type="submit"
              variant="primary"
            >
              Create
            </Button>
            <Button
              className="mt-2"
              type="button"
              variant="outline-primary"
              onClick={(e) => props.handleDialog(false)}
            >
              Cancel
            </Button>
          </Form>
          {loadingCreate && <Loader />}
        </>
      </Modal.Body>
    </Modal>
  );
};

export default AddProducts;
