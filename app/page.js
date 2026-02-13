'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import PostForm from '@/components/PostForm'
import PostCard from '@/components/PostCard'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadPosts = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setPosts(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">人生の選択 投票サイト</h1>
          <p className="text-blue-100 mt-2">匿名で選択を投稿し、みんなの意見を聞こう</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <PostForm onPostCreated={loadPosts} />

        <h2 className="text-2xl font-bold mb-4">みんなの選択</h2>

        {isLoading ? (
          <p className="text-center text-gray-500">読み込み中...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">まだ投稿がありません</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onVoted={loadPosts} />
          ))
        )}
      </main>
    </div>
  )
}