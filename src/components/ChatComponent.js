import { nonEmptyArray } from "check-types";
import React from "react";
import { ArrowRight, Mic, Smile } from "react-feather";
import { Container, Row, Col } from "reactstrap";
import ParticipantComponent from "../components/ParticipantComponent";
import { colorConfigs } from "../config/configs";
import {
  defaultTabHeight,
  defaultSubTabHeight,
  rightSidebarTabHeights,
} from "../config/configs";
const ParticipantIconSize = "16px";

class ChatComponent extends React.Component {
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
          >{`Chats`}</p>
        </div>
        <Container
          fluid
          style={{
            height: rightSidebarTabHeights,
            backgroundColor: colorConfigs.darkGrey,
            overflow: "hidden",
          }}
        >
          <Container
            style={{ width: "100%", height: "75%", overflow: "scroll" }}
          ></Container>
          <hr />
          <Container className="d-flex m-0 p-0" style={{ height: "12%" }}>
            <textarea
              placeholder="Send a Message"
              className="px-3 mb-2"
              style={{
                width: "70%",
                height: "100%",
                resize: "none",
                backgroundColor: "transparent",
                color: "white",
                borderRadius: "20px",
                border: "2px solid gray",
                outlineColor: "transparent",
                fontSize: "12px",
              }}
            ></textarea>
            <Row
              className="m-auto"
              style={{ width: "80px", justifyContent: "space-evenly" }}
            >
              <div className="px-0" style={{ width: "fit-content" }}>
                <Mic
                  color="gray"
                  style={{ width: "fit-content" }}
                  size={ParticipantIconSize}
                />
              </div>
              <div className="px-0" style={{ width: "fit-content" }}>
                <Smile
                  color="gray"
                  style={{ width: "fit-content" }}
                  size={ParticipantIconSize}
                />
              </div>
              <div className="px-0" style={{ width: "fit-content" }}>
                <ArrowRight
                  color="gray"
                  style={{ width: "fit-content" }}
                  size={ParticipantIconSize}
                />
              </div>
            </Row>
          </Container>
        </Container>
      </Container>
    );
  }
}

export default ChatComponent;
