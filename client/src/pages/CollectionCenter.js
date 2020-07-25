import React from "react";
import CrudTable from "../components/CrudTable";
import { Row } from "antd";
import Api from "../utils/Api";
import Message from "../utils/Message";
import Store from "../utils/Store";

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
    Api.get("collection-center/", {
      headers: {
        token: Store.getToken(),
      },
    })
      .then((response) => {
        //console.log(response);
        let data = [];
        response.data.map((item) => {
          let collectionCenter = {
            key: item.id,
            name: item.name,
            address: item.address,
            contactName: item.contactName,
            contactPhone: item.contactPhone,
            photo: item.photo,
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
        //console.log(error);
        this.props.handleErrorResponse(error, false);
      });
  };

  addCollectionCenter = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request post");
    //console.log(data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("contactName", data.contactName);
    formData.append("contactPhone", data.contactPhone);
    data.photo && formData.append("photo", data.photo);
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);
    formData.append("createdBy", Store.getUsername());
    //console.log(formData);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        token: Store.getToken(),
      },
    };
    Api.post("collection-center/", formData, config)
      .then((response) => {
        //console.log(response);
        Message.success("Centro de acopio agregado con éxito.");
        this.getCollectionCenter();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.success(
          "No se pudo agregar el centro de acopio, intente más tarde."
        );
        this.props.handleErrorResponse(error, false);
      });
  };

  editCollectionCenter = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request put");
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("contactName", data.contactName);
    formData.append("contactPhone", data.contactPhone);
    data.photo && formData.append("photo", data.photo);
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        token: Store.getToken(),
      },
    };

    Api.patch(`collection-center/${data.key}/`, formData, config)
      .then((response) => {
        //console.log(response);
        Message.success("Centro de acopio editado con éxito.");
        this.getCollectionCenter();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.success(
          "No se pudo editar el centro de acopio, intente más tarde."
        );
        this.props.handleErrorResponse(error, false);
      });
  };

  deleteCollectionCenter = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request delete");
    Api.delete(`collection-center/${data.key}/`, {
      headers: {
        token: Store.getToken(),
      },
    })
      .then((response) => {
        //console.log(response);
        Message.success("Centro de acopio eliminado con éxito.");
        this.getCollectionCenter();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.success(
          "No se pudo eliminar el centro de acopio, intente más tarde."
        );
        this.props.handleErrorResponse(error, false);
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
        title: "Contacto",
        key: "contactName",
      },
      {
        title: "Teléfono de contacto",
        key: "contactPhone",
      },
      {
        title: "Ubicación",
        key: "ubication",
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
        key: "contactName",
        label: "Nombre de contacto",
        required: true,
        maxLength: 50,
        type: "text",
      },
      {
        key: "contactPhone",
        label: "Teléfono de contacto",
        required: true,
        maxLength: 20,
        type: "phone",
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
      {
        key: "photo",
        label: "Foto del Centro de Acopio",
        required: false,
        maxLength: null,
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
