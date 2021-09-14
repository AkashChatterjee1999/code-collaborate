import { socketEvents } from "../config/configs";
import { heartBeatInterval } from "../config/configs";

class CollabSetupInitiator {
  constructor(socketDomain, profileName, profilePicURL, location, email, roomID) {
    this.id = null;
    this.roomID = roomID;
    this.clientName = profileName;
    this.email = email;
    this.profilePicURL = profilePicURL;
    this.clientLocation = location;
    this.socketAddress = socketDomain;
    this.socketPointer = null;
    this.socketReady = false;
    this.heartbeatCount = 0;
    this.recentSocketInteractionTimestamp = new Date(Date.now());
    this.participants = new Map();
  }

  initializeSocketConnection = (socketReadyCb) => {
    /**
     * Step1. Connect to my socket server
     * Step2. Get a arbitary id
     * Step3. Send the email id to the server
     * Step4. Server will acknowledge with the existing id if found else with the same id
     */

    this.socketPointer = new WebSocket(`wss://${this.socketAddress}/codeCollab-socket`);

    this.socketPointer.onopen = () => {
      console.log("Connected to CollabSocket-Server");
      setInterval(() => {
        let lastInteractionTimeSeconds = (new Date(Date.now()).getTime() - this.recentSocketInteractionTimestamp?.getTime()) / 1000;
        if (this.heartbeatCount > 30) {
          // TODO: you are inactive
        } else if (lastInteractionTimeSeconds > heartBeatInterval / 1000) {
          this.heartbeatCount += 1;
          this.socketPointer.send(
            JSON.stringify({
              responseEvent: socketEvents.heartbeat,
            })
          );
        } else {
          this.heartbeatCount = 0;
        }
      }, heartBeatInterval);
      console.log("Registered heartbeat checker");
    };

    this.socketPointer.onclose = () => {
      console.log("Disconnected from CollabSocket-Server");
    };

    this.socketPointer.onmessage = (socketDataPacket) => {
      let data = socketDataPacket.data;
      this.recentSocketInteractionTimestamp = new Date(Date.now());
      console.log("Socket Server Data: ", data);
      try {
        // if the data is parseable JSON data
        data = JSON.parse(data);

        /**
         * When socket connection is successfull first socket server will send an id and clients already connected
         * This is not the final id, after client_info is acknowledged final client_id is assigned to clioent.
         * In response to this client needs to send their info to the socket server
         * Socket server then broadcast this event as CLIENT_CONNECTED event to all the participants in room
         * When the client gets disconnected then again socket server issues CLIENT_DISCONNECTED event and broadcasts this
         */

        if (data.responseEvent === socketEvents.openEvent) {
          this.id = data.metadataData.id;

          this.socketPointer.send(
            JSON.stringify({
              responseEvent: socketEvents.acknowledgeOpenEvent,
              roomID: this.roomID,
              clientID: this.id,
              clientEmail: this.email,
            })
          );
        } else {
          /**
           * When the connection is successful then client is asking the server to generate the final client id for
           * other dependent services like peer and diffserntial synchronization to work properly.
           */
          console.log("Server acknowledgement for open_event event: ", data);
          this.id = data.data.id;
          this.roomID = data.data.roomID;
          this.socketReady = true;
          socketReadyCb({ clientID: this.id, roomID: this.roomID });
        }
      } catch (err) {
        console.log("Data non parseable as JSON... falling back it as a string message", err.stack);
        console.log(data);
      }
    };
  };

