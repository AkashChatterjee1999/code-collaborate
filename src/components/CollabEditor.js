import React from "react";
import { Navbar, NavbarBrand, NavbarText, Container, Row, Col } from "reactstrap";
import { Clock, Layout, Settings, Sliders, Terminal, UserPlus, Users } from "react-feather";
import { connect } from "react-redux";
import { isEqual } from "lodash";
import StatusHeaderDropdown from "../components/statusHeaderDropdown";
import { colorConfigs, assignColorToClientID } from "../config/configs";
import CollabSetupInitiator from "../utils/helpers";
import MainPanelComponent from "../components/MainPanelComponent";
import ParticipantsPanelComponent from "./participantsPanelComponent";
import person1Sm from "../assets/images/person1-about-us-sm.png";
import InputOutputComponent from "./inputOutputComponent";
import ChatComponent from "./ChatComponent";
import {
  addParticipant,
  removeParticipant,
  updatePrevParticipants,
  updateToCallParticipants,
  updatePeerStreamConstraints,
  updateStreamConstraints,
} from "../redux/actions";

const mapStateToProps = (props) => {
  return {
    participants: props.participantReducers,
    callableParticipantsArray: props.toCallParticipants,
    editorCursorManagerReference: props.cursorManagerReducer,
    videoStreamConstraints: props.changeVideoStreamConstraints,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addParticipant: (participantId, participantData) => dispatch(addParticipant(participantId, participantData)),
    removeParticipant: (participantId) => dispatch(removeParticipant(participantId)),
    updatePrevParticipants: (participants) => dispatch(updatePrevParticipants(participants)),
    updateToCallParticipants: (toCallParticipants) => dispatch(updateToCallParticipants(toCallParticipants)),
    updatePeerStreamConstraints: (participantId, constraintsData) => dispatch(updatePeerStreamConstraints(participantId, constraintsData)),
  };
};

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
      chats: [],
      me: {},
    };
    this.streamConstraints = {
      video: true,
      audio: true,
    };
  }
  componentDidMount = () => {
    let meObj = {
      name: prompt("Your Name"),
      location: prompt("Your location"),
      email: prompt("Your Email"),
      profilePicURL: prompt("profilePicURL"),
    };

    global.aboutMe = meObj;
    this.setState({ me: meObj }, () => {
      this.collabSocket = new CollabSetupInitiator(
        "localhost:5050",
        this.state.me.name,
        this.state.me.profilePicURL,
        this.state.me.location,
        this.state.me.email
      );

      global.myCollabSocket = this.collabSocket;

      this.collabSocket.registerSocketCallbacks(
        this.getParticipants,
        this.addParticipant,
        this.deleteParticipant,
        this.addChat,
        this.onParticipantStreamConstraintChange,
        this.cursorManipulator
      );
    });
  };

  cursorManipulator = (actionType, clientID, cursorPosition, clientName = null) => {
    if (clientID !== this.collabSocket.id) {
      //Only change the cursor for others
      switch (actionType) {
        case "ADD": {
          this.props.editorCursorManagerReference.addCursor(clientID, clientName, assignColorToClientID(), cursorPosition);
          break;
        }
        case "UPDATE": {
          this.props.editorCursorManagerReference.setCursor(clientID, cursorPosition);
          break;
        }
        case "REMOVE": {
          this.props.editorCursorManagerReference.removeCursor(clientID);
          break;
        }
        default: {
          console.log("Wrong action type is triggered in cursor manipulator");
          break;
        }
      }
    }
  };

  getParticipants = (roomParticipants) => {
    let participants = new Map(),
      callableParticipantsArray = [];
    roomParticipants.forEach((participantData, participantId) => {
      let participantInfo = {
        pic: participantData.profilePic,
        name: participantData.name,
        isOnline: true,
        location: participantData.location,
        streamConstraints: participantData.streamConstraints,
      };
      participants.set(participantId, participantInfo);
      if (this.collabSocket.id !== participantId) callableParticipantsArray.push(participantId);
    });
    this.props.updatePrevParticipants(participants);
    this.props.updateToCallParticipants(callableParticipantsArray);
  };

  addParticipant = (clientId, clientData) => {
    let participantData = {
      pic: clientData.profilePic,
      name: clientData.name,
      isOnline: true,
      location: clientData.location,
      streamConstraints: clientData.streamConstraints,
    };
    this.props.addParticipant(clientId, participantData);
  };

  deleteParticipant = (clientId) => {
    this.props.removeParticipant(clientId);
  };

  onParticipantStreamConstraintChange = (clientConstraintData) => {
    let clientID = clientConstraintData.clientID;
    let constraintsData = {
      video: clientConstraintData.video,
      audio: clientConstraintData.audio,
    };
    console.log(clientID, constraintsData);
    this.props.updatePeerStreamConstraints(clientID, constraintsData);
  };

  globalStateChangeSubscriber = () => {
    // Sense the change of client's stream constraints
    if (!isEqual(this.props.videoStreamConstraints, this.streamConstraints)) {
      this.collabSocket.changeStreamState(this.props.videoStreamConstraints.video, this.props.videoStreamConstraints.audio);
      this.streamConstraints = this.props.videoStreamConstraints;
    }
    // Sense all the global state changes here ...
  };

  addChat = (chatMessage) => {
    let { clientID, data } = chatMessage;
    let chats = [...this.state.chats],
      curDtTimeObj = new Date(Date.now());
    chats.push({
      profilePic: this.props.participants.get(clientID).pic,
      sender: this.props.participants.get(clientID).name,
      message: data,
      timeStamp: `${curDtTimeObj.getHours()}:${curDtTimeObj.getMinutes()}`,
    });
    this.setState({ chats });
  };

  sendChat = (chatMessage) => {
    console.log("Sending chat: ", chatMessage);
    this.collabSocket.sendChat(chatMessage);
  };

  render() {
    this.globalStateChangeSubscriber();
    return (
      <Container
        className="p-0"
        fluid
        style={{
          backgroundColor: colorConfigs.extreme,
          height: "100vh",
          overflow: "hidden",
        }}>
        <Navbar dark expand="md" className="px-2">
          <NavbarBrand href="/">
            <Terminal size="25px" strokeWidth="4px" color="#f5791b" />
            <NavbarText style={{ fontSize: "14px" }}>Code-Collaborate</NavbarText>
          </NavbarBrand>
        </Navbar>
        <Container fluid className="d-flex" style={{ height: "40px", backgroundColor: colorConfigs.darkGrey }}>
          <Row className="w-50 px-3 my-auto justify-content-evenly" style={{ maxWidth: "500px" }}>
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
          <Row className="w-25 px-3 my-auto justify-content-evenly ml-auto" style={{ maxWidth: "300px" }}>
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
          <Col md={3} style={{ height: "87vh", overflow: "hidden" }} className="py-3">
            <ParticipantsPanelComponent host={this.state.host} participants={this.props.participants} />
          </Col>
          <Col md={6} className="py-3" style={{ height: "87vh" }}>
            <Container
              className="p-0"
              fluid
              style={{
                color: "white",
                overflow: "hidden",
                height: "100%",
              }}>
              <MainPanelComponent participantIds={this.props.callableParticipantsArray} />
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
              }}>
              <InputOutputComponent />
              <ChatComponent chats={this.state.chats} sendChat={this.sendChat} />
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CollabEditor);
