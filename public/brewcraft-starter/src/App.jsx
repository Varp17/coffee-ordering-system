import { useState, useEffect, useRef } from 'react'
import Hero from './components/Hero'
import Builder from './pages/Builder'

export default function App() {
  const [page, setPage] = useState('hero')
  const builderRef = useRef(null)

  function goToBuilder() {
    setPage('builder')
  }

  useEffect(() => {
    if (page === 'builder' && builderRef.current) {
      builderRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [page])

  return (
    <div style={{ minHeight: '100vh' }}>
      {page === 'hero' && <Hero onStart={goToBuilder} />}
      {page === 'builder' && (
        <div ref={builderRef} style={{ animation: 'fadeIn 0.5s ease' }}>
          <Builder />
        </div>
      )}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
