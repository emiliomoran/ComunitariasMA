import React from "react";
import CrudTable from "../components/CrudTable";
import { Row } from "antd";
import Api from "../utils/Api";
import Message from "../utils/Message";
import Store from "../utils/Store";

class Campaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      dataScopes: [],
    };
  }

  componentDidMount = () => {
    this.getScopes();
  };

  getScopes = () => {
    //console.log("scopes");
    Api.get("scope/")
      .then((response) => {
        let data = [];
        response.data.map((item) => {
          data.push({
            value: item.id,
            text: item.name,
          });
          return true;
        });
        this.setState(
          {
            dataScopes: data,
          },
          () => this.getCampaign()
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getCampaign = () => {
    Api.get("campaign/")
      .then((response) => {
        let data = [];
        response.data.map((item) => {
          let scope = this.state.dataScopes.find(
            (obj) => obj.value === item.scope);
          let infoScope = undefined;
          if (scope) {
            infoScope = scope.text;
            //console.log("Scope: "+scope.text);
          }
          let campaign = {
            key: item.id,
            name: item.name,
            description: item.description,
            contactName: item.contactName,
            photo: item.photo,
            scope: infoScope,
          };
          data.push(campaign);
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
      });
  };

  addCampaign = (data) => {
    this.setState({
      loading: true,
    });
    //console.log(data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("contactName", data.contactName);
    formData.append("description", data.description);
    formData.append("scope", data.scope);
    formData.append("photo", data.photo);
    formData.append("createdBy", Store.getUsername());
    //console.log(formData);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    Api.post("campaign/", formData, config)
      .then((response) => {
        //console.log(response);
        Message.success("Campaña agregada con éxito.");
        this.getCampaign();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.error("No se pudo agregar la campaña, intente más tarde.");
      });
  };

  editCampaign = (data) => {
    this.setState({
      loading: true,
    });
    //console.log(data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("contactName", data.contactName);
    formData.append("description", data.description);
    if(typeof data.scope === "number"){
      //console.log("if para scope");
      formData.append("scope", data.scope);
    }
    if(data.photo instanceof File){
      //console.log("ingresa a if de File");
      formData.append("photo", data.photo);
    }
    //formData.append("createdBy", "reactclient");
    //console.log(formData);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    Api.patch(`campaign/${data.key}/`, formData, config)
      .then((response) => {
        //console.log(response);
        Message.success("Campaña editada con éxito.");
        this.getCampaign();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.error("No se pudo editar la campaña, intente más tarde.");
      });
  };

  deleteCampaign = (data) => {
    this.setState({
      loading: true,
    });
    Api.delete(`campaign/${data.key}/`)
      .then((response) => {
        //console.log(response);
        Message.success("Campaña eliminada con éxito.");
        this.getCampaign();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.error("No se pudo eliminar la campaña, intente más tarde.");
      });
  };

  render() {
    const { 
      data, 
      loading,
      dataScopes
    } = this.state;

    const columns = [
      {
        title: "Nombre",
        key: "name",
      },
      {
        title: "Descripción",
        key: "description",
        ellipsis: true,
      },
      {
        title: "Contacto",
        key: "contactName",
      },
      {
        title: "Alcance",
        key: "scope",
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
        label: "Nombre de Campaña",
        required: true,
        maxLength: 50,
        type: "text",
      },
      {
        key: "contactName",
        label: "Contacto",
        required: true,
        maxLength: 50,
        type: "text",
      },
      {
        key: "scope",
        label: "Alcance",
        required: true,
        maxLength: null,
        type: "select",
      },
      {
        key: "description",
        label: "Descripción",
        required: true,
        maxLength: 500,
        type: "textArea",
      },
      {
        key: "photo",
        label: "Foto de Campaña",
        required: true,
        type: "file",
      },
    ];

    return (
      <Row>
        <h3>Campañas</h3>
        <CrudTable
          columns={columns}
          data={data}
          fieldsForm={fieldsForm}
          title="Campaña"
          add={this.addCampaign}
          edit={this.editCampaign}
          delete={this.deleteCampaign}
          loading={loading}
          includesMap={false}
          optionsScope={dataScopes}
        />
      </Row>
    );
  }
}

export default Campaign;
