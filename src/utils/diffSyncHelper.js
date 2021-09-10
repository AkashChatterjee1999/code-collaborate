import { Client as DiffSyncClient } from "diffsync";
import { collabSocketConnectorPromise } from "./socketConnectors";
import socket from "socket.io-client";

class DiffSyncHelper {
  constructor() {
    this.id = null;
    this.client = null;
    this.dataReference = null;
    this.diffsyncHost = "localhost";
    this.diffsyncPort = "5051";
  }

  provideDiffSync() {
    return new Promise(async (resolve, reject) => {
      if (this.client !== null) resolve(this.client);
      else {
        try {
          let { roomID } = await collabSocketConnectorPromise;
          this.id = roomID;
          this.client = new DiffSyncClient(socket(`http://${this.diffsyncHost}:${this.diffsyncPort}`), this.id);
          resolve(this);
        } catch (err) {
          reject(err);
        }
      }
    });
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
