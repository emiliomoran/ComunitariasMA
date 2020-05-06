import React from "react";
import { Layout, Menu, Icon } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//Pages
import Category from "./pages/Category";
import CollectionCenter from "./pages/CollectionCenter";
import Provider from "./pages/Provider";
//import Donation from "./pages/Donation";
import SupportGroup from "./pages/SupportGroup";
import Distribution from "./pages/Distribution";

const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component {
  render() {
    return (
      <Router>
        <Layout>
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
            <div className="logo" />
            <Menu theme="dark" mode="inline">
              <Menu.Item key="1">
                <Icon type="tags" />
                <span className="nav-text">Categorías</span>
                <Link to="/categorias" />
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="gold" />
                <span className="nav-text">Centros de acopio</span>
                <Link to="/centros-acopio" />
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="shop" />
                <span className="nav-text">Empresas</span>
                <Link to="/empresas" />
              </Menu.Item>
              <Menu.Item key="4">
                <Icon type="medicine-box" />
                <span className="nav-text">Donaciones</span>
                <Link to="/donaciones" />
              </Menu.Item>
              <Menu.Item key="5">
                <Icon type="team" />
                <span className="nav-text">Grupos de apoyo</span>
                <Link to="/grupos-apoyo" />
              </Menu.Item>
              <Menu.Item key="6">
                <Icon type="car" />
                <span className="nav-text">Distribuciones</span>
                <Link to="/distribuciones" />
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: "#fff", padding: 0 }} />
            <Content style={{ margin: "24px 16px 0" }}>
              <div
                style={{
                  padding: 24,
                  background: "#fff",
                  height: "calc(100vh - 55px)",
                }}
              >
                <Route exact path="/categorias" component={Category} />
                <Route
                  exact
                  path="/centros-acopio"
                  component={CollectionCenter}
                />
                <Route exact path="/empresas" component={Provider} />
                {/* <Route exact path="/donaciones" component={Donation} /> */}
                <Route exact path="/grupos-apoyo" component={SupportGroup} />
                <Route exact path="/distribuciones" component={Distribution} />
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Ant Design ©2018 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default App;
