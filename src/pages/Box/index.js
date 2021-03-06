import React, { Component } from "react";
import "./styles.css";
import { MdInsertDriveFile, MdArrowBack } from "react-icons/md";
import logo from "../../assets/logo.svg";
import api from "../../services/api";
import { distanceInWords } from "date-fns";
import pt from "date-fns/locale/pt";
import Dropzone from "react-dropzone";
import socket from "socket.io-client";
import { Button, Col } from "react-bootstrap";

export default class Box extends Component {
  state = {
    box: {}
  };

  async componentDidMount() {
    this.subscribeToNewFiles();

    const box = this.props.match.params.id;
    const response = await api.get(`/boxes/${box}`);
    this.setState({ box: response.data });
  }

  returnHomePage = () => {
    this.props.history.push("/");
  };
  subscribeToNewFiles = () => {
    const box = this.props.match.params.id;
    const io = socket("https://dropbox-backend-omnistack.herokuapp.com");

    io.emit("connectRoom", box);

    io.on("file", data => {
      console.log("data", data);
      this.setState({
        box: { ...this.state.box, files: [data, ...this.state.box.files] }
      });
    });
  };

  handleUpload = files => {
    files.forEach(file => {
      const data = new FormData();
      const box = this.props.match.params.id;

      data.append("file", file);

      api.post(`/boxes/${box}/files`, data);
    });
  };

  render() {
    return (
      <div id="box-container">
        <header>
          <Col sm={3} md={4} id="back-button-aling">
            <Button
              size="sm"
              id="buttom"
              onClick={() => {
                this.returnHomePage();
              }}
            >
              <MdArrowBack size={24} />
            </Button>
          </Col>
          <img src={logo} alt="" />
          <h1>{this.state.box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />

              <p>Arraste arquivos ou clique aqui</p>
            </div>
          )}
        </Dropzone>

        <ul>
          {this.state.box.files &&
            this.state.box.files.map(file => (
              <li key={file._id}>
                <a
                  className="fileInfo"
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MdInsertDriveFile size={24} color="#A5Cfff" />
                  <strong>{file.title}</strong>
                </a>

                <span>
                  Há{" "}
                  {distanceInWords(file.createdAt, new Date(), { locale: pt })}
                </span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
