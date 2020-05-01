import React from "react";
import { Modal, Table, Icon, Divider, Button, Form, Input } from "antd";

const { TextArea } = Input;
const { confirm } = Modal;

const ContactForm = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
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
      if (field.type === "email") {
        rules.push({
          type: "email",
          message: "Correo no válido!",
        });
      }
      if (field.type === "phone") {
        rules.push({
          //type: "regexp",
          pattern: new RegExp("^[0-9]*$"),
          message: "Teléfono no válido!",
        });
      }
      if (field.type === "url") {
        rules.push({
          pattern: new RegExp(
            "^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$"
          ),
          message: "Url no válida!",
        });
      }
      return rules;
    };

    render() {
      const {
        visible,
        onCancel,
        onCreate,
        form,
        fieldsFormContact,
        editedItem,
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Contacto"
          okText="Guardar"
          cancelText="Cancelar"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            {fieldsFormContact &&
              fieldsFormContact.map((field) => (
                <Form.Item key={field.key} label={field.label}>
                  {getFieldDecorator(field.key, {
                    rules: this.setRules(field),
                    initialValue: editedItem
                      ? editedItem[field.key]
                      : undefined,
                  })(
                    field.type === "text" ||
                      field.type === "phone" ||
                      field.type === "email" ||
                      field.type === "url" ? (
                      <Input />
                    ) : field.type === "textArea" ? (
                      <TextArea rows={5} />
                    ) : (
                      field.type === "coordinate" && <Input />
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

class ListContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      editedItem: undefined,
    };
  }

  set_columns = (columns) => {
    let arrayColumns = [];
    columns.map((c) => {
      let item = undefined;
      if (c.key === "action") {
        item = {
          title: c.title,
          key: c.key,
          render: (text, record) => (
            <span>
              <Icon
                type="edit"
                onClick={() => this.setEditedItem(record.key)}
              />
              <Divider type="vertical" />
              <Icon
                type="delete"
                onClick={() => this.confirmDelete(record.key)}
              />
            </span>
          ),
        };
      } else {
        item = {
          title: c.title,
          dataIndex: c.key,
          key: c.key,
          item: c,
        };
      }
      arrayColumns.push(item);
      return true;
    });
    return arrayColumns;
  };

  confirmDelete = (key) => {
    //console.log(this.props.data);
    let item = this.props.data.find((obj) => obj.key === key);
    confirm({
      title: `¿Está seguro de eliminar ${item.firstName} ${item.lastName}?`,
      okText: "Aceptar",
      cancelText: "Cancelar",
      onOk: () => {
        //console.log(item.key);
        this.props.deleteContact(item.key);
      },
      onCancel() {},
    });
  };

  setEditedItem = (key) => {
    //console.log(this.props.data);
    let item = this.props.data.find((obj) => obj.key === key);
    //console.log(item);
    this.setState({
      editedItem: item,
      visible: true,
    });
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    const { form } = this.formRef.props;
    form.resetFields();
    this.setState({ visible: false, editedItem: undefined });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      //console.log("Received values of form: ", values);
      if (this.state.editedItem) {
        values.provider = this.props.provider.key;
        values.key = this.state.editedItem.key;
        this.props.editContact(values);
      } else {
        values.provider = this.props.provider.key;
        this.props.addContact(values);
      }
      form.resetFields();
      this.setState({ visible: false, editedItem: undefined });
    });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  render() {
    const {
      provider,
      visible,
      close,
      columns,
      data,
      fieldsFormContact,
    } = this.props;

    const { editedItem } = this.state;

    const columns_table = this.set_columns(columns);
    //console.log(visible);
    return (
      <Modal
        title={`Contactos de ${provider ? provider.name : "Empresa"}`}
        visible={visible}
        //onOk={this.handleOk}
        onCancel={close}
        width="50%"
        footer={null}
      >
        <div>
          <Button
            type="primary"
            onClick={this.showModal}
            style={{ float: "right" }}
          >
            Nuevo
          </Button>
          <ContactForm
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            fieldsFormContact={fieldsFormContact}
            editedItem={editedItem}
          />
        </div>
        <br></br>
        <br></br>
        <Table columns={columns_table} dataSource={data} />
      </Modal>
    );
  }
}

export default ListContact;
