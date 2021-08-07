import React from "react";
import { colorConfigs } from "../config/configs";
import { Row, Container } from "reactstrap";
import {
  defaultTabHeight,
  defaultSubTabHeight,
  rightSidebarTabHeights,
} from "../config/configs";
import { Code, Grid, FileText } from "react-feather";
const MainPanelIconSize = "16px";

class MainPanelComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      langDropdownOpen: false,
    };
  }
  render() {
    return (
      <Container className="m-0 p-0">
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
            <div className="px-0" style={{ width: "fit-content" }}>
              <Code
                strokeWidth={"2px"}
                color="white"
                style={{ width: "fit-content" }}
                size={MainPanelIconSize}
              />
            </div>
            <div className="px-0" style={{ width: "fit-content" }}>
              <Grid
                strokeWidth={"2px"}
                color="white"
                style={{ width: "fit-content" }}
                size={MainPanelIconSize}
              />
            </div>
            <div className="px-0" style={{ width: "fit-content" }}>
              <FileText
                strokeWidth={"2px"}
                color="white"
                style={{ width: "fit-content" }}
                size={MainPanelIconSize}
              />
            </div>
          </Row>
        </div>
        <Row
          className="m-0"
          style={{
            overflowX: "hidden",
            height: defaultSubTabHeight,
            width: "100%",
            backgroundColor: colorConfigs.tabSubHeaders,
          }}
        ></Row>
        <Container
          className="py-3"
          style={{
            height: "80vh",
            overflow: "scroll",
            backgroundColor: colorConfigs.darkGrey,
          }}
        ></Container>
      </Container>
    );
  }
}

export default MainPanelComponent;
