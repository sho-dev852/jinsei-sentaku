'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import PostForm from '@/components/PostForm'
import PostCard from '@/components/PostCard'
import HeroCard from '@/components/HeroCard'

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

  // Find the most debated post (highest total votes)
  const heroPost = useMemo(() => {
    if (posts.length === 0) return null
    return posts.reduce((best, post) => {
      const totalA = best.vote_yes + best.vote_maybe + best.vote_no
      const totalB = post.vote_yes + post.vote_maybe + post.vote_no
      return totalB > totalA ? post : best
    }, posts[0])
  }, [posts])

  // Remaining posts (exclude hero)
  const listPosts = useMemo(() => {
    if (!heroPost) return posts
    return posts.filter((p) => p.id !== heroPost.id)
  }, [posts, heroPost])

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg-abyss)' }}>
      {/* Header */}
      <header className="relative z-10 pt-10 pb-2">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Logo / Brand */}
          <div className="text-center mb-2">
            <h1
              className="text-3xl md:text-4xl font-black tracking-tight text-glow-cyan"
              style={{ color: 'var(--text-primary)' }}
            >
              Life
              <span style={{ color: 'var(--neon-cyan)' }}> Judge</span>
            </h1>
            <p
              className="mt-2 text-sm tracking-wide"
              style={{ color: 'var(--text-muted)' }}
            >
              あの選択、世間的にはどうなの？
            </p>
          </div>

          {/* Divider */}
          <div
            className="mt-6 h-px"
            style={{
              background:
                'linear-gradient(to right, transparent, rgba(34,211,238,0.15), rgba(168,85,247,0.15), transparent)',
            }}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        {/* Post form */}
        <PostForm onPostCreated={loadPosts} />

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-20">
            <div
              className="inline-block w-6 h-6 rounded-full animate-shimmer"
              style={{
                border: '2px solid var(--glass-border)',
                borderTopColor: 'var(--neon-cyan)',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              読み込み中...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
              まだ誰も告白していない
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              最初の告白者になれ。
            </p>
          </div>
        )}

        {/* Hero section - most debated post */}
        {!isLoading && heroPost && (
          <HeroCard post={heroPost} onVoted={loadPosts} />
        )}

        {/* Post list */}
        {!isLoading && listPosts.length > 0 && (
          <section>
            {/* Section label */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-1.5 h-6 rounded-full"
                style={{
                  backgroundColor: 'var(--neon-purple)',
                  boxShadow: '0 0 8px rgba(168,85,247,0.4)',
                }}
              />
              <h2
                className="text-sm font-medium tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                All Confessions
              </h2>
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    'linear-gradient(to right, rgba(168,85,247,0.15), transparent)',
                }}
              />
            </div>

            {/* Cards */}
            {listPosts.map((post, i) => (
              <PostCard key={post.id} post={post} onVoted={loadPosts} index={i} />
            ))}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center">
        <div
          className="h-px max-w-3xl mx-auto mb-6"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent)',
          }}
        />
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Life Judge — 深夜の告解室
        </p>
      </footer>
    </div>
  )
}
