// @flow

import React from "react";
import { Modal, Button } from "antd";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitudeCenter: -2.110688,
      longitudeCenter: -79.948869,
      zoom: 13,
      newPoint: this.props.previewPoint,
    };
    this.map = null;
  }

  setRefMap = (map) => {
    this.map = map;
  };

  handleOk = () => {
    //console.log("ok");
    this.state.newPoint && this.props.save(this.state.newPoint);
    //this.props.close();
  };

  handleClick = (e) => {
    //console.log(e);
    let point = {
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
    };
    this.setState({
      newPoint: point,
    });
  };

  render() {
    const {
      visible,
      close,
      closeFromForm,
      title,
      item,
      readOnly,
      edit,
      closeMapFormEdit,
    } = this.props;
    const { latitudeCenter, longitudeCenter, newPoint } = this.state;
    const position = [
      item ? item.latitude : latitudeCenter,
      item ? item.longitude : longitudeCenter,
    ];
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleOk}
        onCancel={close}
        width="60%"
        footer={
          readOnly
            ? null
            : [
                <Button
                  key="back"
                  onClick={
                    item && edit
                      ? closeMapFormEdit
                      : item && !edit
                      ? close
                      : closeFromForm
                  }
                >
                  Cancelar
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  //loading={loading}
                  onClick={this.handleOk}
                >
                  Guardar
                </Button>,
              ]
        }
      >
        <Map
          ref={(map) => this.setRefMap(map)}
          center={position}
          zoom={this.state.zoom}
          onClick={readOnly ? null : this.handleClick}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {newPoint && (
            <Marker position={[newPoint.latitude, newPoint.longitude]}></Marker>
          )}
          {readOnly && item && (
            <Marker position={position}>
              <Popup>{item.name}</Popup>
            </Marker>
          )}
        </Map>
      </Modal>
    );
  }
}

export default MapComponent;
