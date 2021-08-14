import React from "react";
import { Row, Container, Button, Col } from "reactstrap";
import { colorConfigs } from "../config/configs";
import {
  defaultTabHeight,
  defaultSubTabHeight,
  rightSidebarTabHeights,
} from "../config/configs";
import "./styles/codingComponent.scss";

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
    };
  }

  componentDidMount = async () => {
    let currentBrowserStream = await navigator.mediaDevices.getUserMedia(
      this.state.currentVideoConstraint
    );
    this.state.videoRef[0].current.srcObject = currentBrowserStream;
    console.log(this.state.videoRef[0].current.addEventListener);
    this.state.videoRef[0].current.addEventListener("loadedmetadata", () => {
      this.state.videoRef[0].current.play();
    });

    global.me.peer.on("call", (call) => {
      let otherUsersVideoStream = document.createElement("video");
      call.answer(currentBrowserStream);
      call.on("stream", (stream) => {
        otherUsersVideoStream.srcObject = stream;
        otherUsersVideoStream.addEventListener("loadedmetadata", () => {
          otherUsersVideoStream.play();
        });

        this.videostreamsListRef.current.appendChild(otherUsersVideoStream);
      });
      call.on("close", () => {
        otherUsersVideoStream.remove();
      });
    });

    this.setState({ currentBrowserStream });
  };

  callAnotherUser = (userId) => {
    let anotherUserCallObj = global.me.peer.call(
      userId,
      this.state.currentBrowserStream
    );
    let videoWrapperDOM = new DOMParser().parseFromString(
      `<div id="video-wrapper-div" class="col-md-4 px-1" style="height: 20vh;overflow: hidden;borderRadius: 20px;"></div>`,
      "text/html"
    );
    let videoWrapper = videoWrapperDOM.getElementById("video-wrapper-div");
    let otherUsersVideoStream = document.createElement("video");
    otherUsersVideoStream.className += " h-100 w-100";
    otherUsersVideoStream.style = `borderRadius: 20px;`;
    videoWrapper.appendChild(otherUsersVideoStream);
    anotherUserCallObj.on("stream", (stream) => {
      otherUsersVideoStream.srcObject = stream;
      otherUsersVideoStream.addEventListener("loadedmetadata", () => {
        otherUsersVideoStream.play();
      });
      this.videostreamsListRef.current.appendChild(videoWrapper);
    });

    anotherUserCallObj.on("close", () => {
      videoWrapper.remove();
    });
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
