'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PostForm({ onPostCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('仕事')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
          vote_no: 0
        }
      ])
      .select()

    if (error) {
      alert('投稿に失敗しました')
      console.error(error)
    } else {
      alert('投稿しました！')
      setTitle('')
      setDescription('')
      setCategory('仕事')
      if (onPostCreated) onPostCreated()
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">人生の選択を投稿</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">選択（20文字以内）</label>
        <input
          type="text"
          maxLength={20}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="例: 転職するか悩んでいる"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">今の状況（50文字以内）</label>
        <textarea
          maxLength={50}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="例: 安定しているが、やりたいことができない"
          rows={3}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">カテゴリ</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isSubmitting ? '投稿中...' : '投稿する'}
      </button>
    </form>
  )
}