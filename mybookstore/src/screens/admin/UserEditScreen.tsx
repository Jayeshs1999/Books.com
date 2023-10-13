import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useGetUserDetailsQuery, useUpdatedUserMutation } from "../../slices/usersApiSlice";

const UserEditScreen= () => {
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId);

  const [updatedUser, { isLoading: loadingUpdate }] =
    useUpdatedUserMutation();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    try {
        await updatedUser({userId,name,email,isAdmin});
        toast.success("user updated Successfully");
        refetch();
        navigate('/admin/userlist')

    }catch(err) {
        toast.error("Error in user Edit screen")
    }
  };

  return (
    <>
      <Link to={"/admin/userlist"} className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer comesfrom='false'>
        <h1>Edit User</h1>
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* {Image input } */}

            <Form.Group controlId="isAdmin" className="my-2">
                <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e)=>setIsAdmin(e.target.checked)}
                >

                </Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;