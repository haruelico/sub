import React from "react";

export type SpeechContextType = {
  original: string
  translated: string
}
export const SpeechContext = React.createContext<SpeechContextType>({original: '', translated: ''})
