import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { Send } from 'lucide-react'

export interface ChatMessage {
  id: string
  from: 'user' | 'other'
  text: string
}

interface Props {
  title: string
  subtitle: string
  autoReply: (userText: string) => string
}

export function ChatConversation({ title, subtitle, autoReply }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'intro', from: 'other', text: subtitle },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = () => {
    const text = input.trim()
    if (!text) return
    const userMsg: ChatMessage = { id: crypto.randomUUID(), from: 'user', text }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)

    // Placeholder — real backend wiring replaces this timeout later
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { id: crypto.randomUUID(), from: 'other', text: autoReply(text) }])
    }, 900)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-white/15">
        <h3 className="text-sm font-semibold text-card-ink">{title}</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                m.from === 'user' ? 'bg-button-bg text-button-ink' : 'bg-black/10 dark:bg-white/10 text-card-ink'
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-black/10 dark:bg-white/10 text-card-ink rounded-2xl px-3 py-2 text-sm opacity-60">
              typing...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-white/15 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          className="flex-1 rounded-full bg-input-bg text-input-ink px-4 py-2 text-sm outline-none"
        />
        <button
          type="button"
          onClick={send}
          className="w-9 h-9 rounded-full bg-button-bg text-button-ink flex items-center justify-center shrink-0"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  )
}