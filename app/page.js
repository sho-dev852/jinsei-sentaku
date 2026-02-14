export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg-abyss, #080b14)' }}
    >
      <div className="text-center px-6">
        <h1
          className="text-3xl md:text-4xl font-black tracking-tight mb-4"
          style={{ color: '#e2e8f0' }}
        >
          Life<span style={{ color: '#22d3ee' }}> Judge</span>
        </h1>
        <div
          className="w-16 h-px mx-auto mb-6"
          style={{ background: 'linear-gradient(to right, #22d3ee, #a855f7)' }}
        />
        <p className="text-lg mb-2" style={{ color: '#8892a4' }}>
          準備中
        </p>
        <p className="text-sm" style={{ color: '#4a5568' }}>
          まもなく公開します
        </p>
      </div>
    </div>
  )
}
