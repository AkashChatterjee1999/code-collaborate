import React from "react";
import { Row, Container, Button, Col } from "reactstrap";
import { colorConfigs } from "../config/configs";
import { ChevronDown } from "react-feather";
import jsColorCodes from "../config/jsCodeColors.json";
import { defaultTabHeight, defaultSubTabHeight, rightSidebarTabHeights } from "../config/configs";
import "./styles/codingComponent.scss";
import syntaxHighlighter from "../utils/syntaxHighlighter";
import { cloneDeep } from "lodash";

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
      cursorXPos: 17,
      cursorYPos: 0,
      cursorPositions: [17],
      supportedLanguages: ["Javascript", "Python3", "C/C++", "JAVA", "Go"],
    };
  }
  componentDidMount() {
    window.onclick = (e) => {
      this.setState({ displayDropDown: false });
    };
  }

  cursor_position() {
    if (window.getSelection && window.getSelection().getRangeAt) {
      let range = window.getSelection().getRangeAt(0);
      let selectedObj = window.getSelection(),
        rangeCount = 0,
        YPos = 0,
        XPos = -1,
        codeEditorDiv = document.getElementById("collab-code-editor");

      if (selectedObj.anchorNode.parentNode == codeEditorDiv) XPos = 0;
      let childNodes = selectedObj.anchorNode.parentNode.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i] == selectedObj.anchorNode) {
          break;
        }
        YPos++;
        if (childNodes[i].outerHTML) rangeCount += childNodes[i].outerHTML.length;
        else if (childNodes[i].nodeType == 3) {
          rangeCount += childNodes[i].textContent.length;
        }
      }
      if (YPos === 0) {
        let focussedNode = selectedObj.anchorNode.parentNode;
        let childNodes = codeEditorDiv.childNodes;
        console.log("Consildated childrens: ", selectedObj.anchorNode);
        for (var i = 0; i < childNodes.length; i++) {
          if (childNodes[i] == focussedNode) {
            YPos = i;
            break;
          }
        }
      }
      XPos = XPos != -1 ? XPos : range.startOffset + rangeCount;
      return [XPos, YPos];
    }
    return [-1, 1];
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
          }}>
          <div
            className="d-flex m-auto"
            style={{ width: "fit-content", minWidth: "100px" }}
            ref={this.langSeelectionDropDownRef}
            onClick={(e) => {
              e.stopPropagation();
              let { top, height, width, left } = this.langSeelectionDropDownRef.current.getBoundingClientRect();
              let langDropdownX = top + height;
              let langDropdownY = left;
              this.setState({
                displayDropDown: !this.state.displayDropDown,
                langDropDownMenuWidth: width,
                langDropdownX,
                langDropdownY,
              });
            }}>
            <p
              className="mx-2 my-auto"
              style={{
                fontSize: "11px",
                color: "white",
                height: "fit-content",
              }}>
              {this.state.selectedLanguage}
            </p>
            <div className="p-0 mt-n2" style={{ width: "fit-content" }}>
              <ChevronDown color="white" style={{ width: "fit-content" }} size={MainSubPanelIconSize} />
            </div>
            <div
              className={`${this.state.displayDropDown ? "d-flex" : "d-none"} flex-column py-2`}
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
              }}>
              <ul className="m-0 p-0" style={{ listStyleType: "none" }}>
                {this.state.supportedLanguages.map((language) => {
                  return (
                    <li className="mx-2 px-2 py-1 text-center lang-options" onClick={(e) => this.setState({ selectedLanguage: language })}>
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
          }}>
          <div
            id="collab-code-editor"
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
            // if (e.key === "Enter") {
            //   if (this.state.cursorXPos < this.state.cursorPositions[this.state.cursorYPos]) {
            //     console.log(this.state.cursorXPos, this.state.cursorPositions[this.state.cursorYPos]);
            //     let remainingCharactersLength = this.state.cursorPositions[this.state.cursorYPos] - this.state.cursorXPos;
            //     let cursorPositions = [...this.state.cursorPositions];
            //     cursorPositions[this.state.cursorYPos] = this.state.cursorXPos;
            //     let cursorXPos = 0,
            //       cursorYPos = this.state.cursorYPos + 1;
            //     if (this.state.cursorYPos === this.state.cursorPositions.length) {
            //       cursorPositions.push(remainingCharactersLength);
            //     } else if (this.state.cursorXPos === 0) {
            //       cursorPositions.splice(this.state.cursorYPos - 2, 0, remainingCharactersLength);
            //     } else {
            //       cursorPositions.splice(this.state.cursorYPos - 1, 0, remainingCharactersLength);
            //     }
            //     this.setState({ cursorPositions, cursorXPos, cursorYPos });
            //   } else {
            //     console.log("Bound command");
            //     let cursorYPos = this.state.cursorYPos;
            //     cursorYPos += 1;
            //     let cursorPositions = [...this.state.cursorPositions];
            //     cursorPositions.push(0);
            //     this.setState({ cursorPositions, cursorXPos: 0, cursorYPos });
            //   }
            // } else if (e.key === "Backspace") {
            //   if (this.state.cursorXPos - 1 < 0 && this.state.cursorYPos - 1 >= 0) {
            //     if (this.state.cursorPositions[this.state.cursorYPos] > 0) {
            //       let cursorPositions = [...this.state.cursorPositions];
            //       let cursorXPos = cursorPositions[this.state.cursorYPos - 1],
            //         cursorYPos = this.state.cursorYPos - 1;
            //       cursorPositions[this.state.cursorYPos - 1] += cursorPositions[this.state.cursorYPos];
            //       cursorPositions.splice(this.state.cursorYPos, 1);
            //       this.setState({ cursorXPos, cursorYPos, cursorPositions });
            //     } else {
            //       let cursorPositions = [...this.state.cursorPositions];
            //       let cursorXPos = cursorPositions[cursorPositions.length - 1],
            //         cursorYPos = this.state.cursorYPos - 1;
            //       cursorPositions.splice(this.state.cursorYPos - 1, 1);
            //       this.setState({ cursorXPos, cursorYPos, cursorPositions });
            //     }
            //   } else {
            //     let cursorPositions = [...this.state.cursorPositions];
            //     let cursorXPos = this.state.cursorXPos;
            //     cursorXPos -= 1;
            //     cursorPositions[this.state.cursorYPos] -= 1;
            //     this.setState({ cursorXPos, cursorPositions });
            //   }
            // } else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
            //   let cursorXPos = this.state.cursorXPos,
            //     cursorYPos = this.state.cursorYPos;
            //   switch (e.key) {
            //     case "ArrowLeft": {
            //       if (cursorXPos - 1 < 0 && cursorYPos - 1 >= 0) {
            //         cursorYPos -= 1;
            //         cursorXPos = this.state.cursorPositions[cursorYPos];
            //         this.setState({ cursorXPos, cursorYPos });
            //       } else if (cursorXPos - 1 >= 0) {
            //         cursorXPos -= 1;
            //         this.setState({ cursorXPos });
            //       }
            //       break;
            //     }
            //     case "ArrowRight": {
            //       if (cursorXPos + 1 > this.state.cursorPositions[this.state.cursorYPos] && cursorYPos + 1 < this.state.cursorPositions.length) {
            //         cursorYPos += 1;
            //         cursorXPos = 0;
            //         this.setState({ cursorXPos, cursorYPos });
            //       } else if (cursorXPos + 1 <= this.state.cursorPositions[this.state.cursorYPos]) {
            //         cursorXPos += 1;
            //         this.setState({ cursorXPos });
            //       }
            //       break;
            //     }
            //     case "ArrowUp": {
            //       if (cursorYPos - 1 >= 0) {
            //         cursorYPos -= 1;
            //         cursorXPos = Math.min(cursorXPos, this.state.cursorPositions[cursorYPos]);
            //         this.setState({ cursorXPos, cursorYPos });
            //       }
            //       break;
            //     }
            //     case "ArrowDown": {
            //       if (cursorYPos + 1 < this.state.cursorPositions.length) {
            //         cursorYPos += 1;
            //         cursorXPos = Math.min(cursorXPos, this.state.cursorPositions[cursorYPos]);
            //         this.setState({ cursorXPos, cursorYPos });
            //       }
            //       break;
            //     }
            //     default: {
            //       console.log("Impossible");
            //     }
            //   }
            // } else if (e.key.match(/^(\d|\w| |\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\+|\=|\||\/|\{|\}|\[|\]|\;|\:|\'|\"|\<|\>|\,|\.|\?|\~|\`){1}$/gi)) {
            //   let cursorPositions = [...this.state.cursorPositions];
            //   let cursorXPos = this.state.cursorXPos;
            //   cursorXPos += 1;
            //   cursorPositions[this.state.cursorYPos] += 1;
            //   this.setState({ cursorXPos, cursorPositions });
            // }
            onClick={(e) => {
              setTimeout(() => {
                let result = this.cursor_position();
                let cursorXPos = result[0],
                  cursorYPos = result[1];
                this.setState({ cursorXPos, cursorYPos });
              }, 0);
            }}
            onKeyDown={(e) => {
              setTimeout(() => {
                let result = this.cursor_position();
                let cursorXPos = result[0],
                  cursorYPos = result[1];
                this.setState({ cursorXPos, cursorYPos });
              }, 0);
            }}>
            <div>//Write from here</div>
          </div>
        </Container>
      </>
    );
  }
}

export default CodingComponent;
