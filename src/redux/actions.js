export const addParticipant = (participantId, participantData) => {
  return {
    type: "ADD_PARTICIPANT",
    participantId,
    participantData,
  };
};

export const updatePrevParticipants = (participants) => {
  return {
    type: "UPDATE_OLD_PARTICIPANTS",
    participants,
  };
};

export const removeParticipant = (participantId) => {
  return {
    type: "REMOVE_PARTICIPANT",
    participantId,
  };
};

export const updateToCallParticipants = (toCallParticipants) => {
  return {
    type: "UPDATE_TO_CALL_PARTICIPANTS",
    toCallParticipants,
  };
};

export const updatePeerStreamConstraints = (participantId, peerStreamConstraintData) => {
  return {
    type: "UPDATE_PEER_STREAM_CONSTRAINT_CHANGE",
    participantId,
    peerStreamConstraintData,
  };
};

export const updateStreamConstraints = (streamConstraints) => {
  return {
    type: "UPDATE_STREAM_CONSTRAINTS",
    streamConstraints,
  };
};

export const updateEditorCursorManager = (cursorManagerReference) => {
  return {
    type: "UPDATE_CURSOR_MANAGER_REFERENCE",
    cursorManagerReference,
  };
};

export const updateCode = (updatedCode) => {
  return {
    type: "UPDATE_CODE",
    updatedCode,
  };
};
