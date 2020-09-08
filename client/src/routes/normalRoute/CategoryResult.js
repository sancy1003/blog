import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CATEGORY_FIND_REQUEST } from "../../redux/types";
import { Row } from "reactstrap";
import PostCardOne from "../../components/post/PostCardOne";

const CategoryResult = () => {
  const dispatch = useDispatch();
  let { categoryName } = useParams();
  const { categoryFindResult } = useSelector((state) => state.post);

  console.log(categoryFindResult);
  console.log(categoryName);

  useEffect(() => {
    dispatch({
      type: CATEGORY_FIND_REQUEST,
      payload: categoryName,
    });
  }, [dispatch, categoryName]);

  return (
    <div>
      <div className="serch-result-title">[ {categoryName} ]</div>
      <Row>
        <PostCardOne posts={categoryFindResult.posts}></PostCardOne>
      </Row>
    </div>
  );
};

export default CategoryResult;
