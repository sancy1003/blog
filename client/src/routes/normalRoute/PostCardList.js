import React, { useEffect, Fragment, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { POSTS_LOADING_REQUEST } from "../../redux/types";
import { Helmet } from "react-helmet";
import { Row, Alert } from "reactstrap";
import { GrowingSpinner } from "../../components/spinner/Spinner";
import PostCardOne from "../../components/post/PostCardOne";
import SearchInput from "../../components/search/searchInput";
import Category from "../../components/post/Category";

const PostCardList = () => {
  const { posts, categoryFindResult, loading, postCount } = useSelector(
    (state) => state.post
  );
  const dispatch = useDispatch();

  // componentDidMount와 같은 기능, 배열을 빈배열로 두면 어떠한 변화가 생겨도 리렌더링 하지 않는다는 의미
  // 배열에 값을 넣으면 그 값이 변할 때만 리렌더링 하겠다는 의미
  useEffect(() => {
    dispatch({ type: POSTS_LOADING_REQUEST, payload: 0 });
  }, [dispatch]);

  ///////////////////////////////
  const skipNumberRef = useRef(0);
  const postCountRef = useRef(0);
  const endMsg = useRef(false);

  postCountRef.current = postCount - 6;

  const observer = useRef();

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          let remainPostCount = postCountRef.current - skipNumberRef.current;
          if (remainPostCount >= 0) {
            dispatch({
              type: POSTS_LOADING_REQUEST,
              payload: skipNumberRef.current + 6,
            });
            skipNumberRef.current += 6;
          } else {
            endMsg.current = true;
          }
        }
      });
      if (observer.current) observer.current.disconnect();
      if (node) {
        console.log(node);
        observer.current.observe(node);
      }
    },
    [dispatch, loading]
  );
  //////////////////////////////

  return (
    <Fragment>
      <Helmet title="Home" />
      <SearchInput />
      <Row className="py-2 mb-4">
        <Category posts={categoryFindResult} />
      </Row>
      <Row>{posts ? <PostCardOne posts={posts} /> : GrowingSpinner}</Row>
      <div ref={lastPostElementRef}>{loading && GrowingSpinner}</div>
      {loading ? (
        ""
      ) : endMsg ? (
        <div>
          <Alert color="danger" className="text-center font-weight-bold">
            더이상 포스트가 없습니다.
          </Alert>
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default PostCardList;
