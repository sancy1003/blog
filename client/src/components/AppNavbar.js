import React, { Fragment, useState, useCallback, useEffect } from "react";
import {
  Navbar,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  Form,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import LoginModal from "../components/auth/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT_REQUEST } from "../redux/types";
import RegisterModal from "./auth/RegisterModal";

const AppNavbar = () => {
  const [isOpen, setIsOpen] = useState(false); // 모바일 상단 바 상태
  const { isAuthenticated, user, userRole } = useSelector(
    // auth 리듀서에서 유저 정보, 인증 여부를 받아옴
    (state) => state.auth
  );
  console.log(userRole, "UserRole");

  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch({
      type: LOGOUT_REQUEST,
    });
  }, [dispatch]);

  // componentDidMount와 같은 기능, 배열을 빈배열로 두면 어떠한 변화가 생겨도 리렌더링 하지 않는다는 의미
  // 배열에 값을 넣으면 그 값이 변할 때만 리렌더링 하겠다는 의미
  useEffect(() => {
    setIsOpen(false);
  }, [user]);
  // 모바일창 로그인시 네브바가 줄어들게 하기 위해서 user값들어오면 false

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const addPostClick = () => {};

  const authLink = (
    <Fragment>
      <NavItem>
        {userRole === "Admin" ? (
          <Form className="col">
            <Link
              to="post"
              className="btn block text-white px-3 btn-add"
              onClick={addPostClick}
            >
              Add Post
            </Link>
          </Form>
        ) : (
          ""
        )}
      </NavItem>
      <NavItem className="d-flex justify-content-center">
        <Form className="col">
          {user && user.name ? (
            <Link to={`/user/${user.name}/profile`}>
              <Button outline color="light" className="px-3 myNav-menu-btn">
                <strong>{user ? `Welcome ${user.name}` : ""}</strong>
              </Button>
            </Link>
          ) : (
            <Button outline color="light" className="px-3">
              <strong>No User</strong>
            </Button>
          )}
        </Form>
      </NavItem>
      <NavItem>
        <Form className="col">
          <Link onClick={onLogout} to="#">
            <Button outline color="light" className="myNav-menu-btn">
              Logout
            </Button>
          </Link>
        </Form>
      </NavItem>
    </Fragment>
  );

  const guestLink = (
    <Fragment>
      <NavItem>
        <RegisterModal />
      </NavItem>
      <NavItem>
        <LoginModal />
      </NavItem>
    </Fragment>
  );

  return (
    <Fragment>
      <Navbar dark expand="lg" className="myNav sticky-top">
        <Link to="/" className="text-white text-decoration-none myNav-title">
          &lt;FrontChan /&gt;
        </Link>
        <NavbarToggler onClick={handleToggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto d-felx justify-content-around" navbar>
            {isAuthenticated ? authLink : guestLink}
          </Nav>
        </Collapse>
      </Navbar>
    </Fragment>
  );
};

export default AppNavbar;
