import { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import ParticipantComponent from "../components/ParticipantComponent";
import { colorConfigs } from "../config/configs";
import { isEqual } from "lodash";
import {
  defaultTabHeight,
  defaultSubTabHeight,
  rightSidebarTabHeights,
} from "../config/configs";

class ParticipantsPanelComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: new Map(),
      host: "",
    };
  }

  componentDidMount() {
    let participants = new Map();
    this.props.participants.forEach((participantData, participantId) => {
      participants.set(participantId, participantData);
    });
    this.setState({ participants, host: this.props.host });
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps, this.props)) {
      let participants = new Map();
      this.props.participants.forEach((participantData, participantId) => {
        participants.set(participantId, participantData);
      });
      this.setState({ participants, host: this.props.host });
    }
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
          isOnline={this.state.host.isOnline}
          clientPic={this.state.host.pic}
          name={this.state.host.name}
          location={this.state.host.location}
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
          >{`Attendees (${
            Array.from(this.state.participants.keys()).length
          })`}</p>
        </div>
        <Container
          className="m-0 px-0 pb-4"
          style={{ overflowY: "scroll", height: "75vh" }}
        >
          {Array.from(this.state.participants.keys()).map((key) => {
            console.log(key, this.state.participants);
            return (
              <ParticipantComponent
                key={key}
                isOnline={this.state.participants.get(key).isOnline}
                clientPic={this.state.participants.get(key).pic}
                name={this.state.participants.get(key).name}
                location={this.state.participants.get(key).location}
              />
            );
          })}
        </Container>
      </Container>
    );
  }
}

export default ParticipantsPanelComponent;
