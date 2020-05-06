import React from "react";
import CrudTable from "../components/CrudTable";
import { Row } from "antd";
import Api from "../utils/Api";

class Distribution extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        loading: true,
        dataUsers: [],
      };
    }

    componentDidMount = () => {
        this.getVolunteers();
    };

    getDistributions = () => {
        Api.get("distribution/")
          .then((response) => {
            let data = [];
            response.data.map((item) => {
              let user = 
                this.state.dataUsers.find(item.user.value);
              if (user) {
                  let infoUser = {
                    key: user.value,
                    label: user.text,
                  };
                }
              let distribution = {
                key: item.id,
                departureAddress: item.departureAddress,
                destinationAddress: item.destinationAddress,
                user: infoUser,
                information: item.information,
              };
              data.push(distribution);
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

    addDistribution = (data) => {
        this.setState({
          loading: true,
        });
        Api.post("distribution/", {
          departureAddress: data.departureAddress,
          destinationAddress: data.destinationAddress,
          user: data.user,
          information: data.information,
          createdBy: "reactclient",
        })
          .then((response) => {
            //console.log(response);
            this.getDistributions();
          })
          .catch((error) => {
            this.setState({
              loading: false,
            });
            console.log(error);
          });
    };
    
    getVolunteers = () => {
        Api.get("volunteer/")
            .then((response) => {
            let data = [];
            response.data.map((item) => {
                let user = {
                value: item.user,
                text: item.first_name.concat(' ', item.last_name),
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
            console.log(error);
            });
    };

    getSupportGroups = () => {
        Api.get("support-group/")
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
            this.setState(
                {
                dataUsers: dataUsers.concat(data),
                },
                () => this.getDistributions()
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
            title: "Lugar de Partida",
            key: "departureAddress",
          },
          {
            title: "Lugar de Llegada",
            key: "destinationAddress",
          },
          {
            title: "Encargado",
            key: "user",
          },
          {
            title: "Informacion",
            key: "information",
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
            key: "user",
            label: "Encargado",
            required: true,
            maxLength: null,
            type: "number",
          },
          {
            key: "information",
            label: "Informacion",
            required: true,
            maxLength: 250,
            type: "text",
          },
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
              loading={loading}
              includesMap={true}
            />
          </Row>
        );
    }
}

export default Distribution;