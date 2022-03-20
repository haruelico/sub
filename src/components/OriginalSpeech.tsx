import React, { useContext } from "react";
import { SpeechContext } from "./SpeechContext";

export const OriginalSpeech = () => {
  const context = useContext(SpeechContext)
  return <div>{context.original}</div>
}
