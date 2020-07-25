import React from "react";
import CrudTable from "../components/CrudTable";
import { Row } from "antd";
import Api from "../utils/Api";
import Message from "../utils/Message";
import Store from "../utils/Store";

class Donation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      dataCategories: [],
      dataProviders: [],
      dataCollectionCenters: [],
      dataUsers: [],
    };
  }

  componentDidMount = () => {
    this.getCategories();
  };

  getDonations = () => {
    //console.log(this.state.dataUsers);
    Api.get("donation/", {
      headers: {
        token: Store.getToken(),
      },
    })
      .then((response) => {
        //console.log(response);
        let data = [];
        response.data.map((item) => {
          let users = [];
          item.users.map((id) => {
            let user = this.state.dataUsers.find(
              (userId) => userId.value === id
            );
            if (user) {
              users.push({
                key: user.value,
                label: user.text,
              });
            }
            return true;
          });
          let category = this.state.dataCategories.find(
            (categoryId) => categoryId.value === item.category
          );
          let infoCategory = [];
          if (category) {
            infoCategory = category.text;
          }

          let provider = this.state.dataProviders.find(
            (providerId) => providerId.value === item.provider
          );
          let infoProvider = undefined;
          if (provider) {
            infoProvider = provider.text;
          }

          let collectionCenter = this.state.dataCollectionCenters.find(
            (collectionCenterId) =>
              collectionCenterId.value === item.collectionCenter
          );
          let infoCollectionCenter = undefined;
          if (collectionCenter) {
            infoCollectionCenter = collectionCenter.text;
          }
          let stateName = "";
          if (item.state === 1) {
            stateName = "Sin utilizar";
          } else {
            stateName = "Utilizada";
          }
          let donation = {
            key: item.id,
            provider: infoProvider,
            category: infoCategory,
            description: item.description,
            collectionCenter: infoCollectionCenter,
            users: item.users,
            tags: users,
            beginDate: item.beginDate,
            expirationDate: item.expirationDate,
            photo: item.photo,
            state: stateName,
            state_code: item.state,
          };
          data.push(donation);
          return true;
        });
        //console.log(data);
        this.setState({
          data: data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        this.props.handleErrorResponse(error, false);
      });
  };

  addDonation = (data) => {
    this.setState({
      loading: true,
    });
    const formData = new FormData();
    formData.append("provider", data.provider);
    formData.append("category", data.category);
    formData.append("description", data.description);
    let users = data.users ? data.users : [];
    users.map((user) => formData.append("users", user));
    //console.log(formData.get("users"));
    if (typeof data.collectionCenter !== "undefined")
      formData.append("collectionCenter", data.collectionCenter);
    if (typeof data.beginDate !== "undefined")
      formData.append("beginDate", data.beginDate);
    if (typeof data.expirationDate !== "undefined")
      formData.append("expirationDate", data.expirationDate);
    if (typeof data.photo !== "undefined") formData.append("photo", data.photo);
    formData.append("createdBy", Store.getUsername());

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        token: Store.getToken(),
      },
    };

    Api.post("donation/", formData, config)
      .then((response) => {
        Message.success("Donación agregada con éxito.");
        this.getDonations();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error.response.data);
        Message.error("No se pudo agregar la donación, intente más tarde.");
        this.props.handleErrorResponse(error, false);
      });
  };

  getCategories = () => {
    Api.get("category/", {
      headers: {
        token: Store.getToken(),
      },
    })
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
          () => this.getProviders()
        );
      })
      .catch((error) => {
        //console.log(error);
        this.props.handleErrorResponse(error, false);
      });
  };

  getProviders = () => {
    Api.get("provider/", {
      headers: {
        token: Store.getToken(),
      },
    })
      .then((response) => {
        let data = [];
        response.data.map((item) => {
          let provider = {
            value: item.id,
            text: item.name,
          };
          data.push(provider);
          return true;
        });
        this.setState(
          {
            dataProviders: data,
          },
          () => this.getCollectionCenters()
        );
      })
      .catch((error) => {
        //console.log(error);
        this.props.handleErrorResponse(error, false);
      });
  };

  getCollectionCenters = () => {
    Api.get("collection-center/", {
      headers: {
        token: Store.getToken(),
      },
    })
      .then((response) => {
        let data = [];
        response.data.map((item) => {
          let collectionCenter = {
            value: item.id,
            text: item.name,
          };
          data.push(collectionCenter);
          return true;
        });
        this.setState(
          {
            dataCollectionCenters: data,
          },
          () => this.getVolunteers()
        );
      })
      .catch((error) => {
        //console.log(error);
        this.props.handleErrorResponse(error, false);
      });
  };

  getVolunteers = () => {
    Api.get("volunteer/", {
      headers: {
        token: Store.getToken(),
      },
    })
      .then((response) => {
        let data = [];
        response.data.map((item) => {
          let user = {
            value: item.user,
            text: item.firstName.concat(" ", item.lastName),
          };
          data.push(user);
          return true;
        });
        this.setState(
          {
            dataUsers: data,
          },
          () => this.getSupportGroups()
        );
      })
      .catch((error) => {
        //console.log(error);
        this.props.handleErrorResponse(error, false);
      });
  };

  getSupportGroups = () => {
    Api.get("support-group/", {
      headers: {
        token: Store.getToken(),
      },
    })
      .then((response) => {
        let data = [];
        response.data.map((item) => {
          let user = {
            value: item.user,
            text: item.name,
          };
          data.push(user);
          return true;
        });

        data = this.state.dataUsers.concat(data);
        //console.log(data);
        this.setState(
          {
            dataUsers: data,
          },
          () => this.getDonations()
        );
      })
      .catch((error) => {
        //console.log(error);
        this.props.handleErrorResponse(error, false);
      });
  };

  editDonationState = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request put", data);
    Api.patch(
      `donation/${data.key}/`,
      {
        state: 0,
        //createdBy: "reactclient",
      },
      {
        headers: {
          token: Store.getToken(),
        },
      }
    )
      .then((response) => {
        //console.log(response);
        Message.success("Estado de donación modificado con éxito.");
        this.getCategories();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.error(
          "No se pudo modificar el estado de la donación, intente más tarde."
        );
        this.props.handleErrorResponse(error, false);
      });
  };

  render() {
    const {
      data,
      loading,
      dataCategories,
      dataCollectionCenters,
      dataProviders,
      dataUsers,
    } = this.state;

    const columns = [
      {
        title: "Proveedor",
        key: "provider",
      },
      {
        title: "Categoría",
        key: "category",
      },
      {
        title: "Descripción",
        key: "description",
      },
      {
        title: "Centro de Acopio",
        key: "collectionCenter",
        search: true,
      },
      {
        title: "Encargado",
        key: "tags",
      },
      {
        title: "Comienzo de uso",
        key: "beginDate",
      },
      {
        title: "Fecha de Expiración",
        key: "expirationDate",
      },
      {
        title: "Foto",
        key: "photo",
      },
      {
        title: "Estado",
        key: "state",
      },
      {
        title: "Modificar estado",
        key: "change_state",
      },
    ];

    const fieldsForm = [
      {
        key: "provider",
        label: "Proveedor",
        required: true,
        maxLength: null,
        type: "select",
      },
      {
        key: "category",
        label: "Categoría",
        required: true,
        maxLength: null,
        type: "select",
      },
      {
        key: "description",
        label: "Descripción",
        required: true,
        maxLength: null,
        type: "text",
      },
      {
        key: "collectionCenter",
        label: "Centro de Acopio",
        required: false,
        maxLength: null,
        type: "select",
      },
      {
        key: "users",
        label: "Encargados",
        required: true,
        maxLength: null,
        type: "multipleSelect",
      },
      {
        key: "beginDate",
        label: "Comienzo de uso",
        required: false,
        maxLength: null,
        type: "date",
      },
      {
        key: "expirationDate",
        label: "Fecha de Expiración",
        required: false,
        maxLength: null,
        type: "date",
      },
      {
        key: "photo",
        label: "Foto",
        required: false,
        type: "file",
      },
    ];

    return (
      <Row>
        <h3>Donaciones</h3>
        <CrudTable
          columns={columns}
          data={data}
          fieldsForm={fieldsForm}
          title="Donación"
          add={this.addDonation}
          patch={this.editDonationState}
          loading={loading}
          includesMap={false}
          optionsProvider={dataProviders}
          optionsCollectionCenter={dataCollectionCenters}
          optionsCategory={dataCategories}
          optionsMultipleSelect={dataUsers}
        />
      </Row>
    );
  }
}

export default Donation;
