import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import {
  POST_DETAIL_LOADING_REQUEST,
  POST_DELETE_REQUEST,
  USER_LOADING_REQUEST,
} from "../../redux/types";
import { Row, Col, Button, Container } from "reactstrap";
import { Link } from "react-router-dom";
import CKEditor from "@ckeditor/ckeditor5-react";
import { GrowingSpinner } from "../../components/spinner/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faCommentDots,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Ballon from "@ckeditor/ckeditor5-editor-balloon/src/ballooneditor";
import { editorConfiguration } from "../../components/editor/EditorConfig";
import Comments from "../../components/comments/Comments";

const PostDetail = (req) => {
  const dispatch = useDispatch();
  const { postDetail, creatorId, title, loading } = useSelector(
    (state) => state.post
  );
  const { userId, userName } = useSelector((state) => state.auth);
  const { comments } = useSelector((state) => state.comment);

  console.log(req);
  useEffect(() => {
    dispatch({
      type: POST_DETAIL_LOADING_REQUEST,
      payload: req.match.params.id,
    });
    dispatch({
      type: USER_LOADING_REQUEST,
      payload: localStorage.getItem("token"),
    });
  }, [dispatch, req.match.params.id]);

  const onDeleteClick = () => {
    dispatch({
      type: POST_DELETE_REQUEST,
      payload: {
        id: req.match.params.id,
        token: localStorage.getItem("token"),
      },
    });
  };

  const EditButton = (
    <Fragment>
      <Row className="d-flex justify-content-center pb-3">
        <Col classID="col-md-3 mr-md-3">
          <Link to="/" className="btn btn-primary btn-block">
            Home
          </Link>
        </Col>
        <Col classID="col-md-3 mr-md-3">
          <Link
            to={`/post/${req.match.params.id}/edit`}
            className="btn btn-success btn-block"
          >
            Edit Post
          </Link>
        </Col>
        <Col classID="col-md-3">
          <Button className="btn-block btn-danger" onClick={onDeleteClick}>
            Delete
          </Button>
        </Col>
      </Row>
    </Fragment>
  );

  const HomeButton = (
    <Fragment>
      <Row className="d-flex justify-content-center pb-3">
        <Col className="col-sm-12 col-md-3">
          <Link to="/" className="btn btn-primary btn-block">
            Home
          </Link>
        </Col>
      </Row>
    </Fragment>
  );

  const Body = (
    <>
      {userId === creatorId ? EditButton : ""}
      <Row className="px-3 pb-3 mb-3 justify-content-between detail-container">
        {(() => {
          if (postDetail && postDetail.creator) {
            return (
              <Fragment>
                <div className="font-weight-bold text-big">
                  <span className="mr-3">
                    <Button className="detail-category">
                      {postDetail.category.categoryName}
                    </Button>
                  </span>
                  <span className="detail-title">{postDetail.title}</span>
                </div>
                <div className="align-self-center detail-creator">
                  {postDetail.creator.name}
                </div>
              </Fragment>
            );
          }
        })()}
      </Row>
      {postDetail && postDetail.comments ? (
        <Fragment>
          <div className="d-flex justify-content-end align-items-baseline detail-info">
            <FontAwesomeIcon icon={faPencilAlt} />
            &nbsp;&nbsp;
            <span className="mr-3">{postDetail.date}</span>
            <FontAwesomeIcon icon={faCommentDots} />
            &nbsp;&nbsp;
            <span className="mr-3">{postDetail.comments.length}</span>
            <FontAwesomeIcon icon={faEye} />
            &nbsp;&nbsp;
            <span>{postDetail.views}</span>
          </div>
          <Row className="mb-3">
            <CKEditor
              editor={Ballon}
              data={postDetail.contents}
              config={editorConfiguration}
              disabled="true"
            />
          </Row>
          <Row>
            <Container className="border rounded detail">
              {Array.isArray(comments)
                ? comments.map(
                    ({ contents, creator, date, _id, creatorName }) => (
                      <div key={_id} className="detail-comment-box">
                        <Row className="justify-content-between p-2">
                          <div className="font-weight-bold">
                            {creatorName ? creatorName : creator}
                          </div>
                          <div className="text-small detail-comment-date">
                            <span className="font-weight-bold">
                              {date.split(" ")[0]}
                            </span>
                            <span className="font-weight-light">
                              {" "}
                              {date.split(" ")[1]}
                            </span>
                          </div>
                        </Row>
                        <Row className="px-2 pt-1">
                          <div>{contents}</div>
                        </Row>
                      </div>
                    )
                  )
                : "Creator"}
              <Comments
                id={req.match.params.id}
                userId={userId}
                userName={userName}
              />
            </Container>
          </Row>
        </Fragment>
      ) : (
        ""
      )}
    </>
  );

  return (
    <div>
      <Helmet title={`post | ${title}`} />
      {loading === true ? GrowingSpinner : Body}
    </div>
  );
};

export default PostDetail;
