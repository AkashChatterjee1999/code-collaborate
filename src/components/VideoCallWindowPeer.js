import React from "react";

class VideoCallWindowPeer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ref: React.createRef(),
      srcObject: null,
      toShow: true,
      muted: false,
    }
  }

  componentDidMount() {
    this.setState({ srcObject: this.props.srcObject, toShow: this.props.toShow, muted: this.props.muted },() => {
      this.state.ref?.current?.srcObject = this.state.srcObject;
      this.state.ref?.current?.addEventListener("loadedmetadata" ,() => {
        this.state.ref.current.play();
      })
    })
  }

  componentDidUpdate(prevProps) {
    if(prevProps !== this.props) {
      this.setState({ srcObject: this.props.srcObject, toShow: this.props.toShow, muted: this.props.muted },() => {
        this.state.ref?.current?.srcObject = this.state.srcObject;
        this.state.ref?.current?.addEventListener("loadedmetadata" ,() => {
          this.state.ref.current.play();
        })
      })
    }
  }


  render() {
    return (
      <video
        ref={this.state.ref}
        className="w-100 h-100"
        style={{
          borderRadius: "20px",
          opacity: this.state.toShow ? 1 : 0,
        }}
        muted={this.state.muted}
      />
    );
  }
}

export default VideoCallWindowPeer;
