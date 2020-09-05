const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { EventEmitter } = require('events');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
     webPreferences: {
       nodeIntegration: true
     }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const BUFFER_SIZE = 4096;

// by default, browsers will create a 48000 sample rate audio context,
// which leads to an HTTP request size of ~1.3 MB for 10 seconds of audio.
// setting the sample rate to 16000 lowers it to a more reasonable 420 KB.
// the size could be further reduced through client-size gzip, TBD if it's worth it.
const SAMPLE_RATE = 16000;

let tempBuffer = new ArrayBuffer(BUFFER_SIZE * 2);
let tempBufferView = new Uint16Array(this.tempBuffer);
let outputBuffer =  new ArrayBuffer(0)

ipcMain.on('sync-message', (event, arg) => {
  // console.log(arg)
  event.returnValue = 'ok'

    for (let i = 0; i < arg.length; i++) {
      tempBufferView[i] = float32ToInt16(arg[i]);
    }

    outputBuffer = combineBuffers(outputBuffer, tempBuffer);


      const apiResult = speechToText(
        outputBuffer,
        //this.audioContext.sampleRate,
        16000,
        'ja-JP',
        process.env.GCLOUD_API_KEY
      );
      outputBuffer = new ArrayBuffer(0);
      return apiResult;
})


const float32ToInt16 = f => {
  const multiplier = f < 0 ? 0x8000 : 0x7fff; // 16-bit signed range is -32768 to 32767
  return f * multiplier;
};

const combineBuffers = (a, b) => {
  const result = new Uint8Array(a.byteLength + b.byteLength);
  result.set(new Uint8Array(a), 0);
  result.set(new Uint8Array(b), a.byteLength);
  return result;
};

const base64 = require('base64-js');

async function speechToText(audioBuffer, sampleRate, languageCode, apiKey) {
  // Reference: https://cloud.google.com/speech-to-text/docs/reference/rest/v1/speech/recognize

  const response = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: sampleRate,
          languageCode: languageCode,
        },
        audio: {
          content: base64.fromByteArray(audioBuffer),
        },
      }),
    }
  );

  const result = response.json();

  if (result.error) {
    throw result.error.message;
  } else {
    return result;
  }
}

async function textToSpeech(text, languageCode, apiKey) {
  // Reference: https://cloud.google.com/text-to-speech/docs/reference/rest/v1/text/synthesize

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          text,
        },
        voice: {
          languageCode: languageCode,
        },
        audioConfig: {
          audioEncoding: 'LINEAR16',
        },
      }),
    }
  );

  const result = await response.json();

  if (result.error) {
    throw result.error.message;
  } else {
    return base64.toByteArray(result.audioContent).buffer;
  }
}
