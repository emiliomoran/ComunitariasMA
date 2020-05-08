import React from "react";
import CrudTable from "../components/CrudTable";
import { Row } from "antd";
import Api from "../utils/Api";

class Campaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
    };
  }

  componentDidMount = () => {
    this.getCampaign();
  };

  getCampaign = () => {
    Api.get("campaign/")
      .then((response) => {
        let data = [];
        response.data.map((item) => {
          let campaign = {
            key: item.id,
            name: item.name,
            description: item.description,
            contactName: item.contactName,
            photo: item.photo,
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
        console.log(error);
      });
  };

  addCampaign = (data) => {
    this.setState({
      loading: true,
    });
    console.log(data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("contactName", data.contactName);
    formData.append("description", data.description);
    formData.append("photo", data.photo);
    formData.append("createdBy", "reactclient");
    //console.log(formData);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    Api.post("campaign/", formData, config)
      .then((response) => {
        console.log(response);
        this.getCampaign();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error);
      });
  };

  editCampaign = (data) => {
    this.setState({
      loading: true,
    });
    console.log(data);
    Api.put(`campaign/${data.key}/`, {
      name: data.name,
      contactName: data.contactName,
      description: data.description,
      photo: data.photo,
      createdBy: "reactclient",
    })
      .then((response) => {
        console.log(response);
        this.getCampaign();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error);
      });
  };

  deleteCampaign = (data) => {
    this.setState({
      loading: true,
    });
    Api.delete(`campaign/${data.key}/`)
      .then((response) => {
        console.log(response);
        this.getCampaign();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error);
      });
  };

  deleteLogicCampaign = (data) => {
    this.setState({
      loading: true,
    });
    Api.put(`campaign/${data.key}/`, {
      state: 0,
    })
      .then((response) => {
        console.log(response);
        this.getCampaign();
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
        title: "Descripción",
        key: "description",
      },
      {
        title: "Contacto",
        key: "contactName",
      },
      {
        title: "Acción",
        key: "action",
      },
      {
        title: "Foto",
        key: "photo",
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
        key: "description",
        label: "Descripción",
        required: true,
        maxLength: 50,
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
        />
      </Row>
    );
  }
}

export default Campaign;
