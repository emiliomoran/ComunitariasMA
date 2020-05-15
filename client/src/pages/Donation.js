import React from "react";
import CrudTable from "../components/CrudTable";
import { Row } from "antd";
import Api from "../utils/Api";
import Message from "../utils/Message";

class Donation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      dataCategories: [],
      dataProviders: [],
      dataCollectionCenters: [],
    };
  }

  componentDidMount = () => {
    this.getCategories();
  };
  
  getDonations = () => {
    Api.get("donation/")
      .then((response) => {
        let data = [];
        response.data.map((item) => {
          
          let category = this.state.dataCategories.find(
            categoryId => categoryId.value === item.category);
          let infoCategory = [];
            if (category) {
                infoCategory = category.text;
              }
           
          let provider = this.state.dataProviders.find(
            providerId => providerId.value === item.provider);
          let infoProvider = undefined;
            if (provider) {
                infoProvider = provider.text;
            }

          let collectionCenter = this.state.dataCollectionCenters.find(
            collectionCenterId => collectionCenterId.value === item.collectionCenter);
          let infoCollectionCenter = undefined;
            if (collectionCenter) {
              infoCollectionCenter = collectionCenter.text;
            }
            let donation = {
              key: item.id,
              provider: infoProvider,
              category: infoCategory,
              description: item.description,
              collectionCenter: infoCollectionCenter,
              beginDate: item.beginDate,
              expirationDate: item.expirationDate,
              photo: item.photo,
            };
            data.push(donation);
            return true;
        });
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
  
  addDonation = (data) => {
    this.setState({
      loading: true,
    });
    const formData = new FormData();
    formData.append("provider", data.provider);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("collectionCenter", data.collectionCenter);
    if (typeof(data.beginDate)==="undefined")
      formData.append("beginDate", "");
    else formData.append("beginDate", data.beginDate);
    if (typeof(data.expirationDate)==="undefined")
      formData.append("expirationDate", "");
    else formData.append("expirationDate", data.expirationDate);
    console.log(data.photo);
    formData.append("photo", data.photo);
    formData.append("createdBy", "reactclient");

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    Api.post("donation/",formData, config)
      .then((response) => {
        Message.success("Donación agregada con éxito.");
        this.getDonations();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error.response.data);
        Message.error("No se pudo agregar la donación, intente más tarde.");
      });
  };
  
  getCategories = () => {
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
          () => this.getProviders()
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  getProviders = () => {
    Api.get("provider/")
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
        console.log(error);
      });
  };
  
  getCollectionCenters = () => {
    Api.get("collection-center/")
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
          () => this.getDonations()
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
      dataCategories,
      dataCollectionCenters,
      dataProviders,
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
        required: true,
        maxLength: null,
        type: "select",
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
        required: true,
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
          loading={loading}
          includesMap={false}
          optionsProvider={dataProviders}
          optionsCollectionCenter={dataCollectionCenters}
          optionsCategory={dataCategories}
        />
      </Row>
    );
  }
}

export default Donation;
