import { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import ParticipantComponent from "../components/ParticipantComponent";
import { colorConfigs } from "../config/configs";
import {
  defaultTabHeight,
  defaultSubTabHeight,
  rightSidebarTabHeights,
} from "../config/configs";

class ParticipantsPanelComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container
        fluid
        className="p-0"
        style={{
          color: "white",
          overflow: "hidden",
        }}
      >
        <div
          className="d-flex px-3"
          style={{
            backgroundColor: colorConfigs.tabHeaders,
            height: defaultTabHeight,
            borderTopRightRadius: "10px",
            borderTopLeftRadius: "10px",
          }}
        >
          <p
            className="my-auto"
            style={{
              fontSize: "11px",
              width: "fit-content",
              fontWeight: 500,
            }}
          >{`Participants (${10})`}</p>
        </div>
        <div
          className="d-flex px-3"
          style={{
            backgroundColor: colorConfigs.tabSubHeaders,
            height: defaultSubTabHeight,
          }}
        >
          <p
            className="my-auto"
            style={{
              fontSize: "11px",
              width: "fit-content",
              fontWeight: 400,
            }}
          >{`Host (1)`}</p>
        </div>
        <ParticipantComponent
          isOnline={this.props.host.isOnline}
          clientPic={this.props.host.pic}
          name={this.props.host.name}
          location={this.props.host.location}
        />
        <div
          className="d-flex px-3"
          style={{
            backgroundColor: colorConfigs.tabSubHeaders,
            height: defaultSubTabHeight,
          }}
        >
          <p
            className="my-auto"
            style={{
              fontSize: "11px",
              width: "fit-content",
              fontWeight: 400,
            }}
          >{`Attendees (${this.props.participants.length})`}</p>
        </div>
        <Container
          className="m-0 px-0 pb-4"
          style={{ overflowY: "scroll", height: "75vh" }}
        >
          {this.props.participants.map((participant) => {
            return (
              <ParticipantComponent
                isOnline={participant.isOnline}
                clientPic={participant.pic}
                name={participant.name}
                location={participant.location}
              />
            );
          })}
        </Container>
      </Container>
    );
  }
}

export default ParticipantsPanelComponent;
