import type { Service, Faq, Promotion, Unclassified } from '../pages/KnowledgeBase'

export interface ParsedCSV {
  services: Service[]
  faqs: Faq[]
  promotions: Promotion[]
  unclassified: Unclassified[]
}

export const parseCSV = (text: string): ParsedCSV => {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())

  const services: Service[] = []
  const faqs: Faq[] = []
  const promotions: Promotion[] = []
  const unclassified: Unclassified[] = []

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue

    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => row[h] = values[idx] || '')

    const category = row.category?.toLowerCase()

    if (category === 'faqs') {
      faqs.push({
        question: row.name || row.question || '',
        answer: row.description || row.answer || ''
      })
    } else if (category === 'promotions') {
      promotions.push({
        description: row.name || row.description || ''
      })
    } else if (row.name) {
      services.push({
        name: row.name || '',
        category: row.category || '',
        price: row.price || '',
        duration: row.duration || '',
        description: row.description || '',
        confidence: 'high'
      })
    } else {
      unclassified.push({ text: lines[i] })
    }
  }

  return { services, faqs, promotions, unclassified }
}