import React from "react";
import { Row } from "reactstrap";
import { ChevronDown } from "react-feather";
import { colorConfigs } from "../config/configs";

class StatusHeaderDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Row
        style={{ maxWidth: "fit-content", color: "white" }}
        className="d-bloc my-auto"
      >
        {this.props.icon}
        <p
          className="mx-2 my-auto p-0"
          style={{ fontSize: "11px", width: "fit-content", fontWeight: 200 }}
        >
          {this.props.text}
        </p>
        <div style={{ width: "fit-content" }} className="p-0 mt-n2">
          <ChevronDown className="p-0" size="12px" color="white" />
        </div>
      </Row>
    );
  }
}

export default StatusHeaderDropdown;
