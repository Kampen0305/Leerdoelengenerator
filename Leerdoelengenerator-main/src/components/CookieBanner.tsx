import { useEffect, useState } from 'react'

const KEY = 'cookie-consent-v1'

export default function CookieBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(KEY)
    if (!saved) setOpen(true)
  }, [])

  const grant = () => {
    localStorage.setItem(KEY, 'granted')
    ;(window as any).gtag?.('consent', 'update', {
      analytics_storage: 'granted',
      functionality_storage: 'granted',
    })

    // Eerste page_view direct na akkoord
    const id = import.meta.env.VITE_GA_ID as string | undefined
    const isProd = import.meta.env.PROD

    if (isProd && id) {
      ;(window as any).gtag?.('event', 'page_view', {
        page_location: window.location.href,
        page_title: document.title,
      })
    }

    setOpen(false)
  }

  const deny = () => {
    localStorage.setItem(KEY, 'denied')
    setOpen(false)
  }

  if (!open) return null

  return (
    <div style={{
      position:'fixed', left:0, right:0, bottom:0, zIndex:9999,
      padding:'12px 16px', background:'#111', color:'#fff',
      display:'flex', gap:12, alignItems:'center', flexWrap:'wrap'
    }}>
      <span>
        We gebruiken analytische cookies om bezoek te meten. Akkoord?
        <a href="/privacy" style={{marginLeft:8, color:'#9cf', textDecoration:'underline'}}>
          Privacyverklaring
        </a>
      </span>
      <div style={{marginLeft:'auto', display:'flex', gap:8}}>
        <button onClick={deny}>Weigeren</button>
        <button onClick={grant}>Akkoord</button>
      </div>
    </div>
  )
}
