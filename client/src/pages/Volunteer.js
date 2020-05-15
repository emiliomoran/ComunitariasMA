import React from "react";
import CrudTable from "../components/CrudTable";
import { Row } from "antd";
import Api from "../utils/Api";
import Message from "../utils/Message";
import Store from "../utils/Store";

class Volunteer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      dataUsers: [],
      dataActivities: [],
      visiblePasswordManager: false,
      titlePasswordManager: "",
      fieldsPasswordManager: [],
      user_id: undefined,
    };
  }

  componentDidMount = () => {
    this.getActivities();
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

  getActivities = () => {
    //console.log("categories");
    Api.get("activity/")
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
            dataActivities: data,
          },
          () => this.getUsers()
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getVolunteers = () => {
    //console.log("Request get");
    //console.log(this.state.dataUsers);
    Api.get("volunteer/")
      .then((response) => {
        console.log(response);
        let data = [];
        response.data.map((item) => {
          let activities = [];
          console.log(item.activities);
          item.activities.map((id) => {
            let activity = this.state.dataActivities.find(
              (obj) => obj.value === id
            );
            if (activity) {
              activities.push({
                key: activity.value,
                label: activity.text,
              });
            }
            return true;
          });

          let user = this.state.dataUsers.find((obj) => obj.key === item.user);
          let volunteer = {
            key: item.id,
            firstName: item.firstName,
            lastName: item.lastName,
            username: user.username,
            phoneNumber: item.phoneNumber,
            social: item.social,
            user: item.user,
            activities: item.activities,
            tags: activities,
          };
          data.push(volunteer);
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
          };
          data.push(user);
          return true;
        });
        this.setState(
          {
            dataUsers: data,
            //loading: false,
          },
          () => this.getVolunteers()
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error);
      });
  };

  addVoluteer = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request post");
    let role = "Volunteer";
    data.activities.map((id) => {
      let activity = this.state.dataActivities.find(
        (obj) => obj.value === id && obj.text === "Actualización de datos"
      );
      if (activity) {
        role = "DataVolunteer";
      }
      return true;
    });
    //console.log(role);

    //Add new user
    Api.post("user/", {
      username: data.username,
      password: data.password,
      role: role,
      createdBy: Store.getUsername(),
    })
      .then((response) => {
        //console.log(response);
        const user_id = response.data.id;
        //Add new Support Group
        Api.post("volunteer/", {
          firstName: data.firstName,
          lastName: data.lastName,
          activities: data.activities,
          phoneNumber: data.phoneNumber,
          social: data.social,
          user: user_id,
          createdBy: Store.getUsername(),
        })
          .then((response) => {
            //console.log(response);
            Message.success("Voluntario agregado con éxito.");
            this.getActivities();
          })
          .catch((error) => {
            this.setState({
              loading: false,
            });
            //console.log(error);
            Message.error(
              "No se pudo agregar al voluntario, intente más tarde."
            );
          });
      })
      .catch((error) => {
        //console.log(error);
        //Error message
        this.setState({
          loading: false,
        });
        Message.error("No se pudo agregar al voluntario, intente más tarde.");
      });
  };

  editVolunteer = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request post");
    //console.log(data);
    //Edit user
    let role = "Volunteer";
    data.activities.map((id) => {
      let activity = this.state.dataActivities.find(
        (obj) => obj.value === id && obj.text === "Actualización de datos"
      );
      if (activity) {
        role = "DataVolunteer";
      }
      return true;
    });
    console.log(role);

    Api.patch(`user/${data.user}/`, {
      username: data.username,
      role: role,
      //password: data.password,
      //createdBy: "reactclient",
    })
      .then((response) => {
        //console.log(response);
        //const user_id = response.data.id;
        //Add new Support Group
        Api.patch(`volunteer/${data.key}/`, {
          firstName: data.firstName,
          lastName: data.lastName,
          activities: data.activities,
          phoneNumber: data.phoneNumber,
          social: data.social,
        })
          .then((response) => {
            //console.log(response);
            Message.success("Voluntario editado con éxito.");
            this.getActivities();
          })
          .catch((error) => {
            this.setState({
              loading: false,
            });
            //console.log(error);
            Message.error(
              "No se pudo editar al voluntario, intente más tarde."
            );
          });
      })
      .catch((error) => {
        //console.log(error);
        //Error message
        this.setState({
          loading: false,
        });
        Message.error("No se pudo editar al voluntario, intente más tarde.");
      });
  };

  deleteVolunteer = (data) => {
    this.setState({
      loading: true,
    });
    console.log(data);
    //Delete support group first
    Api.delete(`volunteer/${data.key}/`)
      .then((response) => {
        //console.log(response);
        //this.getUsers();
        Message.success("Voluntario eliminado con éxito.");
        this.getUsers();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.error("No se pudo eliminar al voluntario, intente más tarde.");
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
      visiblePasswordManager,
      titlePasswordManager,
      fieldsPasswordManager,
      dataActivities,
    } = this.state;

    const columns = [
      {
        title: "Nombres",
        key: "firstName",
      },
      {
        title: "Apellidos",
        key: "lastName",
      },
      {
        title: "Actividades",
        key: "tags",
      },
      {
        title: "Usuario",
        key: "username",
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
        title: "Administración de contraseña",
        key: "passwordManager",
      },
      {
        title: "Acción",
        key: "action",
      },
    ];

    const fieldsForm = [
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
        key: "activities",
        label: "Actividades",
        required: true,
        maxLength: null,
        type: "multipleSelect",
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

    return (
      <Row>
        <h3>Voluntarios</h3>
        <CrudTable
          columns={columns}
          data={data}
          fieldsForm={fieldsForm}
          title="Voluntario"
          add={this.addVoluteer}
          edit={this.editVolunteer}
          delete={this.deleteVolunteer}
          loading={loading}
          includesMap={false}
          includesContacts={false}
          includesPassword={true}
          visiblePasswordManager={visiblePasswordManager}
          titlePasswordManager={titlePasswordManager}
          fieldsPasswordManager={fieldsPasswordManager}
          showPasswordManager={this.showPasswordManager}
          closePasswordManager={this.closePasswordManager}
          changePassword={this.changePassword}
          optionsMultipleSelect={dataActivities}
        />
      </Row>
    );
  }
}

export default Volunteer;
