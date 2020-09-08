import React, { Fragment, useState } from "react";
import { Form } from "reactstrap";
import { useDispatch } from "react-redux";
import { SEARCH_REQUEST } from "../../redux/types";

const SearchInput = () => {
  const dispatch = useDispatch();
  const [form, setValues] = useState({ searchBy: "" });

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
    console.log(form);
  };

  const onSubmit = async (e) => {
    await e.preventDefault();
    const { searchBy } = form;

    dispatch({
      type: SEARCH_REQUEST,
      payload: searchBy,
    });

    console.log(searchBy, "Submit Body");
    document.querySelector(".myNav-searchbar").value = "";
  };
  //const resetValue = useRef(null);

  return (
    <Fragment>
      <Form onSubmit={onSubmit} className="myNav-search-form">
        <input
          name="searchBy"
          onChange={onChange}
          className="myNav-searchbar"
          placeholder="검색"
        />
      </Form>
    </Fragment>
  );
};

export default SearchInput;
