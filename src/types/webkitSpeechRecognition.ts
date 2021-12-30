// https://qiita.com/akkadaska/items/9c1781052038db444182

interface ISpeechRecognitionEvent {
  isTrusted?: boolean;
  results: {
    isFinal: boolean;
    [key: number]:
      | undefined
      | {
          transcript: string;
        };
  }[];
}

interface ISpeechRecognition extends EventTarget {
  // properties
  grammars: string;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;

  // event handlers
  onaudiostart: () => void;
  onaudioend: () => void;
  onend: () => void;
  onerror: (event: any) => void;
  onnomatch: () => void;
  onresult: (event: ISpeechRecognitionEvent) => void;
  onsoundstart: () => void;
  onsoundend: () => void;
  onspeechstart: () => void;
  onspeechend: () => void;
  onstart: () => void;

  // methods
  abort(): void;
  start(): void;
  stop(): void;
}

// export default ISpeechRecognition;

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

interface IWindow extends Window {
  SpeechRecognition: ISpeechRecognitionConstructor;
  webkitSpeechRecognition: ISpeechRecognitionConstructor;
}

export default IWindow;