import CollabSetupInitiator from "../utils/helpers";
import PeerToPeerConnection from "./peerJsHelpers";
import DiffSyncHelper from "../utils/diffSyncHelper";
import url from "url";

export const meObj = {
  name: localStorage.getItem("clientName"),
  location: localStorage.getItem("location"),
  email: localStorage.getItem("clientEmail"),
  profilePicURL: localStorage.getItem("profilePicURL"),
  roomID: localStorage.getItem("roomID"),
};

export const peerConnector = new PeerToPeerConnection();
export const diffSyncConnector = new DiffSyncHelper();

const collabSocket = new CollabSetupInitiator(
  "code-collaborate-backend.herokuapp.com:443",
  meObj.name,
  meObj.profilePicURL,
  meObj.location,
  meObj.email,
  meObj.roomID
);

const collabSocketConnectorPromise = new Promise((resolve, reject) => {
  try {
    collabSocket.initializeSocketConnection((clientAndRoomID) => {
      resolve(clientAndRoomID);
    });
  } catch (err) {
    reject(err);
  }
});

export const registerCollabSocketCallbacks = (
  getParticipantsCb,
  addParticipantCb,
  deleteParticipantCb,
  addChatCb,
  onParticipantStreamConstraintChangeCb,
  cursorManipulatorCb,
  codeOutputGeneratedCb
) => {
  collabSocket.registerSocketCallbacks(
    getParticipantsCb,
    addParticipantCb,
    deleteParticipantCb,
    addChatCb,
    onParticipantStreamConstraintChangeCb,
    cursorManipulatorCb,
    codeOutputGeneratedCb
  );
};

export { collabSocket, collabSocketConnectorPromise };
