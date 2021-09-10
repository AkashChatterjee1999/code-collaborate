import CollabSetupInitiator from "../utils/helpers";
import PeerToPeerConnection from "./peerJsHelpers";
import DiffSyncHelper from "../utils/diffSyncHelper";

export const meObj = {
  name: prompt("Your Name"),
  location: prompt("Your location"),
  email: prompt("Your Email"),
  profilePicURL: prompt("profilePicURL"),
  roomID: prompt("roomID"),
};

export const peerConnector = new PeerToPeerConnection();
export const diffSyncConnector = new DiffSyncHelper();

const collabSocket = new CollabSetupInitiator("localhost:5050", meObj.name, meObj.profilePicURL, meObj.location, meObj.email, meObj.roomID);

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

export { collabSocket, collabSocketConnectorPromise };
