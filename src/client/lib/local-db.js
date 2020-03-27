"use strict"

import { openDB } from 'idb'
import xhttp from '@realmjs/xhttp-request'

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
    const tx = (await this.db).transaction(this.name, 'readwrite');
    if (Array.isArray(data)) {
      data.forEach(item => {
        tx.store.put(item);
      });
    } else {
      tx.store.put(data);
    }
    return tx.done;
  }
  async delete(keys) {
    const tx = (await this.db).transaction(this.name, 'readwrite');
    if (Array.isArray(keys)) {
      keys.forEach(key => {
        tx.store.delete(key);
      });
    } else {
      tx.store.delete(keys);
    }
    return tx.done;
  }
  // external (remote)  interfaces
  async fetch(query) {
    return new Promise((resolve, reject) => {
      xhttp.get(`${this.remote.fetch}?${query}`)
      .then( async ({status, responseText}) => {
        if (status === 200) {
          const data = JSON.parse(responseText);
          await this.put(data);
          resolve(data);
        } else {
          reject(status);
        }
      })
      .catch( err => {
        reject(err);
      });
    });
  }
  async push(data) {
    return new Promise((resolve, reject) => {
      xhttp.put(`${this.remote.push}`, data)
      .then( async ({status, responseText}) => {
        if (status === 200) {
          resolve();
        } else {
          reject(status);
        }
      })
      .catch( err => {
        reject(err);
      });
    });
  }
}

export default class LocalDB {
  constructor({name, stores, remote}) {
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
      this.stores[store] = new Store(store, this.db, remote);
      this[store] = this.stores[store];
    });
  }
}
