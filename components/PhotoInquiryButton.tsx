'use client'

import { DragEvent, ClipboardEvent, useRef, useState } from 'react'
import { getSupabase } from '@/lib/supabase'

type Locale = 'zh' | 'en' | 'ru'

const isHoliday = (() => {
  try {
    const now = new Date()
    return now >= new Date('2026-10-01T00:00:00+08:00') && now < new Date('2026-10-04T00:00:00+08:00')
  } catch {
    return false
  }
})()

const CONTACT = {
  wechat: '15169121111',
  whatsapp: '8617661969056',
  telegram: 'deda_parts',
  email: '',
}

const T = {
  zh: {
    button: '询价',
    title: '配件询价',
    tabPhoto: '📷 拍照',
    tabText: '✍️ OE清单',
    subtitle: '拍一张配件照片,客服帮您查价并回复',
    pick: '点击拍照 / 选择图片',
    pickHint: '支持拖拽图片、Ctrl+V 粘贴截图',
    change: '更换照片',
    textPh: '每行一个 OE 号或型号,可从 Excel 直接粘贴\n例如:\nWG1664440201\nDASP2001\n豪沃T7H 驾驶室减震器 ×2',
    steps: ['拍照/截图上传', '留下联系方式', '客服查价回复'],
    stepsText: ['粘贴 OE 号清单', '留下联系方式', '客服查价回复'],
    noteLabel: '备注(选填)',
    notePh: '品名 / OE号 / 数量',
    contactLabel: '联系方式(必填)',
    contactPh: '手机号 / 微信 / WhatsApp / Telegram',
    privacy: '仅用于本次报价联系,不会公开',
    promise: '工作时间约 30 分钟内,具体报价发到您留的 WhatsApp / 微信 / 手机',
    submit: '提交询价',
    submitting: '提交中…',
    stageImg: '正在处理图片…',
    stageUp: '正在上传…',
    stageIns: '正在提交…',
    needPhoto: '请先选择一张配件照片',
    needText: '请先填写 OE 号或型号清单',
    needContact: '请留下联系方式，方便客服回复报价',
    xlDrop: '拖入 Excel/CSV 文件(≤5MB),或点击选择,自动按行填入',
    xlParsing: '正在解析文件…',
    xlBadType: '仅支持 .xlsx / .xls / .csv 文件',
    xlTooLarge: '文件太大(超过 5MB)',
    xlEmpty: '文件里没有识别到内容',
    xlParseFail: '文件解析失败,请另存为 .xlsx 后重试',
    xlImported: '已从文件导入 {n} 行 ✓',
    tooFast: '提交太频繁,请于 {time} 后再试',
    tooLarge: '图片太大(超过 20MB),请换一张',
    errSuffix: '。也可直接联系客服。',
    okTitle: '已收到您的询价',
    okUploaded: '图片',
    okContact: '联系',
    okNote: '内容',
    okReply: '工作时间约 30 分钟内回复您',
    holiday: '🎉 国庆节 10月1-3日放假，期间询价将于 10月4日 起陆续报价',
    okBtn: '好的',
    contactUs: '直接联系我们',
  },
  en: {
    button: 'Inquiry',
    title: 'Parts Inquiry',
    tabPhoto: '📷 Photo',
    tabText: '✍️ OE List',
    subtitle: 'Send a part photo, we will quote and reply',
    pick: 'Take photo / Choose image',
    pickHint: 'Drag & drop or Ctrl+V paste a screenshot',
    change: 'Change photo',
    textPh: 'One OE number per line — paste from Excel\nExample:\nWG1664440201\nDASP2001\nSinotruk cab shock absorber ×2',
    steps: ['Upload a photo/screenshot', 'Leave your contact', 'We quote & reply'],
    stepsText: ['Paste your OE list', 'Leave your contact', 'We quote & reply'],
    noteLabel: 'Note (optional)',
    notePh: 'Part name / OE number / quantity',
    contactLabel: 'Contact (required)',
    contactPh: 'Phone / WeChat / WhatsApp / Telegram',
    privacy: 'Used for this quote only, never shared',
    promise: 'Get your quote within ~30 min (business hours) via WhatsApp / WeChat / phone',
    submit: 'Send Inquiry',
    submitting: 'Sending…',
    stageImg: 'Processing image…',
    stageUp: 'Uploading…',
    stageIns: 'Sending…',
    needPhoto: 'Please choose a part photo first',
    needText: 'Please enter your OE list first',
    needContact: 'Please leave your contact so we can send the quote',
    xlDrop: 'Drop an Excel/CSV file (≤5MB) or click to choose — rows auto-fill',
    xlParsing: 'Parsing file…',
    xlBadType: 'Only .xlsx / .xls / .csv files are supported',
    xlTooLarge: 'File too large (over 5MB)',
    xlEmpty: 'No content found in the file',
    xlParseFail: 'Could not parse the file — save it as .xlsx and retry',
    xlImported: 'Imported {n} rows from file ✓',
    tooFast: 'Too many requests — please retry after {time}',
    tooLarge: 'Image too large (>20MB), please choose another',
    errSuffix: '. Or contact us directly.',
    okTitle: 'Inquiry received',
    okUploaded: 'Photo',
    okContact: 'Contact',
    okNote: 'Items',
    okReply: 'We reply within ~30 min on business hours',
    holiday: '🎉 National Day holiday Oct 1-3 — inquiries will be quoted from Oct 4',
    okBtn: 'OK',
    contactUs: 'Contact us directly',
  },
  ru: {
    button: 'Запрос',
    title: 'Запрос по деталям',
    tabPhoto: '📷 Фото',
    tabText: '✍️ OE-список',
    subtitle: 'Отправьте фото детали — сделаем расчёт и ответим',
    pick: 'Сделать фото / Выбрать файл',
    pickHint: 'Можно перетащить или вставить скриншот (Ctrl+V)',
    change: 'Другое фото',
    textPh: 'По одному OE-номеру в строке — можно вставить из Excel\nПример:\nWG1664440201\nDASP2001\nамортизатор кабины Sinotruk ×2',
    steps: ['Фото или скриншот', 'Оставьте контакт', 'Расчёт и ответ'],
    stepsText: ['Вставьте OE-список', 'Оставьте контакт', 'Расчёт и ответ'],
    noteLabel: 'Примечание (необяз.)',
    notePh: 'Название / OE-номер / количество',
    contactLabel: 'Контакт (обязат.)',
    contactPh: 'Телефон / WeChat / WhatsApp / Telegram',
    privacy: 'Только для ответа по запросу, не публикуется',
    promise: 'Расчёт — в течение ~30 минут в рабочее время на ваш WhatsApp / WeChat / телефон',
    submit: 'Отправить запрос',
    submitting: 'Отправка…',
    stageImg: 'Обработка фото…',
    stageUp: 'Загрузка…',
    stageIns: 'Отправка…',
    needPhoto: 'Сначала выберите фото детали',
    needText: 'Сначала введите список OE-номеров',
    needContact: 'Оставьте контакт, чтобы мы отправили предложение',
    xlDrop: 'Перетащите Excel/CSV (≤5 МБ) или выберите файл — строки заполнятся сами',
    xlParsing: 'Чтение файла…',
    xlBadType: 'Поддерживаются только .xlsx / .xls / .csv',
    xlTooLarge: 'Файл больше 5 МБ',
    xlEmpty: 'В файле нет данных',
    xlParseFail: 'Не удалось прочитать файл — сохраните как .xlsx и повторите',
    xlImported: 'Импортировано строк: {n} ✓',
    tooFast: 'Слишком часто — повторите после {time}',
    tooLarge: 'Фото слишком большое (>20МБ), выберите другое',
    errSuffix: '. Или свяжитесь с нами напрямую.',
    okTitle: 'Запрос получен',
    okUploaded: 'Фото',
    okContact: 'Контакт',
    okNote: 'Позиции',
    okReply: 'Отвечаем ~30 минут в рабочее время',
    holiday: '🎉 Праздник 1-3 октября — расчёты отправим начиная с 4 октября',
    okBtn: 'Готово',
    contactUs: 'Свяжитесь с нами напрямую',
  },
} as const

