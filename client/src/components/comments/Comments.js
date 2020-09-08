import React, { useState, Fragment, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  COMMENT_UPLOADING_REQUEST,
  COMMENT_LOADING_REQUEST,
} from "../../redux/types";
import { FormGroup, Form, Row, Input, Button } from "reactstrap";

const Comments = ({ id, userName, userId }) => {
  const dispatch = useDispatch();
  const [form, setValues] = useState({ contents: "" });

  const onSubmit = async (e) => {
    await e.preventDefault();
    const { contents } = form;
    const token = localStorage.getItem("token");
    const body = {
      contents,
      token,
      id,
      userId,
      userName,
    };
    dispatch({
      type: COMMENT_UPLOADING_REQUEST,
      payload: body,
    });
    resetValue.current.value = "";
    setValues("");
  };

  const resetValue = useRef(null);

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
    console.log(form.contens);
  };

  useEffect(() => {
    dispatch({
      type: COMMENT_LOADING_REQUEST,
      payload: id,
    });
  }, [dispatch, id]);

  return (
    <Fragment>
      <Form onSubmit={onSubmit}>
        <FormGroup className="mb-o">
          <Row className="p-2">
            <div className="font-weight-bold mx-1 mt-1 mb-2 comment-title">
              Make Comment
            </div>
            <div className="my-1" />
            <Input
              innerRef={resetValue}
              type="textarea"
              name="contents"
              id="contents"
              onChange={onChange}
              placeholder="Comment"
            />
            <Button
              block
              className="mt-3 offset-md-10 col-md-2 btn-comment-submit"
            >
              Submit
            </Button>
          </Row>
        </FormGroup>
      </Form>
    </Fragment>
  );
};

export default Comments;
