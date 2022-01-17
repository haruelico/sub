// original implementation is here
// https://github.com/gillesdemey/node-record-lpcm16
import { spawn, ChildProcess } from "node:child_process"
import assert from "node:assert"
import debug from "debug"

// export class Sox {
//   constructor {
//      const defaults = {
//       sampleRate: 16000,
//       channels: 1,
//       compress: false,
//       threshold: 0.5,
//       thresholdStart: null,
//       thresholdEnd: null,
//       silence: '1.0',
//       recorder: 'sox',
//       endOnSilence: false,
//       audioType: 'wav'
//     }

//     const recorder = 'a'
//   }
// }

export class Sox {
  options: {
    sampleRate: number
    channels: number
    compress: boolean
    threshold: number
    thresholdStart?: boolean
    thresholdEnd?: boolean
    silence: string
    recorder: string
    endOnSilence: boolean
    audioType: string
  }
  cmd: string
  args: string[]
  spawnOptions: object
  cmdOptions: object
  process: ChildProcess
  _stream: ChildProcess["stdout"]

  constructor(options = {}) {
    const defaults = {
      sampleRate: 16000,
      channels: 1,
      compress: false,
      threshold: 0.5,
      // thresholdStart: null,
      // thresholdEnd: null,
      silence: '1.0',
      recorder: 'sox',
      endOnSilence: false,
      audioType: 'wav'
    }
    this.options = defaults
    this.cmd = 'sox'
    this.args = [
      '--default-device',
      '--no-show-progress', // show no progress
      '--rate', this.options.sampleRate.toString(), // sample rate
      '--channels', this.options.channels.toString(), // channels
      '--encoding', 'signed-integer', // sample encoding
      '--bits', '16', // precision (bits)
      '--type', this.options.audioType, // audio type
      '-' // pipe
    ]
    this.spawnOptions = {}
    this.cmdOptions = Object.assign({
      encoding: 'binary',
      stdio: 'pipe',
      env: { AUDIODRIVER: "waveaudio" }
    }, this.spawnOptions)

    return this
  }

  start() {
    const { cmd, args, cmdOptions } = this

    const cp = spawn(cmd, args, cmdOptions)
    console.warn("aaaaaaaaaaaaaaaaaaaa")
    const rec = cp.stdout
    const err = cp.stderr

    this.process = cp // expose child process
    this._stream = rec // expose output stream

    cp.on('close', code => {
      if (code === 0) return
      rec.emit('error', `${this.cmd} has exited with error code ${code}.
Enable debugging with the environment variable DEBUG=record.`
      )
    })

    err.on('data', chunk => {
      console.log(`STDERR: ${chunk}`)
    })

    rec.on('data', chunk => {
      // console.log(`Recording ${chunk.length} bytes`)
    })

    rec.on('end', () => {
      console.log('Recording ended')
    })

    return this
  }

  stop() {
    assert(this.process, 'Recording not yet started')

    this.process.kill()
  }

  pause() {
    assert(this.process, 'Recording not yet started')

    this.process.kill('SIGSTOP')
    this._stream.pause()
    // console.log('Paused recording')
  }

  resume() {
    assert(this.process, 'Recording not yet started')

    this.process.kill('SIGCONT')
    this._stream.resume()
    // console.log('Resumed recording')
  }

  isPaused() {
    assert(this.process, 'Recording not yet started')

    return this._stream.isPaused()
  }

  stream() {
    assert(this._stream, 'Recording not yet started')

    return this._stream
  }
}