export default function PhotoInquiryButton({ locale = 'zh' }: { locale?: string }) {
  const t = T[(locale as Locale) in T ? (locale as Locale) : 'zh']
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'photo' | 'text'>('photo')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [oeText, setOeText] = useState('')
  const [note, setNote] = useState('')
  const [contact, setContact] = useState('')
  const [company, setCompany] = useState('')
  const [busy, setBusy] = useState(false)
  const [stage, setStage] = useState('')
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [xlBusy, setXlBusy] = useState(false)
  const [xlDrag, setXlDrag] = useState(false)
  const [xlInfo, setXlInfo] = useState('')
  const [wxCopied, setWxCopied] = useState(false)
  const xlRef = useRef<HTMLInputElement>(null)

  function pick(f: File | null) {
    setErr('')
    setDone(false)
    setFile(f)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(f ? URL.createObjectURL(f) : '')
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const f = Array.from(e.dataTransfer.files).find((x) => x.type.startsWith('image/'))
    if (f) pick(f)
  }

  function onPaste(e: ClipboardEvent) {
    const f = Array.from(e.clipboardData.files).find((x) => x.type.startsWith('image/'))
    if (f) pick(f)
  }

  async function importSpreadsheet(f: File | null) {
    if (!f) return
    setErr('')
    setXlInfo('')
    if (!/\.(xlsx|xls|csv)$/i.test(f.name)) {
      setErr(t.xlBadType)
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setErr(t.xlTooLarge)
      return
    }
    setXlBusy(true)
    try {
      const XLSX = await import('xlsx')
      const wb = XLSX.read(await f.arrayBuffer(), { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: '', raw: false })
      const parsed: string[][] = []
      for (const r of rows) {
        const cells = (r || []).map((c) => String(c ?? '').trim()).filter(Boolean)
        if (cells.length) parsed.push(cells)
      }
      const firstDigit = parsed.findIndex((cells) => cells.some((c) => /\d/.test(c)))
      const src = firstDigit > 0 ? parsed.slice(firstDigit) : parsed
      const lines = src.slice(0, 300).map((cells) =>
        cells
          .map((c, i) => (i > 0 && /^\d+(\.\d+)?$/.test(c) && Number(c) <= 9999 ? '×' + c : c))
          .join(' ')
      )
      if (!lines.length) {
        setErr(t.xlEmpty)
        return
      }
      let merged = (oeText.trim() ? oeText.trim() + '\n' : '') + lines.join('\n')
      if (merged.length > 2000) merged = merged.slice(0, 2000).replace(/\n[^\n]*$/, '')
      setOeText(merged)
      setXlInfo(t.xlImported.replace('{n}', String(lines.length)))
    } catch {
      setErr(t.xlParseFail)
    } finally {
      setXlBusy(false)
    }
  }

  async function submit() {
    if (busy) return
    if (mode === 'photo' && !file) {
      setErr(t.needPhoto)
      return
    }
    if (mode === 'text' && !oeText.trim()) {
      setErr(t.needText)
      return
    }
    if (!contact.trim()) {
      setErr(t.needContact)
      return
    }
    if (company.trim()) {
      setDone(true)
      return
    }
    if (mode === 'photo' && (!file!.type.startsWith('image/') || file!.size > 20 * 1024 * 1024)) {
      setErr(t.tooLarge)
      return
    }
    try {
      const last = Number(localStorage.getItem('pi_last_submit') || 0)
      const waitMs = 3 * 60 * 1000 - (Date.now() - last)
      if (last && waitMs > 0) {
        const retryAt = new Date(Date.now() + waitMs)
        const hh = String(retryAt.getHours()).padStart(2, '0')
        const mm = String(retryAt.getMinutes()).padStart(2, '0')
        setErr(t.tooFast.replace('{time}', `${hh}:${mm}`))
        return
      }
    } catch {}
    setBusy(true)
    setErr('')
    setStage(t.stageImg)
    try {
      let imageUrl: string | null = null
      if (mode === 'photo') {
        const payload = await compressImage(file!)
        setStage(t.stageUp)
        const supabase = getSupabase()
        const ext = (payload.name.split('.').pop() || 'jpg').toLowerCase()
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
        const { error: upErr } = await supabase.storage
          .from('inquiry-images')
          .upload(path, payload, { contentType: payload.type || 'image/jpeg' })
        if (upErr) throw new Error('图片上传失败(' + upErr.message + ')')
        imageUrl = supabase.storage.from('inquiry-images').getPublicUrl(path).data.publicUrl
      }
      setStage(t.stageIns)
      const fullNote = mode === 'text' ? oeText.trim() + (note.trim() ? '\n' + note.trim() : '') : note.trim()
      
      // 改为调用 API 通知客服
      const res = await fetch('/api/photo-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl || '',
          oe_text: mode === 'text' ? oeText.trim() : '',
          note: mode === 'text' ? '' : fullNote,
          contact: contact.trim(),
          kind: mode
        })
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.error || '提交失败')
      }
      try {
        localStorage.setItem('pi_last_submit', String(Date.now()))
      } catch {}
      setDone(true)
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
      setStage('')
    }
  }

  function close() {
    setOpen(false)
    setDone(false)
  }

  const stepsNow = mode === 'photo' ? t.steps : t.stepsText

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-sm rounded-lg px-3.5 py-1.5 transition active:scale-95"
      >
        <span className="text-base leading-none">📷</span> {t.button}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-[2px] p-0 sm:p-4"
          onClick={(e) => e.target === e.currentTarget && !busy && close()}
          onPaste={onPaste}
        >
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto">
            {done ? (
              <div className="text-center py-10 px-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mb-4">
                  ✅
                </div>
                <p className="text-lg font-semibold text-gray-900">{t.okTitle}</p>
                <div className="mt-4 bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-600 space-y-1.5">
                  {preview && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{t.okUploaded}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt="ok" className="w-12 h-12 object-cover rounded-md border" />
                      <span className="text-green-600">✓</span>
                    </div>
                  )}
                  {contact.trim() && (
                    <p>
                      <span className="text-gray-400">{t.okContact} </span>
                      {contact}
                    </p>
                  )}
                  {(oeText.trim() || note.trim()) && (
                    <p className="whitespace-pre-line line-clamp-6">
                      <span className="text-gray-400">{t.okNote} </span>
                      {mode === 'text' ? oeText.trim() : note.trim()}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-4">{isHoliday ? t.holiday : t.okReply}</p>
                <button
                  onClick={close}
                  className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                >
                  {t.okBtn}
                </button>
              </div>
            ) : (
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-base">{t.title}</h3>
                  <button
                    onClick={() => !busy && close()}
                    className="text-gray-300 hover:text-gray-600 text-2xl leading-none w-8 h-8 rounded-full hover:bg-gray-100 transition"
                    aria-label="close"
                  >
                    ×
                  </button>
                </div>
                <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-3">
                  {(['photo', 'text'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex-1 text-sm font-medium py-1.5 rounded-lg transition ${
                        mode === m ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {m === 'photo' ? t.tabPhoto : t.tabText}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mb-3">{mode === 'photo' ? t.subtitle : t.stepsText.join(' → ')}</p>
                <div className="flex items-center justify-center gap-1.5 mb-4 text-[11px] sm:text-xs text-gray-600 bg-blue-50/60 rounded-xl py-2 px-2">
                  <span className="inline-flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold shrink-0">1</span>{stepsNow[0]}</span>
                  <span className="text-blue-300 font-bold">→</span>
                  <span className="inline-flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold shrink-0">2</span>{stepsNow[1]}</span>
                  <span className="text-blue-300 font-bold">→</span>
                  <span className="inline-flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold shrink-0">3</span>{stepsNow[2]}</span>
                </div>
                {isHoliday ? (
                  <p className="text-xs text-orange-700 bg-orange-50 rounded-lg px-3 py-2 mb-4 font-medium flex items-center gap-1.5"><span>🏮</span>{t.holiday}</p>
                ) : (
                  <p className="text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-2 mb-4 font-medium flex items-center gap-1.5"><span>📩</span>{t.promise}</p>
                )}

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => pick(e.target.files?.[0] ?? null)}
                />
                {mode === 'photo' ? (
                  preview ? (
                    <div className="relative mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt="preview"
                        className="w-full h-44 object-contain bg-gray-50 rounded-xl border"
                      />
                      <button
                        onClick={() => pick(null)}
                        className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg transition"
                      >
                        {t.change}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragOver(true)
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={onDrop}
                      className={`w-full h-32 mb-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition ${
                        dragOver
                          ? 'border-blue-500 bg-blue-50 scale-[1.01]'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-3xl">📸</span>
                      <span className="text-sm text-gray-600 font-medium">{t.pick}</span>
                      <span className="text-xs text-gray-500">{t.pickHint}</span>
                    </button>
                  )
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setXlDrag(true)
                    }}
                    onDragLeave={() => setXlDrag(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setXlDrag(false)
                      importSpreadsheet(e.dataTransfer.files?.[0] ?? null)
                    }}
                    className={`mb-4 rounded-xl transition ${xlDrag ? 'ring-2 ring-blue-400 bg-blue-50' : ''}`}
                  >
                    <input
                      ref={xlRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                      onChange={(e) => {
                        importSpreadsheet(e.target.files?.[0] ?? null)
                        e.target.value = ''
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => xlRef.current?.click()}
                      disabled={xlBusy}
                      className={`w-full h-10 mb-1.5 rounded-lg border border-dashed text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-60 ${
                        xlDrag
                          ? 'border-blue-500 text-blue-700 bg-blue-50'
                          : 'border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      <span>📊</span>
                      {xlBusy ? t.xlParsing : t.xlDrop}
                    </button>
                    {xlInfo && <p className="text-xs text-green-600 font-medium px-1 pb-1">{xlInfo}</p>}
                    <textarea
                      value={oeText}
                      onChange={(e) => {
                        setOeText(e.target.value)
                        setXlInfo('')
                      }}
                      placeholder={t.textPh}
                      rows={5}
                      maxLength={2000}
                      className="w-full text-sm text-gray-900 font-medium bg-white border border-gray-300 shadow-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition placeholder:font-normal placeholder:text-gray-400"
                    />
                  </div>
                )}

                <div className="space-y-2.5">
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute opacity-0 pointer-events-none h-0 w-0"
                  />
                  {mode === 'photo' && (
                    <div>
                      <label className="text-xs font-medium text-gray-600">{t.noteLabel}</label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={t.notePh}
                        rows={2}
                        maxLength={200}
                        className="w-full text-sm text-gray-900 font-medium bg-white border border-gray-300 shadow-sm rounded-xl px-3 py-2 mt-1 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-gray-600">{t.contactLabel}</label>
                    <input
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder={t.contactPh}
                      maxLength={60}
                      className="w-full text-[15px] font-medium text-gray-900 bg-white border border-gray-300 shadow-sm rounded-xl px-3 py-2.5 mt-1 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    />
                    <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1"><span>🔒</span>{t.privacy}</p>
                  </div>
                </div>

                {err && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-3">
                    {err}
                    {t.errSuffix}
                  </p>
                )}
                <button
                  onClick={submit}
                  disabled={busy || (mode === 'photo' ? !file : !oeText.trim())}
                  className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {busy && (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                  {busy ? stage || t.submitting : t.submit}
                </button>

                {(CONTACT.whatsapp || CONTACT.telegram || CONTACT.email || (CONTACT.wechat && locale === 'zh')) && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center mb-2">{t.contactUs}</p>
                    <div className="flex items-center justify-center gap-2 text-xs">
                      {CONTACT.whatsapp && (
                        <a
                          href={`https://wa.me/${CONTACT.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition"
                        >
                          💬 WhatsApp
                        </a>
                      )}
                      {CONTACT.telegram && (
                        <a
                          href={`https://t.me/${CONTACT.telegram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition"
                        >
                          ✈️ Telegram
                        </a>
                      )}
                      {CONTACT.email && (
                        <a
                          href={`mailto:${CONTACT.email}`}
                          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition"
                        >
                          ✉️ Email
                        </a>
                      )}
                      {CONTACT.wechat && locale === 'zh' && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard
                              ?.writeText(CONTACT.wechat)
                              .then(() => {
                                setWxCopied(true)
                                setTimeout(() => setWxCopied(false), 1500)
                              })
                              .catch(() => {})
                          }}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition active:scale-95"
                        >
                          💚 微信:{CONTACT.wechat}
                          {wxCopied ? ' ✓ 已复制' : ''}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

async function compressImage(source: File): Promise<File> {
  try {
    if (!source.type.startsWith('image/') || source.size < 300 * 1024) return source
    const bitmap = await createImageBitmap(source)
    const scale = Math.min(1, 1600 / bitmap.width)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.85))
    if (!blob || blob.size >= source.size) return source
    return new File([blob], source.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return source
  }
}
