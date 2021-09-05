import CollabSetupInitiator from "../utils/helpers";
import PeerToPeerConnection from "./peerJsHelpers";

export const meObj = {
  name: prompt("Your Name"),
  location: prompt("Your location"),
  email: prompt("Your Email"),
  profilePicURL: prompt("profilePicURL"),
  roomID: prompt("roomID"),
};

export const collabSocket = new CollabSetupInitiator("localhost:5050", meObj.name, meObj.profilePicURL, meObj.location, meObj.email, meObj.roomID);

let peerConnector = null,
  diffSyncConnector = null;

export const registerCollabSocketCallbacks = (
  getParticipantsCb,
  addParticipantCb,
  deleteParticipantCb,
  addChatCb,
  onParticipantStreamConstraintChangeCb,
  cursorManipulatorCb
) => {
  collabSocket.registerSocketCallbacks(
    getParticipantsCb,
    addParticipantCb,
    deleteParticipantCb,
    addChatCb,
    onParticipantStreamConstraintChangeCb,
    cursorManipulatorCb
  );
};
