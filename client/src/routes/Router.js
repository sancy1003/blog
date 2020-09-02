import React, { Fragment } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppNavbar from "../components/AppNavbar";
import { Container } from "reactstrap";
import { Switch, Route, Redirect } from "react-router-dom";
import PostCardList from "../routes/normalRoute/PostCardList";
import PostWrite from "../routes/normalRoute/PostWrite";
import PostDetail from "../routes/normalRoute/PostDetail";
import Search from "../routes/normalRoute/Search";
import CategoryResult from "../routes/normalRoute/CategoryResult";
import { EditProtectedRoute } from "./protectedRoute/ProtectedRoute";
import PostEdit from "./normalRoute/PostEdit";

const MyRouter = () => (
  <>
    <AppNavbar />
    <Header />
    <Container id="main-body">
      <Switch>
        <Route path="/" exact component={PostCardList} />
        <Route path="/post" exact component={PostWrite} />
        <Route path="/post/:id" exact component={PostDetail} />
        <EditProtectedRoute path="/post/:id/edit" exact component={PostEdit} />
        <Route
          path="/post/category/:categoryName"
          exact
          component={CategoryResult}
        />
        <Route path="/search/:searchTerm" exact component={Search} />
        <Redirect from="*" to="/" />
      </Switch>
    </Container>
    <Footer />
  </>
);

export default MyRouter;
