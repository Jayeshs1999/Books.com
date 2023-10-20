import React from "react";
import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import SearchBox from "./SearchBox";
import { resetCart } from "../slices/cartSlice";
import scrollToTop from "../utils/moveToTop";
import categories from "../utils/objects";

const Header = () => {
  const { cartItems } = useSelector((state: any) => state.cart);
  const { userInfo } = useSelector((state: any) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall("").unwrap();
      dispatch(logout(""));
      dispatch(resetCart());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header className="sticky-header">
      <Navbar
        bg="primary"
        className="navbar-bg-color"
        variant="dark"
        expand="xl"
        collapseOnSelect
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="domain-font">
              <img width={"50px"} src={logo} alt="abs" />
              &nbsp; BookBucket
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle area-aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox />
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <NavDropdown
                title="Categories"
                id="adminmenu"
                style={{ zIndex: "999" }}
              >
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {categories &&
                    categories.map((category: any, index) => (
                      <LinkContainer
                        key={index}
                        to={`category/${category.name}`}
                      >
                        <NavDropdown.Item>{category.name}</NavDropdown.Item>
                      </LinkContainer>
                    ))}
                </div>
              </NavDropdown>
              <LinkContainer to="/aboutus" onClick={scrollToTop}>
                <Nav.Link>About Us</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart />
                  Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                      {cartItems.reduce((a: any, c: any) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={<FaUser />} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile & Orders</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser />
                    Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              <NavDropdown
                title={userInfo?.isAdmin ? "Admin" : "Sell My Books"}
                id="adminmenu"
              >
                <LinkContainer to="/productlist">
                  <NavDropdown.Item>Products</NavDropdown.Item>
                </LinkContainer>
                {userInfo && userInfo.isAdmin && (
                  <>
                    <LinkContainer to="/admin/userlist">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orderlist">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                  </>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
