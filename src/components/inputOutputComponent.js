import React from "react";
import { AlertCircle, ArrowUpRight, Play } from "react-feather";
import { Container, Row, Col } from "reactstrap";
import ParticipantComponent from "../components/ParticipantComponent";
import { colorConfigs } from "../config/configs";
import { defaultTabHeight, defaultSubTabHeight, rightSidebarTabHeights } from "../config/configs";
import { connect } from "react-redux";
import axios from "axios";

const MainPanelIconSize = "16px";
const MainSubPanelIconSize = "12px";

const mapStateToProps = (props) => {
  return {
    updatedCodeData: props.updateCodeReducer,
  };
};

class InputOutputComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPanel: 1,
      inputText: "",
      codeSubmissionAckID: "",
      isCodeSubmitted: false,
    };
  }

  getCodeStatus() {
    /* Excution end output result: 
      {
        "status": "executed",
        "input": "",
        "result": {
            "exitCode": 0,
            "output": "Hello World"
        }
      } */

    axios
      .get(`https://code-collaborate-compiler.herokuapp.com/api/v1/checkStatus/${this.state.codeSubmissionAckID}`)
      .then((response) => {
        if (response.data.status === "executed") this.props.sendOutputData(response.data);
        if (response.data.status !== "in queue...") {
          this.setState({ isCodeSubmitted: false, codeSubmissionAckID: "" }, () => {
            if (global.codeStatusChecker) {
              // De-registering status poller
              window.clearInterval(global.codeStatusChecker);
              global.codeStatusChecker = undefined;
            }
          });
        }
      })
      .catch((err) => {
        console.log(err.stack);
        alert(err.response.data);
      });
  }

  runCode() {
    axios
      .post("https://code-collaborate-compiler.herokuapp.com/api/v1/submitCode", {
        code: this.props.updatedCodeData.code,
        language: this.props.updatedCodeData.codeLanguage,
        input: this.state.inputText,
      })
      .then((response) => {
        this.setState({ codeSubmissionAckID: response.data.ackID, inputText: "", isCodeSubmitted: true }, () => {
          // registering status poller
          global.codeStatusChecker = setInterval(this.getCodeStatus(), 2000);
        });
      })
      .catch((err) => {
        console.log(err.stack);
        alert(err.response.data.errorDescription ? err.response.data.errorDescription : JSON.stringify(err.response.data, "\n", 2));
      });
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
          }}>
          <p
            className="my-auto"
            style={{
              fontSize: "11px",
              width: "fit-content",
              fontWeight: 500,
            }}>{`Input & Output`}</p>
          <div className="d-flex ml-auto">
            {this.state.selectedPanel === 1 ? (
              <div
                className="mx-1"
                disabled={this.state.runButtonDisabled || this.props.updatedCodeData === ""}
                style={{ width: "fit-content", display: "flex", cursor: "pointer" }}
                onClick={(e) => this.runCode()}>
                <Play className="my-auto" strokeWidth={"0px"} fill="green" size={"20px"} />
              </div>
            ) : null}
            <div
              className="mx-1"
              style={{ width: "fit-content", display: "flex", cursor: "pointer" }}
              onClick={(e) => this.setState({ selectedPanel: 1 })}>
              <AlertCircle className="my-auto" strokeWidth={"2px"} color="white" size={MainPanelIconSize} />
            </div>
            <div
              className="mx-1"
              style={{ width: "fit-content", display: "flex", cursor: "pointer" }}
              onClick={(e) => this.setState({ selectedPanel: 2 })}>
              <ArrowUpRight className="my-auto" strokeWidth={"2px"} color="white" size={MainPanelIconSize} />
            </div>
          </div>
        </div>
        <Container
          className="p-3"
          fluid
          style={{
            height: rightSidebarTabHeights,
            backgroundColor: colorConfigs.darkGrey,
            overflowX: "hidden",
            overflowY: `${this.state.selectedPanel === 1 ? "hidden" : "scroll"}`,
          }}>
          {this.state.selectedPanel === 1 ? (
            <textarea
              placeholder="write your input here"
              className="p-2"
              value={this.state.inputText}
              onChange={(e) => this.setState({ inputText: e.target.value })}
              style={{ color: "white", height: "100%", width: "100%", backgroundColor: "transparent", resize: "none" }}
            />
          ) : (
            <>
              {this.props.codeOutputs.map((output, index) => {
                return (
                  <Container key={index} className="m-0 p-0 d-flex">
                    <div
                      className="d-flex my-3 px-2"
                      style={{
                        width: "45px",
                        height: "40px",
                        borderRadius: "45px",
                        overflow: "hidden",
                        background: `url(${output.profilePic})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}></div>
                    <Container
                      className="my-3 mx-1 p-3"
                      style={{
                        borderRadius: "15px",
                        height: "fit-content",
                        backgroundColor: colorConfigs.tabSubHeaders,
                      }}>
                      <p className="m-0" style={{ color: "white", fontSize: "11px" }}>
                        {output.sender}
                        <span className="mx-2" style={{ color: "grey" }}>
                          {output.timeStamp}
                        </span>
                      </p>
                      <p className="mb-0 mt-2" style={{ fontSize: "10.85px", fontWeight: "normal" }}>
                        The code is executed successfully with the folowing input: <br /> <b>{`${output.codeOutput.input}`}</b>
                        <br />
                        <br /> which produced this output: <br /> <b> {`${output.codeOutput.result.output}`}</b> <br /> <br />
                        and the code exited with exitCode: <b>{`${output.codeOutput.result.exitCode}`}</b>
                      </p>
                    </Container>
                  </Container>
                );
              })}
            </>
          )}
        </Container>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(InputOutputComponent);
