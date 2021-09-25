import React from "react";
import { ArrowRight, Mic, Smile } from "react-feather";
import { Container, Row, Col } from "reactstrap";
import { colorConfigs } from "../config/configs";
import { defaultTabHeight, defaultSubTabHeight, rightSidebarTabHeights } from "../config/configs";
import { isEqual } from "lodash";
const ParticipantIconSize = "16px";

class ChatComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      msg: "",
    };
  }

  componentDidMount() {
    let chats = [...this.props.chats];
    this.setState({ chats });
  }

  componentDidUpdate = (prevProps) => {
    if (!isEqual(prevProps, this.props)) {
      let chats = [...this.props.chats];
      this.setState({ chats });
    }
  };

  chatMessageHandler = (e) => {
    this.setState({ msg: e.target.value });
  };

  chatHandler = (e) => {
    if (this.state.msg.length > 1) {
      this.props.sendChat(this.state.msg);
      this.setState({ msg: "" });
    }
  };

  chatHandleKeyDownChatBox = (e) => {
    if (e.key === "Enter") {
      this.chatHandler(e);
    }
  };

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
          }}>
          <p
            className="my-auto"
            style={{
              fontSize: "11px",
              width: "fit-content",
              fontWeight: 500,
            }}>{`Chats`}</p>
        </div>
        <Container
          fluid
          className="pt-1"
          style={{
            height: rightSidebarTabHeights,
            backgroundColor: colorConfigs.darkGrey,
            overflow: "hidden",
          }}>
          <Container
            className="px-2"
            style={{
              width: "100%",
              height: "75%",
              overflow: "scroll",
            }}>
            {this.state.chats.map((chat, index) => {
              return (
                <Container key={index} className="m-0 p-0 d-flex">
                  <div
                    className="d-flex my-3 px-2"
                    style={{
                      width: "45px",
                      height: "40px",
                      borderRadius: "45px",
                      overflow: "hidden",
                      background: `url(${chat.profilePic})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}>
                    {/* <img
                      src={}
                      alt="person w-100 h-100"
                      style={{ height: "35px", width: "35px" }}
                      className="m-auto"
                    /> */}
                  </div>
                  <Container
                    className="my-3 mx-1 p-3"
                    style={{
                      borderRadius: "15px",
                      height: "fit-content",
                      backgroundColor: colorConfigs.tabSubHeaders,
                    }}>
                    <p className="m-0" style={{ color: "white", fontSize: "11px" }}>
                      {chat.sender}
                      <span className="mx-2" style={{ color: "grey" }}>
                        {chat.timeStamp}
                      </span>
                    </p>
                    <p className="mb-0 mt-2" style={{ fontSize: "10.85px", fontWeight: "normal" }}>
                      {chat.message}
                    </p>
                  </Container>
                </Container>
              );
            })}
          </Container>
          <hr />
          <Container className="d-flex m-0 p-0" style={{ height: "calc( 100% - 90% )" }}>
            <textarea
              placeholder="Send a Message"
              className="px-3 mb-2"
              value={this.state.msg}
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
              onKeyDown={this.chatHandleKeyDownChatBox}
              onChange={this.chatMessageHandler}></textarea>
            <Row className="m-auto" style={{ width: "80px", justifyContent: "space-evenly" }}>
              <div className="px-0" style={{ width: "max-content" }}>
                <Mic color="gray" size={ParticipantIconSize} />
              </div>
              <div className="px-0" style={{ width: "max-content" }}>
                <Smile color="gray" size={ParticipantIconSize} />
              </div>
              <div className="px-0" style={{ width: "max-content" }}>
                <ArrowRight color="gray" size={ParticipantIconSize} onClick={this.chatHandler} />
              </div>
            </Row>
          </Container>
        </Container>
      </Container>
    );
  }
}

export default ChatComponent;
