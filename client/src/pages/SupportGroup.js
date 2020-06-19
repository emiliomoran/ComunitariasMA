import React from "react";
import CrudTable from "../components/CrudTable";
import { Row } from "antd";
import Api from "../utils/Api";
import Message from "../utils/Message";
import Store from "../utils/Store";

class SupportGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      visibleMembers: false,
      dataMembers: [],
      supportGroup: undefined,
      dataUsers: [],
      visiblePasswordManager: false,
      titlePasswordManager: "",
      fieldsPasswordManager: [],
      user_id: undefined,
    };
  }

  componentDidMount = () => {
    this.getUsers();
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

  showPasswordManager = (opt, user_id) => {
    let title = "Cambio de contraseña";
    let fields = [
      {
        key: "currentPassword",
        label: "Contraseña actual",
        required: true,
        maxLength: 20,
        type: "password",
      },
      {
        key: "newPassword",
        label: "Contraseña nueva",
        required: true,
        maxLength: 20,
        type: "password",
      },
    ];
    if (opt === 2) {
      //Recovery password
      title = "Recuperación de contraseña";
      fields = [
        {
          key: "newPassword",
          label: "Contraseña nueva",
          required: true,
          maxLength: 20,
          type: "password",
        },
      ];
    }
    this.setState({
      visiblePasswordManager: true,
      titlePasswordManager: title,
      fieldsPasswordManager: fields,
      user_id: user_id,
    });
  };

  closePasswordManager = () => {
    this.setState({
      visiblePasswordManager: false,
    });
  };

  getSupportGroups = () => {
    //console.log("Request get");
    //console.log(this.state.dataUsers);
    Api.get("support-group/")
      .then((response) => {
        //console.log(response);
        let data = [];
        response.data.map((item) => {
          let user = this.state.dataUsers.find((obj) => obj.key === item.user);
          let supportGroup = {
            key: item.id,
            name: item.name,
            username: user.username,
            user: item.user,
            members: item.members,
            email: user.email,
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

  getUsers = () => {
    Api.get("user/")
      .then((response) => {
        //console.log(response);
        let data = [];
        response.data.map((item) => {
          let user = {
            key: item.id,
            username: item.username,
            email: item.email,
          };
          data.push(user);
          return true;
        });
        this.setState(
          {
            dataUsers: data,
            //loading: false,
          },
          () => this.getSupportGroups()
        );
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
    //Add new user
    Api.post("user/", {
      username: data.username,
      password: data.password,
      email: data.email,
      role: "Group",
      createdBy: Store.getUsername(),
    })
      .then((response) => {
        //console.log(response);
        const user_id = response.data.id;
        //Add new Support Group
        Api.post("support-group/", {
          name: data.name,
          user: user_id,
          createdBy: Store.getUsername(),
        })
          .then((response) => {
            //console.log(response);
            Message.success("Grupo de apoyo agregado con éxito.");
            this.getUsers();
          })
          .catch((error) => {
            this.setState({
              loading: false,
            });
            //console.log(error);
            Message.error(
              "No se pudo agregar el grupo de apoyo, intente más tarde."
            );
          });
      })
      .catch((error) => {
        console.log(error);
        //Error message
        this.setState({
          loading: false,
        });
        Message.error(
          "No se pudo agregar el grupo de apoyo, intente más tarde."
        );
      });
  };

  editSupportGroup = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request post");
    console.log(data);
    //Edit user
    Api.patch(`user/${data.user}/`, {
      username: data.username,
      email: data.email,
      //password: data.password,
      //createdBy: "reactclient",
    })
      .then((response) => {
        //console.log(response);
        //const user_id = response.data.id;
        //Add new Support Group
        Api.patch(`support-group/${data.key}/`, {
          name: data.name,
          //user: user_id,
          //createdBy: "reactclient",
        })
          .then((response) => {
            //console.log(response);
            Message.success("Grupo de apoyo editado con éxito.");
            this.getUsers();
          })
          .catch((error) => {
            this.setState({
              loading: false,
            });
            //console.log(error);
            Message.error(
              "No se pudo editar el grupo de apoyo, intente más tarde."
            );
          });
      })
      .catch((error) => {
        console.log(error);
        //Error message
        this.setState({
          loading: false,
        });
        Message.error(
          "No se pudo editar el grupo de apoyo, intente más tarde."
        );
      });
  };

  deleteSupportGroup = (data) => {
    this.setState({
      loading: true,
    });
    //console.log(data);
    //Delete support group first
    Api.delete(`support-group/${data.key}/`)
      .then((response) => {
        console.log(response);
        Message.success("Grupo de apoyo eliminado con éxito.");
        this.getUsers();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.error(
          "No se pudo eliminar el grupo de apoyo, intente más tarde."
        );
      });
  };

  addMember = (data) => {
    this.setState({
      loading: true,
    });
    console.log(data);
    Api.post("group-member/", {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      supportgroup: data.provider, //provider in this case is supportGroup id
      createdBy: Store.getUsername(),
    })
      .then((response) => {
        //console.log(response);
        this.setState({
          visibleMembers: false,
        });
        Message.success("Integrante agregado con éxito.");
        this.getSupportGroups();
      })
      .catch((error) => {
        //console.log(error);
        Message.error("No se pudo agregar al integrante, intente más tarde.");
      });
  };

  editMember = (data) => {
    this.setState({
      loading: true,
    });
    Api.patch(`group-member/${data.key}/`, {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      supportgroup: data.provider,
      //createdBy: "reactclient",
    })
      .then((response) => {
        //console.log(response);
        this.setState({
          visibleMembers: false,
        });
        Message.success("Integrante editado con éxito.");
        this.getSupportGroups();
      })
      .catch((error) => {
        //console.log(error);
        Message.error("No se pudo editar al integrante, intente más tarde.");
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
        Message.success("Integrante eliminado con éxito.");
        this.getSupportGroups();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.error("No se pudo eliminar al integrante, intente más tarde.");
      });
  };

  changePassword = (data) => {
    this.setState({
      loading: true,
    });
    console.log(data);
    //Edit user
    Api.patch(`user/${this.state.user_id}/`, {
      currentPassword: data.currentPassword,
      password: data.newPassword,
    })
      .then((response) => {
        //console.log(response);
        this.setState({
          visiblePasswordManager: false,
          titlePasswordManager: "",
          fieldsPasswordManager: [],
          user_id: undefined,
        });
        Message.success("Contraseña cambiada con éxito.");
        this.getUsers();
      })
      .catch((error) => {
        console.log(error);
        //Error message
        this.setState({
          loading: false,
        });
        Message.error("No se pudo cambiar la contraseña, intente más tarde.");
      });
  };

  render() {
    const {
      data,
      loading,
      visibleMembers,
      dataMembers,
      provider,
      visiblePasswordManager,
      titlePasswordManager,
      fieldsPasswordManager,
      //dataCategories,
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
        title: "Correo",
        key: "email",
      },
      {
        title: "Integrantes",
        key: "members",
      },
      {
        title: "Administración de contraseña",
        key: "passwordManager",
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
        key: "email",
        label: "Correo",
        required: true,
        maxLength: 50,
        type: "email",
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
        maxLength: 64,
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
          includesPassword={true}
          visibleContacts={visibleMembers}
          showContacts={this.showMember}
          closeContacts={this.closeMembers}
          columnsContacts={columnsMembers}
          dataContacts={dataMembers}
          provider={provider}
          fieldsFormContact={fieldsFormMember}
          addContact={this.addMember}
          editContact={this.editMember}
          deleteContact={this.deleteMember}
          visiblePasswordManager={visiblePasswordManager}
          titlePasswordManager={titlePasswordManager}
          fieldsPasswordManager={fieldsPasswordManager}
          showPasswordManager={this.showPasswordManager}
          closePasswordManager={this.closePasswordManager}
          changePassword={this.changePassword}
        />
      </Row>
    );
  }
}

export default SupportGroup;
