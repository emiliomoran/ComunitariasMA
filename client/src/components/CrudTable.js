import React from "react";
import { Table, Divider, Icon, Button, Modal, Form, Input, Row } from "antd";

const { TextArea } = Input;
const { confirm } = Modal;

const CategoryForm = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const {
        visible,
        onCancel,
        onCreate,
        form,
        fieldsForm,
        title,
        editedItem,
      } = this.props;
      const { getFieldDecorator } = form;
      //console.log(editedItem);
      return (
        <Modal
          visible={visible}
          title={title}
          okText="Guardar"
          cancelText="Cancelar"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            {fieldsForm &&
              fieldsForm.map((field) => (
                <Form.Item key={field.key} label={field.label}>
                  {getFieldDecorator(field.key, {
                    rules: [
                      {
                        required: field.required,
                        message: `${field.name} requerido!`,
                      },
                      {
                        max: field.maxLength,
                        message: `Sólo se permiten ${field.maxLength} caracteres!`,
                      },
                    ],
                    initialValue: editedItem
                      ? editedItem[field.key]
                      : undefined,
                  })(
                    field.type === "text" ? (
                      <Input />
                    ) : (
                      field.type === "textArea" && <TextArea rows={5} />
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

class CrudTable extends React.Component {
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

  setEditedItem = (key) => {
    //console.log(this.props.data);
    let item = this.props.data.find((obj) => obj.key === key);
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
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      if (this.state.editedItem) {
        //console.log(this.state.editedItem);
        values.key = this.state.editedItem.key;
        //console.log("Received values of form edit: ", values);
        this.props.edit(values);
      } else {
        //console.log("Received values of form new: ", values);
        this.props.add(values);
      }
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  confirmDelete = (key) => {
    //console.log(this.props.data);
    let item = this.props.data.find((obj) => obj.key === key);
    confirm({
      title: `¿Está seguro de eliminar ${item.name} ?`,
      okText: "Acepar",
      cancelText: "Cancelar",
      onOk: () => {
        //console.log(item.key);
        this.props.delete(item.key);
      },
      onCancel() {},
    });
  };

  render() {
    const { editedItem } = this.state;

    const { columns, data, fieldsForm, title, loading } = this.props;

    const columns_table = this.set_columns(columns);

    return (
      <Row>
        <div>
          <Button
            type="primary"
            onClick={this.showModal}
            style={{ position: "absolute", right: 0 }}
          >
            Nueva
          </Button>
          <CategoryForm
            fieldsForm={fieldsForm}
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            title={title}
            editedItem={editedItem}
          />
        </div>
        <br></br>
        <br></br>
        <Table columns={columns_table} dataSource={data} loading={loading} />;
      </Row>
    );
  }
}

export default CrudTable;
