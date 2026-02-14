'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function VoteButtons({ postId, onVoted, variant = 'default' }) {
  const [hasVoted, setHasVoted] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [flashTarget, setFlashTarget] = useState(null)
  const buttonRefs = useRef({})

  useEffect(() => {
    const voted = localStorage.getItem(`voted_${postId}`)
    if (voted) {
      setHasVoted(true)
    }
  }, [postId])

  const handleVote = async (voteType) => {
    if (hasVoted || isVoting) return
    setIsVoting(true)

    // Trigger flash animation
    setFlashTarget(voteType)
    setTimeout(() => setFlashTarget(null), 400)

    const { error: voteError } = await supabase
      .from('votes')
      .insert([{ post_id: postId, vote_type: voteType, voter_ip: 'anonymous' }])

    if (voteError) {
      alert('投票に失敗しました')
      setIsVoting(false)
      return
    }

    const columnName =
      voteType === 'yes' ? 'vote_yes' : voteType === 'maybe' ? 'vote_maybe' : 'vote_no'

    const { data: post } = await supabase
      .from('posts')
      .select(columnName)
      .eq('id', postId)
      .single()

    if (post) {
      await supabase
        .from('posts')
        .update({ [columnName]: post[columnName] + 1 })
        .eq('id', postId)
    }

    localStorage.setItem(`voted_${postId}`, voteType)
    setHasVoted(true)
    setIsVoting(false)
    if (onVoted) onVoted()
  }

  const isHero = variant === 'hero'
  const baseHeight = isHero ? 'py-4' : 'py-3'
  const fontSize = isHero ? 'text-base' : 'text-sm'

  const buttons = [
    {
      type: 'yes',
      label: '正解',
      color: 'var(--neon-cyan)',
      dimColor: 'var(--neon-cyan-dim)',
      borderColor: 'rgba(34,211,238,0.2)',
      glowColor: 'rgba(34,211,238,0.5)',
    },
    {
      type: 'maybe',
      label: '微妙',
      color: 'var(--neon-amber)',
      dimColor: 'var(--neon-amber-dim)',
      borderColor: 'rgba(245,158,11,0.2)',
      glowColor: 'rgba(245,158,11,0.5)',
    },
    {
      type: 'no',
      label: 'やめとけ',
      color: 'var(--neon-purple)',
      dimColor: 'var(--neon-purple-dim)',
      borderColor: 'rgba(168,85,247,0.2)',
      glowColor: 'rgba(168,85,247,0.5)',
    },
  ]

  return (
    <div className={`flex gap-3 ${isHero ? 'gap-4' : ''}`}>
      {buttons.map((btn) => {
        const isFlashing = flashTarget === btn.type
        const disabled = hasVoted || isVoting

        return (
          <button
            key={btn.type}
            ref={(el) => (buttonRefs.current[btn.type] = el)}
            onClick={() => handleVote(btn.type)}
            disabled={disabled}
            className={`
              flex-1 ${baseHeight} rounded-xl ${fontSize} font-medium
              transition-all duration-200 cursor-pointer
              ${isFlashing ? 'animate-vote-flash' : ''}
              ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
            `}
            style={{
              background: disabled
                ? 'var(--bg-elevated)'
                : btn.dimColor,
              color: disabled
                ? 'var(--text-muted)'
                : btn.color,
              border: `1px solid ${disabled ? 'var(--glass-border)' : btn.borderColor}`,
              boxShadow: isFlashing
                ? `0 0 16px ${btn.glowColor}, 0 0 32px ${btn.dimColor}`
                : 'none',
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.boxShadow = `0 0 12px ${btn.dimColor}`
                e.currentTarget.style.borderColor = btn.color
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled) {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = btn.borderColor
              }
            }}
          >
            {btn.label}
          </button>
        )
      })}
    </div>
  )
}
