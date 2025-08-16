import { useState, useMemo } from 'react'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'
import type { Chat } from '../types'
import { useUserData } from "@nhost/react"

export default function Dashboard() {
  const [selectedChatId, setSelectedChatId] = useState<string|null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const userData = useUserData()

  const selectedChatInfo=useMemo(()=>{
    return chats.find((chat)=>chat.id===selectedChatId)
  },[chats, selectedChatId])

  return (
    <div className="layout">
      <ChatList chats={chats} setChats={setChats} selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />
      <ChatWindow displayName={userData?.displayName} email={userData?.email} selectedChatName={selectedChatInfo?.title} chatId={selectedChatId} />
    </div>
  )
}


