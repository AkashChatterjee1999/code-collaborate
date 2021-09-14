import React from "react";
import { Copy } from "react-feather";
import { Row, Container } from "reactstrap";
import { colorConfigs } from "../../config/configs";

class InviteDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.yOffset = 40;
    this.state = {
      width: "200px",
      top: "100px",
      left: "35px",
      roomID: "",
    };
  }

  componentDidMount() {
    if (this.props.boundingRect) {
      let { top, left } = this.props.boundingRect;
      top += this.yOffset;
      this.setState({ top, left, roomID: this.props.roomID });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props && this.props.boundingRect) {
      let { top, left } = this.props.boundingRect;
      top += this.yOffset;
      this.setState({ top, left, roomID: this.props.roomID });
    }
  }

  render() {
    return (
      <Container
        className="p-3"
        style={{
          width: this.state.width,
          position: "absolute",
          top: this.state.top,
          left: this.state.left,
          backgroundColor: colorConfigs.tabHeaders,
          borderRadius: "20px",
        }}>
        <p style={{ fontSize: "10.75px", color: "lightgray" }}>Copy this roomID and ask them to put this roomID when they join this room</p>
        <Row className="px-2">
          <p className="my-auto" style={{ fontSize: "10px", color: "white", width: "fit-content" }}>
            Copy roomID
          </p>
          <div style={{ width: "fit-content", height: "fit-content" }}>
            <Copy color="white" strokeWidth="2.75px" size="16" onClick={(e) => navigator.clipboard.writeText(this.state.roomID)}></Copy>
          </div>
        </Row>
      </Container>
    );
  }
}

export default InviteDropdown;
