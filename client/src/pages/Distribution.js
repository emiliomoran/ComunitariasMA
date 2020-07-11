import React from "react";
import CrudTable from "../components/CrudTable";
import { Row } from "antd";
import Api from "../utils/Api";
import Message from "../utils/Message";
import Store from "../utils/Store";

class Distribution extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        data: [],
        dataUsers: [],
        dataManagerTypes: [{"value": 1, "text": "Grupo de Apoyo"},
          {"value": 2, "text": "Voluntario"}],
      };
    }

    componentDidMount = () => {
        this.getVolunteers();
    };

    getDistributions = () => {
        Api.get("distribution/", {
          headers: {
            token: Store.getToken(),
          },
        })
          .then((response) => {
            let data = [];
            response.data.map((item) => {
              let user = this.state.dataUsers.find(userId => userId.value === item.user);
              let infoUser = [];
              if (user) {
                  infoUser.push({
                    key: user.value,
                    label: user.text,
                  });
                }
              let distribution = {
                key: item.id,
                departureAddress: item.departureAddress,
                destinationAddress: item.destinationAddress,
                user: item.user,
                photo: item.photo,
                tags: infoUser,
                information: item.information,
              };
              data.push(distribution);
              return true;
            });
            console.log(data);
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

    addDistribution = (data) => {
        this.setState({
          loading: true,
        });
        //console.log(data);
        const formData = new FormData();
        formData.append("departureAddress", data.departureAddress);
        formData.append("destinationAddress", data.destinationAddress);
        formData.append("manager_type", data.manager_type);
        formData.append("user", data.user);
        formData.append("information", data.information);
        if (typeof data.photo !== "undefined"){
          //console.log("if de photo");
          formData.append("photo", data.photo);
        }
        formData.append("createdBy", Store.getUsername());
        const config = {
          headers: {
            "content-type": "multipart/form-data",
            token: Store.getToken(),            
          },
        };
        Api.post("distribution/", formData, config)
          .then((response) => {
            //console.log(response);
            Message.success("Plan de distribución agregado con éxito.");
            this.getDistributions();
          })
          .catch((error) => {
            this.setState({
              loading: false,
            });
            //console.log(error);
            Message.error("No se pudo agregar el plan de distribución, intente más tarde.");
            this.props.handleErrorResponse(error, false);
          });
    };

    deleteDistribution = (data) => {
      this.setState({
        loading: true,
      });
      Api.delete(`distribution/${data.key}/`, {
        headers: {
          token: Store.getToken(),
        },
      })
        .then((response) => {
          //console.log(response);
          Message.success("Plan de distribución eliminado con éxito.");
          this.getDistributions();
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
          Message.error("No se pudo eliminar el plan de distribución, intente más tarde.");
          this.props.handleErrorResponse(error, false);
          //console.log(error);
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
                text: item.firstName.concat(' ', item.lastName),
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
                () => this.getDistributions()
            );
            })
            .catch((error) => {
            //console.log(error);
            this.props.handleErrorResponse(error, false);
            });
    };

    render() {
        const { data, loading, dataUsers, dataManagerTypes} = this.state;
    
        const columns = [
          {
            title: "Lugar de Partida",
            key: "departureAddress",
          },
          {
            title: "Lugar de Llegada",
            key: "destinationAddress",
          },
          {
            title: "Encargado",
            key: "tags",
          },
          {
            title: "Informacion",
            key: "information",
          },
          {
            title: "Foto Lugar de llegada",
            key: "photo",
          },
          {
            title: "Acción",
            key: "action",
          },
        ];
        
        const fieldsForm = [
          {
            key: "departureAddress",
            label: "Lugar de Partida",
            required: true,
            maxLength: 50,
            type: "text",
          },
          {
            key: "destinationAddress",
            label: "Lugar de Llegada",
            required: true,
            maxLength: 50,
            type: "text",
          },
          {
            key: "manager_type",
            label: "Tipo de Encargado",
            required: true,
            max_length: null,
            type: "select",
          },
          {
            key: "user",
            label: "Encargado",
            required: true,
            maxLength: null,
            type: "select",
          },
          {
            key: "information",
            label: "Informacion",
            required: true,
            maxLength: 250,
            type: "text",
          },
          {
            key: "photo",
            label: "Foto Lugar de llegada",
            required: false,
            type: "file",
          }
        ];
    
        return (
          <Row>
            <h3>Distribuciones</h3>
            <CrudTable
              columns={columns}
              data={data}
              fieldsForm={fieldsForm}
              title="Distribuciones"
              add={this.addDistribution}
              delete={this.deleteDistribution}
              loading={loading}
              includesMap={false}
              optionsUser={dataUsers}
              optionsManagerType={dataManagerTypes}
            />
          </Row>
        );
    }
}

export default Distribution;