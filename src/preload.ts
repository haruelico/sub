import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('electron', {
  speechToText: (listerner: Function) => {
    ipcRenderer.on('speech-to-text', (event, arg) => listerner(arg))
  }
})
