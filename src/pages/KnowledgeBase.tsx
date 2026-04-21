import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFetch } from '../utils/api'
import  { parseCSV } from '../utils/parseCSV'
import Spinner from '../components/Spinner'


// ── Types ──────────────────────────────────────────────────────────────
export interface Service {
  id?: number
  name: string
  category: string
  price: string
  duration: string
  description: string
  confidence?: 'high' | 'low'
  isNew?: boolean
}

export interface Faq {
  id?: number
  question: string
  answer: string
  isNew?: boolean
}

export interface Promotion {
  id?: number
  description: string
  active?: boolean
  isNew?: boolean
}

export interface Unclassified {
  text: string
}

type Mode = 'manual' | 'import'
type ImportType = 'text' | 'file' | 'website'

// ── Shared styles ──────────────────────────────────────────────────────
const inputCls = 'w-full bg-[#F0EDE6] border border-[#CCC9C0] rounded px-2 py-[5px] text-[11px] font-sans text-[#1A1A18] outline-none'
const warnCls = 'w-full bg-[#FAEEDA] border border-[#BA7517] rounded px-2 py-[5px] text-[11px] font-sans text-[#854F0B] outline-none placeholder-[#BA7517]'
const secLblCls = 'font-mono text-[9px] text-[#5C5C58] tracking-[1.5px]'
const addRowCls = 'font-mono text-[9px] text-[#4A7C59] border border-[#4A7C59] bg-transparent px-[10px] py-[3px] rounded cursor-pointer hover:bg-[#4A7C59] hover:text-[#F0EDE6] transition-colors'
const delCls = 'font-mono text-[10px] text-[#B85C38] border-none bg-transparent cursor-pointer w-5 h-5 flex items-center justify-center flex-shrink-0 hover:text-[#8B3A1E]'
const checkCls = 'text-[#4A7C59] text-[10px] mr-1 flex-shrink-0'
const divider = 'h-[0.5px] bg-[#EAE7E0] my-[14px]'

const KnowledgeBase = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('import')
  const [importType, setImportType] = useState<ImportType>('text')
  const [fileName, setFileName] = useState('')

  // ── Manual state ──
  const [services, setServices] = useState<Service[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [showSvcForm, setShowSvcForm] = useState(false)
  const [showFaqForm, setShowFaqForm] = useState(false)
  const [showPromoForm, setShowPromoForm] = useState(false)
  const [newSvc, setNewSvc] = useState({ name: '', category: '', price: '', duration: '', description: '' })
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })
  const [newPromo, setNewPromo] = useState({ description: '' })
  const [generating, setGenerating] = useState(false)
  const [generateMsg, setGenerateMsg] = useState('')

  const [customInstructions, setCustomInstructions] = useState('')
  const [savingInstructions, setSavingInstructions] = useState(false)
  const [savedInstructions, setSavedInstructions] = useState(false)
  const [editingInstructions, setEditingInstructions] = useState(false)

  const [editingSvc, setEditingSvc] = useState<number | null>(null)
  const [editingFaq, setEditingFaq] = useState<number | null>(null)
  const [editingPromo, setEditingPromo] = useState<number | null>(null)
  const [editSvcData, setEditSvcData] = useState<Service | null>(null)
  const [editFaqData, setEditFaqData] = useState<Faq | null>(null)
  const [editPromoData, setEditPromoData] = useState<Promotion | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'services' | 'faqs' | 'promotions' } | null>(null)

//SCRAPING

const [websiteUrl, setWebsiteUrl] = useState('')
const [scraping, setScraping] = useState(false)
const [scrapeError, setScrapeError] = useState('')
const [pagesCount, setPagesCount] = useState(0)

const scrapeWebsite = async () => {
  if (!websiteUrl.trim()) return
  setScraping(true)
  setScrapeError('')
  setRawText('')
  try {
    const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/agent/scrape-website`, {
      method: 'POST',
      body: JSON.stringify({ url: websiteUrl }),
    })
    if (res.ok) {
      const data = await res.json()
      setRawText(data.text)
      setPagesCount(data.pagesCount)
    } else {
      setScrapeError('Failed to import from website. Check the URL and try again.')
    }
  } catch {
    setScrapeError('Something went wrong. Please try again.')
  }
  setScraping(false)
}

  const saveCustomInstructions = async () => {
  setSavingInstructions(true)
  try {
    const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/agent/custom-instructions`, {
      method: 'PATCH',
      body: JSON.stringify({ customInstructions }),
    })
    if (res.ok) {
      setSavedInstructions(true)
      setEditingInstructions(false)
      setTimeout(() => setSavedInstructions(false), 3000)
    }
  } catch (err) {
    console.error('Failed to save custom instructions', err)
  }
  setSavingInstructions(false)
}
  
