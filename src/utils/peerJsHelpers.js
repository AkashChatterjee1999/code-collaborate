import Peer from "peerjs";

export default class PeerToPeerConnection {
  constructor() {
    this.peer = new Peer(undefined, {
      host: "/",
      port: "3002",
    });
  }

  callOthers(peerID, constraints, mediaStreamCb) {
    let getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
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
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
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
