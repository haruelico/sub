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

import './index.css';
import IWindow from './types/webkitSpeechRecognition'
declare const window: IWindow;

console.log('👋 This message is being logged by "renderer.js", included via webpack');

const recognition =  new window.webkitSpeechRecognition();
console.log(recognition)
// recognition.start()
recognition.continuous = true
recognition.lang = 'ja-JP'
recognition.interimResults = true
console.log(recognition)

document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a color command.');
}

recognition.onresult = function (event){
  console.log(event)
}

recognition.onstart = function () {
  console.warn("recognition started")
}
  
recognition.onerror = function(event){
  console.log(event)
}