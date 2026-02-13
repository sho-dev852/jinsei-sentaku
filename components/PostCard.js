'use client'
import { useState } from 'react'
import VoteButtons from './VoteButtons'
import { supabase } from '@/lib/supabase'

export default function PostCard({ post, onVoted }) {
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
      .insert([
        {
          post_id: post.id,
          comment_text: commentText
        }
      ])
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
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold">{post.title}</h3>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          {post.category}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{post.description}</p>

      <VoteButtons postId={post.id} onVoted={onVoted} />

      {totalVotes > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <span className="w-20">👍 アリ</span>
            <div className="flex-1 bg-gray-200 rounded-full h-6">
              <div
                className="bg-green-500 h-6 rounded-full flex items-center justify-center text-white text-sm"
                style={{ width: `${yesPercent}%` }}
              >
                {yesPercent}%
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-20">🤔 怖い</span>
            <div className="flex-1 bg-gray-200 rounded-full h-6">
              <div
                className="bg-yellow-500 h-6 rounded-full flex items-center justify-center text-white text-sm"
                style={{ width: `${maybePercent}%` }}
              >
                {maybePercent}%
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-20">👎 ナシ</span>
            <div className="flex-1 bg-gray-200 rounded-full h-6">
              <div
                className="bg-red-500 h-6 rounded-full flex items-center justify-center text-white text-sm"
                style={{ width: `${noPercent}%` }}
              >
                {noPercent}%
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 border-t pt-4">
        <button
          onClick={loadComments}
          className="text-blue-500 hover:text-blue-700 mb-2"
        >
          {showComments ? 'コメントを隠す' : `コメント (${comments.length})`}
        </button>

        {showComments && (
          <div>
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder="コメントを書く..."
                rows={2}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                コメント送信
              </button>
            </form>

            <div className="space-y-2">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-800">{comment.comment_text}</p>
                  <p className="text-xs text-gray-500 mt-1">
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