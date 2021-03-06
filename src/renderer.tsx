/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import React from "react";
import ReactDOM from "react-dom";
import './index.css';
import { App } from "./components/App";
// import { ipcRenderer } from 'electron'
// import ky from 'ky';
console.log('👋 This message is being logged by "renderer.js", included via webpack');

interface IElectronAPI {
  speechToText: (arg: Function) => Promise<void>
  getDeeplApiKey: () => Promise<string>
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}


window.electron.speechToText((arg: any) => {
  // console.log(arg)
  // document.getElementById("text").textContent = `${arg.translations[0].text} ${arg.original}`
})

ReactDOM.render(
  <App />,
  document.getElementById("app")
)
