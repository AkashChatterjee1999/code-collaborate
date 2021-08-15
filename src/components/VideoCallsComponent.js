import React from "react";
import { Row, Container, Button, Col } from "reactstrap";
import { colorConfigs } from "../config/configs";
import {
  defaultTabHeight,
  defaultSubTabHeight,
  rightSidebarTabHeights,
} from "../config/configs";
import "./styles/codingComponent.scss";
import { isEqual, cloneDeep } from "lodash";

const MainSubPanelIconSize = "12px";
const MainPanelContainerHeight = `calc( 100% - ( ${defaultTabHeight} + ${defaultSubTabHeight} ) )`;

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

        this.setState({ currentBrowserStream }, () => {
          console.log("Got it");
          if (
            this.props.participantIds !== null &&
            (this.props.participantIds.length > 0 ||
              this.state.prevParticipants.length > 0) &&
            !this.state.calledOthers
          ) {
            // Since here we are sure that browser stream is available to us.
            if (this.state.prevParticipants > 0) {
              // if component did update already set the state with prev participants
              this.state.prevParticipants.forEach((participantId) => {
                this.callAnotherUser(participantId);
              });
            } else if (this.state.prevParticipants.length > 0) {
              // is component did mount executed faster than that then component did mount will update that ...
              this.setState(
                {
                  calledOthers: true,
                  prevParticipants: this.props.participantIds,
                },
                () => {
                  console.log("Calling others ");
                  this.state.prevParticipants.forEach((participantId) => {
                    this.callAnotherUser(participantId);
                  });
                }
              );
            }
          }
        });
      })
      .catch((err) => {
        console.log("Cannot get the browser Stream: ", err);
      });
  }

  componentDidUpdate = (prevProps) => {
    console.log("Curr State Update: ", prevProps, this.props);
    if (
      prevProps.participantIds.length > 0 &&
      !this.state.calledOthers &&
      this.state.prevParticipants.length === 0
    ) {
      if (this.state.currentBrowserStream !== "") {
        this.setState(
          { calledOthers: true, prevParticipants: this.props.participantIds },
          () => {
            console.log("Calling others ");
            this.state.prevParticipants.forEach((participantId) => {
              this.callAnotherUser(participantId);
            });
          }
        );
      } else if (this.state.prevParticipants.length === 0) {
        // Since browser stream is not availabel yet hence only update the state
        this.setState({ prevParticipants: this.props.participantIds });
      }
    }
  };

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
    this.peerVideoStreamAdjuster(call, "NOT-KNOWN");
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
    let videoRef = cloneDeep(this.state.videoRef);
    videoRef[`${clientID}`] = videoWrapper;
    this.setState({ videoRef });
    callObj.on(
      "stream",
      function (stream) {
        otherUsersVideoStream.srcObject = stream;
        otherUsersVideoStream.addEventListener("loadedmetadata", () => {
          otherUsersVideoStream.play();
        });
        this.videostreamsListRef.current.appendChild(videoWrapper);
      }.bind(this)
    );
  };

  render() {
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

export default VideoCallsComponent;
