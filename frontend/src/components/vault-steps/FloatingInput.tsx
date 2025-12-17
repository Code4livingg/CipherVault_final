import { motion } from 'framer-motion'
import { useState } from 'react'

interface FloatingInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  rows?: number
  id?: string
}

export default function FloatingInput({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 1,
  id
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value.length > 0
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`

  const InputComponent = multiline ? 'textarea' : 'input'

  return (
    <div className="relative mb-8">
      <motion.label
        htmlFor={inputId}
        animate={{
          y: isFocused || hasValue ? -24 : 0,
          scale: isFocused || hasValue ? 0.85 : 1,
          color: isFocused ? '#3B82F6' : '#94A3B8'
        }}
        transition={{ duration: 0.2 }}
        className="absolute left-0 top-3 font-body text-sm pointer-events-none origin-left"
      >
        {label}
      </motion.label>

      <InputComponent
        id={inputId}
        name={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? placeholder : ''}
        rows={multiline ? rows : undefined}
        className="w-full bg-transparent text-white border-none border-b-2 border-[#1E293B] focus:border-[#3B82F6] outline-none py-3 font-body transition-colors resize-none placeholder:text-[#64748B]"
        style={{
          borderBottomColor: isFocused ? '#3B82F6' : '#1E293B'
        }}
      />

      {/* Neon underline glow */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-[#3B82F6]"
        initial={{ width: '0%' }}
        animate={{ width: isFocused ? '100%' : '0%' }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: isFocused ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none'
        }}
      />
    </div>
  )
}
