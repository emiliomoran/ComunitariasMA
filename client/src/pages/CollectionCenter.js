import React from "react";
import CrudTable from "../components/CrudTable";
import { Row } from "antd";
import Api from "../utils/Api";

class CollectionCenters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
    };
  }

  componentDidMount = () => {
    this.getCollectionCenter();
  };

  getCollectionCenter = () => {
    //console.log("Request get");
    Api.get("collection-center/")
      .then((response) => {
        //console.log(response);
        let data = [];
        response.data.map((item) => {
          let collectionCenter = {
            key: item.id,
            name: item.name,
            address: item.address,
            latitude: item.latitude,
            longitude: item.longitude,
          };
          data.push(collectionCenter);
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

  addCollectionCenter = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request post");
    console.log(data);
    Api.post("collection-center/", {
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      createdBy: "reactclient",
    })
      .then((response) => {
        console.log(response);
        this.getCollectionCenter();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error);
      });
  };

  editCollectionCenter = (data) => {
    this.setState({
      loading: true,
    });
    console.log("Request put");
    Api.put(`collection-center/${data.key}/`, {
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      createdBy: "reactclient",
    })
      .then((response) => {
        console.log(response);
        this.getCollectionCenter();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error);
      });
  };

  deleteCollectionCenter = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request delete");
    Api.delete(`collection-center/${data.key}/`)
      .then((response) => {
        console.log(response);
        this.getCollectionCenter();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error);
      });
  };

  render() {
    const { data, loading } = this.state;

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
        title: "Acción",
        key: "action",
      },
      {
        title: "Ubicación",
        key: "ubication",
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
        key: "latitude",
        label: "Latitud",
        required: true,
        maxLength: null,
        type: "coordinate",
      },
      {
        key: "longitude",
        label: "Longitud",
        required: true,
        maxLength: null,
        type: "coordinate",
      },
    ];

    return (
      <Row>
        <h3>Centros de acopio</h3>
        <CrudTable
          columns={columns}
          data={data}
          fieldsForm={fieldsForm}
          title="Centro de acopio"
          add={this.addCollectionCenter}
          edit={this.editCollectionCenter}
          delete={this.deleteCollectionCenter}
          loading={loading}
          includesMap={true}
        />
      </Row>
    );
  }
}

export default CollectionCenters;
