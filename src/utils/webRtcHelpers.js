const servers = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
  iceCandidatesPoolSize: 10,
};

class WebRTCHelper {
  constructor() {
    this.peerConnection = new RTCPeerConnection(servers);
  }

  onPeerAddition = (peerStreamCB) => {
    this.peerConnection.ontrack = (e) => {
      e.streams[0].getTracks().forEach((track) => {
        peerStreamCB(track);
      });
    };
  };

  createRTCOffer = async () => {
    this.peerConnection.onicecandidate((event) => {
      console.log(event); // add the event.candidate.toJSON() to the server;
    });
    let myOfferDesc = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(myOfferDesc); //automatically calls ICS candidates

    const myOffer = {
      sdp: myOfferDesc.sdp, //session description protocol
      type: myOfferDesc.type,
    };

    //send this offer to signalling server.
  };
}

export default WebRTCHelper;
