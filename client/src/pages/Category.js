import React from "react";
import CrudTable from "../components/CrudTable";
import { Row } from "antd";
import Api from "../utils/Api";
import Message from "../utils/Message";
import Store from "../utils/Store";

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
    };
  }

  componentDidMount = () => {
    this.getCategory();
  };

  getCategory = () => {
    //console.log("Request get");
    Api.get(
      "category/" /* , {
      headers: {
        token: Store.getToken(),
      },
    } */
    )
      .then((response) => {
        let data = [];
        response.data.map((item) => {
          let category = {
            key: item.id,
            name: item.name,
            description: item.description,
          };
          data.push(category);
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

  addCategory = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request post");
    //console.log(data);
    Api.post("category/", {
      name: data.name,
      description: data.description ? data.description : "",
      createdBy: Store.getUsername(),
    })
      .then((response) => {
        //console.log(response);
        Message.success("Categoría agregada con éxito.");
        this.getCategory();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.error("No se pudo agregar la categoría, intente más tarde.");
      });
  };

  editCategory = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request put");
    Api.patch(`category/${data.key}/`, {
      name: data.name,
      description: data.description ? data.description : "",
      //createdBy: "reactclient",
    })
      .then((response) => {
        //console.log(response);
        Message.success("Categoría editada con éxito.");
        this.getCategory();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        //console.log(error);
        Message.error("No se pudo editar la categoría, intente más tarde.");
      });
  };

  deleteCategory = (data) => {
    this.setState({
      loading: true,
    });
    Api.delete(`category/${data.key}/`)
      .then((response) => {
        //console.log(response);
        Message.success("Categoría eliminada con éxito.");
        this.getCategory();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        Message.error("No se pudo eliminar la categoría, intente más tarde.");
        //console.log(error);
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
        key: "description",
        label: "Descripción",
        required: false,
        maxLength: 250,
        type: "textArea",
      },
    ];

    return (
      <Row>
        <h3>Categorías</h3>
        <CrudTable
          columns={columns}
          data={data}
          fieldsForm={fieldsForm}
          title="Categoría"
          add={this.addCategory}
          edit={this.editCategory}
          delete={this.deleteCategory}
          loading={loading}
          includesMap={false}
        />
      </Row>
    );
  }
}

export default Category;
