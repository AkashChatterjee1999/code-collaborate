import React from "react";
import { Row, Container, Button, Col } from "reactstrap";
import { colorConfigs } from "../config/configs";
import { ChevronDown } from "react-feather";
import jsColorCodes from "../config/jsCodeColors.json";
import {
  defaultTabHeight,
  defaultSubTabHeight,
  rightSidebarTabHeights,
} from "../config/configs";
import "./styles/codingComponent.scss";
import syntaxHighlighter from "../utils/syntaxHighlighter";

const MainSubPanelIconSize = "12px";
const MainPanelContainerHeight = `calc( 100% - ( ${defaultTabHeight} + ${defaultSubTabHeight} ) )`;

class CodingComponent extends React.Component {
  constructor(props) {
    super(props);
    this.langSeelectionDropDownRef = React.createRef();
    this.codeEditor = React.createRef();
    this.state = {
      displayDropDown: false,
      langDropdownX: "",
      selectedLanguage: "Javascript",
      langDropDownMenuWidth: "0px",
      langDropdownY: "",
      supportedLanguages: ["Javascript", "Python3", "C/C++", "JAVA", "Go"],
    };
  }
  componentDidMount() {
    window.onclick = (e) => {
      this.setState({ displayDropDown: false });
    };
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
        >
          <div
            className="d-flex m-auto"
            style={{ width: "fit-content", minWidth: "100px" }}
            ref={this.langSeelectionDropDownRef}
            onClick={(e) => {
              e.stopPropagation();
              let { top, height, width, left } =
                this.langSeelectionDropDownRef.current.getBoundingClientRect();
              let langDropdownX = top + height;
              let langDropdownY = left;
              this.setState({
                displayDropDown: !this.state.displayDropDown,
                langDropDownMenuWidth: width,
                langDropdownX,
                langDropdownY,
              });
            }}
          >
            <p
              className="mx-2 my-auto"
              style={{
                fontSize: "11px",
                color: "white",
                height: "fit-content",
              }}
            >
              {this.state.selectedLanguage}
            </p>
            <div className="p-0 mt-n2" style={{ width: "fit-content" }}>
              <ChevronDown
                color="white"
                style={{ width: "fit-content" }}
                size={MainSubPanelIconSize}
              />
            </div>
            <div
              className={`${
                this.state.displayDropDown ? "d-flex" : "d-none"
              } flex-column py-2`}
              style={{
                backgroundColor: colorConfigs.tabSubHeaders,
                color: "white",
                height: "fit-content",
                width: this.state.langDropDownMenuWidth,
                position: "absolute",
                fontSize: "10.5px",
                borderRadius: "5px",
                top: this.state.langDropdownX,
                left: this.state.langDropdownY,
              }}
            >
              <ul className="m-0 p-0" style={{ listStyleType: "none" }}>
                {this.state.supportedLanguages.map((language) => {
                  return (
                    <li
                      className="mx-2 px-2 py-1 text-center lang-options"
                      onClick={(e) =>
                        this.setState({ selectedLanguage: language })
                      }
                    >
                      {language}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Row>
        <Container
          className="py-3"
          style={{
            height: MainPanelContainerHeight,
            overflow: "scroll",
            backgroundColor: colorConfigs.darkGrey,
          }}
        >
          <pre
            ref={this.codeEditor}
            contentEditable
            className="editor p-2"
            style={{
              width: "100%",
              height: "96.5%",
              backgroundColor: "transparent",
              fontFamily: "operator-mono",
              border: "0px",
              resize: "none",
              color: jsColorCodes.text,
            }}
            // onKeyPress={(e) =>
            //   setTimeout(() => {
            //     this.codeEditor.current.innerHTML = syntaxHighlighter(
            //       this.codeEditor.current.innerText
            //     );
            //   }, 0)
            // }
          >
            <div>//Write from here</div>
          </pre>
        </Container>
      </>
    );
  }
}

export default CodingComponent;
