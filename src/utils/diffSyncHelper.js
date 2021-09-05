const DiffSyncClient = require("diffsync").Client;
const socket = require("socket.io-client");

class DiffSyncHelper {
  constructor(id) {
    this.id = id;
    this.client = new DiffSyncClient(socket("http://localhost:5051"), id);
    this.dataReference = null;
  }

  registerDiffSyncEvents(intialDataCb, onSyncedDataCb) {
    this.client.on("connected", () => {
      this.dataReference = this.client.getData();
      intialDataCb(this.dataReference.updatedCode);
    });

    this.client.on("synced", () => {
      onSyncedDataCb(this.dataReference.updatedCode);
    });

    this.client.initialize();
  }

  synchroizeDifferences = (updatedCode, callback) => {
    this.dataReference.updatedCode = updatedCode;
    this.client.sync();
    callback();
  };
}

export default DiffSyncHelper;
