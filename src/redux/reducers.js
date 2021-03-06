import { combineReducers } from "redux";

const participantReducers = (state = new Map(), action) => {
  switch (action.type) {
    /**
     * Assuming the participantData is supplied with the isOnline data that is true
     * Hence i am not explicitly setting it to true in here.
     */
    case "ADD_PARTICIPANT": {
      let intermediateState = new Map(state);
      intermediateState.set(action.participantId, action.participantData);
      return intermediateState;
    }

    case "UPDATE_OLD_PARTICIPANTS": {
      return action.participants;
    }

    case "UPDATE_PEER_STREAM_CONSTRAINT_CHANGE": {
      let intermediateState = new Map(state);
      let pData = intermediateState.get(action.participantId);
      pData.streamConstraints = {
        video: action.peerStreamConstraintData.video,
        audio: action.peerStreamConstraintData.audio,
      };
      intermediateState.set(action.participantId, pData);
      return intermediateState;
    }

    case "REMOVE_PARTICIPANT": {
      let intermediateState = new Map(state);
      let pData = intermediateState.get(action.participantId);
      pData.isOnline = false;
      intermediateState.set(action.participantId, pData);
      return intermediateState;
    }

    default:
      return state;
  }
};

const toCallParticipants = (state = [], action) => {
  switch (action.type) {
    // Hence i want to change the to call participants to only those who are predecessor to this participant
    case "UPDATE_TO_CALL_PARTICIPANTS": {
      if (state.length === 0) return action.toCallParticipants;
      else return state;
    }

    default:
      return state;
  }
};

const changeVideoStreamConstraints = (state = { video: true, audio: true }, action) => {
  switch (action.type) {
    case "UPDATE_STREAM_CONSTRAINTS": {
      return {
        video: action.streamConstraints.video,
        audio: action.streamConstraints.audio,
      };
    }

    default:
      return state;
  }
};

const cursorManagerReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_CURSOR_MANAGER_REFERENCE": {
      return action.cursorManagerReference;
    }

    default:
      return state;
  }
};

const updateCodeReducer = (state = { code: "", codeLanguage: "js" }, action) => {
  switch (action.type) {
    case "UPDATE_CODE": {
      state.code = action.code;
      return state;
    }

    case "UPDATE_CODE_LANGUAGE": {
      state.codeLanguage = action.codeLanguage;
      return state;
    }

    default:
      return state;
  }
};

export default combineReducers({
  participantReducers,
  toCallParticipants,
  changeVideoStreamConstraints,
  cursorManagerReducer,
  updateCodeReducer,
});