const deleteCustomInstructions = async () => {
  try {
    await authFetch(`${import.meta.env.VITE_API_URL}/api/agent/custom-instructions`, {
      method: 'PATCH',
      body: JSON.stringify({ customInstructions: '' }),
    })
    setCustomInstructions('')
    setEditingInstructions(false)
  } catch (err) {
    console.error('Failed to delete custom instructions', err)
  }
}

  // ── Import state ──
  const [rawText, setRawText] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [extracted, setExtracted] = useState<{
    services: Service[]
    faqs: Faq[]
    promotions: Promotion[]
    unclassified: Unclassified[]
  } | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [extractError, setExtractError] = useState('')


  const fetchAll = async () => {
    try {
      const [sRes, fRes, pRes, agentRes] = await Promise.all([
        authFetch(`${import.meta.env.VITE_API_URL}/api/services`),
        authFetch(`${import.meta.env.VITE_API_URL}/api/faqs`),
        authFetch(`${import.meta.env.VITE_API_URL}/api/promotions`),
        authFetch(`${import.meta.env.VITE_API_URL}/api/agent`),
      ])
      if (sRes.ok) setServices(await sRes.json())
      if (fRes.ok) setFaqs(await fRes.json())
      if (pRes.ok) setPromotions(await pRes.json())
      if (agentRes.ok) {
        const agentData = await agentRes.json()
        setCustomInstructions(agentData.custom_instructions || '')
      }
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    const load = async () => { await fetchAll() }
    load()
  }, [])

  // ── Manual CRUD ──
  const addService = async () => {
    if (!newSvc.name) return
    const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/services`, { method: 'POST', body: JSON.stringify(newSvc) })
    if (res.ok) { const d = await res.json(); setServices(p => [...p, d]); setNewSvc({ name: '', category: '', price: '', duration: '', description: '' }); setShowSvcForm(false) }
  }
  const deleteService = async (id: number) => {
    await authFetch(`${import.meta.env.VITE_API_URL}/api/services/${id}`, { method: 'DELETE' })
    setServices(p => p.filter(s => s.id !== id))
  }
  const addFaq = async () => {
    if (!newFaq.question || !newFaq.answer) return
    const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/faqs`, { method: 'POST', body: JSON.stringify(newFaq) })
    if (res.ok) { const d = await res.json(); setFaqs(p => [...p, d]); setNewFaq({ question: '', answer: '' }); setShowFaqForm(false) }
  }
  const deleteFaq = async (id: number) => {
    await authFetch(`${import.meta.env.VITE_API_URL}/api/faqs/${id}`, { method: 'DELETE' })
    setFaqs(p => p.filter(f => f.id !== id))
  }
  const addPromo = async () => {
    if (!newPromo.description) return
    const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/promotions`, { method: 'POST', body: JSON.stringify(newPromo) })
    if (res.ok) { const d = await res.json(); setPromotions(p => [...p, d]); setNewPromo({ description: '' }); setShowPromoForm(false) }
  }
  const togglePromo = async (id: number, active: boolean) => {
    await authFetch(`${import.meta.env.VITE_API_URL}/api/promotions/${id}`, { method: 'PATCH', body: JSON.stringify({ active: !active }) })
    setPromotions(p => p.map(x => x.id === id ? { ...x, active: !active } : x))
  }
  const deletePromo = async (id: number) => {
    await authFetch(`${import.meta.env.VITE_API_URL}/api/promotions/${id}`, { method: 'DELETE' })
    setPromotions(p => p.filter(x => x.id !== id))
  }

  const updateService = async (id: number) => {
    if (!editSvcData) return
    await authFetch(`${import.meta.env.VITE_API_URL}/api/services/${id}`, { method: 'PUT', body: JSON.stringify(editSvcData) })
    setServices(p => p.map(s => s.id === id ? { ...editSvcData, id } : s))
    setEditingSvc(null); setEditSvcData(null)
  }
  const updateFaq = async (id: number) => {
    if (!editFaqData) return
    await authFetch(`${import.meta.env.VITE_API_URL}/api/faqs/${id}`, { method: 'PUT', body: JSON.stringify(editFaqData) })
    setFaqs(p => p.map(f => f.id === id ? { ...editFaqData, id } : f))
    setEditingFaq(null); setEditFaqData(null)
  }
  const updatePromo = async (id: number) => {
    if (!editPromoData) return
    await authFetch(`${import.meta.env.VITE_API_URL}/api/promotions/${id}`, { method: 'PUT', body: JSON.stringify(editPromoData) })
    setPromotions(p => p.map(x => x.id === id ? { ...editPromoData, id } : x))
    setEditingPromo(null); setEditPromoData(null)
  }
  const deleteAll = async (type: 'services' | 'faqs' | 'promotions') => {
    if (type === 'services') {
      await Promise.all(services.map(s => authFetch(`${import.meta.env.VITE_API_URL}/api/services/${s.id}`, { method: 'DELETE' })))
      setServices([])
    } else if (type === 'faqs') {
      await Promise.all(faqs.map(f => authFetch(`${import.meta.env.VITE_API_URL}/api/faqs/${f.id}`, { method: 'DELETE' })))
      setFaqs([])
    } else {
      await Promise.all(promotions.map(p => authFetch(`${import.meta.env.VITE_API_URL}/api/promotions/${p.id}`, { method: 'DELETE' })))
      setPromotions([])
    }
    setConfirmDelete(null)
  }

  const generatePrompt = async () => {
  setGenerating(true); setGenerateMsg('')
  const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/agent/generate-prompt`, { method: 'POST', body: JSON.stringify({}) })
  setGenerateMsg(res.ok ? 'Agent updated! Your agent now knows all your services.' : 'Something went wrong.')
  setGenerating(false)
}

  // ── File upload ──
  const handleFileUpload = async (file: File) => {
    setFileName(file.name)

    if (file.name.endsWith('.csv')) {
  const text = await file.text()
  const parsed = parseCSV(text)
  setExtracted(parsed)
  return
}

    if (file.name.endsWith('.pdf')) {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1]
        try {
          const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/agent/extract-pdf-text`, {
            method: 'POST',
            body: JSON.stringify({ base64 }),
          })
          if (res.ok) {
            const data = await res.json()
            setRawText(data.text)
          }
        } catch (err) {
          console.error('PDF extraction failed:', err)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // ── AI Import ──
 const extract = async () => {
  if (!rawText.trim()) return
  setExtracting(true)
  setExtracted(null)
  setExtractError('')
  try {
    const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/agent/extract-knowledge`, {
      method: 'POST',
      body: JSON.stringify({ rawText }),
    })
    if (res.ok) {
      const data = await res.json()
      setExtracted({
        services: data.services || [],
        faqs: data.faqs || [],
        promotions: data.promotions || [],
        unclassified: data.unclassified || [],
      })
    } else {
      setExtractError('Extraction failed. Please try again.')
    }
  } catch (err) {
    setExtractError('Something went wrong. Please try again.')
  }
  setExtracting(false)
}

  const updateExtractedService = (i: number, field: string, value: string) => {
    if (!extracted) return
    const updated = [...extracted.services]
    updated[i] = { ...updated[i], [field]: value }
    setExtracted({ ...extracted, services: updated })
  }
  const removeExtractedService = (i: number) => {
    if (!extracted) return
    setExtracted({ ...extracted, services: extracted.services.filter((_, idx) => idx !== i) })
  }
  const addExtractedServiceRow = () => {
    if (!extracted) return
    setExtracted({ ...extracted, services: [...extracted.services, { name: '', category: '', price: '', duration: '', description: '', confidence: 'high', isNew: true }] })
  }
  const updateExtractedFaq = (i: number, field: string, value: string) => {
    if (!extracted) return
    const updated = [...extracted.faqs]
    updated[i] = { ...updated[i], [field]: value }
    setExtracted({ ...extracted, faqs: updated })
  }
  const removeExtractedFaq = (i: number) => {
    if (!extracted) return
    setExtracted({ ...extracted, faqs: extracted.faqs.filter((_, idx) => idx !== i) })
  }
  const addExtractedFaqRow = () => {
    if (!extracted) return
    setExtracted({ ...extracted, faqs: [...extracted.faqs, { question: '', answer: '', isNew: true }] })
  }
  const updateExtractedPromo = (i: number, value: string) => {
    if (!extracted) return
    const updated = [...extracted.promotions]
    updated[i] = { ...updated[i], description: value }
    setExtracted({ ...extracted, promotions: updated })
  }
  const removeExtractedPromo = (i: number) => {
    if (!extracted) return
    setExtracted({ ...extracted, promotions: extracted.promotions.filter((_, idx) => idx !== i) })
  }
  const addExtractedPromoRow = () => {
    if (!extracted) return
    setExtracted({ ...extracted, promotions: [...extracted.promotions, { description: '', isNew: true }] })
  }
  const removeUnclassified = (i: number) => {
    if (!extracted) return
    setExtracted({ ...extracted, unclassified: extracted.unclassified.filter((_, idx) => idx !== i) })
  }
  const promoteUnclassified = (i: number, to: 'service' | 'promo') => {
    if (!extracted) return
    const item = extracted.unclassified[i]
    if (to === 'service') {
      setExtracted({
        ...extracted,
        services: [...extracted.services, { name: item.text, category: '', price: '', duration: '', description: '', confidence: 'low', isNew: true }],
        unclassified: extracted.unclassified.filter((_, idx) => idx !== i)
      })
    } else {
      setExtracted({
        ...extracted,
        promotions: [...extracted.promotions, { description: item.text, isNew: true }],
        unclassified: extracted.unclassified.filter((_, idx) => idx !== i)
      })
    }
  }

  const saveAll = async () => {
    if (!extracted) return
    setSaving(true); setSaveMsg('')
    try {

      await Promise.all([
        ...extracted.services.filter(s => s.name).map(s =>
          authFetch(`${import.meta.env.VITE_API_URL}/api/services`, { method: 'POST', body: JSON.stringify(s) })
        ),
        ...extracted.faqs.filter(f => f.question && f.answer).map(f =>
          authFetch(`${import.meta.env.VITE_API_URL}/api/faqs`, { method: 'POST', body: JSON.stringify(f) })
        ),
        ...extracted.promotions.filter(p => p.description).map(p =>
          authFetch(`${import.meta.env.VITE_API_URL}/api/promotions`, { method: 'POST', body: JSON.stringify(p) })
        ),
      ])
      setSaveMsg('All saved! Click "Generate Agent Prompt" to update your agent.')
      setExtracted(null)
      setRawText('')
      setFileName('')
      setWebsiteUrl('')
      fetchAll()
    } catch (err) {
          console.error('saveAll error:', err)

      setSaveMsg('Something went wrong. Please try again.')
    }
    setSaving(false)
  }

  // ── Render helpers ──
  const renderSectionHead = (label: string, onAdd: () => void) => (
    <div className="flex justify-between items-center mb-2">
      <span className={secLblCls}>{label}</span>
      <button className={addRowCls} onClick={onAdd}>+ ADD ROW</button>
    </div>
  )

  const renderSvcHead = () => (
    <div className="grid gap-[6px] pb-[6px] mb-1" style={{ gridTemplateColumns: '20px 2fr 1fr 1fr 1fr 20px', borderBottom: '0.5px solid #EAE7E0' }}>
      {['', 'NAME', 'CATEGORY', 'PRICE', 'DURATION', ''].map((h, i) => (
        <span key={i} className="font-mono text-[9px] text-[#999] tracking-[1px]">{h}</span>
      ))}
    </div>
  )

  const closeEditingRows = () => {
    setEditingSvc(null); setEditSvcData(null)
    setEditingFaq(null); setEditFaqData(null)
    setEditingPromo(null); setEditPromoData(null)
  }

  return (
    <>
    {/* Confirm Delete Modal — outside the scroll container so position:fixed works correctly */}
    {confirmDelete && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(26,26,24,0.55)' }}>
        <div className="bg-[#FAF8F3] rounded-[14px] p-6 w-[340px]" style={{ border: '0.5px solid #CCC9C0' }}>
          <div className="font-condensed text-[18px] font-bold text-[#1A1A18] uppercase mb-2">Delete All {confirmDelete.type}?</div>
          <div className="text-[12px] text-[#5C5C58] mb-5">This will permanently delete all {confirmDelete.type} from your knowledge base. This cannot be undone.</div>
          <div className="flex gap-2">
            <button onClick={() => deleteAll(confirmDelete.type)} className="font-mono text-[10px] text-[#F0EDE6] px-4 py-2 rounded-lg flex-1 hover:brightness-90 transition-all" style={{ background: '#B85C38' }}>DELETE ALL</button>
            <button onClick={() => setConfirmDelete(null)} className="font-mono text-[10px] text-[#999] border border-[#CCC9C0] px-4 py-2 rounded-lg flex-1 hover:bg-[#EAE7E0] transition-colors">CANCEL</button>
          </div>
        </div>
      </div>
    )}
    <div className="bg-[#F0EDE6] p-6 overflow-y-auto h-full" onClick={closeEditingRows}>

      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button onClick={() => navigate('/')} className="font-mono text-[10px] text-[#999] tracking-wide hover:text-[#1A1A18] transition-colors mb-3 block">
            ← BACK TO DASHBOARD
          </button>
          <h1 className="font-condensed text-[28px] font-bold text-[#1A1A18] uppercase">Knowledge Base</h1>
          <div className="font-mono text-[9px] text-[#999] tracking-[1.5px] mt-1">SERVICES · FAQS · PROMOTIONS — POWERS YOUR AGENT'S RESPONSES</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button onClick={generatePrompt} disabled={generating || !!extracted || extracting} className="flex items-center gap-2 font-mono text-[10px] text-[#F0EDE6] px-4 py-2 rounded-full tracking-[1px] transition-colors hover:brightness-90" style={{ background: generating ? '#6A9C79' : '#4A7C59', opacity: extracted || extracting ? 0.4 : 1 }}>
            {generating && <Spinner />}
            {generating ? 'GENERATING...' : 'GENERATE AGENT PROMPT →'}
          </button>
          {generateMsg && <div className="font-mono text-[9px] text-[#4A7C59] tracking-wide max-w-[280px] text-right">{generateMsg}</div>}
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex mb-6 rounded-lg overflow-hidden w-fit" style={{ border: '0.5px solid #CCC9C0' }}>
        {(['manual', 'import'] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`font-mono text-[10px] px-[18px] py-[9px] border-none cursor-pointer tracking-[1px] transition-all ${mode === m ? 'bg-[#1A1A18] text-[#F0EDE6]' : 'bg-[#FAF8F3] text-[#999] hover:bg-[#EAE7E0] hover:text-[#1A1A18]'}`}>
            {m === 'manual' ? 'MANUAL INPUT' : 'SMART IMPORT'}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* MANUAL MODE */}
      {/* ══════════════════════════════════════════ */}
      {mode === 'manual' && (
        <>
          {/* Services */}
          <div className="bg-[#FAF8F3] rounded-[14px] mb-4 overflow-hidden" style={{ border: '0.5px solid #CCC9C0' }}>
            <div className="flex items-center justify-between px-[18px] py-[14px]" style={{ borderBottom: '0.5px solid #CCC9C0' }}>
              <span className="font-mono text-[10px] text-[#1A1A18] tracking-[1.5px]">SERVICES & PRICING</span>
              <div className="flex gap-2">
                {services.length > 0 && <button onClick={() => setConfirmDelete({ type: 'services' })} className="font-mono text-[9px] text-[#B85C38] border border-[#B85C38] bg-transparent px-[10px] py-[3px] rounded cursor-pointer hover:bg-[#B85C38] hover:text-[#F0EDE6] transition-colors">DELETE ALL</button>}
                <button onClick={() => setShowSvcForm(v => !v)} className={addRowCls}>{showSvcForm ? 'CANCEL' : '+ ADD SERVICE'}</button>
              </div>
            </div>
            {showSvcForm && (
              <div className="px-[18px] py-4 grid grid-cols-3 gap-3" style={{ borderBottom: '0.5px solid #EAE7E0' }}>
                <input value={newSvc.name} onChange={e => setNewSvc({ ...newSvc, name: e.target.value })} placeholder="Service name" className={inputCls} />
                <input value={newSvc.category} onChange={e => setNewSvc({ ...newSvc, category: e.target.value })} placeholder="Category" className={inputCls} />
                <input value={newSvc.price} onChange={e => setNewSvc({ ...newSvc, price: e.target.value })} placeholder="Price" className={inputCls} />
                <input value={newSvc.duration} onChange={e => setNewSvc({ ...newSvc, duration: e.target.value })} placeholder="Duration" className={inputCls} />
                <input value={newSvc.description} onChange={e => setNewSvc({ ...newSvc, description: e.target.value })} placeholder="Description (optional)" className={`${inputCls} col-span-2`} />
                <button onClick={addService} className="col-span-2 py-2 font-mono text-[10px] text-[#F0EDE6] rounded-lg hover:brightness-90 transition-all" style={{ background: '#1A1A18' }}>ADD SERVICE</button>
              </div>
            )}
            {services.length === 0 ? (
              <div className="font-mono text-[10px] text-[#CCC9C0] text-center py-6 tracking-[1px]">NO SERVICES ADDED YET</div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr>{['NAME', 'CATEGORY', 'PRICE', 'DURATION', ''].map(h => <th key={h} className="font-mono text-[9px] text-[#999] tracking-[1px] px-[18px] py-[10px] text-left" style={{ borderBottom: '0.5px solid #EAE7E0' }}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {services.map(s => editingSvc === s.id && editSvcData ? (
                    <tr key={s.id} style={{ background: '#F0EDE6' }} onClick={e => e.stopPropagation()}>
                      <td className="px-[18px] py-[8px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}><input value={editSvcData.name} onChange={e => setEditSvcData({ ...editSvcData, name: e.target.value })} className={inputCls} autoFocus /></td>
                      <td className="px-[18px] py-[8px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}><input value={editSvcData.category} onChange={e => setEditSvcData({ ...editSvcData, category: e.target.value })} className={inputCls} /></td>
                      <td className="px-[18px] py-[8px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}><input value={editSvcData.price} onChange={e => setEditSvcData({ ...editSvcData, price: e.target.value })} className={inputCls} /></td>
                      <td className="px-[18px] py-[8px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}><input value={editSvcData.duration} onChange={e => setEditSvcData({ ...editSvcData, duration: e.target.value })} onKeyDown={e => e.key === 'Enter' && updateService(s.id!)} className={inputCls} /></td>
                      <td className="px-[18px] py-[8px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}>
                        <div className="flex gap-1">
                          <button onClick={() => updateService(s.id!)} className="font-mono text-[9px] text-[#4A7C59] border border-[#4A7C59] px-2 py-[2px] rounded hover:bg-[#4A7C59] hover:text-[#F0EDE6] transition-colors">SAVE</button>
                          <button onClick={() => { setEditingSvc(null); setEditSvcData(null) }} className={delCls}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={s.id} className="hover:bg-[#F0EDE6] transition-colors cursor-pointer" onClick={e => { e.stopPropagation(); setEditingSvc(s.id!); setEditSvcData({ ...s }) }}>
                      <td className="text-[12px] text-[#1A1A18] px-[18px] py-[10px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}>{s.name}</td>
                      <td className="px-[18px] py-[10px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}><span className="font-mono text-[9px] bg-[#EAE7E0] text-[#5C5C58] px-2 py-[2px] rounded-[10px]">{s.category}</span></td>
                      <td className="text-[12px] text-[#1A1A18] px-[18px] py-[10px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}>{s.price || '—'}</td>
                      <td className="text-[12px] text-[#1A1A18] px-[18px] py-[10px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}>{s.duration || '—'}</td>
                      <td className="px-[18px] py-[10px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}><button onClick={e => { e.stopPropagation(); deleteService(s.id!) }} className={delCls}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* FAQs */}
          <div className="bg-[#FAF8F3] rounded-[14px] mb-4 overflow-hidden" style={{ border: '0.5px solid #CCC9C0' }}>
            <div className="flex items-center justify-between px-[18px] py-[14px]" style={{ borderBottom: '0.5px solid #CCC9C0' }}>
              <span className="font-mono text-[10px] text-[#1A1A18] tracking-[1.5px]">FREQUENTLY ASKED QUESTIONS</span>
              <div className="flex gap-2">
                {faqs.length > 0 && <button onClick={() => setConfirmDelete({ type: 'faqs' })} className="font-mono text-[9px] text-[#B85C38] border border-[#B85C38] bg-transparent px-[10px] py-[3px] rounded cursor-pointer hover:bg-[#B85C38] hover:text-[#F0EDE6] transition-colors">DELETE ALL</button>}
                <button onClick={() => setShowFaqForm(v => !v)} className={addRowCls}>{showFaqForm ? 'CANCEL' : '+ ADD FAQ'}</button>
              </div>
            </div>
            {showFaqForm && (
              <div className="px-[18px] py-4 flex flex-col gap-3" style={{ borderBottom: '0.5px solid #EAE7E0' }}>
                <input value={newFaq.question} onChange={e => setNewFaq({ ...newFaq, question: e.target.value })} placeholder="Question" className={inputCls} />
                <textarea value={newFaq.answer} onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })} placeholder="Answer" rows={2} className={`${inputCls} resize-none`} />
                <button onClick={addFaq} className="py-2 font-mono text-[10px] text-[#F0EDE6] rounded-lg hover:brightness-90 transition-all" style={{ background: '#1A1A18' }}>ADD FAQ</button>
              </div>
            )}
            {faqs.length === 0 ? (
              <div className="font-mono text-[10px] text-[#CCC9C0] text-center py-6 tracking-[1px]">NO FAQS ADDED YET</div>
            ) : (
              <table className="w-full border-collapse">
                <thead><tr>{['QUESTION', 'ANSWER', ''].map(h => <th key={h} className="font-mono text-[9px] text-[#999] tracking-[1px] px-[18px] py-[10px] text-left" style={{ borderBottom: '0.5px solid #EAE7E0' }}>{h}</th>)}</tr></thead>
                <tbody>
                  {faqs.map(f => editingFaq === f.id && editFaqData ? (
                    <tr key={f.id} style={{ background: '#F0EDE6' }} onClick={e => e.stopPropagation()}>
                      <td className="px-[18px] py-[8px] w-[35%]" style={{ borderBottom: '0.5px solid #EAE7E0' }}><input value={editFaqData.question} onChange={e => setEditFaqData({ ...editFaqData, question: e.target.value })} className={inputCls} autoFocus /></td>
                      <td className="px-[18px] py-[8px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}><textarea value={editFaqData.answer} onChange={e => setEditFaqData({ ...editFaqData, answer: e.target.value })} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); updateFaq(f.id!) } }} rows={2} className={`${inputCls} resize-none`} /></td>
                      <td className="px-[18px] py-[8px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}>
                        <div className="flex gap-1">
                          <button onClick={() => updateFaq(f.id!)} className="font-mono text-[9px] text-[#4A7C59] border border-[#4A7C59] px-2 py-[2px] rounded hover:bg-[#4A7C59] hover:text-[#F0EDE6] transition-colors">SAVE</button>
                          <button onClick={() => { setEditingFaq(null); setEditFaqData(null) }} className={delCls}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={f.id} className="hover:bg-[#F0EDE6] transition-colors cursor-pointer" onClick={e => { e.stopPropagation(); setEditingFaq(f.id!); setEditFaqData({ ...f }) }}>
                      <td className="text-[12px] text-[#1A1A18] px-[18px] py-[10px] w-[35%]" style={{ borderBottom: '0.5px solid #EAE7E0' }}>{f.question}</td>
                      <td className="text-[12px] text-[#5C5C58] px-[18px] py-[10px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}>{f.answer}</td>
                      <td className="px-[18px] py-[10px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}><button onClick={e => { e.stopPropagation(); deleteFaq(f.id!) }} className={delCls}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Promotions */}
          <div className="bg-[#FAF8F3] rounded-[14px] mb-4 overflow-hidden" style={{ border: '0.5px solid #CCC9C0' }}>
            <div className="flex items-center justify-between px-[18px] py-[14px]" style={{ borderBottom: '0.5px solid #CCC9C0' }}>
              <span className="font-mono text-[10px] text-[#1A1A18] tracking-[1.5px]">ACTIVE PROMOTIONS</span>
              <div className="flex gap-2">
                {promotions.length > 0 && <button onClick={() => setConfirmDelete({ type: 'promotions' })} className="font-mono text-[9px] text-[#B85C38] border border-[#B85C38] bg-transparent px-[10px] py-[3px] rounded cursor-pointer hover:bg-[#B85C38] hover:text-[#F0EDE6] transition-colors">DELETE ALL</button>}
                <button onClick={() => setShowPromoForm(v => !v)} className={addRowCls}>{showPromoForm ? 'CANCEL' : '+ ADD PROMOTION'}</button>
              </div>
            </div>
            {showPromoForm && (
              <div className="px-[18px] py-4 flex flex-col gap-3" style={{ borderBottom: '0.5px solid #EAE7E0' }}>
                <input value={newPromo.description} onChange={e => setNewPromo({ description: e.target.value })} placeholder="e.g. 20% off first laser for new clients" className={inputCls} />
                <button onClick={addPromo} className="py-2 font-mono text-[10px] text-[#F0EDE6] rounded-lg hover:brightness-90 transition-all" style={{ background: '#1A1A18' }}>ADD PROMOTION</button>
              </div>
            )}
            {promotions.length === 0 ? (
              <div className="font-mono text-[10px] text-[#CCC9C0] text-center py-6 tracking-[1px]">NO PROMOTIONS ADDED YET</div>
            ) : (
              <table className="w-full border-collapse">
                <thead><tr>{['DESCRIPTION', 'STATUS', ''].map(h => <th key={h} className="font-mono text-[9px] text-[#999] tracking-[1px] px-[18px] py-[10px] text-left" style={{ borderBottom: '0.5px solid #EAE7E0' }}>{h}</th>)}</tr></thead>
                <tbody>
                  {promotions.map(p => editingPromo === p.id && editPromoData ? (
                    <tr key={p.id} style={{ background: '#F0EDE6' }} onClick={e => e.stopPropagation()}>
                      <td className="px-[18px] py-[8px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}><input value={editPromoData.description} onChange={e => setEditPromoData({ ...editPromoData, description: e.target.value })} onKeyDown={e => e.key === 'Enter' && updatePromo(p.id!)} className={inputCls} autoFocus /></td>
                      <td className="px-[18px] py-[8px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}></td>
                      <td className="px-[18px] py-[8px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}>
                        <div className="flex gap-1">
                          <button onClick={() => updatePromo(p.id!)} className="font-mono text-[9px] text-[#4A7C59] border border-[#4A7C59] px-2 py-[2px] rounded hover:bg-[#4A7C59] hover:text-[#F0EDE6] transition-colors">SAVE</button>
                          <button onClick={() => { setEditingPromo(null); setEditPromoData(null) }} className={delCls}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={p.id} className="hover:bg-[#F0EDE6] transition-colors cursor-pointer" onClick={e => { e.stopPropagation(); setEditingPromo(p.id!); setEditPromoData({ ...p }) }}>
                      <td className="text-[12px] text-[#1A1A18] px-[18px] py-[10px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}>{p.description}</td>
                      <td className="px-[18px] py-[10px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}>
                        <button onClick={e => { e.stopPropagation(); togglePromo(p.id!, p.active!) }} className={`font-mono text-[9px] px-2 py-[2px] rounded-[10px] transition-colors ${p.active ? 'bg-[#E1F5EE] text-[#085041] hover:bg-[#C8EDD8]' : 'bg-[#EAE7E0] text-[#999] hover:bg-[#D8D4CB]'}`}>
                          {p.active ? 'ACTIVE' : 'PAUSED'}
                        </button>
                      </td>
                      <td className="px-[18px] py-[10px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}><button onClick={e => { e.stopPropagation(); deletePromo(p.id!) }} className={delCls}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Custom Instructions */}
<div className="bg-[#FAF8F3] rounded-[14px] mb-4 overflow-hidden" style={{ border: '0.5px solid #CCC9C0' }}>
  <div className="px-[18px] py-[14px] flex items-center justify-between" style={{ borderBottom: '0.5px solid #CCC9C0' }}>
    <div>
      <span className="font-mono text-[10px] text-[#1A1A18] tracking-[1.5px]">CUSTOM INSTRUCTIONS</span>
      <div className="font-mono text-[9px] text-[#999] mt-1">Special rules, policies, or notes for your agent</div>
    </div>
    {!editingInstructions && !customInstructions && (
      <button
        onClick={() => setEditingInstructions(true)}
        className={addRowCls}
      >
        + ADD
      </button>
    )}
  </div>

  <div className="px-[18px] py-4">
    {/* Empty state */}
    {!customInstructions && !editingInstructions && (
      <div className="font-mono text-[10px] text-[#CCC9C0] text-center py-4 tracking-[1px]">
        NO CUSTOM INSTRUCTIONS ADDED YET
      </div>
    )}

    {/* Saved state — read only */}
    {customInstructions && !editingInstructions && (
      <div>
        <div
          className="w-full bg-[#F0EDE6] rounded-[10px] px-4 py-3 text-[12px] font-sans text-[#1A1A18] leading-[1.6] whitespace-pre-wrap cursor-pointer"
          style={{ border: '0.5px solid #CCC9C0' }}
          onClick={() => setEditingInstructions(true)}
        >
          {customInstructions}
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setEditingInstructions(true)}
            className="font-mono text-[9px] text-[#4A7C59] border border-[#4A7C59] bg-transparent px-3 py-[5px] rounded cursor-pointer hover:bg-[#4A7C59] hover:text-[#F0EDE6] transition-colors"
          >
            EDIT
          </button>
          <button
            onClick={deleteCustomInstructions}
            className="font-mono text-[9px] text-[#B85C38] border border-[#B85C38] bg-transparent px-3 py-[5px] rounded cursor-pointer hover:bg-[#B85C38] hover:text-[#F0EDE6] transition-colors"
          >
            DELETE
          </button>
        </div>
      </div>
    )}

    {/* Edit state */}
    {editingInstructions && (
      <div>
        <textarea
          value={customInstructions}
          onChange={e => setCustomInstructions(e.target.value)}
          placeholder="e.g. Always mention our loyalty program. We don't accept walk-ins. Cherry financing available over $300."
          rows={4}
          autoFocus
          className="w-full bg-[#F0EDE6] rounded-[10px] px-4 py-3 text-[12px] font-sans text-[#1A1A18] outline-none resize-none leading-[1.6]"
          style={{ border: '0.5px solid #1A1A18' }}
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={saveCustomInstructions}
            disabled={savingInstructions}
            className="flex items-center gap-2 font-mono text-[10px] text-[#F0EDE6] px-4 py-2 rounded-lg tracking-[1px] transition-colors"
            style={{ background: savedInstructions ? '#4A7C59' : savingInstructions ? '#6A9C79' : '#1A1A18' }}
          >
            {savingInstructions && <Spinner />}
            {savingInstructions ? 'SAVING...' : savedInstructions ? 'SAVED ✓' : 'SAVE INSTRUCTIONS'}
          </button>
          <button
            onClick={() => setEditingInstructions(false)}
            className="font-mono text-[9px] text-[#999] border border-[#CCC9C0] bg-transparent px-4 py-2 rounded-lg cursor-pointer hover:bg-[#EAE7E0] transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    )}
  </div>
</div>
        </>
      )}

      {/* ══════════════════════════════════════════ */}
      {/* SMART IMPORT MODE */}
      {/* ══════════════════════════════════════════ */}
      {mode === 'import' && (
        <>
          <div className="bg-[#FAF8F3] rounded-[14px] mb-4 p-5" style={{ border: '0.5px solid #CCC9C0' }}>
            <div className="font-condensed text-[18px] font-bold text-[#1A1A18] uppercase mb-1">
              Import your services with AI
            </div>
            <div className="text-[12px] text-[#888780] mb-5">
              Paste anything — website text, message, menu, or notes.
            </div>

            {/* Import type selector */}
            <div className="grid grid-cols-3 gap-[10px] mb-5">
              {[
                { key: 'text', label: 'PASTE TEXT', sub: 'Menu, notes, WhatsApp message' },
                { key: 'file', label: 'UPLOAD FILE', sub: 'PDF or CSV — price list, brochure' },
                  { key: 'website', label: 'SCRAPE WEBSITE', sub: 'Paste a URL — we import data from your site' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => { setImportType(opt.key as ImportType); setRawText(''); setFileName(''); setWebsiteUrl(''); }}
                  className="rounded-[10px] p-[14px] flex flex-col gap-1 cursor-pointer transition-all text-left"
                  style={{
                    border: importType === opt.key ? '0.5px solid #1A1A18' : '0.5px solid #CCC9C0',
                    background: importType === opt.key ? '#1A1A18' : '#F0EDE6',
                  }}
                >
                  <span className={`font-mono text-[10px] tracking-[1px] ${importType === opt.key ? 'text-[#F0EDE6]' : 'text-[#1A1A18]'}`}>
                    {opt.label}
                  </span>
                  <span className={`text-[11px] ${importType === opt.key ? 'text-[#888]' : 'text-[#999]'}`}>
                    {opt.sub}
                  </span>
                </button>
              ))}
            </div>

            {/* Paste text */}
            {importType === 'text' && (
              <>
                <label className="font-mono text-[9px] text-[#5C5C58] tracking-[1.5px] block mb-2">
                  PASTE YOUR CONTENT
                </label>
                <textarea
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  rows={6}
                  placeholder={`Paste your price list or menu here...\n\nExample:\nBotox — $9/unit\nHydraFacial — $250 (60 min)\nLip Filler from $650\n\nNew clients: 20% off first laser!\nDo you offer financing? Yes, Cherry Pay.`}
                  className="w-full bg-[#F0EDE6] rounded-[10px] px-4 py-3 text-[12px] font-sans text-[#1A1A18] outline-none resize-none leading-[1.6]"
                  style={{ border: '0.5px solid #CCC9C0' }}
                />
                <div className="font-mono text-[9px] text-[#999] mt-2">
                  Any format works — Smart import will extract and structure it.
                </div>
              </>
            )}

            {/* Upload file */}
            {importType === 'file' && (
              <>
                <label className="font-mono text-[9px] text-[#5C5C58] tracking-[1.5px] block mb-2">
                  UPLOAD YOUR FILE
                </label>
                <div
                  className="bg-[#F0EDE6] rounded-[10px] p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors"
                  style={{ border: '1.5px dashed #CCC9C0' }}
                  onClick={() => document.getElementById('file-input')?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault()
                    const file = e.dataTransfer.files[0]
                    if (file) handleFileUpload(file)
                  }}
                >
                  <span className="font-mono text-[10px] text-[#1A1A18] tracking-[1px]">
                    {fileName || 'DROP FILE HERE'}
                  </span>
                  <span className="text-[11px] text-[#999]">PDF or CSV — max 10MB</span>
                  <button className="font-mono text-[9px] text-[#4A7C59] border border-[#4A7C59] bg-transparent px-[14px] py-[5px] rounded cursor-pointer mt-1 hover:bg-[#4A7C59] hover:text-[#F0EDE6] transition-colors">
                    BROWSE FILE
                  </button>
                </div>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.csv"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) handleFileUpload(f)
                  }}
                />
                <div className="font-mono text-[9px] text-[#999] mt-2">
                  Text will be extracted for processing.
                </div>
                {fileName && rawText && (
                  <div className="font-mono text-[9px] text-[#4A7C59] mt-2">
                    ✓ {fileName} — ready to extract
                  </div>
                )}
              </>
            )}

            {importType === 'website' && (
  <div>
    <label className="font-mono text-[9px] text-[#5C5C58] tracking-[1.5px] block mb-2">
      WEBSITE URL
    </label>
    <div className="flex gap-2">
      <input
        value={websiteUrl}
        onChange={e => setWebsiteUrl(e.target.value)}
        placeholder="https://yourbusiness.com"
        className="flex-1 bg-[#F0EDE6] rounded-[10px] px-4 py-3 text-[12px] font-sans text-[#1A1A18] outline-none"
        style={{ border: '0.5px solid #CCC9C0' }}
      />
      <button
        onClick={scrapeWebsite}
        disabled={scraping || !websiteUrl.trim()}
        className="flex items-center gap-2 font-mono text-[10px] text-[#F0EDE6] px-4 py-3 rounded-[10px] transition-all whitespace-nowrap hover:brightness-90"
        style={{ background: '#1A1A18', opacity: scraping || !websiteUrl.trim() ? 0.5 : 1 }}
      >
        {scraping && <Spinner />}
        {scraping ? 'IMPORTING...' : 'IMPORT SITE →'}
      </button>
    </div>
    <div className="font-mono text-[9px] text-[#999] mt-2">
      We will import data from up to 10 pages — services, pricing, about, FAQs.
    </div>
    {scrapeError && (
      <div className="font-mono text-[9px] text-[#B85C38] mt-2">{scrapeError}</div>
    )}
    {rawText && !scraping && (
      <div className="font-mono text-[9px] text-[#4A7C59] mt-2">
        ✓ WEBSITE IMPORTED — {pagesCount} pages extracted
      </div>
    )}
  </div>
)}

            {rawText.trim() && (
              <button
  onClick={extract}
  disabled={extracting || !rawText.trim()}
  className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] text-[#F0EDE6] px-5 py-[10px] rounded-lg tracking-[1px] transition-all hover:brightness-90"
  style={{ background: '#1A1A18', opacity: extracting || !rawText.trim() ? 0.5 : 1 }}
>
  {extracting && <Spinner />}
  {extracting ? 'EXTRACTING...' : 'EXTRACT WITH AI'}
  {!extracting && <span className="text-[9px] text-[#666]"></span>}
</button>
            )}
            {extractError && (
  <div className="font-mono text-[9px] text-[#B85C38] mt-2 tracking-wide">
    {extractError}
  </div>
)}

{extracted && !extracting && (
  <div className="font-mono text-[9px] text-[#4A7C59] mt-2 tracking-wide">
    ✓ EXTRACTION COMPLETE — review below before generating a prompt.
  </div>
)}
          </div>

          {/* Extracted preview */}
          {extracted && (
            <div className="bg-[#FAF8F3] rounded-[14px] p-5" style={{ border: '0.5px solid #4A7C59' }}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="font-mono text-[10px] text-[#4A7C59] tracking-[1.5px]">✓ EXTRACTED — EDIT ANYTHING, THEN SAVE</div>
                  <div className="text-[11px] text-[#888780] mt-1">Nothing is saved yet — review and confirm below</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={extract} className="font-mono text-[10px] text-[#999] border border-[#CCC9C0] bg-transparent px-4 py-[7px] rounded-full cursor-pointer hover:bg-[#EAE7E0] hover:text-[#1A1A18] transition-colors">RE-EXTRACT ↺</button>
                  <button onClick={() => { setExtracted(null); setRawText(''); setFileName(''); setWebsiteUrl('') }} className="font-mono text-[10px] text-[#B85C38] border border-[#B85C38] bg-transparent px-4 py-[7px] rounded-full cursor-pointer hover:bg-[#B85C38] hover:text-[#F0EDE6] transition-colors">CLEAR</button>
                  <button onClick={saveAll} disabled={saving} className="flex items-center gap-2 font-mono text-[10px] text-[#F0EDE6] px-4 py-[7px] rounded-full cursor-pointer hover:brightness-90 transition-all" style={{ background: saving ? '#6A9C79' : '#4A7C59' }}>
                    {saving && <Spinner />}
                    {saving ? 'SAVING...' : 'SAVE ALL →'}
                  </button>
                </div>
              </div>

              {saveMsg && <div className="font-mono text-[9px] text-[#4A7C59] mb-4 tracking-wide">{saveMsg}</div>}

              {/* Services */}
              {renderSectionHead('SERVICES', addExtractedServiceRow)}
              {renderSvcHead()}
              {extracted.services.map((s, i) => (
                <div key={i} className="grid gap-[6px] py-[5px]" style={{ gridTemplateColumns: '20px 2fr 1fr 1fr 1fr 20px', borderBottom: '0.5px solid #EAE7E0' }}>
                  <span className={checkCls}>{s.isNew ? '+' : '✓'}</span>
                  <input className={s.name ? inputCls : warnCls} value={s.name} onChange={e => updateExtractedService(i, 'name', e.target.value)} placeholder="service name..." />
                  <input className={s.category ? inputCls : warnCls} value={s.category} onChange={e => updateExtractedService(i, 'category', e.target.value)} placeholder="category..." />
                  <input className={s.price ? inputCls : warnCls} value={s.price} onChange={e => updateExtractedService(i, 'price', e.target.value)} placeholder="price..." />
                  <input className={s.duration ? inputCls : warnCls} value={s.duration} onChange={e => updateExtractedService(i, 'duration', e.target.value)} placeholder="duration..." />
                  <button className={delCls} onClick={() => removeExtractedService(i)}>✕</button>
                </div>
              ))}

              <div className={divider} />

              {/* Promotions */}
              {renderSectionHead('PROMOTIONS', addExtractedPromoRow)}
              {extracted.promotions.map((p, i) => (
                <div key={i} className="grid gap-[6px] py-[5px] items-center" style={{ gridTemplateColumns: '20px 1fr 20px', borderBottom: '0.5px solid #EAE7E0' }}>
                  <span className={checkCls}>{p.isNew ? '+' : '✓'}</span>
                  <input className={p.description ? inputCls : warnCls} value={p.description} onChange={e => updateExtractedPromo(i, e.target.value)} placeholder="promotion description..." />
                  <button className={delCls} onClick={() => removeExtractedPromo(i)}>✕</button>
                </div>
              ))}
              {extracted.promotions.length === 0 && (
                <div className="font-mono text-[10px] text-[#CCC9C0] py-3 tracking-[1px]">NO PROMOTIONS DETECTED</div>
              )}

              <div className={divider} />

              {/* FAQs */}
              {renderSectionHead('FAQS', addExtractedFaqRow)}
              <div className="grid gap-[6px] pb-[6px] mb-1" style={{ gridTemplateColumns: '20px 1fr 1fr 20px', borderBottom: '0.5px solid #EAE7E0' }}>
                {['', 'QUESTION', 'ANSWER', ''].map((h, i) => <span key={i} className="font-mono text-[9px] text-[#999] tracking-[1px]">{h}</span>)}
              </div>
              {extracted.faqs.map((f, i) => (
                <div key={i} className="grid gap-[6px] py-[5px] items-center" style={{ gridTemplateColumns: '20px 1fr 1fr 20px', borderBottom: '0.5px solid #EAE7E0' }}>
                  <span className={checkCls}>{f.isNew ? '+' : '✓'}</span>
                  <input className={f.question ? inputCls : warnCls} value={f.question} onChange={e => updateExtractedFaq(i, 'question', e.target.value)} placeholder="question..." />
                  <input className={f.answer ? inputCls : warnCls} value={f.answer} onChange={e => updateExtractedFaq(i, 'answer', e.target.value)} placeholder="answer..." />
                  <button className={delCls} onClick={() => removeExtractedFaq(i)}>✕</button>
                </div>
              ))}
              {extracted.faqs.length === 0 && (
                <div className="font-mono text-[10px] text-[#CCC9C0] py-3 tracking-[1px]">NO FAQS DETECTED</div>
              )}

              {/* Unclassified */}
              {extracted.unclassified.length > 0 && (
                <>
                  <div className={divider} />
                  <div className="font-mono text-[9px] text-[#BA7517] tracking-[1.5px] mb-2">⚠ UNCLASSIFIED — REVIEW MANUALLY</div>
                  <div className="bg-[#FAEEDA] rounded-[8px] p-3">
                    <div className="font-mono text-[9px] text-[#854F0B] tracking-[1px] mb-2">CLAUDE COULDN'T CLASSIFY THESE</div>
                    {extracted.unclassified.map((u, i) => (
                      <div key={i} className="grid gap-[8px] items-center py-[6px]" style={{ gridTemplateColumns: '1fr auto auto auto', borderBottom: i < extracted.unclassified.length - 1 ? '0.5px solid #F5C4B3' : 'none' }}>
                        <span className="text-[11px] text-[#854F0B] font-mono">"{u.text}"</span>
                        <button onClick={() => promoteUnclassified(i, 'service')} className="font-mono text-[9px] text-[#1A1A18] border border-[#1A1A18] bg-transparent px-2 py-1 rounded cursor-pointer whitespace-nowrap hover:bg-[#1A1A18] hover:text-[#F0EDE6] transition-colors">→ SERVICE</button>
                        <button onClick={() => promoteUnclassified(i, 'promo')} className="font-mono text-[9px] text-[#4A7C59] border border-[#4A7C59] bg-transparent px-2 py-1 rounded cursor-pointer whitespace-nowrap hover:bg-[#4A7C59] hover:text-[#F0EDE6] transition-colors">→ PROMO</button>
                        <button className={delCls} onClick={() => removeUnclassified(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

    </div>
    </>
  )
  
}

export default KnowledgeBase