  connectSocket = (
    participantsCb,
    participantAddCb,
    participantDisconnectCb,
    onChatMessageRecieved,
    onParticipantStreamConstraintChangeCb,
    onCursorsManipulationCb
  ) => {
    if (!this.socketReady || !this.id || !this.socketPointer) {
      console.log("Callbacks cannot be registered before the socket is ready");
      throw new Error("Callbacks cannot be registered before the socket is ready");
    }
    /**
     * After getting basic information about my id,
     * Just tell the server about yourself also so that it can broadcast that to all
     * clients connected to this room and also about the room id,
     * if you don't have server will generate one for you
     */

    this.recentSocketInteractionTimestamp = new Date(Date.now());
    this.socketPointer.send(
      JSON.stringify({
        responseEvent: socketEvents.clientInfoEvent,
        clientName: this.clientName,
        clientID: this.id,
        profilePic: this.profilePicURL,
        clientEmail: this.email,
        roomID: this.roomID,
        location: this.clientLocation,
      })
    );

    this.socketPointer.onmessage = (socketDataPacket) => {
      let data = socketDataPacket.data;
      this.recentSocketInteractionTimestamp = new Date(Date.now());
      console.log("Socket Server Data: ", data);
      try {
        // if the data is parseable JSON data
        data = JSON.parse(data);
        switch (data.responseEvent) {
          // When new client joins the server;
          case socketEvents.peerConnectionEvent: {
            let clientID = data.data.clientID;
            this.participants.set(clientID, {
              name: data.data.clientName,
              profilePic: data.data.profilePic,
              location: data.data.location,
              email: data.data.email,
              streamConstraints: data.data.streamConstraints,
            });
            participantAddCb(clientID, {
              name: data.data.clientName,
              profilePic: data.data.profilePic,
              location: data.data.location,
              email: data.data.email,
              streamConstraints: data.data.streamConstraints,
            });
            if (this.id !== clientID) {
              //&& this.onOtherParticipantJoined
              console.log("Tried to call man: ", clientID);
              // onOtherParticipantJoinedCb(clientID);
            }
            break;
          }

          // When the socket server send the client info acknowledgement
          case socketEvents.clientInfoAcknowledgement: {
            console.log("Server acknowledgement for client_info event: ", data);
            this.id = data.data.id;
            this.roomID = data.data.roomID;

            /**
             * Getting the peers connected in the room and adding them to the map
             * Note: Map used for faster retrieval than array for serious situations
             */

            data.data.connectedClients.forEach((client) => {
              let participantObj = {
                name: client.name,
                profilePic: client.profilePic,
                location: client.location,
                email: client.email,
                streamConstraints: client.streamConstraints,
                isHost: client.isHost,
              };
              if (client.cursorPosition) {
                participantObj.cursorPosition = client.cursorPosition;
                onCursorsManipulationCb("ADD", client.clientId, client.cursorPosition, client.name);
              }
              this.participants.set(client.clientId, participantObj);
            });
            participantsCb(this.participants);
            break;
          }

          // When client disconnects from our socket server
          case socketEvents.peerDisconnectEvent: {
            let clientID = data.data.clientID;
            this.participants.delete(clientID);
            onCursorsManipulationCb("REMOVE", data.data.clientID);
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
            break;
          }

          case socketEvents.clientStreamStateChange: {
            let clientData = this.participants.get(data.clientID);
            clientData.streamConstraints = data.constraints;
            this.participants.set(data.clientID, clientData);
            let streamStateChangeData = {
              clientID: data.clientID,
              video: data.constraints.video,
              audio: data.constraints.audio,
            };
            onParticipantStreamConstraintChangeCb(streamStateChangeData);
            break;
          }

          case socketEvents.acknowledgeHeartbeat: {
            console.log("Service is online, heartbeat check success");
            break;
          }

          case socketEvents.cursorAdded: {
            let clientData = this.participants.get(data.data.clientID);
            clientData.cursorPosition = data.data.cursorPosition;
            this.participants.set(data.data.clientID, clientData);
            onCursorsManipulationCb("ADD", data.data.clientID, data.data.cursorPosition, clientData.name);
            break;
          }

          case socketEvents.cursorPositionUpdated: {
            let clientData = this.participants.get(data.data.clientID);
            clientData.cursorPosition = data.data.cursorPosition;
            this.participants.set(data.data.clientID, clientData);
            onCursorsManipulationCb("UPDATE", data.data.clientID, data.data.cursorPosition);
            break;
          }

          /**
           * Socket event switcher ends here
           */
        }
      } catch (err) {
        console.log("Data non parseable as JSON... falling back it as a string message", err.stack);
        console.log(data);
      }

      /**
       * Message event ends here
       */
    };
  };

  sendChat = (chatMessage) => {
    this.recentSocketInteractionTimestamp = new Date(Date.now());
    this.socketPointer.send(
      JSON.stringify({
        responseEvent: socketEvents.chatEvent,
        clientID: this.id,
        roomID: this.roomID,
        data: chatMessage,
      })
    );
  };

  changeStreamState = (video, audio) => {
    this.recentSocketInteractionTimestamp = new Date(Date.now());
    this.socketPointer.send(
      JSON.stringify({
        responseEvent: socketEvents.clientStreamStateChange,
        clientID: this.id,
        roomID: this.roomID,
        constraints: {
          video,
          audio,
        },
      })
    );
  };

  addCursorPosition = (cursorPosition) => {
    this.recentSocketInteractionTimestamp = new Date(Date.now());
    this.socketPointer.send(
      JSON.stringify({
        responseEvent: socketEvents.cursorAdded,
        data: {
          clientID: this.id,
          roomID: this.roomID,
          cursorPosition,
        },
      })
    );
  };

  updateCursorPosition = (cursorPosition) => {
    this.recentSocketInteractionTimestamp = new Date(Date.now());
    this.socketPointer.send(
      JSON.stringify({
        responseEvent: socketEvents.cursorPositionUpdated,
        data: {
          clientID: this.id,
          roomID: this.roomID,
          cursorPosition,
        },
      })
    );
  };

  registerSocketCallbacks = (
    participantsCb,
    participantAddCb,
    participantDisconnectCb,
    onChatMessageRecieved,
    onParticipantStreamConstraintChangeCb,
    onCursorsManipulationCb
  ) => {
    this.connectSocket(
      participantsCb,
      participantAddCb,
      participantDisconnectCb,
      onChatMessageRecieved,
      onParticipantStreamConstraintChangeCb,
      onCursorsManipulationCb
    );
  };
}

export default CollabSetupInitiator;
