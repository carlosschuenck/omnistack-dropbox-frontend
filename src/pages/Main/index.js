import React, { Component } from "react";
import api from "../../services/api";

import "./styles.css";
import "../Box/styles.css";
import logo from "../../assets/logo.svg";
import { MdOpenInBrowser, MdDelete } from "react-icons/md";
import { Button, Row, Col, Tooltip, OverlayTrigger } from "react-bootstrap";

export default class Main extends Component {
  state = {
    newBox: "",
    boxes: []
  };

  componentDidMount() {
    this.findAllBoxes();
  }

  findAllBoxes = async () => {
    const response = await api.get("/boxes");
    this.setState({ boxes: response.data });
  };

  openBox = id => {
    this.props.history.push(`/box/${id}`);
  };

  deleteBox = id => {
    api.delete(`/boxes/${id}`).then(() => this.findAllBoxes());
  };

  handleSubmit = async event => {
    event.preventDefault();
    const response = await api.post("/boxes", {
      title: this.state.newBox
    });

    this.props.history.push(`/box/${response.data._id}`);
  };

  handleInputChange = event => {
    this.setState({ newBox: event.target.value });
  };
  render() {
    return (
      <div>
        <div id="main-container">
          <form onSubmit={this.handleSubmit}>
            <img src={logo} alt="" />
            <input
              placeholder="Criar um box"
              value={this.state.newBox}
              onChange={this.handleInputChange}
            />
            <button type="submit">Criar</button>
          </form>
        </div>
        <div id="box-container">
          <ul>
            {this.state.boxes &&
              this.state.boxes.map(box => (
                <li key={box._id}>
                  <Row className="row-table">
                    <Col>
                      <strong>{box.title}</strong>
                    </Col>
                    <Col md={1}>
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="tooltip-top">
                            Clique para acessar este box!
                          </Tooltip>
                        }
                      >
                        <Button variant="info" className="action-button">
                          <MdOpenInBrowser
                            size={20}
                            onClick={() => this.openBox(box._id)}
                          />
                        </Button>
                      </OverlayTrigger>
                    </Col>

                    <Col md={1}>
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="tooltip-top">
                            Clique para deletar este box!
                          </Tooltip>
                        }
                      >
                        <Button
                          variant="danger"
                          className="action-button"
                          onClick={() => this.deleteBox(box._id)}
                        >
                          <MdDelete size={20} />
                        </Button>
                      </OverlayTrigger>
                    </Col>
                  </Row>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}
