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
