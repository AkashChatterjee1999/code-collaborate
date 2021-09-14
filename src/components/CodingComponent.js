import React from "react";
import AceEditor from "react-ace";
import { Row, Container, Button, Col } from "reactstrap";
import { colorConfigs } from "../config/configs";
import { connect } from "react-redux";
import CodingComponentDropdown from "./CodingComponentDropdowns";
import { isEqual } from "lodash";
import { collabSocket } from "../utils/socketConnectors";
import { diffSyncConnector } from "../utils/socketConnectors";
import { defaultTabHeight, defaultSubTabHeight } from "../config/configs";
import * as AceCollabExt from "@convergence/ace-collab-ext";
import "@convergence/ace-collab-ext/css/ace-collab-ext.min.css";
import { updateEditorCursorManager } from "../redux/actions";

import "./styles/codingComponent.scss";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-c_cpp";

import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-merbivore";
import "ace-builds/src-noconflict/theme-dracula";

const mapStateToProps = (props) => {
  return {
    updatedCodeData: props.codeUpdaterReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateEditorCursorManagerRef: (cursorManagerRef) => dispatch(updateEditorCursorManager(cursorManagerRef)),
  };
};

const MainPanelContainerHeight = `calc( 100% - ( ${defaultTabHeight} + ${defaultSubTabHeight} ) )`;

class CodingComponent extends React.Component {
  constructor(props) {
    super(props);
    this.langSeelectionDropDownRef = React.createRef();
    this.codeEditor = React.createRef();
    this.codeDifferenceSynchronizer = null;
    this.prevCodeSnapshot = "";
    this.state = {
      displayDropDown: false,
      selectedLanguage: {
        label: "Javascript",
        value: "javascript",
      },
      addedCursorPosition: false,
      previousCursorPosition: {},
      selectedFontSize: 14,
      selectedTheme: {
        label: "Theme: Terminal",
        value: "terminal",
      },
      fontSizes: [10, 11, 12, 13, 14, 15, 16, 18, 20, 25, 30],
      supportedThemes: [
        {
          label: "Theme: Terminal",
          value: "terminal",
        },
        {
          label: "Theme: Github",
          value: "github",
        },
        {
          label: "Theme: Monokai",
          value: "monokai",
        },
        {
          label: "Theme: Merbivore",
          value: "merbivore",
        },
        {
          label: "Theme: dracula",
          value: "dracula",
        },
      ],
      supportedLanguages: [
        {
          label: "Javascript",
          value: "javascript",
        },
        {
          label: "Python3",
          value: "python",
        },
        {
          label: "C/C++",
          value: "c_cpp",
        },
        {
          label: "JAVA",
          value: "java",
        },
        {
          label: "Go",
          value: "golang",
        },
      ],
    };
  }

  getCursorPosition() {
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
        console.log("Consildated children: ", selectedObj.anchorNode);
        for (var i = 0; i < childNodes.length; i++) {
          if (childNodes[i] == focussedNode) {
            YPos = i;
            break;
          }
        }
      }
      XPos = XPos != -1 ? XPos : range.startOffset + rangeCount;
      return [XPos, YPos, codeEditorDiv.childNodes[YPos]];
    }
    return [-1, -1, null];
  }

  setCursorPosition = (lineNo, characterPos) => {
    let codeEditorDiv = document.getElementById("collab-code-editor"),
      setpos = document.createRange(),
      set = window.getSelection();

    console.log(lineNo, characterPos);
    console.log(codeEditorDiv.childNodes[lineNo]);
    setpos.setStart(codeEditorDiv.childNodes[lineNo], 2);
    setpos.collapse(true);
    set.removeAllRanges();
    set.addRange(setpos);
    codeEditorDiv.focus();
  };

  async componentDidMount() {
    this.props.updateEditorCursorManagerRef(new AceCollabExt.AceMultiCursorManager(this.codeEditor.current.editor.getSession()));
    this.codeDifferenceSynchronizer = await diffSyncConnector.provideDiffSync();
    this.codeDifferenceSynchronizer.registerDiffSyncEvents(
      (initialCode) => {
        if (initialCode) this.codeEditor.current.editor.setValue(initialCode);
      },
      (updatedCode) => {
        if (updatedCode && this.prevCodeSnapshot !== updatedCode) {
          let currentCursorPosition = this.codeEditor.current.editor.getCursorPosition();
          this.prevCodeSnapshot = updatedCode;
          this.codeEditor.current.editor.setValue(updatedCode);
          this.codeEditor.current.editor.clearSelection();
          this.codeEditor.current.editor.moveCursorTo(currentCursorPosition.row, currentCursorPosition.column);
        }
      }
    );
  }

  codeSyncAndCursorPositionUpdater = (code) => {
    this.prevCodeSnapshot = code;
    this.codeDifferenceSynchronizer.synchroizeDifferences(code, () => {
      if (this.codeEditor.current) {
        let currentCursorPosition = this.codeEditor.current.editor.getCursorPosition();
        if (!(currentCursorPosition.row === 0 && currentCursorPosition.column === 0)) {
          if (!this.state.addedCursorPosition) {
            this.setState({ addedCursorPosition: true, previousCursorPosition: currentCursorPosition }, () => {
              collabSocket.addCursorPosition(currentCursorPosition);
            });
          } else if (!isEqual(currentCursorPosition, this.state.previousCursorPosition)) {
            this.setState({ previousCursorPosition: currentCursorPosition }, () => {
              collabSocket.updateCursorPosition(currentCursorPosition);
            });
          }
        }
      }
    });
  };

  render() {
    return (
      <>
        <Row
          className={`m-0 justify-content-evenly ${this.props.className}`}
          style={{
            overflow: "hidden",
            height: defaultSubTabHeight,
            width: "100%",
            backgroundColor: colorConfigs.tabSubHeaders,
          }}>
          <CodingComponentDropdown
            options={this.state.fontSizes}
            selection={this.state.selectedFontSize}
            onChange={(option) => this.setState({ selectedFontSize: option })}
          />
          <CodingComponentDropdown
            options={this.state.supportedLanguages}
            selection={this.state.selectedLanguage}
            onChange={(option) => this.setState({ selectedLanguage: option })}
          />
          <CodingComponentDropdown
            options={this.state.supportedThemes}
            selection={this.state.selectedTheme}
            onChange={(option) => this.setState({ selectedTheme: option })}
          />
        </Row>
        <Container
          className={`py-3 ${this.props.className}`}
          style={{
            height: MainPanelContainerHeight,
            overflow: "scroll",
            backgroundColor: colorConfigs.darkGrey,
          }}>
          <AceEditor
            ref={this.codeEditor}
            placeholder="//Write from here"
            mode={this.state.selectedLanguage.value}
            theme={this.state.selectedTheme.value}
            style={{ width: "100%", height: "100%", fontFamily: "operator-mono" }}
            name="collab-code-editor"
            onChange={(value) => {
              setTimeout(() => this.codeSyncAndCursorPositionUpdater(value), 0);
            }}
            fontSize={this.state.selectedFontSize}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CodingComponent);
