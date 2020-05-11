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
import PasswordManager from "./PasswordManager";

const { TextArea } = Input;
const { confirm } = Modal;
const { Option } = Select;

const CategoryForm = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    setRules = (field) => {
      let rules = [];

      if (field.required) {
        if (field.type === "password" && !this.props.editedItem) {
          rules.push({
            required: field.required,
            message: `${field.label} requerido!`,
          });
        } else if (field.type !== "password") {
          rules.push({
            required: field.required,
            message: `${field.label} requerido!`,
          });
        }
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
        fieldsForm,
        title,
        editedItem,
        includesMap,
        showMapForm,
        hasPoint,
        optionsMultipleSelect,
        onChangeFileUpload,
        file,
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
                    display:
                      field.type === "coordinate"
                        ? "none"
                        : editedItem && field.type === "password"
                        ? "none"
                        : "block",
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
                      field.type === "url" ||
                      field.type === "coordinate" ? (
                      <Input />
                    ) : field.type === "textArea" ? (
                      <TextArea rows={5} />
                    ) : field.type === "password" ? (
                      <Input type="password" />
                    ) : field.type === "file" ? ( 
                      editedItem ? <div><img src={file} width="90%"/>
                      <br /><br />
                      <input type="file" accept="image/*" onChange={onChangeFileUpload} />
                      </div> :
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onChangeFileUpload}
                      />
                    ) : (
                      <Select mode="multiple" placeholder="Seleccionar">
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
      file: undefined,
      visiblePhoto: false,
      photoSRC: undefined,
    };
  }

  onChangeFileUpload = (e) => {
    console.log(e);
    this.setState(
      {
        file: e.target.files[0],
      },
      () => console.log(this.state.file)
    );
  };

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
              {item.tags &&
                item.tags.map((tag) => {
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
      } else if (c.key === "passwordManager") {
        item = {
          title: c.title,
          key: c.key,
          render: (text, record) => (
            <span>
              <Button
                type="link"
                onClick={() => this.props.showPasswordManager(1, record.user)}
              >
                Cambiar contraseña
              </Button>
              <Divider type="vertical" />
              <Button
                type="link"
                onClick={() => this.props.showPasswordManager(2, record.user)}
              >
                Restablecer contraseña
              </Button>
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
                onClick={() => this.showPhotoModal(record.key)}
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
    let point = {
      latitude: item.latitude,
      longitude: item.longitude,
    };
    let photo = item.photo;
    this.setState({
      editedItem: item,
      visible: true,
      hasPoint: true,
      previewPoint: point,
      file: photo,
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
      file: undefined,
    });
  };

  handleCancel = () => {
    const { form } = this.formRef.props;
    form.resetFields();
    this.setState({
      visible: false,
      previewPoint: undefined,
      hasPoint: false,
      file: undefined,
    });
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
        if (this.state.file) {
          values.photo = this.state.file;
        }
        this.props.edit(values);
      } else {
        //console.log("Received values of form new: ", values);
        if (this.state.file) {
          values.photo = this.state.file;
        }
        this.props.add(values);
      }
      form.resetFields();
      this.setState({
        editedItem: undefined,
        visible: false,
        previewPoint: undefined,
        hasPoint: false,
        readOnlyMap: true,
        file: undefined,
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

  showPhotoModal = (key) => {
    console.log("Foto Abierto");
    let item = this.props.data.find((obj) => obj.key === key);
    console.log(item.photo);
    //document.getElementById("photoTAG").src = item.photo;
    this.setState({
      //editedItem: item,
      visiblePhoto: true,
      photoSRC: item.photo,
    });
  };

  closePhotoModal = () => {
    console.log("Foto Cerrado");
    this.setState({
      //editedItem: undefined,
      visiblePhoto: false,
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
      visiblePhoto,
      photoSRC,
    } = this.state;

    const {
      columns,
      data,
      fieldsForm,
      title,
      loading,
      includesMap,
      includesContacts,
      includesPassword,
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
      visiblePasswordManager,
      titlePasswordManager,
      fieldsPasswordManager,
      closePasswordManager,
      changePassword,
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
            onChangeFileUpload={this.onChangeFileUpload}
            file={this.state.file}
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
        <Modal
          title={title}
          visible={visiblePhoto}
          onCancel={this.closePhotoModal}
          centered={true}
          footer={null}
        >
          <img id="photoTAG" src={this.state.photoSRC} alt="foto de campaña" 
          width="90%" height="90%" />
        </Modal>
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
        {includesPassword && (
          <PasswordManager
            visible={visiblePasswordManager}
            title={titlePasswordManager}
            onCancel={closePasswordManager}
            fieldsForm={fieldsPasswordManager}
            changePassword={changePassword}
          />
        )}
      </Row>
    );
  }
}

export default CrudTable;
