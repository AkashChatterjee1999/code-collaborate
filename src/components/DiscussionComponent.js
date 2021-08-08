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

class DiscussionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
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
        ></Container>
      </>
    );
  }
}

export default DiscussionComponent;
