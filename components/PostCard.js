'use client'
import { useState } from 'react'
import VoteButtons from './VoteButtons'
import { supabase } from '@/lib/supabase'

export default function PostCard({ post, onVoted, index = 0 }) {
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [isLoadingComments, setIsLoadingComments] = useState(false)

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

  const totalVotes = post.vote_yes + post.vote_maybe + post.vote_no
  const yesPercent = totalVotes > 0 ? Math.round((post.vote_yes / totalVotes) * 100) : 0
  const maybePercent = totalVotes > 0 ? Math.round((post.vote_maybe / totalVotes) * 100) : 0
  const noPercent = totalVotes > 0 ? Math.round((post.vote_no / totalVotes) * 100) : 0

  return (
    <div
      className="glass-card p-5 md:p-6 mb-4 transition-all duration-300 hover:border-opacity-20 animate-fade-in-up"
      style={{
        animationDelay: `${index * 80}ms`,
        borderColor: 'rgba(255,255,255,0.06)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(34,211,238,0.12)'
        e.currentTarget.style.boxShadow = '0 0 20px rgba(34,211,238,0.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Header row */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          {post.title}
        </h3>
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ml-3"
          style={{
            background: 'var(--neon-purple-dim)',
            color: 'var(--neon-purple)',
            border: '1px solid rgba(168,85,247,0.12)',
          }}
        >
          {post.category}
        </span>
      </div>

      <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {post.description}
      </p>

      {/* Vote buttons */}
      <VoteButtons postId={post.id} onVoted={onVoted} />

      {/* Vote results */}
      {totalVotes > 0 && (
        <div className="mt-4 space-y-2">
          {/* Yes */}
          <div className="flex items-center gap-3">
            <span className="w-16 text-xs font-medium" style={{ color: 'var(--neon-cyan)' }}>正解</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
              <div
                className="h-full rounded-full transition-all duration-700 bar-glow-cyan"
                style={{
                  width: `${yesPercent}%`,
                  background: 'linear-gradient(90deg, var(--neon-cyan), rgba(34,211,238,0.5))',
                }}
              />
            </div>
            <span className="w-10 text-right text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {yesPercent}%
            </span>
          </div>

          {/* Maybe */}
          <div className="flex items-center gap-3">
            <span className="w-16 text-xs font-medium" style={{ color: 'var(--neon-amber)' }}>微妙</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
              <div
                className="h-full rounded-full transition-all duration-700 bar-glow-amber"
                style={{
                  width: `${maybePercent}%`,
                  background: 'linear-gradient(90deg, var(--neon-amber), rgba(245,158,11,0.5))',
                }}
              />
            </div>
            <span className="w-10 text-right text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {maybePercent}%
            </span>
          </div>

          {/* No */}
          <div className="flex items-center gap-3">
            <span className="w-16 text-xs font-medium" style={{ color: 'var(--neon-purple)' }}>やめとけ</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
              <div
                className="h-full rounded-full transition-all duration-700 bar-glow-purple"
                style={{
                  width: `${noPercent}%`,
                  background: 'linear-gradient(90deg, var(--neon-purple), rgba(168,85,247,0.5))',
                }}
              />
            </div>
            <span className="w-10 text-right text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {noPercent}%
            </span>
          </div>

          <p className="text-xs text-right" style={{ color: 'var(--text-muted)' }}>
            {totalVotes} 票
          </p>
        </div>
      )}

      {/* Comments */}
      <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--glass-border)' }}>
        <button
          onClick={loadComments}
          className="text-xs transition-colors duration-200 hover:opacity-80"
          style={{ color: 'var(--text-muted)' }}
        >
          {isLoadingComments
            ? '読み込み中...'
            : showComments
            ? '閉じる'
            : `コメント (${comments.length})`}
        </button>

        {showComments && (
          <div className="mt-3 animate-fade-in-up">
            <form onSubmit={handleCommentSubmit} className="mb-3">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-2.5 rounded-lg text-sm resize-none transition-colors duration-200"
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
                className="mt-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'var(--neon-cyan-dim)',
                  color: 'var(--neon-cyan)',
                  border: '1px solid rgba(34,211,238,0.15)',
                }}
              >
                送信
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-2.5 rounded-lg"
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
  )
}
