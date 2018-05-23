import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Menu1 = () => <h2>Menu1</h2>;

// const Menu2 = () => <h2>Menu2</h2>;

const Menu2 = ({ routes }) => (
  <div>
    <h2>Menu2</h2>
    <ul>
      <li>
        <Link to="/second/first">sub1</Link>
      </li>
      <li>
        <Link to="/second/second">sub2</Link>
      </li>
    </ul>

    {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
  </div>
);

const subMenu1 = () => <h3>subMenu1</h3>;
const subMenu2 = () => <h3>subMenu2</h3>;

////////////////////////////////////////////////////////////
// then our route config
const routes = [
  {
    path: "/first",
    component: Menu1
  },
  {
    path: "/second",
    component: Menu2,
    routes: [
      {
        path: "/second/first",
        component: subMenu1
      },
      {
        path: "/second/second",
        component: subMenu2
      }
    ]
  }
];

// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
const RouteWithSubRoutes = route => (
  <Route
    path={route.path}
    render={props => (
      // pass the sub-routes down to keep nesting
      <route.component {...props} routes={route.routes} />
    )}
  />
);

const Root = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/first">FirstItem</Link>
        </li>
        <li>
          <Link to="/second">SecondItem</Link>
        </li>
      </ul>

      {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
    </div>
  </Router>
);

export default Root;