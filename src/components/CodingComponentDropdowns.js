import React from "react";
import { ChevronDown } from "react-feather";
import { colorConfigs } from "../config/configs";
const MainSubPanelIconSize = "12px";

class CodingComponentDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      displayDropDown: false,
      langDropdownX: "",
      dropDownMenuWidth: "0px",
      langDropdownY: "",
    };
  }
  componentDidMount() {
    window.onclick = (e) => {
      this.setState({ displayDropDown: false });
    };
  }
  render() {
    return (
      <div
        className="d-flex m-auto"
        style={{ width: "max-content", minWidth: "100px" }}
        ref={this.ref}
        onClick={(e) => {
          e.stopPropagation();
          let { top, height, width, left } = this.ref.current.getBoundingClientRect();
          let langDropdownY = top + height;
          this.setState({
            displayDropDown: !this.state.displayDropDown,
            dropDownMenuWidth: width,
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
          {this.props.selection.label ? this.props.selection.label : this.props.selection}
        </p>
        <div className="p-0 mt-n2" style={{ width: "max-content" }}>
          <ChevronDown color="white" size={MainSubPanelIconSize} />
        </div>
        <div
          className={`${this.state.displayDropDown ? "d-flex" : "d-none"} flex-column py-2`}
          style={{
            backgroundColor: colorConfigs.tabSubHeaders,
            color: "white",
            height: "max-content",
            width: this.state.DropDownMenuWidth,
            position: "absolute",
            fontSize: "10.5px",
            borderRadius: "5px",
            top: this.state.langDropdownY,
            zIndex: 2,
          }}>
          <ul className="m-0 p-0" style={{ listStyleType: "none" }}>
            {this.props.options.map((option) => {
              return (
                <li className="mx-2 px-2 py-1 text-center lang-options" onClick={(e) => this.props.onChange(option)}>
                  {option.label ? option.label : option}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default CodingComponentDropdown;
