import React from "react";
import CrudTable from "../components/CrudTable";
import { Row } from "antd";
import Api from "../utils/Api";
import Message from "../utils/Message";
import Store from "../utils/Store";

class Provider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      visibleContacts: false,
      dataContacts: [],
      provider: undefined,
      dataCategories: [],
    };
  }

  componentDidMount = () => {
    //this.getProvider();
    this.getCategories();
  };

  showContacts = (key) => {
    //console.log("showContacts");
    let provider = this.state.data.find((obj) => obj.key === key);
    //console.log(provider);
    let contacts = [];
    provider.contacts.map((contact) => {
      //console.log(contact);
      let data = {
        key: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phoneNumber: contact.phoneNumber,
        social: contact.social,
      };
      contacts.push(data);
      return true;
    });
    this.setState(
      {
        dataContacts: contacts,
        provider: provider,
        visibleContacts: true,
      }
      //() => console.log(this.state)
    );
  };

  closeContacts = () => {
    this.setState({
      visibleContacts: false,
    });
  };

  getProvider = () => {
    //console.log("Request get");
    Api.get("provider/")
      .then((response) => {
        //console.log(response);
        let data = [];
        response.data.map((item) => {
          let categories = [];
          //console.log(item.categories);
          item.categories.map((id) => {
            let category = this.state.dataCategories.find(
              (obj) => obj.value === id
            );
            if (category) {
              categories.push({
                key: category.value,
                label: category.text,
              });
            }
            return true;
          });
          let provider = {
            key: item.id,
            name: item.name,
            address: item.address,
            phoneNumber: item.phoneNumber,
            email: item.email,
            tags: categories,
            categories: item.categories,
            contacts: item.contacts,
          };
          data.push(provider);
          return true;
        });
        console.log(data);
        this.setState({
          data: data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error);
      });
  };

  addProvider = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request post");
    console.log(data);
    Api.post("provider/", {
      name: data.name,
      address: data.address,
      phoneNumber: data.phoneNumber,
      email: data.email,
      categories: data.categories,
      createdBy: Store.getUsername(),
    })
      .then((response) => {
        //console.log(response);
        Message.success("Empresa agregada con éxito.");
        this.getCategories();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.error("No se pudo agregar la empresa, intente más tarde.");
      });
  };

  editProvider = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request put", data);
    Api.patch(`provider/${data.key}/`, {
      name: data.name,
      address: data.address,
      phoneNumber: data.phoneNumber,
      email: data.email,
      categories: data.categories,
      //createdBy: "reactclient",
    })
      .then((response) => {
        //console.log(response);
        Message.success("Empresa editada con éxito.");
        this.getProvider();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.error("No se pudo editar la empresa, intente más tarde.");
      });
  };

  deleteProvider = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request delete");
    Api.delete(`provider/${data.key}/`)
      .then((response) => {
        //console.log(response);
        Message.success("Empresa eliminada con éxito.");
        this.getProvider();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.error("No se pudo eliminar la empresa, intente más tarde.");
      });
  };

  addContact = (data) => {
    this.setState({
      loading: true,
    });
    //console.log(data);
    Api.post("provider-contact/", {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      social: data.social,
      provider: data.provider,
      createdBy: Store.getUsername(),
    })
      .then((response) => {
        //console.log(response);
        this.setState({
          visibleContacts: false,
        });
        Message.success("Contacto agregado con éxito.");
        this.getCategories();
      })
      .catch((error) => {
        //console.log(error);
        Message.error("No se pudo agregar al contacto, intente más tarde.");
      });
  };

  editContact = (data) => {
    this.setState({
      loading: true,
    });
    Api.patch(`provider-contact/${data.key}/`, {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      social: data.social,
      //provider: data.provider,
      //createdBy: "reactclient",
    })
      .then((response) => {
        //console.log(response);
        this.setState({
          visibleContacts: false,
        });
        Message.success("Contacto editado con éxito.");
        this.getCategories();
      })
      .catch((error) => {
        //console.log(error);
        Message.error("No se pudo editar al contacto, intente más tarde.");
      });
  };

  deleteContact = (key) => {
    this.setState({
      loading: true,
    });
    //console.log("Request delete", key);
    Api.delete(`provider-contact/${key}/`)
      .then((response) => {
        //console.log(response);
        this.setState({
          visibleContacts: false,
        });
        Message.success("Contacto eliminado con éxito.");
        this.getCategories();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.error("No se pudo eliminar al contacto, intente más tarde.");
      });
  };

  getCategories = () => {
    //console.log("categories");
    Api.get("category/")
      .then((response) => {
        let data = [];
        response.data.map((item) => {
          let category = {
            value: item.id,
            text: item.name,
          };
          data.push(category);
          return true;
        });
        this.setState(
          {
            dataCategories: data,
          },
          () => this.getProvider()
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const {
      data,
      loading,
      visibleContacts,
      dataContacts,
      provider,
      dataCategories,
    } = this.state;

    const columns = [
      {
        title: "Nombre",
        key: "name",
      },
      {
        title: "Dirección",
        key: "address",
      },
      {
        title: "Categorías",
        key: "tags",
      },
      {
        title: "Teléfono",
        key: "phoneNumber",
      },
      {
        title: "Correo",
        key: "email",
      },
      {
        title: "Contactos",
        key: "contacts",
      },
      {
        title: "Acción",
        key: "action",
      },
    ];

    const columnsContacts = [
      {
        title: "Nombres",
        key: "firstName",
      },
      {
        title: "Apellidos",
        key: "lastName",
      },
      {
        title: "Teléfono",
        key: "phoneNumber",
      },
      {
        title: "Red social",
        key: "social",
      },
      {
        title: "Acción",
        key: "action",
      },
    ];

    const fieldsForm = [
      {
        key: "name",
        label: "Nombre",
        required: true,
        maxLength: 50,
        type: "text",
      },
      {
        key: "address",
        label: "Dirección",
        required: true,
        maxLength: 500,
        type: "text",
      },
      {
        key: "phoneNumber",
        label: "Teléfono",
        required: true,
        maxLength: 20,
        type: "phone",
      },
      {
        key: "email",
        label: "Correo",
        required: true,
        maxLength: 50,
        type: "email",
      },
      {
        key: "categories",
        label: "Categorías",
        required: true,
        maxLength: null,
        type: "multipleSelect",
      },
    ];

    const fieldsFormContact = [
      {
        key: "firstName",
        label: "Nombres",
        required: true,
        maxLength: 50,
        type: "text",
      },
      {
        key: "lastName",
        label: "Apellidos",
        required: true,
        maxLength: 50,
        type: "text",
      },
      {
        key: "phoneNumber",
        label: "Teléfono",
        required: true,
        maxLength: 20,
        type: "phone",
      },
      {
        key: "social",
        label: "Red social",
        required: false,
        maxLength: 50,
        type: "url",
      },
    ];

    return (
      <Row>
        <h3>Empresas</h3>
        <CrudTable
          columns={columns}
          data={data}
          fieldsForm={fieldsForm}
          title="Empresas"
          add={this.addProvider}
          edit={this.editProvider}
          delete={this.deleteProvider}
          loading={loading}
          includesMap={false}
          includesContacts={true}
          visibleContacts={visibleContacts}
          showContacts={this.showContacts}
          closeContacts={this.closeContacts}
          columnsContacts={columnsContacts}
          dataContacts={dataContacts}
          provider={provider}
          fieldsFormContact={fieldsFormContact}
          addContact={this.addContact}
          editContact={this.editContact}
          deleteContact={this.deleteContact}
          optionsMultipleSelect={dataCategories}
        />
      </Row>
    );
  }
}

export default Provider;
