import React from "react";
import { Container, NavbarBrand, Navbar, NavbarText, Row, Col, CustomInput, Button } from "reactstrap";
import { colorConfigs } from "../config/configs";
import { Terminal } from "react-feather";
import codeCollabLookPng from "../assets/images/code-collab-editor-look.png";
import axios from "axios";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomID: "",
      location: "",
    };
  }
  componentDidMount() {
    axios
      .get("http://demo.ip-api.com/json/?fields=66842623&lang=en")
      .then((response) => {
        let { region, city } = response.data;
        console.log(`${city}, ${region}`);
        this.setState({ location: `${city}, ${region}` });
      })
      .catch((err) => {
        console.error(err.message);
        this.setState({ location: `Unavailable` });
      });
  }
  handleAuth = () => {
    let base64State = btoa(JSON.stringify({ roomID: this.state.roomID, location: this.state.location }));
    let oAuthEndpoint =
      `https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly` +
      `&include_granted_scopes=true&response_type=token&` +
      `redirect_uri=https%3A//code-collaborate.netlify.app/editor&state=${base64State}&` +
      `client_id=25415606823-d15qcd5agfm2rf91dm4hpghfop4pl7rm.apps.googleusercontent.com`;
    window.location.href = oAuthEndpoint;
  };
  render() {
    return (
      <Container fluid style={{ backgroundColor: colorConfigs.extreme, height: "100vh", overflow: "hidden" }} className="d-flex flex-column">
        <Navbar dark expand="md" className="px-2">
          <NavbarBrand href="/">
            <Terminal size="25px" strokeWidth="4px" color="#f5791b" />
            <NavbarText style={{ fontSize: "14px" }}>Code-Collaborate</NavbarText>
          </NavbarBrand>
        </Navbar>
        <Row className="m-auto" style={{ width: "100%" }}>
          <Col md={5} className="d-flex flex-column">
            <Container className="d-flex flex-column m-auto">
              <Container className="m-auto" style={{ color: "white", maxWidth: "600px" }}>
                <p style={{ fontSize: "20px" }}>A Web based application for collaborative code editing along with video call support</p>
                <br />
                <p style={{ fontSize: "15px" }}>
                  An editor with a big list of features including video call support, chat support along with that code compilation support with real
                  time code editing all of this in an intuitive looking UI.
                </p>
                <br />
                <Row style={{ marginTop: "25px", marginBottom: "25px", justifyContent: "space-between" }}>
                  <Col sm={5}>
                    <CustomInput
                      type="text"
                      className="pb-2"
                      style={{
                        color: "white",
                        backgroundColor: "transparent",
                        borderBottom: "2px gray solid",
                        borderTop: "0px",
                        borderLeft: "0px",
                        borderRight: "0px",
                      }}
                      placeholder="Room ID"
                      value={this.state.roomID}
                      onChange={(e) => this.setState({ roomID: e.target.value })}
                    />
                  </Col>
                  <Col sm={5}>
                    <Button
                      className="d-block m-auto"
                      style={{
                        color: "white",
                        backgroundColor: "#f5791c",
                      }}
                      onClick={this.handleAuth}>
                      {this.state.roomID === "" ? "Create Room" : "Proceed"}
                    </Button>
                  </Col>
                </Row>
                <br />
                <p style={{ fontSize: "15px" }}>
                  Made with <span style={{ fontSize: "25px" }}>❤️</span> by <span style={{ fontSize: "20px" }}>Akash Chatterjee</span>
                </p>
              </Container>
            </Container>
          </Col>
          <Col md={7}>
            <img src={codeCollabLookPng} alt="collab-look" style={{ width: "85%" }} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default HomePage;
