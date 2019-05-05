import React, { Component } from "react";
import api from "../../services/api";

import "./styles.css";
import logo from "../../assets/logo.svg";
import { MdOpenInBrowser, MdDelete } from "react-icons/md";
import {
  Button,
  Row,
  Col,
  Tooltip,
  OverlayTrigger,
  Table
} from "react-bootstrap";

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
              placeholder="Escreva o nome da box..."
              value={this.state.newBox}
              onChange={this.handleInputChange}
            />
            <button type="submit">Criar</button>
          </form>
        </div>
        <div className="table-style">
          <Table responsive>
            <thead>
              <tr>
                <th>Nome do Box</th>
                <th className="action-column">Ações</th>
              </tr>
            </thead>
            <tbody>
              {this.state.boxes &&
                this.state.boxes.map(box => (
                  <tr key={box._id}>
                    <td>
                      <strong>{box.title}</strong>
                    </td>
                    <td>
                      <Row>
                        <Col md={6}>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-top">
                                Clique para acessar este box
                              </Tooltip>
                            }
                          >
                            <Button
                              variant="info"
                              className="action-button"
                              size="sm"
                            >
                              <MdOpenInBrowser
                                size={20}
                                onClick={() => this.openBox(box._id)}
                              />
                            </Button>
                          </OverlayTrigger>
                        </Col>
                        <Col md={6}>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-top">
                                Clique para deletar este box
                              </Tooltip>
                            }
                          >
                            <Button
                              variant="danger"
                              className="action-button"
                              size="sm"
                              onClick={() => this.deleteBox(box._id)}
                            >
                              <MdDelete size={20} />
                            </Button>
                          </OverlayTrigger>
                        </Col>
                      </Row>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}
