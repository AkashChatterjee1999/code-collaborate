import React from "react";
import { Container, Row, Col } from "reactstrap";
import { colorConfigs } from "../config/configs";
import { Mic, Video, Info, MicOff, VideoOff } from "react-feather";
const ParticipantIconSize = "16px";
const onlineColor = "#56e352";
const offlineColor = "#d95356";

class ParticipantComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container
        className="p-3 d-flex"
        style={{ backgroundColor: colorConfigs.darkGrey }}
      >
        <Container className="d-flex m-0 p-0" style={{ float: "left" }}>
          <div
            className="d-flex"
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "35px",
              overflow: "hidden",
            }}
          >
            <img
              src={this.props.clientPic}
              alt="person"
              className="m-auto w-100 h-100"
            />
          </div>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "10px",
              backgroundColor: this.props.isOnline ? onlineColor : offlineColor,
              marginLeft: "-5px",
            }}
          ></div>
          <div className="mx-2 px-1">
            <p className="m-0" style={{ color: "white", fontSize: "11px" }}>
              {this.props.name}
            </p>
            <p
              className="m-0"
              style={{ color: "gray", fontSize: "10.5px", fontWeight: 400 }}
            >
              {this.props.location}
            </p>
          </div>
        </Container>
        <Container
          className="p-0"
          style={{ float: "right", width: "fit-content" }}
        >
          <Row
            className="m-auto"
            style={{ width: "100px", justifyContent: "space-evenly" }}
          >
            <div className="px-0" style={{ width: "fit-content" }}>
              {this.props.streamConstraints &&
              this.props.streamConstraints.audio ? (
                <Mic color="white" size={ParticipantIconSize} />
              ) : (
                <MicOff color="gray" size={ParticipantIconSize} />
              )}
            </div>
            <div className="px-0" style={{ width: "fit-content" }}>
              {this.props.streamConstraints &&
              this.props.streamConstraints.video ? (
                <Video color="white" size={ParticipantIconSize} />
              ) : (
                <VideoOff color="gray" size={ParticipantIconSize} />
              )}
            </div>
            <div className="px-0" style={{ width: "fit-content" }}>
              <Info color="gray" size={ParticipantIconSize} />
            </div>
          </Row>
        </Container>
      </Container>
    );
  }
}

export default ParticipantComponent;
