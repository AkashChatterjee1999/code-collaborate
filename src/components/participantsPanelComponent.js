import { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import ParticipantComponent from "../components/ParticipantComponent";
import { colorConfigs } from "../config/configs";
import { isEqual } from "lodash";
import { defaultTabHeight, defaultSubTabHeight, rightSidebarTabHeights } from "../config/configs";
import { connect } from "react-redux";

const mapStateToProps = (props) => {
  return {
    participants: props.participantReducers,
  };
};

class ParticipantsPanelComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      host: "",
    };
  }

  componentDidMount() {
    this.setState({ host: this.props.host });
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps, this.props)) {
      this.setState({ host: this.props.host });
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
        }}>
        <div
          className="d-flex px-3"
          style={{
            backgroundColor: colorConfigs.tabHeaders,
            height: defaultTabHeight,
            borderTopRightRadius: "10px",
            borderTopLeftRadius: "10px",
          }}>
          <p
            className="my-auto"
            style={{
              fontSize: "11px",
              width: "fit-content",
              fontWeight: 500,
            }}>{`Participants (${Array.from(this.props.participants.keys()).length + 1}})`}</p>
        </div>
        <div
          className="d-flex px-3"
          style={{
            backgroundColor: colorConfigs.tabSubHeaders,
            height: defaultSubTabHeight,
          }}>
          <p
            className="my-auto"
            style={{
              fontSize: "11px",
              width: "fit-content",
              fontWeight: 400,
            }}>{`Host (1)`}</p>
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
          }}>
          <p
            className="my-auto"
            style={{
              fontSize: "11px",
              width: "fit-content",
              fontWeight: 400,
            }}>{`Attendees (${Array.from(this.props.participants.keys()).length})`}</p>
        </div>
        <Container className="m-0 px-0 pb-4" style={{ overflowY: "scroll", height: "75vh" }}>
          {Array.from(this.props.participants.keys()).map((key) => {
            console.log(this.props.participants.get(key).name, this.props.participants.get(key).streamConstraints);
            return (
              <ParticipantComponent
                key={key}
                isOnline={this.props.participants.get(key).isOnline}
                clientPic={this.props.participants.get(key).pic}
                name={this.props.participants.get(key).name}
                location={this.props.participants.get(key).location}
                streamConstraints={this.props.participants.get(key).streamConstraints}
              />
            );
          })}
        </Container>
      </Container>
    );
  }
}

export default connect(mapStateToProps, null)(ParticipantsPanelComponent);
