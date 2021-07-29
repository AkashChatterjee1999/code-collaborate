import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  CustomInput,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Container,
  Row,
  Col,
} from "reactstrap";
import { ArrowRight, ChevronRight, Terminal } from "react-feather";
const selectedTabColor = "#5d5d6f";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      ref: React.createRef(),
      codeRef: React.createRef(),
      code: "",
      formattedCode: "",
      lineNo: 0,
      isParticipantsViewing: true,
      clients: [
        { name: "Akash Chatterjee", email: "akashchatterjee1000@gmail.com" },
        { name: "Souronil Chatterjee", email: "souronil72@gmail.com" },
      ],
      chats: [
        { name: "Akash Chatterjee", text: "Hello Souro!", time: "18:50" },
      ],
      supportedLanguages: ["html", "javascript"],
    };
  }

  codeChangeHandler = (e) => {
    console.log(this.state.ref.current.innerText);
    this.setState({ code: this.state.ref.current.innerText });
  };

  toggle = () => this.setState({ isOpen: !this.state.isOpen });
  render() {
    return (
      <Container
        fluid
        style={{
          backgroundColor: "#353f57",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Navbar dark expand="md">
          <NavbarBrand href="/">
            <Terminal size="40px" strokeWidth="4px" color="#f5791b" />
            <NavbarText size="35px">Code-Collaborate</NavbarText>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar style={{ marginLeft: "auto", color: "#949bac" }}>
              <NavItem className="px-2">
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Font-Size: 10
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>12</DropdownItem>
                    <DropdownItem>14</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </NavItem>
              <NavItem className="px-2">
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    javascript
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>python3</DropdownItem>
                    <DropdownItem>C++</DropdownItem>
                    <DropdownItem>C</DropdownItem>
                    <DropdownItem>JAVA</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Container fluid className="m-0" style={{ height: "100%" }}>
          <Row className="justfy-content-evenly" style={{ height: "100%" }}>
            <Container style={{ width: "5vw" }}>
              <Col className="mt-2"></Col>
            </Container>
            <Container style={{ width: "92vw" }} className="pr-2">
              <Row style={{ height: "100%" }}>
                <Col
                  className="m-0 py-2"
                  lg={9}
                  md={7}
                  style={{
                    height: "100%",
                    maxHeight: "100%",
                    overflow: "hidden",
                    flexFlow: "column",
                  }}
                >
                  <Container className="px-0 py-2" style={{ height: "85%" }}>
                    <Row className="px-3">
                      <div
                        className="text-center py-2"
                        style={{
                          fontSize: "0.9rem",
                          width: "20%",
                          height: "35px",
                          color: "white",
                          borderTopRightRadius: "15px",
                          borderTopLeftRadius: "15px",
                          backgroundColor: "#2d2d44",
                        }}
                      >
                        Hello.js
                      </div>
                    </Row>
                    <div
                      className="px-3 py-2"
                      style={{
                        height: "100%",
                        width: "100%",
                        maxHeight: "100%",
                        maxWidth: "100%",
                        borderRadius: "1%",
                        boxSizing: "border-box",
                        outline: "none",
                        border: "none",
                        color: "#9efeff",
                        backgroundColor: "#1e1e3f",
                      }}
                    >
                      <pre
                        ref={this.state.ref}
                        contentEditable="true"
                        style={{
                          fontFamily: "Operator-Mono",
                          outline: "none",
                          fontSize: "20px",
                          overflow: "scroll",
                          height: "100%",
                        }}
                        onKeyPress={(e) =>
                          setTimeout(() => this.codeChangeHandler(), 0)
                        }
                      >
                        <div>// Write some code here</div>
                        <br />
                      </pre>
                    </div>
                  </Container>
                </Col>
                <Col
                  className="m-0"
                  lg={3}
                  md={5}
                  style={{
                    height: "100%",
                    overflow: "hidden",
                    flexFlow: "column",
                  }}
                >
                  <div
                    className="px-3 py-2"
                    style={{
                      height: "87%",
                      width: "100%",
                      maxHeight: "90%",
                      maxWidth: "100%",
                      borderRadius: "1%",
                      boxSizing: "border-box",
                      outline: "none",
                      border: "none",
                      backgroundColor: "#1e1e3f",
                    }}
                  >
                    <h4
                      className="text-center"
                      style={{ fontSize: "20px", color: "white" }}
                    >
                      Participants
                    </h4>
                    <hr style={{ height: "5px", backgroundColor: "white" }} />
                    <div className="px-1" style={{ color: "#949bac" }}>
                      <Row
                        className="px-2 mb-2"
                        n
                        style={{ justifyContent: "space-between" }}
                      >
                        <Col sm={6} className="px-0">
                          <div
                            className="text-center p-2"
                            style={{
                              fontSize: "0.85rem",
                              width: "98%",
                              height: "35px",
                              color: "white",
                              backgroundColor: this.state.isParticipantsViewing
                                ? selectedTabColor
                                : "#2d2d44",
                            }}
                            onClick={(e) =>
                              this.setState({ isParticipantsViewing: true })
                            }
                          >
                            Participants
                          </div>
                        </Col>
                        <Col sm={6} className="px-0">
                          <div
                            className="text-center py-2"
                            style={{
                              fontSize: "0.9rem",
                              width: "98%",
                              height: "35px",
                              color: "white",
                              backgroundColor: !this.state.isParticipantsViewing
                                ? selectedTabColor
                                : "#2d2d44",
                            }}
                            onClick={(e) =>
                              this.setState({ isParticipantsViewing: false })
                            }
                          >
                            chat
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div
                      className="d-flex"
                      style={{ height: "92%", flexDirection: "column" }}
                    >
                      {this.state.isParticipantsViewing ? (
                        <div
                          className="d-flex"
                          style={{
                            overflow: "scroll",
                            flexDirection: "column",
                            height: "90%",
                            overflowX: "hidden",
                          }}
                        >
                          {this.state.clients.map((client) => {
                            return (
                              <Row className="p-2">
                                <Col sm={3}>
                                  <Container
                                    fluid
                                    style={{
                                      backgroundColor: "white",
                                      borderRadius: "100%",
                                      width: "45px",
                                      height: "45px",
                                    }}
                                  ></Container>
                                </Col>
                                <Col
                                  sm={9}
                                  style={{ color: "white", fontSize: "12px" }}
                                >
                                  <p className="mb-1">{client.name}</p>
                                  <p className="text">{client.email}</p>
                                </Col>
                              </Row>
                            );
                          })}
                        </div>
                      ) : (
                        <div
                          className="d-flex"
                          style={{
                            overflow: "scroll",
                            flexDirection: "column",
                            height: "90%",
                            overflowX: "hidden",
                          }}
                        >
                          <Container
                            fluid
                            style={{
                              height: "90%",
                              display: "flex",
                              flexDirection: "columns",
                            }}
                          >
                            {this.state.chats.map((chat) => {
                              return (
                                <p style={{ height: "30px", color: "white" }}>
                                  {chat.text}
                                </p>
                              );
                            })}
                          </Container>
                          <Container style={{ height: "10%" }}>
                            <Row className="px-2" style={{ bottom: "10px" }}>
                              <Col sm={11}>
                                <CustomInput
                                  style={{ width: "100%" }}
                                  type="text"
                                />
                              </Col>
                              <Col sm={1} className="px-1">
                                <ArrowRight color="white" />
                              </Col>
                            </Row>
                          </Container>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </Row>
        </Container>
      </Container>
    );
  }
}
export default Editor;
