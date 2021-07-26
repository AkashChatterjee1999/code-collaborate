import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Container,
  Row,
  Col,
} from 'reactstrap';
import Prism from "prismjs";
import { Terminal } from 'react-feather';
import syntaxHighlighter from "../utils/syntaxHighlighter";
import parse from 'html-react-parser';

class Editor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            ref: React.createRef(),
            code: "",
            formattedCode: "",
            lineNo: 0,
            supportedLanguages: ['html', 'javascript']
        }
    }

    componentDidMount() {
        if (this.ref && this.ref.current) {
            Prism.highlightElement(this.ref.current)
        }
    }

    componentDidUpdate() {
        if (this.ref && this.ref.current) {
            console.log("Gelo");
            Prism.highlightElement(this.ref.current)
        }
    }
      
       getCaretPosition = () => {
        if (window.getSelection && window.getSelection().getRangeAt) {
          var range = window.getSelection().getRangeAt(0);
          var selectedObj = window.getSelection();
          var rangeCount = 0;
          var childNodes = selectedObj.anchorNode.parentNode.childNodes;
          for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i] == selectedObj.anchorNode) {
              break;
            }
            if (childNodes[i].outerHTML)
              rangeCount += childNodes[i].outerHTML.length;
            else if (childNodes[i].nodeType == 3) {
              rangeCount += childNodes[i].textContent.length;
            }
          }
          return range.startOffset + rangeCount;
        }
        return -1;
      }
    
    appendCode = (char) => {
      let lNo = this.state.lineNo;
      console.log(this.state.cursorPos, this.state.lineNo)
      for(let i=0; i<this.state.code.length; i++) {
        if(lNo === 0) return this.state.code.substr(0, i + this.getCaretPosition()) + char + this.state.code.substr(i + this.getCaretPosition());
        if(this.state.code[i] === '\n') lNo --;
      }
      return this.state.code + char
    }

    deleteCode = isBackspace => {
      let lNo = this.state.lineNo;
      console.log(this.getCaretPosition(), this.state.lineNo, "delete")
      for(let i=0; i<this.state.code.length; i++) {
        if(lNo === 0) {
          console.log("deletepoefbj", isBackspace, this.state.code[i + this.getCaretPosition() - 1] === "\n")
          if(isBackspace && this.getCaretPosition() === 1) {
            console.log("Hello");
            this.setState({ lineNo: this.state.lineNo - 1 },() => {
              return isBackspace? 
                this.state.code.substr(0, i + this.getCaretPosition() - 1) + this.state.code.substr(i + this.getCaretPosition())
                : this.state.code.substr(0, i + this.getCaretPosition()) + this.state.code.substr(i + this.getCaretPosition() + 1);
              })
          } else {
            return isBackspace? 
                this.state.code.substr(0, i + this.getCaretPosition() - 1) + this.state.code.substr(i + this.getCaretPosition())
                : this.state.code.substr(0, i + this.getCaretPosition()) + this.state.code.substr(i + this.getCaretPosition() + 1);
          }
        }
        if(this.state.code[i] === '\n') lNo --;
      }
      console.log("lola", lNo, this.state.lineNo);
      return ""
    }

    codeChangeHandler = e => { 
        console.log("codechangeHandler", this.getCaretPosition(), this.state.lineNo);
        if(e.key === "Enter") {
            this.setState({ code: this.state.code + '\n', lineNo: this.state.lineNo + 1 }, () => {
                this.setState({ formattedCode: syntaxHighlighter(this.state.code) })
            })
        } else if(e.key === "Backspace") {
          console.log(this.deleteCode(true))
          this.setState({ code: this.deleteCode(true) }, () => {
            this.setState({ formattedCode: syntaxHighlighter(this.state.code) })
          })
        } else if(e.key === "Delete") {
          console.log(this.deleteCode(false))
          this.setState({ code: this.deleteCode(false) }, () => {
            this.setState({ formattedCode: syntaxHighlighter(this.state.code) })
          })
        } else if(e.key === "ArrowUp") {
            this.setState({ lineNo: this.state.lineNo - 1 });
        } else if(e.key === "ArrowDown") {
            this.setState({ lineNo: this.state.lineNo + 1 });
        } else if(e.key.length === 1) {
            this.setState({ code: this.appendCode(e.key) }, () => {
                this.setState({ formattedCode: syntaxHighlighter(this.state.code) })
            })
        } 
    }

    toggle = () => this.setState({ isOpen: !this.state.isOpen});
    render() {
        return (
            <Container fluid style= {{ backgroundColor: "#353f57", height: "100vh", overflow: "hidden" }}>
              <Navbar dark expand="md">
                <NavbarBrand href="/">
                    <Terminal size="40px" strokeWidth="4px" color="#f5791b"/>
                </NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                  <Nav navbar style={{ marginLeft: "auto"}}>
                  </Nav>
                </Collapse>
              </Navbar>
              <Container fluid className="m-0" style={{ "height": "100%"}}>
                <Row style={{ "height": "100%"}}>
                    <Col className="m-0 py-2" md={9} style={{height: "100%", maxHeight: "100%", overflow: "hidden", flexFlow: "column"}}>
                        <Container className="px-0 py-2" style={{ height: "90%" }}>
                            <div style={{ 
                                height: "100%", 
                                width: "100%", 
                                maxHeight: "100%", 
                                maxWidth: "100%",  
                                overflow: "scroll",
                                boxSizing: "border-box", 
                                outline: "none", 
                                border: "none", 
                                color: "#9efeff",
                                backgroundColor: "#1e1e3f" 
                            }}>
                            <div contentEditable onKeyDown={this.codeChangeHandler} onClick={(e) => { console.log(this.getCaretPosition()) }}></div>
                            <pre>
                                {parse(this.state.formattedCode)}
                            </pre>
                            </div>       
                        </Container>
                    </Col>
                    <Col className="m-0" md={3} style={{height: "100%", overflow: "hidden", flexFlow: "column"}}>
                    </Col>
              </Row>
              </Container>
            </Container>
        );
    }
}
export default Editor