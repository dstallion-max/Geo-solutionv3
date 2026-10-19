import { useState, useEffect, useRef } from 'react'
import { Send, Pin, PinOff, Trash2, Loader2 } from 'lucide-react'
import { apiRequest } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { formatDateTime } from '../../lib/format'

export default function AdminChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function fetchMessages() {
    try {
      const data = await apiRequest('/chat')
      setMessages(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!text.trim()) return
    try {
      await apiRequest('/chat', { method: 'POST', body: { text: text.trim() } })
      setText('')
      fetchMessages()
    } catch (err) { alert(err.message) }
  }

  async function togglePin(id) {
    try {
      await apiRequest(`/chat/${id}/pin`, { method: 'PATCH' })
      fetchMessages()
    } catch (err) { alert(err.message) }
  }

  async function deleteMsg(id) {
    if (!confirm('Delete this message?')) return
    try {
      await apiRequest(`/chat/${id}`, { method: 'DELETE' })
      fetchMessages()
    } catch (err) { alert(err.message) }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>

  const pinnedMessages = messages.filter(m => m.is_pinned)

  return (
    <div className="space-y-4 animate-fade-in-up flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">Team Chat</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2d9b4e]/10 text-[#2d9b4e]">
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          <span className="text-[10px] font-semibold uppercase">Live Room</span>
        </div>
      </div>

      {/* Pinned Messages Banner */}
      {pinnedMessages.length > 0 && (
        <div className="glass-card rounded-xl p-3 border-l-4 border-[#f4a261] bg-[#f4a261]/5 dark:bg-[#f4a261]/10">
          <div className="flex items-center gap-2 mb-2">
            <Pin className="w-4 h-4 text-[#f4a261]" />
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#f4a261]">Pinned Messages</h3>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {pinnedMessages.map(m => (
              <div key={`pin-${m.id}`} className="text-xs text-[#0f2b3d] dark:text-white flex items-start justify-between gap-2">
                <p><strong>{m.sender_name}:</strong> {m.text}</p>
                <button onClick={() => togglePin(m.id)} className="text-[#94a3b8] hover:text-[#e63946] shrink-0" title="Unpin">
                  <PinOff className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="glass-card rounded-xl flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => {
          const isMe = m.sender_id === user.id
          return (
            /* 
              The `group` class is on this outer container. 
              Hovering anywhere on this row will reveal the action buttons below.
            */
            <div key={m.id} className="group flex flex-col mb-4">
              <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] lg:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] font-semibold text-[#64748b] dark:text-[#a0aec0] mb-1 px-1">
                    {m.sender_name} ({m.sender_role})
                  </span>
                  
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isMe 
                      ? 'bg-[#0f2b3d] dark:bg-[#00b4d8] text-white rounded-br-sm' 
                      : 'bg-[#f4f3f5] dark:bg-[#0d1b2a] text-[#0f2b3d] dark:text-white rounded-bl-sm'
                  }`}>
                    {m.is_pinned && <Pin className="w-3 h-3 text-[#f4a261] inline-block mr-1 mb-0.5" />}
                    {m.text}
                    <div className="text-[9px] opacity-60 mt-1">{formatDateTime(m.created_at)}</div>
                  </div>
                  
                  {/* Action Buttons - visible on hover of the whole message block */}
                  <div className="flex gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => togglePin(m.id)} className="text-[10px] text-[#94a3b8] hover:text-[#f4a261] flex items-center gap-0.5">
                      {m.is_pinned ? <><PinOff className="w-3 h-3"/> Unpin</> : <><Pin className="w-3 h-3"/> Pin</>}
                    </button>
                    {(isMe || user.role === 'admin') && (
                      <button onClick={() => deleteMsg(m.id)} className="text-[10px] text-[#94a3b8] hover:text-[#e63946] flex items-center gap-0.5">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="glass-card rounded-xl p-2 flex gap-2">
        <input 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="Type a message to the team..." 
          className="flex-1 px-4 py-2.5 rounded-lg bg-transparent text-sm dark:text-white focus:outline-none" 
        />
        <button type="submit" disabled={!text.trim()} className="p-2.5 rounded-lg bg-[#0f2b3d] dark:bg-[#00b4d8] text-white disabled:opacity-40">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}