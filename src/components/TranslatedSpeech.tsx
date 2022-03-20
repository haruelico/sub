import React, { useContext } from "react";
import { SpeechContext } from "./SpeechContext";

export const TranslatedSpeech = () => {
  const context = useContext(SpeechContext)
  return <div style={{
    // fontSize: '1rem'
  }}>{context.translated}</div>
}
