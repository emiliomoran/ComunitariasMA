import React from "react";
import CrudTable from "../components/CrudTable";
import { Row } from "antd";
import Api from "../utils/Api";

class SupportGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      visibleMembers: false,
      dataMembers: [],
      supportGroup: undefined,
    };
  }

  componentDidMount = () => {
    this.getSupportGroups();
  };

  showMember = (key) => {
    //console.log("showMember");
    let supportGroup = this.state.data.find((obj) => obj.key === key);
    //console.log(supportGroup);
    let members = [];
    supportGroup.members.map((contact) => {
      //console.log(contact);
      let data = {
        key: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phoneNumber: contact.phoneNumber,
      };
      members.push(data);
      return true;
    });
    this.setState(
      {
        dataMembers: members,
        provider: supportGroup,
        visibleMembers: true,
      }
      //() => console.log(this.state)
    );
  };

  closeMembers = () => {
    this.setState({
      visibleMembers: false,
    });
  };

  getSupportGroups = () => {
    //console.log("Request get");
    Api.get("suppot-group/")
      .then((response) => {
        //console.log(response);
        let data = [];
        response.data.map((item) => {
          let supportGroup = {
            key: item.id,
            name: item.name,
            username: item.username,
            password: item.password,
            members: item.members,
          };
          data.push(supportGroup);
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

  addSupportGroup = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request post");
    //console.log(data);
    Api.post("support-group/", {
      name: data.name,
      username: data.username,
      password: data.password,
      createdBy: "reactclient",
    })
      .then((response) => {
        //console.log(response);
        this.getSupportGroups();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error);
      });
  };

  editSupportGroup = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request put", data);
    Api.put(`provider/${data.key}/`, {
      name: data.name,
      username: data.username,
      password: data.password,
      createdBy: "reactclient",
    })
      .then((response) => {
        //console.log(response);
        this.getSupportGroups();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error);
      });
  };

  deleteSupportGroup = (key) => {
    this.setState({
      loading: true,
    });
    //console.log("Request delete");
    Api.delete(`support-group/${key}/`)
      .then((response) => {
        //console.log(response);
        this.getSupportGroups();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error);
      });
  };

  addMember = (data) => {
    this.setState({
      loading: true,
    });
    //console.log(data);
    Api.post("group-member/", {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      supportgroup: data.supportgroup,
      createdBy: "reactclient",
    })
      .then((response) => {
        //console.log(response);
        this.setState({
          visibleMembers: false,
        });
        this.getSupportGroups();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editMember = (data) => {
    this.setState({
      loading: true,
    });
    Api.put(`group-member/${data.key}/`, {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      supportgroup: data.supportgroup,
      createdBy: "reactclient",
    })
      .then((response) => {
        //console.log(response);
        this.setState({
          visibleMembers: false,
        });
        this.getSupportGroups();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deleteMember = (key) => {
    this.setState({
      loading: true,
    });
    //console.log("Request delete", key);
    Api.delete(`group-member/${key}/`)
      .then((response) => {
        //console.log(response);
        this.setState({
          visibleMembers: false,
        });
        this.getSupportGroups();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error);
      });
  };

  render() {
    const {
      data,
      loading,
      visibleMembers,
      dataMembers,
      provider,
      dataCategories,
    } = this.state;

    const columns = [
      {
        title: "Nombre",
        key: "name",
      },
      {
        title: "Usuario",
        key: "username",
      },
      {
        title: "Contraseña",
        key: "password",
      },
      {
        title: "Acción",
        key: "action",
      },
    ];

    const columnsMembers = [
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
        key: "username",
        label: "Usuario",
        required: true,
        maxLength: 50,
        type: "text",
      },
      {
        key: "password",
        label: "Contraseña",
        required: true,
        maxLength: 20,
        type: "password",
      },
    ];

    const fieldsFormMember = [
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
    ];

    return (
      <Row>
        <h3>Grupos de apoyo</h3>
        <CrudTable
          columns={columns}
          data={data}
          fieldsForm={fieldsForm}
          title="Grupos de apoyo"
          add={this.addSupportGroup}
          edit={this.editSupportGroup}
          delete={this.deleteSupportGroup}
          loading={loading}
          includesMap={false}
          includesContacts={true}
          visibleContacts={visibleMembers}
          showContacts={this.showMember}
          closeContacts={this.closeMembers}
          columnsContacts={columnsMembers}
          dataContacts={dataMembers}
          provider={provider}
          fieldsFormContact={fieldsFormMember}
          addContact={this.addMember}
          editContact={this.editMember}
          deleteContact={this.deleteContact}
          optionsMultipleSelect={dataCategories}
        />
      </Row>
    );
  }
}

export default SupportGroup;
