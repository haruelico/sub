import React, { useEffect } from "react";

type EventCatcherProps = {
  setSpeech: any
}

export const EventCatcher = ({setSpeech}: EventCatcherProps) => {
  useEffect(() => {
    window.electron.speechToText((arg: any) => {
      console.log(arg)
      setSpeech({original: arg.original, translated: arg.translations[0].text})
    })
  }, [])
  return <></>
}
