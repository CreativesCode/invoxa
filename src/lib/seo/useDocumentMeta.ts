import { useEffect } from 'react'

type DocumentMeta = {
  title: string
  description?: string
  canonical?: string
  noindex?: boolean
}

const DEFAULT_TITLE = 'Invoxa — Facturación inteligente para equipos creativos'
const TITLE_SUFFIX = ' · Invoxa'

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useDocumentMeta({ title, description, canonical, noindex }: DocumentMeta) {
  useEffect(() => {
    const fullTitle =
      title === DEFAULT_TITLE || title.endsWith(TITLE_SUFFIX) ? title : `${title}${TITLE_SUFFIX}`
    document.title = fullTitle
    setMeta('og:title', fullTitle, 'property')
    setMeta('twitter:title', fullTitle)

    if (description) {
      setMeta('description', description)
      setMeta('og:description', description, 'property')
      setMeta('twitter:description', description)
    }

    if (canonical) setLink('canonical', canonical)

    if (noindex) {
      setMeta('robots', 'noindex, nofollow')
    } else {
      setMeta(
        'robots',
        'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      )
    }
  }, [title, description, canonical, noindex])
}
