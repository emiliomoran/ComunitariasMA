import React from "react";
import CrudTable from "../components/CrudTable";
import { Row } from "antd";

import axios from "axios";

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
    axios
      .get("http://127.0.0.1:8000/api/category/")
      .then((response) => {
        let data = [];
        response.data.map((item, index) => {
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
        console.log(error);
      });
  };

  addCategory = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request post");
    //console.log(data);
    axios
      .post("http://127.0.0.1:8000/api/category/", {
        name: data.name,
        description: data.description ? data.description : "",
        createdBy: "reactclient",
      })
      .then((response) => {
        console.log(response);
        this.getCategory();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editCategory = (data) => {
    this.setState({
      loading: true,
    });
    //console.log("Request put");
    axios
      .put(`http://127.0.0.1:8000/api/category/${data.key}/`, {
        name: data.name,
        description: data.description ? data.description : "",
        createdBy: "reactclient",
      })
      .then((response) => {
        console.log(response);
        this.getCategory();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deleteCategory = (key) => {
    this.setState({
      loading: true,
    });
    //console.log("Request delete");
    axios
      .delete(`http://127.0.0.1:8000/api/category/${key}/`)
      .then((response) => {
        console.log(response);
        this.getCategory();
      })
      .catch((error) => {
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
        />
      </Row>
    );
  }
}

export default Category;
