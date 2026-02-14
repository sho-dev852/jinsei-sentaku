'use client'
import { useState, useEffect, useMemo } from 'react'
import VoteButtons from './VoteButtons'
import { supabase } from '@/lib/supabase'

export default function HeroCard({ post, onVoted }) {
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [isLoadingComments, setIsLoadingComments] = useState(false)

  const totalVotes = post.vote_yes + post.vote_maybe + post.vote_no
  const yesPercent = totalVotes > 0 ? Math.round((post.vote_yes / totalVotes) * 100) : 0
  const noPercent = totalVotes > 0 ? Math.round((post.vote_no / totalVotes) * 100) : 0

  // Determine neon border class based on vote balance
  const neonClass = useMemo(() => {
    if (totalVotes === 0) return 'neon-border-mixed'
    const ratio = post.vote_yes / totalVotes
    if (ratio > 0.6) return 'neon-border-cyan'
    if (ratio < 0.4) return 'neon-border-purple'
    return 'neon-border-mixed'
  }, [post.vote_yes, totalVotes])

  const loadComments = async () => {
    if (showComments) {
      setShowComments(false)
      return
    }
    setIsLoadingComments(true)
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', post.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setComments(data)
    }
    setShowComments(true)
    setIsLoadingComments(false)
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: post.id, comment_text: commentText }])
      .select()

    if (!error && data) {
      setComments([data[0], ...comments])
      setCommentText('')
    }
  }

  return (
    <section className="mb-12">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1.5 h-6 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 8px rgba(34,211,238,0.4)' }} />
        <h2 className="text-sm font-medium tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>
          Most Debated
        </h2>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(34,211,238,0.15), transparent)' }} />
      </div>

      {/* Hero card */}
      <div className={`glass-card ${neonClass} p-8 md:p-10 relative overflow-hidden`}>
        {/* Background accent gradient */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, var(--neon-cyan-dim) 0%, transparent 50%),
                         radial-gradient(ellipse at 80% 50%, var(--neon-purple-dim) 0%, transparent 50%)`,
          }}
        />

        <div className="relative z-10">
          {/* Category + heat indicator */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium tracking-wide"
              style={{
                background: 'var(--neon-cyan-dim)',
                color: 'var(--neon-cyan)',
                border: '1px solid rgba(34,211,238,0.15)',
              }}
            >
              {post.category}
            </span>

            {totalVotes > 0 && (
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: 'var(--neon-cyan)',
                    animation: 'heartbeat-glow 1.5s ease-in-out infinite',
                  }}
                />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {totalVotes} votes
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3
            className="text-2xl md:text-3xl font-bold mb-3 text-glow-cyan"
            style={{ color: 'var(--text-primary)' }}
          >
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-base md:text-lg mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {post.description}
          </p>

          {/* Vote buttons */}
          <VoteButtons postId={post.id} onVoted={onVoted} variant="hero" />

          {/* Vote results bar */}
          {totalVotes > 0 && (
            <div className="mt-6 space-y-3">
              {/* Dual bar visualization */}
              <div className="flex gap-1 h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
                <div
                  className="rounded-l-full transition-all duration-700 bar-glow-cyan"
                  style={{
                    width: `${yesPercent}%`,
                    background: 'linear-gradient(90deg, var(--neon-cyan), rgba(34,211,238,0.6))',
                  }}
                />
                <div
                  className="transition-all duration-700"
                  style={{
                    width: `${100 - yesPercent - noPercent}%`,
                    background: 'linear-gradient(90deg, rgba(245,158,11,0.4), rgba(245,158,11,0.2))',
                  }}
                />
                <div
                  className="rounded-r-full transition-all duration-700 bar-glow-purple"
                  style={{
                    width: `${noPercent}%`,
                    background: 'linear-gradient(90deg, rgba(168,85,247,0.6), var(--neon-purple))',
                  }}
                />
              </div>

              {/* Labels */}
              <div className="flex justify-between text-xs font-medium">
                <span style={{ color: 'var(--neon-cyan)' }}>
                  正解 {yesPercent}%
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  微妙 {100 - yesPercent - noPercent}%
                </span>
                <span style={{ color: 'var(--neon-purple)' }}>
                  やめとけ {noPercent}%
                </span>
              </div>
            </div>
          )}

          {/* Comments section */}
          <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
            <button
              onClick={loadComments}
              className="text-sm transition-colors duration-200 hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isLoadingComments
                ? '読み込み中...'
                : showComments
                ? '閉じる'
                : `コメントを見る (${comments.length})`}
            </button>

            {showComments && (
              <div className="mt-4 animate-fade-in-up">
                <form onSubmit={handleCommentSubmit} className="mb-4">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full p-3 rounded-lg text-sm resize-none transition-colors duration-200"
                    style={{
                      background: 'var(--bg-deep)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="本音を書け..."
                    rows={2}
                  />
                  <button
                    type="submit"
                    className="mt-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90"
                    style={{
                      background: 'var(--neon-cyan-dim)',
                      color: 'var(--neon-cyan)',
                      border: '1px solid rgba(34,211,238,0.2)',
                    }}
                  >
                    送信
                  </button>
                </form>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 rounded-lg"
                      style={{ background: 'var(--bg-deep)', border: '1px solid var(--glass-border)' }}
                    >
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        {comment.comment_text}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {new Date(comment.created_at).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
