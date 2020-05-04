import React from "react";
import CrudTable from "../components/CrudTable";
import { Row } from "antd";
import Api from "../utils/Api";

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
          let category = 
		    this.state.dataCategories.find(item.category.value);
          if (category) {
              let infoCategory = {
                key: category.value,
                label: category.text,
              };
            }
          
          let provider = 
		    this.state.dataProviders.find(item.provider.value);
          if (provider) {
              let infoProvider = {
                key: provider.value,
                label: provider.text,
              };
            }

          let collectionCenter = 
		    this.state.dataCollectionCenters.find(item.collectionCenter.value);
          if (collectionCenter) {
              let infoCollectionCenter = {
                key: collectionCenter.value,
                label: collectionCenter.text,
              };
            }

            return true;
          });
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
    Api.post("donation/", {
      provider: data.provider,
      category: data.category,
      description: data.description,
      collectionCenter: data.collectionCenter,
      beginDate: data.beginDate,
      expirationDate: data.expirationDate,
      photo: data.photo,
      createdBy: "reactclient",
    })
      .then((response) => {
        //console.log(response);
        this.getDonations();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error);
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
          () => this.getDonations()
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
    const { data, loading } = this.state;

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
	  {
        title: "Acción",
        key: "action",
      },
    ];

    const fieldsForm = [
      {
        key: "provider",
        label: "Proveedor",
        required: true,
        maxLength: 50,
        type: "number",
      },
      {
        key: "category",
        label: "Categoría",
        required: true,
        maxLength: 500,
        type: "number",
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
        type: "number",
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
        <h3>Centros de acopio</h3>
        <CrudTable
          columns={columns}
          data={data}
          fieldsForm={fieldsForm}
          title="Donaciones"
          add={this.addDonation}
          loading={loading}
          includesMap={true}
        />
      </Row>
    );
  }
}

export default Donation;
