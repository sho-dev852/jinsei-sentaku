'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PostForm({ onPostCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('仕事')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          description,
          category,
          vote_yes: 0,
          vote_maybe: 0,
          vote_no: 0,
        },
      ])
      .select()

    if (error) {
      alert('投稿に失敗しました')
      console.error(error)
    } else {
      setTitle('')
      setDescription('')
      setCategory('仕事')
      setIsOpen(false)
      if (onPostCreated) onPostCreated()
    }

    setIsSubmitting(false)
  }

  const inputStyle = {
    background: 'var(--bg-deep)',
    border: '1px solid var(--glass-border)',
    color: 'var(--text-primary)',
  }

  return (
    <div className="mb-10">
      {/* Toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 rounded-2xl text-sm font-medium transition-all duration-300 glass-card"
          style={{
            color: 'var(--text-secondary)',
            borderColor: 'rgba(34,211,238,0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.25)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(34,211,238,0.06)'
            e.currentTarget.style.color = 'var(--neon-cyan)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.1)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          + 告白する
        </button>
      )}

      {/* Form */}
      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="glass-card p-6 md:p-8 animate-fade-in-up"
          style={{ borderColor: 'rgba(34,211,238,0.1)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              告白する
            </h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm transition-colors duration-200"
              style={{ color: 'var(--text-muted)' }}
            >
              閉じる
            </button>
          </div>

          {/* Title */}
          <div className="mb-5">
            <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              あなたの選択（20文字以内）
            </label>
            <input
              type="text"
              maxLength={20}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl text-sm transition-colors duration-200"
              style={inputStyle}
              placeholder="例: 安定を捨てて起業した"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              背景・状況（50文字以内）
            </label>
            <textarea
              maxLength={50}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl text-sm resize-none transition-colors duration-200"
              style={inputStyle}
              placeholder="例: 年収800万を捨てて、貯金200万で独立した"
              rows={3}
              required
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              カテゴリ
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-xl text-sm transition-colors duration-200 appearance-none cursor-pointer"
              style={inputStyle}
            >
              <option value="仕事">仕事</option>
              <option value="恋愛">恋愛</option>
              <option value="お金">お金</option>
              <option value="人間関係">人間関係</option>
              <option value="進学・就職">進学・就職</option>
              <option value="教育・子育て">教育・子育て</option>
              <option value="家族">家族</option>
              <option value="住む場所">住む場所</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-300"
            style={{
              background: isSubmitting ? 'var(--bg-elevated)' : 'var(--neon-cyan-dim)',
              color: isSubmitting ? 'var(--text-muted)' : 'var(--neon-cyan)',
              border: `1px solid ${isSubmitting ? 'var(--glass-border)' : 'rgba(34,211,238,0.2)'}`,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(34,211,238,0.15)'
                e.currentTarget.style.borderColor = 'var(--neon-cyan)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = 'rgba(34,211,238,0.2)'
              }
            }}
          >
            {isSubmitting ? '投稿中...' : '世間に問う'}
          </button>
        </form>
      )}
    </div>
  )
}
