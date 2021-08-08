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
import {
  ArrowRight,
  Clock,
  Layout,
  Settings,
  Sliders,
  Terminal,
  UserPlus,
  Users,
} from "react-feather";
import StatusHeaderDropdown from "../components/statusHeaderDropdown";
import { colorConfigs } from "../config/configs";
import MainPanelComponent from "../components/MainPanelComponent";
import ParticipantsPanelComponent from "./participantsPanelComponent";
import person1Sm from "../assets/images/person1-about-us-sm.png";
import person2Sm from "../assets/images/person2-about-us-sm.png";
import person3Sm from "../assets/images/person3-about-us-sm.png";
import person4Sm from "../assets/images/person4-about-us-sm.png";
import InputOutputComponent from "./inputOutputComponent";
import ChatComponent from "./ChatComponent";
import PeerToPeerConnection from "../utils/peerJsHelpers";
import {
  defaultTabHeight,
  defaultSubTabHeight,
  rightSidebarTabHeights,
} from "../config/configs";

class CollabEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      host: {
        pic: person1Sm,
        name: "Rahul Prasad",
        location: "Gurgaon, India",
        isOnline: true,
      },
      participants: [
        {
          pic: person2Sm,
          name: "Kapil Patil",
          location: "Gurgaon, India",
          isOnline: false,
        },
        {
          pic: person3Sm,
          name: "Swati Sinha",
          location: "Gurgaon, India",
          isOnline: true,
        },
        {
          pic: person4Sm,
          name: "Ankit Prasad",
          isOnline: false,
          location: "Gurgaon, India",
        },
      ],
    };
  }
  componentDidMount = () => {
    global.me = new PeerToPeerConnection();
  };
  render() {
    return (
      <Container
        className="p-0"
        fluid
        style={{
          backgroundColor: colorConfigs.extreme,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Navbar dark expand="md" className="px-2">
          <NavbarBrand href="/">
            <Terminal size="25px" strokeWidth="4px" color="#f5791b" />
            <NavbarText style={{ fontSize: "14px" }}>
              Code-Collaborate
            </NavbarText>
          </NavbarBrand>
        </Navbar>
        <Container
          fluid
          className="d-flex"
          style={{ height: "40px", backgroundColor: colorConfigs.darkGrey }}
        >
          <Row
            className="w-50 px-3 my-auto justify-content-evenly"
            style={{ maxWidth: "500px" }}
          >
            <StatusHeaderDropdown
              icon={
                <div className="p-0" style={{ width: "fit-content" }}>
                  <UserPlus className="p-0" color="white" size="18px" />
                </div>
              }
              text="Invite"
            />
            <StatusHeaderDropdown
              icon={
                <div className="p-0" style={{ width: "fit-content" }}>
                  <Layout className="p-0" color="white" size="18px" />
                </div>
              }
              text="Layout"
            />
            <StatusHeaderDropdown
              icon={
                <div className="p-0" style={{ width: "fit-content" }}>
                  <Clock className="p-0" color="white" size="18px" />
                </div>
              }
              text="Time"
            />
            <StatusHeaderDropdown
              icon={
                <div className="p-0" style={{ width: "fit-content" }}>
                  <Users className="p-0" color="white" size="18px" />
                </div>
              }
              text="Presentation"
            />
          </Row>
          <Row
            className="w-25 px-3 my-auto justify-content-evenly ml-auto"
            style={{ maxWidth: "300px" }}
          >
            <StatusHeaderDropdown
              icon={
                <div className="p-0" style={{ width: "fit-content" }}>
                  <Settings className="p-0" color="white" size="18px" />
                </div>
              }
              text="Dashboard"
            />
            <StatusHeaderDropdown
              icon={
                <div className="p-0" style={{ width: "fit-content" }}>
                  <Sliders className="p-0" color="white" size="18px" />
                </div>
              }
              text="Language"
            />
          </Row>
        </Container>
        <Row className="px-3">
          <Col
            md={3}
            style={{ height: "87vh", overflow: "hidden" }}
            className="py-3"
          >
            <ParticipantsPanelComponent
              host={this.state.host}
              participants={this.state.participants}
            />
          </Col>
          <Col md={6} className="py-3" style={{ height: "87vh" }}>
            <Container
              className="p-0"
              fluid
              style={{
                color: "white",
                overflow: "hidden",
                height: "100%",
              }}
            >
              <MainPanelComponent />
            </Container>
          </Col>
          <Col md={3} className="py-3" style={{ height: "87vh" }}>
            <Container
              fluid
              className="d-flex flex-column justify-content-between p-0"
              style={{
                height: "100%",
                color: "white",
                overflow: "hidden",
              }}
            >
              <InputOutputComponent />
              <ChatComponent />
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default CollabEditor;
