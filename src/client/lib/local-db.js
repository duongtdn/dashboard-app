"use strict"

import { openDB } from 'idb'

class Store {
  constructor(name, db, remote) {
    this.name = name;
    this.db = db;
    this.remote = remote;
  }
  // local indexes db interfaces
  async get(key) {
    return (await this.db).get(this.name, key);
  }
  async all(query) {
    return (await this.db).getAll(this.name, query);
  }
  async put(data) {
    return (await this.db).put(this.name, data);
  }
  // external (remote)  interfaces
  async fetch() {

  }
  async push() {

  }
}

export default class LocalDB {
  constructor({name, stores}) {
    // validate parameters
    if (Object.keys(stores).indexOf('db') !== -1 || Object.keys(stores).indexOf('stores') !== -1) {
      throw new Error('Store name is reserved!');
    }
    // open localdb
    this.db = openDB(name || 'LocalDB', 1, {
      upgrade: (db, oldVersion, newVersion, transaction) => {
        console.log(`Upgrade local DB from version ${oldVersion} to ${newVersion}`);
        stores && Object.keys(stores).forEach( store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: stores[store] });
          }
        });
      }
    });
    // init store handles
    this.stores = {};
    stores && Object.keys(stores).forEach( store => {
      this.stores[store] = new Store(store, this.db);
      this[store] = this.stores[store];
    });
  }
}