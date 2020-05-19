import React from "react";
import { Form, Icon, Input, Button, Row, Col, Card, Layout } from "antd";
import Api from "../utils/Api";
import Store from "../utils/Store";
import { Redirect } from "react-router-dom";
import Message from "../utils/Message";

const { Header, Footer, Content } = Layout;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      loading: false,
    };
  }

  componentDidMount = () => {
    if (Store.getToken()) {
      this.setState({
        redirect: true,
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        //console.log("Received values of form: ", values);
        Api.post("login/", {
          username: values.username,
          password: values.password,
        })
          .then((response) => {
            console.log(response);
            Store.setToken(response.data.token);
            this.setState({
              redirect: true,
              loading: false,
            });
            Message.success("Ha iniciado sesión con éxito.");
          })
          .catch((error) => {
            //console.log(error);
            if (error.response) {
              const status = error.response.status;
              if (status === 401) {
                Message.error(
                  "Las credenciales no son válidas, intente nuevamente."
                );
              } else if (status === 404) {
                Message.error("El usuario no se encuentra registrado.");
              } else {
                Message.error("Se ha producido un error, intente nuevamente.");
              }
            } else {
              Message.error("Se ha producido un error, intente nuevamente.");
            }
            this.setState({
              loading: false,
            });
          });
      }
    });
  };

  render() {
    const { redirect } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        {redirect && <Redirect to="/" />}
        <Layout style={{ height: "100vh" }}>
          <Header style={{ backgroundColor: "#8AA409" }}></Header>
          <Content style={{ backgroundColor: "#fff" }}>
            <br></br>
            <Row align="middle">
              <Col
                lg={{ span: 6, offset: 9 }}
                md={{ span: 6, offset: 9 }}
                sm={{ span: 6, offset: 9 }}
                xs={{ span: 20, offset: 2 }}
                style={{ backgroundColor: "white" }}
              >
                <Row style={{ backgroundColor: "#fff" }}>
                  <img
                    src={`${process.env.PUBLIC_URL}/imagen1.png`}
                    alt="mision-alianza"
                    style={{ width: "100%" }}
                  ></img>
                </Row>
                <br></br>
                <Card title="Ingreso">
                  <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                      {getFieldDecorator("username", {
                        rules: [
                          {
                            required: true,
                            message: "Usuario requerido!",
                          },
                        ],
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="user"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          placeholder="Username"
                        />
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator("password", {
                        rules: [
                          {
                            required: true,
                            message: "Contraseña requerida!",
                          },
                        ],
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="lock"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          type="password"
                          placeholder="Password"
                        />
                      )}
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        style={{
                          backgroundColor: "#8AA409",
                          borderColor: "#8AA409",
                        }}
                      >
                        Ingresar
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </Content>
          <Footer style={{ textAlign: "center" }}>Misión Alianza ©2020</Footer>
        </Layout>
      </>
    );
  }
}

const WrappedLoginForm = Form.create({ name: "login" })(Login);

export default WrappedLoginForm;
