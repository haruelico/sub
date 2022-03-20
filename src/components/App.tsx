import React, { useState } from "react"
import { SpeechContext, SpeechContextType } from "./SpeechContext"
import { TranslatedSpeech } from "./TranslatedSpeech"
import { OriginalSpeech } from "./OriginalSpeech"
import { EventCatcher } from "./EventCatcher"


export const App = () => {
  const [speech, setSpeech] = useState<SpeechContextType>({original: '', translated: ''})

  return <SpeechContext.Provider value={speech}>
    <EventCatcher setSpeech={setSpeech} />
    <TranslatedSpeech />
    <OriginalSpeech />
  </SpeechContext.Provider>
}
