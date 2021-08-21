import React from "react";
import { Row, Container, Button, Col } from "reactstrap";
import { colorConfigs } from "../config/configs";
import {
  defaultTabHeight,
  defaultSubTabHeight,
  rightSidebarTabHeights,
} from "../config/configs";
import "./styles/codingComponent.scss";
import { cloneDeep } from "lodash";
import { connect } from "react-redux";

const MainSubPanelIconSize = "12px";
const MainPanelContainerHeight = `calc( 100% - ( ${defaultTabHeight} + ${defaultSubTabHeight} ) )`;

const mapStateToProps = (props) => {
  return {
    participants: props.participantReducers,
    callableParticipantsArray: props.toCallParticipants,
  };
};

class VideoCallsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.videostreamsListRef = React.createRef();
    this.state = {
      videoRef: {
        0: React.createRef(),
      },
      currentVideoConstraint: { video: true, audio: true },
      currentBrowserStream: "",
      calledOthers: false,
      prevParticipants: [],
    };
  }

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia(this.state.currentVideoConstraint)
      .then((currentBrowserStream) => {
        console.log("Current Browwsestream: ", currentBrowserStream);
        this.state.videoRef[0].current.srcObject = currentBrowserStream;
        console.log(this.state.videoRef[0].current.addEventListener);
        this.state.videoRef[0].current.addEventListener(
          "loadedmetadata",
          () => {
            this.state.videoRef[0].current.play();
          }
        );

        global.me.peer.on("call", this.gettingCalled);
        global.me.peer.on("disconnected", function () {
          global.me.peer.reconnect();
        });

        this.setState({ currentBrowserStream }, () => {
          console.log("Got it");
          if (!this.state.calledOthers) {
            this.props.callableParticipantsArray.forEach((participantId) => {
              this.callAnotherUser(participantId);
            });
          }
        });
      })
      .catch((err) => {
        console.log("Cannot get the browser Stream: ", err);
      });
  }

  callAnotherUser = (userId) => {
    console.log("Am i calling?: ", userId, this.state.currentBrowserStream);
    let anotherUserCallObj = global.me.peer.call(
      userId,
      this.state.currentBrowserStream
    );
    console.log(anotherUserCallObj);
    global.me.peer.on("error", function (err) {
      console.log("PeerJs Error: ", err);
    });
    this.peerVideoStreamAdjuster(anotherUserCallObj, userId);
  };

  //TODO: check the NOT-KNOWN caller id for linking his/her stream in the video refernce stream

  gettingCalled = (call) => {
    console.log("Am i getting a call?: ", call);
    call.answer(this.state.currentBrowserStream);
    this.peerVideoStreamAdjuster(call, call.peer);
  };

  peerVideoStreamAdjuster = (callObj, clientID) => {
    let videoWrapperDOM = new DOMParser().parseFromString(
      `<div id="video-wrapper-div" class="col-md-4 px-1" style="height: 20vh;overflow: hidden;borderRadius: 20px;"></div>`,
      "text/html"
    );
    let videoWrapper = videoWrapperDOM.getElementById("video-wrapper-div");
    let otherUsersVideoStream = document.createElement("video");
    otherUsersVideoStream.className += " h-100 w-100";
    otherUsersVideoStream.style = `borderRadius: 20px;`;
    videoWrapper.appendChild(otherUsersVideoStream);
    callObj.on(
      "stream",
      function (stream) {
        otherUsersVideoStream.srcObject = stream;
        otherUsersVideoStream.addEventListener("loadedmetadata", () => {
          otherUsersVideoStream.play();
        });
        let videoRef = cloneDeep(this.state.videoRef);
        videoRef[`${clientID}`] = videoWrapper;
        this.setState({ videoRef });
        this.videostreamsListRef.current.appendChild(videoWrapper);
      }.bind(this)
    );
  };

  removeVideoStreamOnParticipantDisconnect = () => {
    Array.from(this.props.participants.keys()).forEach((participantId) => {
      if (
        !this.props.participants.get(participantId).isOnline &&
        this.state.videoRef[participantId]
      ) {
        this.state.videoRef[participantId].remove();
      }
    });
  };

  render() {
    this.removeVideoStreamOnParticipantDisconnect();
    return (
      <>
        <Row
          className="m-0 justify-content-evenly"
          style={{
            overflow: "hidden",
            height: defaultSubTabHeight,
            width: "100%",
            backgroundColor: colorConfigs.tabSubHeaders,
          }}
        ></Row>
        <Container
          className="py-3"
          style={{
            height: MainPanelContainerHeight,
            overflow: "scroll",
            backgroundColor: colorConfigs.darkGrey,
          }}
        >
          <div
            className="d-flex"
            ref={this.videostreamsListRef}
            style={{ flexWrap: "wrap" }}
          >
            <Col
              md={4}
              className="px-1"
              style={{
                height: "20vh",
                overflow: "hidden",
                borderRadius: "20px",
              }}
            >
              <video
                ref={this.state.videoRef[0]}
                className="h-100 w-100"
                style={{ borderRadius: "20px" }}
                muted
              />
            </Col>
          </div>
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps)(VideoCallsComponent);
