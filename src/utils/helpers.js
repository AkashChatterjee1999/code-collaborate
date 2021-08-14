import WebSockets from "ws";
import { socketEvents } from "../config/configs";
import PeerToPeerConnection from "../utils/peerJsHelpers";

class CollabSetupInitiator {
  constructor(socketDomain, profileName, profilePicURL, location) {
    this.id = null;
    this.clientName = profileName;
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
    onChatMessageRecieved
  ) => {
    /**
     * Step1. Connect to my socket server
     * Step2. Connect to peer server
     * Step3. Check the mappings of clients and call them using peerjs
     */

    this.socketPointer = new WebSockets(`ws://${this.socketAddress}`);

    this.socketPointer.on("open", () => {
      console.log("Connected to CollabSocket-Server");
    });

    this.socketPointer.on("close", () => {
      console.log("Disconnected from CollabSocket-Server");
    });

    this.socketPointer.on("message", (data) => {
      try {
        // if the data is parseable JSON data
        data = JSON.parse(data);
        switch (data.responseEvent) {
          // When socket connection is successful then do all those;
          case socketEvents.openEvent: {
            /**
             * When socket connection is successfull first socket server will send an id and clients already connected
             * In response to this client needs to send their info to the socket server
             * Socket server then broadcast this event as CLIENT_CONNECTED event to all the participants in room
             * When the client gets disconnected then again socket server issues CLIENT_DISCONNECTED event and broadcasts this
             */

            this.id = data.metadataData.id;
            global.me = new PeerToPeerConnection(this.id);

            /**
             * Getting the peers connected in the room and adding them to the map
             * Note: Map used for faster retrieval than array for serious situations
             */

            data.metadataData.connectedClients.forEach((client) => {
              this.participants.set(client.clientId, {
                name: client.name,
                profilePic: client.profilePic,
                location: client.location,
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
                location: this.clientLocation,
              })
            );

            console.log("Socket Server Ack: ", data.metadataData);
            break;
          }

          // When new client joins the server;
          case socketEvents.peerConnectionEvent: {
            let clientID = data.data.clientID;
            this.participants.delete(clientID);
            participantDisconnectCb(clientID);
            break;
          }

          // When client disconnects from our socket server
          case socketEvents.peerDisconnectEvent: {
            let clientID = data.data.clientID;
            this.participants.set(clientID, {
              name: data.data.clientName,
              profilePic: data.data.profilePic,
              location: data.data.location,
            });
            participantAddCb(clientID, {
              name: data.data.clientName,
              profilePic: data.data.profilePic,
              location: data.data.location,
            });
            break;
          }

          //When we recieve any chat message from a client
          case socketEvents.chatEvent: {
            let chatData = data.data;
            onChatMessageRecieved(chatData);
          }

          /**
           * Socket event switcher ends here
           */
        }
      } catch (err) {
        console.log(
          "Data non parseable as JSON... falling back it as a string message"
        );
        console.log(data);
      }

      /**
       * Message event ends here
       */
    });
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
    onChatMessageRecieved
  ) => {
    this.connectSocket(
      participantsCb,
      participantAddCb,
      participantDisconnectCb,
      onChatMessageRecieved
    );
  };
}

export default CollabSetupInitiator;
