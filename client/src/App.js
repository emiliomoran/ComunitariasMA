import React from "react";
import { Layout, Menu, Icon } from "antd";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import decode from "jwt-decode";
import Store from "./utils/Store";

//Pages
import Category from "./pages/Category";
import CollectionCenter from "./pages/CollectionCenter";
import Provider from "./pages/Provider";
import Donation from "./pages/Donation";
import SupportGroup from "./pages/SupportGroup";
import Distribution from "./pages/Distribution";
import Campaign from "./pages/Campaign";
import Volunteer from "./pages/Volunteer";

const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      user: undefined,
    };
  }

  componentDidMount = () => {
    if (!Store.getToken()) {
      this.setState({
        redirect: true,
      });
    } else {
      const user = decode(Store.getToken());
      //console.log(user);
      this.setState({
        user,
      });
    }
  };

  logout = () => {
    Store.removeToken();
    this.setState({
      redirect: true,
    });
  };

  render() {
    const { redirect, user } = this.state;
    console.log(user);
    return (
      <>
        {redirect && <Redirect to="/login" />}
        <Router>
          <Layout style={{ height: "100vh" }}>
            <Sider
              breakpoint="lg"
              collapsedWidth="0"
              onBreakpoint={(broken) => {
                console.log(broken);
              }}
              onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
              }}
            >
              <div className="logo">
                <img
                  src={`${process.env.PUBLIC_URL}/logo.png`}
                  alt="logo"
                  style={{ width: "100%" }}
                ></img>
              </div>
              <Menu theme="dark" mode="inline">
                {user &&
                  (user.role === "Admin" ||
                    user.role === "DataVolunteer" ||
                    user.role === "Group") && (
                    <Menu.Item key="1">
                      <Icon type="tags" />
                      <span className="nav-text">Categorías</span>
                      <Link to="/categorias" />
                    </Menu.Item>
                  )}
                {user &&
                  (user.role === "Admin" ||
                    user.role === "DataVolunteer" ||
                    user.role === "Group") && (
                    <Menu.Item key="2">
                      <Icon type="gold" />
                      <span className="nav-text">Centros de acopio</span>
                      <Link to="/centros-acopio" />
                    </Menu.Item>
                  )}
                {user &&
                  (user.role === "Admin" ||
                    user.role === "DataVolunteer" ||
                    user.role === "Group") && (
                    <Menu.Item key="3">
                      <Icon type="shop" />
                      <span className="nav-text">Empresas</span>
                      <Link to="/empresas" />
                    </Menu.Item>
                  )}
                {user &&
                  (user.role === "Admin" ||
                    user.role === "DataVolunteer" ||
                    user.role === "Group") && (
                    <Menu.Item key="4">
                      <Icon type="medicine-box" />
                      <span className="nav-text">Donaciones</span>
                      <Link to="/donaciones" />
                    </Menu.Item>
                  )}
                {user &&
                  (user.role === "Admin" ||
                    user.role === "DataVolunteer" ||
                    user.role === "Group") && (
                    <Menu.Item key="5">
                      <Icon type="team" />
                      <span className="nav-text">Grupos de apoyo</span>
                      <Link to="/grupos-apoyo" />
                    </Menu.Item>
                  )}
                {user &&
                  (user.role === "Admin" ||
                    user.role === "DataVolunteer" ||
                    user.role === "Group") && (
                    <Menu.Item key="6">
                      <Icon type="team" />
                      <span className="nav-text">Voluntarios</span>
                      <Link to="/voluntarios" />
                    </Menu.Item>
                  )}
                {user &&
                  (user.role === "Admin" ||
                    user.role === "DataVolunteer" ||
                    user.role === "Group") && (
                    <Menu.Item key="7">
                      <Icon type="car" />
                      <span className="nav-text">Distribuciones</span>
                      <Link to="/distribuciones" />
                    </Menu.Item>
                  )}
                {user &&
                  (user.role === "Admin" ||
                    user.role === "DataVolunteer" ||
                    user.role === "Group") && (
                    <Menu.Item key="8">
                      <Icon type="notification" />
                      <span className="nav-text">Campañas</span>
                      <Link to="/campañas" />
                    </Menu.Item>
                  )}
                {user && (
                  <Menu.Item
                    key="9"
                    style={{ position: "absolute", bottom: 0 }}
                    onClick={this.logout}
                  >
                    <Icon type="logout" />
                    <span className="nav-text">Salir</span>
                  </Menu.Item>
                )}
              </Menu>
            </Sider>
            <Layout>
              <Header style={{ background: "#fff", padding: 0 }} />
              <Content style={{ margin: "24px 16px 0" }}>
                <div
                  style={{
                    padding: 24,
                    background: "#fff",
                  }}
                >
                  <Route exact path="/categorias" component={Category} />
                  <Route
                    exact
                    path="/centros-acopio"
                    component={CollectionCenter}
                  />
                  <Route exact path="/empresas" component={Provider} />
                  <Route exact path="/donaciones" component={Donation} />
                  <Route exact path="/grupos-apoyo" component={SupportGroup} />
                  <Route exact path="/distribuciones" component={Distribution} />
                  <Route exact path="/campañas" component={Campaign} />
                  <Route exact path="/voluntarios" component={Volunteer} />
                </div>
              </Content>
              <Footer style={{ textAlign: "center" }}>
                Misión Alianza ©2020
              </Footer>
            </Layout>
          </Layout>
        </Router>
      </>
    );
  }
}

export default App;
