import React from "react";
import {
  Table,
  Divider,
  Icon,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Tag,
  Select,
} from "antd";
import Map from "../components/Map";
import ListContacts from "../components/ListContact";

const { TextArea } = Input;
const { confirm } = Modal;
const { Option } = Select;

const CategoryForm = Form.create({ name: "form_in_modal" })(
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
      return rules;
    };

    render() {
      const {
        visible,
        onCancel,
        onCreate,
        form,
        fieldsForm,
        title,
        editedItem,
        includesMap,
        showMapForm,
        hasPoint,
        optionsMultipleSelect,
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
                <Form.Item
                  key={field.key}
                  label={field.label}
                  style={{
                    display: field.type === "coordinate" ? "none" : "block",
                  }}
                >
                  {getFieldDecorator(field.key, {
                    rules: this.setRules(field),
                    initialValue: editedItem
                      ? editedItem[field.key]
                      : undefined,
                  })(
                    field.type === "text" ||
                      field.type === "phone" ||
                      field.type === "email" ||
                      field.type === "coordinate" ? (
                      <Input />
                    ) : field.type === "textArea" ? (
                      <TextArea rows={5} />
                    ) : field.type === "password" ? (
                      <Input type="password" />
                    ) : field.type === "file" ? (
                      <input type="file" accept="image/*" />
                    ) : (
                      <Select
                        mode="multiple"
                        placeholder="Seleccionar la(s) categoría(s)"
                      >
                        {optionsMultipleSelect &&
                          optionsMultipleSelect.map((option) => (
                            <Option key={option.value} value={option.value}>
                              {option.text}
                            </Option>
                          ))}
                      </Select>
                    )
                  )}
                </Form.Item>
              ))}
            {includesMap && (
              <div>
                {editedItem
                  ? "Editar ubicación en el mapa"
                  : "Añadir ubicación en el mapa"}{" "}
                <Icon
                  type="environment"
                  theme="twoTone"
                  twoToneColor={hasPoint ? "#52c41a" : "#C8BDBB"}
                  onClick={() => showMapForm(editedItem)}
                />
              </div>
            )}
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
      visibleMap: false,
      readOnlyMap: true,
      previewPoint: undefined,
      hasPoint: false,
      edit: false,
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
      } else if (c.key === "ubication") {
        item = {
          title: c.title,
          key: c.key,
          render: (text, record) => (
            <span>
              <Icon
                type="environment"
                theme="twoTone"
                twoToneColor="#52c41a"
                onClick={() => this.showMap(record.key)}
              />
            </span>
          ),
        };
      } else if (c.key === "tags") {
        item = {
          title: c.title,
          key: c.key,
          render: (item) => (
            <span>
              {item.tags.map((tag) => {
                return <Tag key={tag.key}>{tag.label}</Tag>;
              })}
            </span>
          ),
        };
      } else if (c.key === "contacts" || c.key === "members") {
        item = {
          title: c.title,
          key: c.key,
          render: (text, record) => (
            <span>
              <Icon
                type="contacts"
                onClick={() => this.props.showContacts(record.key)}
              />
            </span>
          ),
        };
      } else if (c.key === "photo") {
        item = {
          title: c.title,
          key: c.key,
          render: (text, record) => (
          <span>
            <Icon
              type="picture"
              theme="twoTone"
              twoToneColor="#52c41a"
              onClick={() => console.log("clicked")}
            />
          </span>
          ),
        }
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
    let point = {
      latitude: item.latitude,
      longitude: item.longitude,
    };
    this.setState({
      editedItem: item,
      visible: true,
      hasPoint: true,
      previewPoint: point,
    });
  };

  showModal = () => {
    //console.log("showModal");
    this.setState({
      hasPoint: false,
      previewPoint: undefined,
      editedItem: undefined,
      readOnlyMap: true,
      visible: true,
    });
  };

  handleCancel = () => {
    const { form } = this.formRef.props;
    form.resetFields();
    this.setState({ visible: false, previewPoint: undefined, hasPoint: false });
  };

  showMap = (key) => {
    //console.log("showMap");
    let item = this.props.data.find((obj) => obj.key === key);
    this.setState({
      editedItem: item,
      visibleMap: true,
    });
  };

  showMapForm = (item) => {
    //console.log("showMapForm");
    this.setState({
      editedItem: item,
      visibleMap: true,
      readOnlyMap: false,
      edit: true,
    });
  };

  closeMap = () => {
    //console.log("closeMap");
    this.setState({
      //editedItem: undefined,
      visibleMap: false,
      readOnlyMap: true,
    });
  };

  closeMapForm = () => {
    //console.log("closeMapForm");
    const { form } = this.formRef.props;
    form.setFieldsValue({
      latitude: undefined,
      longitude: undefined,
    });
    this.setState({
      visibleMap: false,
      readOnlyMap: true,
      previewPoint: undefined,
      hasPoint: false,
    });
  };

  closeMapFormEdit = () => {
    //console.log("closeMapFormEdit");
    //console.log(this.state.editedItem);
    //console.log(this.state.previewPoint);
    if (
      this.state.editedItem &&
      this.state.previewPoint &&
      this.state.editedItem.latitude === this.state.previewPoint.latitude &&
      this.state.editedItem.longitude === this.state.previewPoint.longitude
    ) {
      this.setState({
        visibleMap: false,
        readOnlyMap: true,
        //previewPoint: undefined,
      });
    } else {
      let point = {
        latitude: this.state.editedItem.latitude,
        longitude: this.state.editedItem.longitude,
      };
      this.setState({
        visibleMap: false,
        readOnlyMap: true,
        previewPoint: point,
      });
    }
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
        values.user = this.state.editedItem.user;
        //console.log("Received values of form edit: ", values);
        this.props.edit(values);
      } else {
        //console.log("Received values of form new: ", values);
        this.props.add(values);
      }
      form.resetFields();
      this.setState({
        editedItem: undefined,
        visible: false,
        previewPoint: undefined,
        hasPoint: false,
        readOnlyMap: true,
      });
    });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  confirmDelete = (key) => {
    //console.log(this.props.data);
    let item = this.props.data.find((obj) => obj.key === key);
    console.log(item);
    confirm({
      title: `¿Está seguro de eliminar ${item.name}?`,
      okText: "Acepar",
      cancelText: "Cancelar",
      onOk: () => {
        //console.log(item.key);
        this.props.delete({
          key: item.key,
          user: item.user,
        });
      },
      onCancel() {},
    });
  };

  setCoordinatesForm = (point) => {
    //console.log(point);
    const { form } = this.formRef.props;
    form.setFieldsValue({
      latitude: point.latitude,
      longitude: point.longitude,
    });
    this.setState({
      previewPoint: point,
      hasPoint: true,
      visibleMap: false,
    });
  };

  render() {
    const {
      editedItem,
      visible,
      visibleMap,
      readOnlyMap,
      previewPoint,
      hasPoint,
      edit,
    } = this.state;

    const {
      columns,
      data,
      fieldsForm,
      title,
      loading,
      includesMap,
      includesContacts,
      visibleContacts,
      showContacts,
      closeContacts,
      columnsContacts,
      dataContacts,
      provider,
      fieldsFormContact,
      addContact,
      editContact,
      deleteContact,
      optionsMultipleSelect,
    } = this.props;

    //console.log(provider);

    const columns_table = this.set_columns(columns);

    return (
      <Row>
        <div>
          <Button
            type="primary"
            onClick={this.showModal}
            style={{ position: "absolute", right: 0 }}
          >
            Nuevo
          </Button>
          <CategoryForm
            fieldsForm={fieldsForm}
            wrappedComponentRef={this.saveFormRef}
            visible={visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            title={title}
            editedItem={editedItem}
            includesMap={includesMap}
            showMapForm={this.showMapForm}
            hasPoint={hasPoint}
            showContacts={showContacts}
            optionsMultipleSelect={optionsMultipleSelect}
          />
        </div>
        <br></br>
        <br></br>
        <Table columns={columns_table} dataSource={data} loading={loading} />
        <Map
          key={`map-${Math.random()}`}
          visible={visibleMap}
          close={this.closeMap}
          closeFromForm={this.closeMapForm}
          closeMapFormEdit={this.closeMapFormEdit}
          title={title}
          item={editedItem}
          readOnly={readOnlyMap}
          save={this.setCoordinatesForm}
          previewPoint={previewPoint}
          edit={edit}
        />
        {includesContacts && (
          <ListContacts
            provider={provider}
            visible={visibleContacts}
            close={closeContacts}
            columns={columnsContacts}
            data={dataContacts}
            fieldsFormContact={fieldsFormContact}
            addContact={addContact}
            editContact={editContact}
            deleteContact={deleteContact}
          />
        )}
      </Row>
    );
  }
}

export default CrudTable;
