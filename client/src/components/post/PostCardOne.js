import React, { Fragment } from "react";
import { Card, CardImg, CardBody, CardTitle, Row, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { faEye, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PostCardOne = ({ posts }) => {
  console.log(posts, "posts");
  return (
    <Fragment>
      {Array.isArray(posts)
        ? posts.map(({ _id, title, fileUrl, comments, views }) => {
            return (
              <div key={_id} className="col-md-4">
                <Link
                  to={`/post/${_id}`}
                  className="text-dark text-decoration-none"
                >
                  <Card className="mb-4">
                    <CardImg top alt="카드이미지" src={fileUrl} />
                    <CardBody className="Mycardbody">
                      <CardTitle className="d-flex justify-content-between">
                        <span className="text-truncate myCard-title">
                          {title}
                        </span>
                        <span>
                          <FontAwesomeIcon icon={faEye} />
                          &nbsp;&nbsp;
                          <span style={{ marginRight: "15px" }}>{views}</span>
                          <FontAwesomeIcon icon={faComment} />
                          &nbsp;&nbsp;
                          <span>{comments.length}</span>
                        </span>
                      </CardTitle>
                      <Row>
                        <Button className="p-2 btn-block btn-card-more">
                          More
                        </Button>
                      </Row>
                    </CardBody>
                  </Card>
                </Link>
              </div>
            );
          })
        : ""}
    </Fragment>
  );
};

export default PostCardOne;
