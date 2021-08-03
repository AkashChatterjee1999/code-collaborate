import React from "react";
import { Container, Row, Col } from "reactstrap";
import ParticipantComponent from "../components/ParticipantComponent";
import { colorConfigs } from "../config/configs";
import {
  defaultTabHeight,
  defaultSubTabHeight,
  rightSidebarTabHeights,
} from "../config/configs";

class InputOutputComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Container className="px-0">
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
          >{`Input & Output`}</p>
        </div>
        <Container
          fluid
          style={{
            height: rightSidebarTabHeights,
            backgroundColor: colorConfigs.darkGrey,
            overflow: "scroll",
          }}
        >
          {/*Your input output data here */}
        </Container>
      </Container>
    );
  }
}

export default InputOutputComponent;
