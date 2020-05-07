import React from "react";
import { Modal, Icon, Form, Input } from "antd";

const PasswordManager = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        visiblePassword0: false,
        visiblePassword1: false,
      };
    }

    handleVisiblePassword = (opt) => {
      if (opt === 0) {
        this.setState({
          visiblePassword0: !this.state.visiblePassword0,
        });
      } else if (opt === 1) {
        this.setState({
          visiblePassword1: !this.state.visiblePassword1,
        });
      }
    };

    setRules = (field) => {
      let rules = [];

      if (field.required) {
        rules.push({
          required: field.required,
          message: `${field.label} requerido!`,
        });
      }
      if (field.maxLength) {
        rules.push({
          max: field.maxLength,
          message: `Sólo se permiten ${field.maxLength} caracteres!`,
        });
      }
      return rules;
    };

    onCancel = () => {
      const { form } = this.props;
      this.setState({
        visiblePassword0: false,
        visiblePassword1: false,
      });
      form.resetFields();
      this.props.onCancel();
    };

    handleCreate = () => {
      const { form } = this.props;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        this.props.changePassword(values);
      });
    };

    render() {
      const { visiblePassword0, visiblePassword1 } = this.state;
      const { visible, form, fieldsForm, editedItem, title } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title={title}
          okText="Aceptar"
          cancelText="Cancelar"
          onCancel={this.onCancel}
          onOk={this.handleCreate}
        >
          <Form layout="vertical">
            {fieldsForm &&
              fieldsForm.map((field, index) => (
                <Form.Item key={field.key} label={field.label}>
                  {getFieldDecorator(field.key, {
                    rules: this.setRules(field),
                    initialValue: editedItem
                      ? editedItem[field.key]
                      : undefined,
                  })(
                    field.type === "password" ? (
                      index === 0 ? (
                        <Input
                          type={visiblePassword0 ? "text" : "password"}
                          prefix={
                            <Icon
                              type={visiblePassword0 ? "eye" : "eye-invisible"}
                              onClick={() => this.handleVisiblePassword(index)}
                            />
                          }
                        />
                      ) : (
                        <Input
                          type={visiblePassword1 ? "text" : "password"}
                          prefix={
                            <Icon
                              type={visiblePassword1 ? "eye" : "eye-invisible"}
                              onClick={() => this.handleVisiblePassword(index)}
                            />
                          }
                        />
                      )
                    ) : (
                      <Input />
                    )
                  )}
                </Form.Item>
              ))}
          </Form>
        </Modal>
      );
    }
  }
);

export default PasswordManager;
