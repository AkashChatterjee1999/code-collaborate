import Peer from "peerjs";
import { collabSocketConnectorPromise } from "./socketConnectors";

export default class PeerToPeerConnection {
  constructor() {
    this.peerID = null;
    this.peer = null;
    this.peerHost = "code-collaborate-peer-server.herokuapp.com";
    this.peerPort = "5002";
  }

  providePeer() {
    console.log("hello");
    return new Promise(async (resolve, reject) => {
      if (this.peer !== null) resolve(this.peer);
      else {
        try {
          let { clientID } = await collabSocketConnectorPromise;
          this.peerID = clientID;
          this.peer = new Peer(clientID, {
            host: this.peerHost,
            port: "443",
            secure: true,
          });
          resolve(this.peer);
        } catch (err) {
          reject(err);
        }
      }
    });
  }

  callOthers(peerID, constraints, mediaStreamCb) {
    let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    getUserMedia(
      constraints,
      (stream) => {
        let call = this.peer.call(peerID, stream);
        call.on("stream", (remoteStream) => mediaStreamCb(remoteStream));
      },
      (err) => {
        console.log("Failed to get local stream", err);
      }
    );
  }

  gettingCalled(constraints, mediaStreamCb) {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    this.peer.on("call", (call) => {
      getUserMedia(
        constraints,
        function (stream) {
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            mediaStreamCb(remoteStream);
          });
        },
        (err) => {
          console.log("Failed to get local stream", err);
        }
      );
    });
  }
}
