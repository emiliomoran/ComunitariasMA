import React from 'react'
import axios, { post } from 'axios';

class FileUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      file: this.props.file,
    }
    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    console.log(e.target.files[0]);
    this.setState({
      file: e.target.files[0],
    });
  }

  render() {
    const { file } = this.state;

    return (
      <input type="file" accept="image/*" onChange={this.onChange} />
   ):
  }
}

export default FileUpload;