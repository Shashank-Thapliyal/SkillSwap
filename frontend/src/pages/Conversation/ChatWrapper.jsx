import React from 'react'
import Chat from './Chat'
import { useParams } from 'react-router-dom'

const ChatWrapper = () => {
    const {userId, tab} = useParams();
  return (
    <Chat userId={userId} tab={tab} />
  )
}

export default ChatWrapper