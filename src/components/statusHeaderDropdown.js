import React from "react";
import { Row } from "reactstrap";
import { ChevronDown } from "react-feather";
import { colorConfigs } from "../config/configs";
import InvitePeopleDropdown from "../components/StatusHeaderDropdowns/InvitePeopleDropdown";

class StatusHeaderDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      type: null,
      toShow: false,
      boundingRect: "",
      roomID: "",
    };
  }

  componentDidMount() {
    window.addEventListener("click", () => {
      this.setState({ toShow: false });
    });
    if (this.props.type !== null && this.props.type !== undefined) {
      this.setState({ type: this.props.type, roomID: this.props.roomID });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props && this.props.type !== null && this.props.type !== undefined) {
      this.setState({ type: this.props.type, roomID: this.props.roomID });
    }
  }

  showDropdown = (e) => {
    e.stopPropagation();
    this.setState({ toShow: !this.state.toShow, boundingRect: this.ref.current.getBoundingClientRect() });
  };

  render() {
    return (
      <>
        <div style={{ maxWidth: "fit-content" }} ref={this.ref} onClick={(e) => this.showDropdown(e)}>
          <Row style={{ color: "white" }} className="m-auto">
            {this.props.icon}
            <p className="mx-2 my-auto p-0" style={{ fontSize: "11px", width: "fit-content", fontWeight: 200 }}>
              {this.props.text}
            </p>
            <div style={{ width: "fit-content" }} className="p-0 mt-n2">
              <ChevronDown className="p-0" size="12px" color="white" />
            </div>
          </Row>
        </div>
        {this.state.toShow ? (
          this.state.type === 1 ? (
            <InvitePeopleDropdown boundingRect={this.state.boundingRect} roomID={this.state.roomID} />
          ) : this.state.type === 2 ? (
            <></>
          ) : this.state.type === 3 ? (
            <></>
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default StatusHeaderDropdown;
