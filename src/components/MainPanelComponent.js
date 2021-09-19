import React from "react";
import { colorConfigs } from "../config/configs";
import { Row, Container } from "reactstrap";
import { defaultTabHeight, defaultSubTabHeight, rightSidebarTabHeights } from "../config/configs";
import { isEqual } from "lodash";
import { Code, Grid, FileText } from "react-feather";
import CodingComponent from "./CodingComponent";
import VideoCallsComponent from "./VideoCallsComponent";
import DiscussionComponent from "./DiscussionComponent";
const MainPanelIconSize = "16px";

class MainPanelComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPanel: 1,
      participantIds: [],
    };
  }

  /**
   * Note: Simulatneous calls from both sides will be there when 2nd person joins the code-collaborate
   * Though according to my tests the first call will probably fail since the reciever won't be available
   * right then, hence the peerjs socket will be dead by then
   */

  render() {
    return (
      <Container className="m-0 p-0" style={{ height: "100%", overflow: "hidden" }}>
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
            }}>
            {"Main Panel"}
          </p>
          <Row className="my-auto ml-auto justify-content-between px-3" style={{ width: "100px" }}>
            <div className="px-0" style={{ width: "max-content", cursor: "pointer" }} onClick={(e) => this.setState({ selectedPanel: 1 })}>
              <Code strokeWidth={"2px"} color="white" size={MainPanelIconSize} />
            </div>
            <div className="px-0" style={{ width: "max-content", cursor: "pointer" }} onClick={(e) => this.setState({ selectedPanel: 2 })}>
              <Grid strokeWidth={"2px"} color="white" size={MainPanelIconSize} />
            </div>
            <div className="px-0" style={{ width: "max-content", cursor: "pointer" }} onClick={(e) => this.setState({ selectedPanel: 3 })}>
              <FileText strokeWidth={"2px"} color="white" size={MainPanelIconSize} />
            </div>
          </Row>
        </div>
        <CodingComponent className={this.state.selectedPanel === 1 ? "" : "d-none"} />
        <VideoCallsComponent className={this.state.selectedPanel === 2 ? "" : "d-none"} />
        <DiscussionComponent className={this.state.selectedPanel === 3 ? "" : "d-none"} />
      </Container>
    );
  }
}

export default MainPanelComponent;
