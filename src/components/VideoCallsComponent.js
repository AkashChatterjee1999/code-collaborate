import React from "react";
import { Row, Container, Button, Col } from "reactstrap";
import { colorConfigs } from "../config/configs";
import { defaultTabHeight, defaultSubTabHeight, rightSidebarTabHeights } from "../config/configs";
import "./styles/codingComponent.scss";
import { cloneDeep } from "lodash";
import { connect } from "react-redux";
import { collabSocket, peerConnector } from "../utils/socketConnectors";
import { VideoOff, Video, Mic, MicOff } from "react-feather";
import { updatePeerStreamConstraints, updateStreamConstraints } from "../redux/actions";

const MainPanelIconSize = "16px";
const MainSubPanelIconSize = "12px";
const MainPanelContainerHeight = `calc( 100% - ( ${defaultTabHeight} + ${defaultSubTabHeight} ) )`;

const mapStateToProps = (props) => {
  return {
    participants: props.participantReducers,
    callableParticipantsArray: props.toCallParticipants,
    currentStreamConstraints: props.changeVideoStreamConstraints,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePeerStreamConstraints: (constraintsData) => dispatch(updatePeerStreamConstraints(constraintsData)),
    updateStreamConstraints: (constraintsData) => dispatch(updateStreamConstraints(constraintsData)),
  };
};

class VideoCallsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.videostreamsListRef = React.createRef();
    this.peerConnector = null;
    this.state = {
      videoRef: {
        0: React.createRef(),
      },
      currentBrowserStream: "",
      calledOthers: false,
      prevParticipants: [],
    };
  }

  async componentDidMount() {
    this.peerConnector = await peerConnector.providePeer();
    navigator.mediaDevices
      .getUserMedia(this.props.currentStreamConstraints)
      .then((currentBrowserStream) => {
        console.log("Current Browwsestream: ", currentBrowserStream);
        this.state.videoRef[0].current.srcObject = currentBrowserStream;
        console.log(this.state.videoRef[0].current.addEventListener);
        this.state.videoRef[0].current.addEventListener("loadedmetadata", () => {
          console.log("Loaded data video");
          this.state.videoRef[0].current.play();
        });

        this.peerConnector.on("call", this.gettingCalled);
        this.peerConnector.on("disconnected", function () {
          this.peerConnector.reconnect();
        });

        this.setState({ currentBrowserStream }, () => {
          if (!this.state.calledOthers && this.props.callableParticipantsArray.length > 0) {
            this.props.callableParticipantsArray.forEach((participantId) => {
              if (participantId !== collabSocket.id)
                // if this peer participant ss not me then only call them
                this.callAnotherUser(participantId);
            });
            this.state.calledOthers = true; // because i don't wanna call render();
          }
        });
      })
      .catch((err) => {
        console.log("Cannot get the browser Stream: ", err);
      });
  }

  callAnotherUser = (userId) => {
    console.log("Am i calling?: ", userId, this.state.currentBrowserStream);
    let anotherUserCallObj = this.peerConnector.call(userId, this.state.currentBrowserStream);
    console.log("call another user obj: ", anotherUserCallObj);
    this.peerConnector.on("error", function (err) {
      console.log("PeerJs Error: ", err);
    });
    this.peerVideoStreamAdjuster(anotherUserCallObj, userId);
  };

  gettingCalled = (call) => {
    console.log("Am i getting a call?: ", call);
    call.answer(this.state.currentBrowserStream);
    this.peerVideoStreamAdjuster(call, call.peer);
  };

  peerVideoStreamAdjuster = (callObj, clientID) => {
    const videoWrapperDOM = new DOMParser().parseFromString(
      `<div
          id="video-wrapper-div"
          class="col-md-4 px-1" 
          style="height: 20vh; overflow: hidden; border-radius: 20px;"
      >
        <div
          id="video-container"
          style="height: 100%; overflow: hidden; border-radius: 20px; background-color: ${colorConfigs.tabHeaders};"
        >
          <div
            id="video-overlay-client-profile-pic"
            style="width: 7.5vh; height: 7.5vh; position: absolute; margin-top: calc(-0.8 * 20vh); margin-left: calc(0.16 * 33.33%); background-image: url("${
              this.props.participants.get(clientID)?.pic
            }"); background-position: center; background-repeat: no-repeat; background-size: cover; border-radius: 7.5vh; overflow: hidden;"
          >
          </div>
          <video id="client-stream-${clientID}" style="borderRadius: 20px;" class="h-100 w-100" />
        </div>
        <div
          class="d-flex mr-auto"
          style="max-width: max-content; margin-top: -30px; margin-left: 20px; position: absolute; z-index: 2;"
        >
          <p 
            id="video-overlay-text" 
            class="my-auto" 
            style="font-size: 11px;"
          >
          ${this.props.participants.get(clientID)?.name}
          </p>
        </div> 
      </div>`,
      "text/html"
    );
    let videoWrapper = videoWrapperDOM.getElementById("video-wrapper-div");
    let otherUsersVideoStream = videoWrapperDOM.getElementById(`client-stream-${clientID}`);

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

  performVideoCallsStateChangeOnGlobalEvents = () => {
    console.log("Particpants current situation: ", this.props.participants);
    if (!this.state.calledOthers && this.props.callableParticipantsArray.length > 0 && this.state.currentBrowserStream !== "") {
      this.props.callableParticipantsArray.forEach((participantId) => {
        if (participantId !== collabSocket.id)
          // if this peer participant ss not me then only call them
          this.callAnotherUser(participantId);
      });
      this.state.calledOthers = true; // because i don't wanna call render();
    }
    Array.from(this.props.participants.keys()).forEach((participantId) => {
      if (!this.props.participants.get(participantId).isOnline && this.state.videoRef[participantId]) {
        this.state.videoRef[participantId].remove();
      } else if (this.state.videoRef[participantId]) {
        let videoDOMHtmlElement = document.getElementById(`client-stream-${participantId}`);
        if (videoDOMHtmlElement !== null && videoDOMHtmlElement !== undefined) {
          videoDOMHtmlElement.style.opacity = this.props.participants.get(participantId)?.streamConstraints?.video ? 1 : 0;
          videoDOMHtmlElement.muted = !this.props.participants.get(participantId)?.streamConstraints?.audio;
        }
      }
    });
  };

  render() {
    this.performVideoCallsStateChangeOnGlobalEvents();
    return (
      <>
        <Row
          className={`m-0 justify-content-evenly ${this.props.className}`}
          style={{
            overflow: "hidden",
            height: defaultSubTabHeight,
            width: "100%",
            backgroundColor: colorConfigs.tabSubHeaders,
          }}>
          <Row className="d-flex justify-content-between" style={{ maxWidth: "60px" }}>
            <div
              className="px-0"
              style={{ width: "fit-content", cursor: "pointer" }}
              onClick={(e) =>
                this.props.updateStreamConstraints({
                  video: !this.props.currentStreamConstraints.video,
                  audio: this.props.currentStreamConstraints.audio,
                })
              }>
              {this.props.currentStreamConstraints.video ? (
                <VideoOff strokeWidth={"2px"} color="white" style={{ width: "fit-content" }} size={MainSubPanelIconSize} />
              ) : (
                <Video strokeWidth={"2px"} color="white" style={{ width: "fit-content" }} size={MainSubPanelIconSize} />
              )}
            </div>
            <div
              className="px-0"
              style={{ width: "fit-content", cursor: "pointer" }}
              onClick={(e) =>
                this.props.updateStreamConstraints({
                  video: this.props.currentStreamConstraints.video,
                  audio: !this.props.currentStreamConstraints.audio,
                })
              }>
              {this.props.currentStreamConstraints.audio ? (
                <MicOff strokeWidth={"2px"} color="white" style={{ width: "fit-content" }} size={MainSubPanelIconSize} />
              ) : (
                <Mic strokeWidth={"2px"} color="white" style={{ width: "fit-content" }} size={MainSubPanelIconSize} />
              )}
            </div>
          </Row>
        </Row>
        <Container
          className={`py-3 ${this.props.className}`}
          style={{
            height: MainPanelContainerHeight,
            overflow: "scroll",
            backgroundColor: colorConfigs.darkGrey,
          }}>
          <div className="d-flex" ref={this.videostreamsListRef} style={{ flexWrap: "wrap" }}>
            <Col
              md={4}
              className="px-1"
              style={{
                height: "20vh",
                overflow: "hidden",
                borderRadius: "20px",
              }}>
              <div
                style={{
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: "20px",
                  backgroundColor: colorConfigs.tabHeaders,
                }}>
                <video
                  ref={this.state.videoRef[0]}
                  className="w-100 h-100"
                  style={{
                    borderRadius: "20px",
                    opacity: this.props.currentStreamConstraints?.video ? 1 : 0,
                  }}
                  muted
                />
                <div
                  style={{
                    width: "7.5vh",
                    height: "7.5vh",
                    position: "absolute",
                    marginTop: "calc(-0.8 * 20vh)",
                    marginLeft: "calc(0.16 * 33.33%)",
                    background: `url("${global.aboutMe?.profilePicURL}")`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    borderRadius: "7.5vh",
                    overflow: "hidden",
                  }}></div>
              </div>
              <div
                className="d-flex mr-auto"
                style={{
                  maxWidth: "max-content",
                  marginTop: "-30px",
                  marginLeft: "20px",
                  position: "absolute",
                  zIndex: 2,
                }}>
                <p className="my-auto" style={{ fontSize: "11px" }}>
                  {global.aboutMe?.name}
                </p>
              </div>
            </Col>
          </div>
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoCallsComponent);
