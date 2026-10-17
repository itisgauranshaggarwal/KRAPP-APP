import { Mic, Paperclip, SendHorizontal, Smile } from 'lucide-react'
import { useRef, useState, type KeyboardEvent } from 'react'

import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/lib/utils'

export interface MessageInputProps {
  onSend: (text: string) => void
  onTypingChange?: (typing: boolean) => void
  disabled?: boolean
  className?: string
}

export function MessageInput({
  onSend,
  onTypingChange,
  disabled = false,
  className,
}: MessageInputProps) {
  const [value, setValue] = useState('')
  const typingRef = useRef(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function notifyTyping(next: boolean) {
    if (typingRef.current === next) return
    typingRef.current = next
    onTypingChange?.(next)
  }

  function submit() {
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue('')
    notifyTyping(false)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  function autoGrow() {
    const node = textareaRef.current
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${Math.min(node.scrollHeight, 140)}px`
  }

  const hasText = value.trim().length > 0

  return (
    <div className={cn('border-t border-line bg-surface px-3 py-2.5 sm:px-6', className)}>
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        {/* Media actions arrive in Phase 4. */}
        <IconButton
          label="Attach a file"
          variant="ghost"
          className="hidden sm:inline-flex"
          disabled={disabled}
        >
          <Paperclip className="size-5" />
        </IconButton>

        <div className="flex flex-1 items-end gap-1 rounded-lg border border-line-strong bg-surface px-1.5 py-1 transition-[border-color,box-shadow] duration-100 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-soft">
          <IconButton label="Emoji" size="sm" variant="ghost" className="mb-0.5">
            <Smile className="size-5" />
          </IconButton>

          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            disabled={disabled}
            placeholder="Type a message"
            aria-label="Message"
            onChange={(e) => {
              setValue(e.target.value)
              autoGrow()
              notifyTyping(e.target.value.trim().length > 0)
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => notifyTyping(false)}
            className={cn(
              'max-h-[140px] min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm text-text',
              'placeholder:text-faint focus-visible:outline-none scroll-soft',
            )}
          />
        </div>

        {hasText ? (
          <IconButton
            label="Send message"
            variant="primary"
            className="animate-fade"
            onClick={submit}
            disabled={disabled}
          >
            <SendHorizontal className="size-5" />
          </IconButton>
        ) : (
          <IconButton
            label="Hold to record a voice note"
            variant="ghost"
            disabled={disabled}
            title="Voice notes arrive in a later update"
          >
            <Mic className="size-5" />
          </IconButton>
        )}
      </div>
    </div>
  )
}
