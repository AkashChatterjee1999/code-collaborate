export let colorConfigs = {
  extreme: "#131313",
  darkGrey: "#1f1f1f",
  tabHeaders: "#373737",
  tabSubHeaders: "#444648",
};

export let socketEvents = {
  peerConnectionEvent: "CLIENT_CONNECTED",
  peerDisconnectEvent: "CLIENT_DISCONNECTED",
  openEvent: "OPEN",
  chatEvent: "CHAT",
  codeUpdated: "UPDATED_CODE",
  cursorAdded: "ADD_CURSOR",
  heartbeat: "HEARTBEAT",
  acknowledgeHeartbeat: "ACKNOWLEDGE_HEARTBEAT",
  acknowledgeOpenEvent: "ACKNOWLEDGE_OPEN_EVENT",
  cursorPositionUpdated: "CURSOR_POSITION_CHANGED",
  clientInfoAcknowledgement: "ACKNOWLEDGE_CLIENT_INFO",
  clientInfoEvent: "CLIENT_INFO",
  clientStreamStateChange: "STREAM_STATE_CHANGE",
};

export const heartBeatInterval = 10000;
export const assignColorToClientID = () => {
  let colors = ["red", "orange", "pink", "yellow", "blue", "green"];
  let no = Math.floor(Math.random() * 90 + 10);
  console.log("random No.: ", no);
  return colors[no % colors.length];
};
export const defaultTabHeight = "30px";
export const defaultSubTabHeight = "22px";
export const rightSidebarTabHeights = "37vh";
