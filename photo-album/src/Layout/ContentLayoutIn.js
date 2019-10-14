import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Layout} from "antd";

import { routes } from "../routers/routers";
import BreadcumbCompoent from "../Components/BreadcumbComponent";

const { Content } = Layout;
class ContentLayoutIn extends Component {
  render() {
    return (
      <Content
        style={{
          margin: "24px 0",
          padding: 24,
          background: "#fff",
          minHeight: 100
        }}
      >
        <BreadcumbCompoent/>
        {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={route.main}
            >
            </Route>
          ))}
        <Switch>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={route.component}
            >
            </Route>
          ))}
        </Switch>
      </Content>
    );
  }
}

export default ContentLayoutIn;
