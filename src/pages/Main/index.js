import React, { Component } from "react";
import api from "../../services/api";

import "./styles.css";
import "../Box/styles.css";
import logo from "../../assets/logo.svg";
import { MdFolderOpen, MdOpenInBrowser } from "react-icons/md";

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
                  <strong>{box.title}</strong>

                  <MdOpenInBrowser
                    className="click"
                    size={24}
                    onClick={() => this.openBox(box._id)}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}
