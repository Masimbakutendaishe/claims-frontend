import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageCircle, X, Bot, Headset, ArrowLeft } from 'lucide-react'
import { ChatConversation } from './ChatConversation'

type Mode = 'closed' | 'choose' | 'ai' | 'admin'

export function ChatWidget() {
  const [mode, setMode] = useState<Mode>('closed')
  const isOpen = mode !== 'closed'

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end w-80">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="mb-3 w-80 h-96 rounded-2xl overflow-hidden shadow-2xl bg-card border border-white/15 flex flex-col"
          >
            {mode === 'choose' && (
              <div className="flex flex-col h-full">
                <div className="px-4 py-3 border-b border-white/15 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-card-ink">How can we help?</h3>
                  <button type="button" onClick={() => setMode('closed')} className="text-card-ink opacity-70">
                    <X size={16} />
                  </button>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-3 px-6">
                  <button
                    type="button"
                    onClick={() => setMode('ai')}
                    className="flex items-center gap-3 rounded-xl border border-white/20 hover:bg-white/10 px-4 py-3 text-left transition-colors"
                  >
                    <Bot size={20} className="text-card-ink shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-card-ink">AI Assistant</div>
                      <div className="text-xs opacity-60 text-card-ink">Instant answers, any time</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('admin')}
                    className="flex items-center gap-3 rounded-xl border border-white/20 hover:bg-white/10 px-4 py-3 text-left transition-colors"
                  >
                    <Headset size={20} className="text-card-ink shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-card-ink">Claims Admin</div>
                      <div className="text-xs opacity-60 text-card-ink">Talk to a real person about your claim</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {mode === 'ai' && (
              <div className="flex flex-col h-full">
                <button
                  type="button"
                  onClick={() => setMode('choose')}
                  className="flex items-center gap-1.5 px-4 pt-3 text-xs text-card-ink opacity-70"
                >
                  <ArrowLeft size={13} /> Back
                </button>
                <ChatConversation
                  title="AI Assistant"
                  subtitle="Hi, I'm the claims AI assistant. Ask me anything about your claim or the process."
                  autoReply={() => "That's a placeholder reply — I'll be connected to a real assistant soon."}
                />
              </div>
            )}

            {mode === 'admin' && (
              <div className="flex flex-col h-full">
                <button
                  type="button"
                  onClick={() => setMode('choose')}
                  className="flex items-center gap-1.5 px-4 pt-3 text-xs text-card-ink opacity-70"
                >
                  <ArrowLeft size={13} /> Back
                </button>
                <ChatConversation
                  title="Claims Admin"
                  subtitle="You're connected to a Claims Admin. Response times may vary."
                  autoReply={() => "Thanks for your message — a Claims Admin will reply here shortly."}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setMode(isOpen ? 'closed' : 'choose')}
        animate={{ x: isOpen ? -260 : 0 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="w-14 h-14 rounded-full bg-button-bg text-button-ink shadow-lg flex items-center justify-center"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}