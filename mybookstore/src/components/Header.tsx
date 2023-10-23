import React, { useState, useTransition } from "react";
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
import { useTranslation } from "react-i18next";
const Header = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") ? localStorage.getItem("language") : "en"
  );
  const { cartItems } = useSelector((state: any) => state.cart);
  const { userInfo } = useSelector((state: any) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    localStorage.setItem("language", lng);
    setSelectedLanguage(lng);
    i18n.changeLanguage(lng);
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
              &nbsp; <strong>BookBucket.In</strong>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle area-aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox />
              <LinkContainer to="/">
                <Nav.Link>{t("home")}</Nav.Link>
              </LinkContainer>
              <NavDropdown
                title={t("categories")}
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
                <Nav.Link>{t("aboutUs")}</Nav.Link>
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
              <NavDropdown
                title={
                  userInfo?.isAdmin
                    ? `${t("admin")}`
                    : `${t("userProductAdmin")}`
                }
                id="adminmenu"
              >
                <LinkContainer to="/productlist">
                  <NavDropdown.Item>{t("products")}</NavDropdown.Item>
                </LinkContainer>
                {userInfo && userInfo.isAdmin && (
                  <>
                    <LinkContainer to="/admin/userlist">
                      <NavDropdown.Item>{t("users")}</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orderlist">
                      <NavDropdown.Item>{t("orders")}</NavDropdown.Item>
                    </LinkContainer>
                  </>
                )}
              </NavDropdown>

              <NavDropdown title={t("language")} id="language">
                  <div onClick={() => changeLanguage("en")}>
                    <NavDropdown.Item active={selectedLanguage === "en"}>
                      English
                    </NavDropdown.Item>
                  </div>
                  <div onClick={() => changeLanguage("es")}>
                    <NavDropdown.Item active={selectedLanguage === "es"}>
                      मराठी
                    </NavDropdown.Item>
                  </div>
              </NavDropdown>

              {userInfo ? (
                <NavDropdown title={<span>{userInfo.name}</span>} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>{t("profileAndOrders")}</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    {t("logout")}
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser />
                    {t("signIn")}
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
