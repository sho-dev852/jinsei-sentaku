'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function VoteButtons({ postId, onVoted }) {
  const [hasVoted, setHasVoted] = useState(false)
  const [isVoting, setIsVoting] = useState(false)

  // ページ読み込み時に投票済みかチェック
  useEffect(() => {
    const voted = localStorage.getItem(`voted_${postId}`)
    if (voted) {
      setHasVoted(true)
    }
  }, [postId])

  const handleVote = async (voteType) => {
    if (hasVoted || isVoting) return

    setIsVoting(true)

    // 投票を記録
    const { error: voteError } = await supabase
      .from('votes')
      .insert([
        {
          post_id: postId,
          vote_type: voteType,
          voter_ip: 'anonymous'
        }
      ])

    if (voteError) {
      alert('投票に失敗しました')
      setIsVoting(false)
      return
    }

    // 投票数を更新
    const columnName = voteType === 'yes' ? 'vote_yes' 
                     : voteType === 'maybe' ? 'vote_maybe' 
                     : 'vote_no'

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

    // localStorageに投票済みを記録
    localStorage.setItem(`voted_${postId}`, voteType)

    setHasVoted(true)
    setIsVoting(false)
    if (onVoted) onVoted()
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleVote('yes')}
        disabled={hasVoted || isVoting}
        className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg"
      >
        👍 アリ
      </button>
      <button
        onClick={() => handleVote('maybe')}
        disabled={hasVoted || isVoting}
        className="flex-1 bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg"
      >
        🤔 怖い
      </button>
      <button
        onClick={() => handleVote('no')}
        disabled={hasVoted || isVoting}
        className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg"
      >
        👎 ナシ
      </button>
    </div>
  )
}