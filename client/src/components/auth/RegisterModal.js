import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CLEAR_ERROR_REQUEST, REGISTER_REQUEST } from "../../redux/types";
import {
  NavLink,
  ModalHeader,
  ModalBody,
  Alert,
  Form,
  FormGroup,
  Button,
  Label,
  Modal,
  Input,
} from "reactstrap";

const RegisterModal = () => {
  const [modal, setModal] = useState(false);
  const [form, setValue] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [localMsg, setLocalMsg] = useState("");
  const { errorMsg } = useSelector((state) => state.auth); //reducers의 index.js에 auth를 의미

  const dispatch = useDispatch();
  const handleToggle = () => {
    dispatch({
      type: CLEAR_ERROR_REQUEST,
    });
    setModal(!modal);
  };

  useEffect(() => {
    try {
      setLocalMsg(errorMsg);
    } catch (e) {
      console.log(e);
    }
  }, [errorMsg]);
  // errorMsg가 변할 경우에 실행 함

  const onChange = (e) => {
    setValue({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password } = form;
    const newUser = { name, email, password };
    console.log(newUser, "newUser");
    dispatch({
      type: REGISTER_REQUEST,
      payload: newUser,
    });
  };

  return (
    <div>
      <NavLink onClick={handleToggle} href="#" className="myNav-menu register">
        Register
      </NavLink>
      <Modal isOpen={modal} toggle={handleToggle}>
        <ModalHeader toggle={handleToggle} className="myNav-modal-title">
          Register
        </ModalHeader>
        <ModalBody>
          {localMsg ? <Alert color="danger">{localMsg}</Alert> : null}
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                onChange={onChange}
                className="myNav-modal-input"
              />
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                onChange={onChange}
                className="myNav-modal-input"
              />
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={onChange}
                className="myNav-modal-input last"
              />
              <Button className="mt-2 myNav-btn" block>
                생성하기
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default RegisterModal;
