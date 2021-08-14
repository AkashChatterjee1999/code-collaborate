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
import CollabSetupInitiator from "../utils/helpers";
import MainPanelComponent from "../components/MainPanelComponent";
import ParticipantsPanelComponent from "./participantsPanelComponent";
import person1Sm from "../assets/images/person1-about-us-sm.png";
import person2Sm from "../assets/images/person2-about-us-sm.png";
import person3Sm from "../assets/images/person3-about-us-sm.png";
import person4Sm from "../assets/images/person4-about-us-sm.png";
import InputOutputComponent from "./inputOutputComponent";
import ChatComponent from "./ChatComponent";
import {
  defaultTabHeight,
  defaultSubTabHeight,
  rightSidebarTabHeights,
} from "../config/configs";

class CollabEditor extends React.Component {
  constructor(props) {
    super(props);
    this.collabSocket = null;
    this.state = {
      host: {
        pic: person1Sm,
        name: "Rahul Prasad",
        email: "rahul@uthaan.co.in",
        location: "Gurgaon, India",
        isOnline: true,
      },
      participants: new Map(),
      chats: [],
      me: {},
    };
  }
  componentDidMount = () => {
    let meObj = {
      name: prompt("Your Name"),
      location: prompt("Your location"),
      email: prompt("Your Email"),
      profilePicURL: prompt("profilePicURL"),
    };

    this.setState({ me: meObj }, () => {
      this.collabSocket = new CollabSetupInitiator(
        "localhost:5050",
        this.state.me.name,
        this.state.me.profilePicURL,
        this.state.me.location,
        this.state.me.email
      );

      this.collabSocket.registerSocketCallbacks(
        this.getParticipants,
        this.addParticipant,
        this.deleteParticipant,
        this.addChat
      );

      let staticParticipants = new Map();
      staticParticipants.set("asfasfa", {
        pic: person2Sm,
        name: "Kapil Patil",
        location: "Gurgaon, India",
        isOnline: false,
      });

      staticParticipants.set("dafaf", {
        pic: person3Sm,
        name: "Swati Sinha",
        location: "Gurgaon, India",
        isOnline: true,
      });

      staticParticipants.set("fqefqef", {
        pic: person4Sm,
        name: "Ankit Prasad",
        isOnline: false,
        location: "Gurgaon, India",
      });

      let dummyChats = [
        {
          profilePic: person1Sm,
          sender: "Rahul Prasad",
          message:
            "Hello all, welcome to todays session in how to write code so that you caan learn and develop some new things based on that",
          timeStamp: "11:20",
        },
        {
          profilePic: person2Sm,
          sender: "Kapil Patil",
          message:
            "Thanks Rahul, for the warm welcome. We too are excited to join in this session, let's start",
          timeStamp: "11:22",
        },
      ];

      this.setState({ participants: staticParticipants, chats: dummyChats });
    });
  };

  getParticipants = (roomParticipants) => {
    let participants = new Map();
    roomParticipants.forEach((participantData, participantId) => {
      let participantInfo = {
        pic: participantData.profilePic,
        name: participantData.name,
        isOnline: true,
        location: participantData.location,
      };
      participants.set(participantId, participantInfo);
    });
    this.setState({ participants });
  };

  addParticipant = (clientId, clientData) => {
    let participants = new Map(this.state.participants);
    participants.set(clientId, {
      pic: clientData.profilePic,
      name: clientData.name,
      isOnline: true,
      location: clientData.location,
    });
    this.setState({ participants });
  };

  deleteParticipant = (clientId) => {
    let participants = new Map(this.state.participants);
    let participantData = participants.get(clientId);
    participantData.isOnline = false;
    participants.set(clientId, participantData);
    this.setState({ participants });
  };

  addChat = (chatMessage) => {
    let { clientId, dataMessage } = chatMessage;
    let chats = [...this.state.chats];
    chats.push({
      profilePic: this.state.participants.get(clientId).pic,
      sender: this.state.participants.get(clientId).name,
      message: dataMessage,
      timeStamp: new Date(Date.now()).toISOString().split("T")[0],
    });
    this.setState({ chats });
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
              <ChatComponent chats={this.state.chats} />
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default CollabEditor;
