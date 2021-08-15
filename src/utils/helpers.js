import { socketEvents } from "../config/configs";
import PeerToPeerConnection from "../utils/peerJsHelpers";

class CollabSetupInitiator {
  constructor(socketDomain, profileName, profilePicURL, location, email) {
    this.id = null;
    this.clientName = profileName;
    this.email = email;
    this.profilePicURL = profilePicURL;
    this.clientLocation = location;
    this.socketAddress = socketDomain;
    this.socketPointer = null;
    this.participants = new Map();
  }

  connectSocket = (
    participantsCb,
    participantAddCb,
    participantDisconnectCb,
    onChatMessageRecieved,
    onOtherParticipantJoinedCb
  ) => {
    /**
     * Step1. Connect to my socket server
     * Step2. Connect to peer server
     * Step3. Check the mappings of clients and call them using peerjs
     */

    this.socketPointer = new WebSocket(`ws://${this.socketAddress}`);

    this.socketPointer.onopen = () => {
      console.log("Connected to CollabSocket-Server");
    };

    this.socketPointer.onclose = () => {
      console.log("Disconnected from CollabSocket-Server");
    };

    this.socketPointer.onmessage = (socketDataPacket) => {
      let data = socketDataPacket.data;
      console.log("Socket Server Data: ", data);
      try {
        // if the data is parseable JSON data
        data = JSON.parse(data);
        switch (data.responseEvent) {
          // When socket connection is successful then do all those;
          case socketEvents.openEvent: {
            /**
             * When socket connection is successfull first socket server will send an id and clients already connected
             * This is not the final id, after client_info is acknowledged final client_id is assigned to clioent.
             * In response to this client needs to send their info to the socket server
             * Socket server then broadcast this event as CLIENT_CONNECTED event to all the participants in room
             * When the client gets disconnected then again socket server issues CLIENT_DISCONNECTED event and broadcasts this
             */

            this.id = data.metadataData.id;

            /**
             * Getting the peers connected in the room and adding them to the map
             * Note: Map used for faster retrieval than array for serious situations
             */

            data.metadataData.connectedClients.forEach((client) => {
              this.participants.set(client.clientId, {
                name: client.name,
                profilePic: client.profilePic,
                location: client.location,
                email: client.email,
              });
            });
            participantsCb(this.participants);

            /**
             * After getting information about all the clients connected to this room
             * Just tell the server about yourself also so that it can broadcast that to all
             * clients connected to this room
             */

            this.socketPointer.send(
              JSON.stringify({
                responseEvent: socketEvents.clientInfoEvent,
                clientName: this.clientName,
                clientID: this.id,
                profilePic: this.profilePicURL,
                clientEmail: this.email,
                location: this.clientLocation,
              })
            );

            console.log("Socket Server Ack: ", data.metadataData);
            break;
          }

          // When new client joins the server;
          case socketEvents.peerConnectionEvent: {
            let clientID = data.data.clientID;
            this.participants.set(clientID, {
              name: data.data.clientName,
              profilePic: data.data.profilePic,
              location: data.data.location,
              email: data.data.email,
            });
            participantAddCb(clientID, {
              name: data.data.clientName,
              profilePic: data.data.profilePic,
              location: data.data.location,
              email: data.data.email,
            });
            if (this.id !== clientID) {
              //&& this.onOtherParticipantJoined
              console.log("Tried to call man: ", clientID);
              onOtherParticipantJoinedCb(clientID);
            }
            break;
          }

          // When the socket server send the client info acknowledgement
          case socketEvents.clientInfoAcknowledgement: {
            console.log("Server acknowledgement for client_info event: ", data);
            this.id = data.data.id;
            global.me = new PeerToPeerConnection(this.id);
            break;
          }

          // When client disconnects from our socket server
          case socketEvents.peerDisconnectEvent: {
            let clientID = data.data.clientID;
            this.participants.delete(clientID);
            participantDisconnectCb(clientID);
            break;
          }

          // When we recieve any chat message from a client
          case socketEvents.chatEvent: {
            let chatData = {
              clientID: data.clientID,
              data: data.data,
            };
            onChatMessageRecieved(chatData);
          }

          /**
           * Socket event switcher ends here
           */
        }
      } catch (err) {
        console.log(
          "Data non parseable as JSON... falling back it as a string message",
          err.stack
        );
        console.log(data);
      }

      /**
       * Message event ends here
       */
    };
  };

  sendChat = (chatMessage) => {
    this.socketPointer.send(
      JSON.stringify({
        responseEvent: socketEvents.chatEvent,
        clientID: this.id,
        data: chatMessage,
      })
    );
  };

  registerSocketCallbacks = (
    participantsCb,
    participantAddCb,
    participantDisconnectCb,
    onChatMessageRecieved,
    onOtherParticipantJoinedCb
  ) => {
    this.connectSocket(
      participantsCb,
      participantAddCb,
      participantDisconnectCb,
      onChatMessageRecieved,
      onOtherParticipantJoinedCb
    );
  };
}

export default CollabSetupInitiator;
