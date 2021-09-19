import React from "react";
import { Container } from "reactstrap";
import axios from "axios";
import { colorConfigs } from "../config/configs";
import { Terminal } from "react-feather";
import "./styles/collabEditorParamChecker.scss";
const CollabEditor = React.lazy(() => import("./CollabEditor"));

const LoaderScreen = (props) => {
  return (
    <Container fluid className={`collabEditorParamChecker ${props.addClassName}`} style={{ background: colorConfigs.extreme }}>
      <p className="m-auto d-flex" style={{ fontSize: "25px" }}>
        Starting{" "}
        <span className="d-flex mx-3">
          <Terminal className="m-auto" size="35px" strokeWidth="4px" color="#f5791b" />
          <p className="m-auto" style={{ fontSize: "25px" }}>
            Code-Collaborate
          </p>
        </span>{" "}
        ...
      </p>
    </Container>
  );
};

class CollabEditorParamChecker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addClassName: "",
      openCollabEditor: false,
    };
  }

  componentDidMount() {
    this.setState({ addClassName: "visible" }, () => {
      let redirectedURI = window.location.href,
        profilePicURL,
        clientName,
        clientEmail,
        roomID,
        location;
      let urlSplits = redirectedURI.split("#")[1];
      let components = urlSplits.split("&"),
        obj = {};
      components.forEach((component) => {
        let key = component.split("=")[0],
          value = component.split("=")[1];
        obj[key] = value;
      });

      axios
        .post("https://www.googleapis.com/oauth2/v3/userinfo", null, {
          headers: { Authorization: `Bearer ${obj["access_token"]}` },
        })
        .then((response) => {
          profilePicURL = response.data.picture;
          clientName = response.data.name;
          clientEmail = response.data.email;
          try {
            roomID = JSON.parse(atob(obj["state"])).roomID;
            location = JSON.parse(atob(obj["state"])).location;

            localStorage.setItem("clientName", clientName);
            localStorage.setItem("profilePicURL", profilePicURL);
            localStorage.setItem("clientEmail", clientEmail);
            localStorage.setItem("roomID", roomID);
            localStorage.setItem("location", location);

            setTimeout(() => {
              this.setState({ openCollabEditor: true });
            }, 2000);
          } catch (err) {
            console.log(err);
            window.location.href = `${window.location.origin}`;
          }
        })
        .catch((err) => {
          console.log(err);
          window.location.href = `${window.location.origin}`;
        });
    });
  }

  render() {
    return this.state.openCollabEditor ? (
      <Suspense fallback={<LoaderScreen addClassName={this.state.addClassName} />}>
        <CollabEditor />
      </Suspense>
    ) : (
      <LoaderScreen addClassName={this.state.addClassName} />
    );
  }
}

export default CollabEditorParamChecker;
