import React from "react";
import { colorConfigs } from "../config/configs";
import { Row, Container } from "reactstrap";
import {
  defaultTabHeight,
  defaultSubTabHeight,
  rightSidebarTabHeights,
} from "../config/configs";
import { Code, Grid, FileText } from "react-feather";
import CodingComponent from "./CodingComponent";
import VideoCallsComponent from "./VideoCallsComponent";
import DiscussionComponent from "./DiscussionComponent";
const MainPanelIconSize = "16px";

class MainPanelComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPanel: 2,
    };
  }
  render() {
    return (
      <Container
        className="m-0 p-0"
        style={{ height: "100%", overflow: "hidden" }}
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
          >
            {"Main Panel"}
          </p>
          <Row
            className="my-auto ml-auto justify-content-between px-3"
            style={{ width: "100px" }}
          >
            <div
              className="px-0"
              style={{ width: "fit-content", cursor: "pointer" }}
              onClick={(e) => this.setState({ selectedPanel: 1 })}
            >
              <Code
                strokeWidth={"2px"}
                color="white"
                style={{ width: "fit-content" }}
                size={MainPanelIconSize}
              />
            </div>
            <div
              className="px-0"
              style={{ width: "fit-content", cursor: "pointer" }}
              onClick={(e) => this.setState({ selectedPanel: 2 })}
            >
              <Grid
                strokeWidth={"2px"}
                color="white"
                style={{ width: "fit-content" }}
                size={MainPanelIconSize}
              />
            </div>
            <div
              className="px-0"
              style={{ width: "fit-content", cursor: "pointer" }}
              onClick={(e) => this.setState({ selectedPanel: 3 })}
            >
              <FileText
                strokeWidth={"2px"}
                color="white"
                style={{ width: "fit-content" }}
                size={MainPanelIconSize}
              />
            </div>
          </Row>
        </div>
        {this.state.selectedPanel === 1 ? (
          <CodingComponent />
        ) : this.state.selectedPanel === 2 ? (
          <VideoCallsComponent />
        ) : (
          <DiscussionComponent />
        )}
      </Container>
    );
  }
}

export default MainPanelComponent;
