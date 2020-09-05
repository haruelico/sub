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

const { ipcRenderer } = require('electron')

console.log(ipcRenderer)
console.log('👋 This message is being logged by "renderer.js", included via webpack');

const AudioContext = window.AudioContext;
const audioContext = new AudioContext();
console.log("Initialize audiocontext");

const audioButton = document.getElementById("enableAudio");
const audioDisableButton = document.getElementById("disableAudio");

// audioButton.addEventListener('click', async () => {
//   const stream = await navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
//     const input = audioContext.createMediaStreamSource(stream)
//     let processor = audioContext.createScriptProcessor(1024,1,1);
//     // const analyzer = audioContext.createAnalyser();
//     input.connect(processor);
//     processor.connect(audioContext.destination);
//     processor.onaudioprocess = function (e){
//       console.log(e);
//     }
//     console.log("connected!");
//   }).catch(err => {
//     console.error(err);
//   })
// });

audioDisableButton.addEventListener('click', () => {
  audioContext.close()
})

let handleSuccess = stream => { // const audioContext = new AudioContext():
  const input = audioContext.createMediaStreamSource(stream);
  let processor = audioContext.createScriptProcessor(1024, 1,1);
  input.connect(processor);
  processor.connect(audioContext.destination);
  processor.onaudioprocess = function (e) {
    let inputLs = e.inputBuffer.getChannelData(0);
    // console.log(inputLs[0])
    // ipcRenderer.sendSync('sync-message', inputLs)
  }
}

audioButton.addEventListener('click', async () => {
  navigator.mediaDevices.getUserMedia({audio: true}).then(handleSuccess)
})

// const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
// console.log(SpeechRecognition)
// let recognition = new SpeechRecognition();
// recognition.lang = 'ja-JP';
// recognition.interimResults = true;
// recognition.continuous = true;
//
// const recognitionResultElem = document.getElementById('speechToText');
//
// recognition.onresult = event =>{
//   console.log(event.results)
//   recognitionResultElem.innerText = event.results[0][0].transcript
// }
//
// recognition.onerror = event => {
//   console.error(event)
// }
//
// document.getElementById('startSpeechToText').addEventListener('click', () => {
//   console.log("start recognition")
//   recognition.start();
// })