'use client'

import { useRef, useState } from 'react'
import { getSupabase } from '@/lib/supabase'

export default function PhotoInquiryButton() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [note, setNote] = useState('')
  const [contact, setContact] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function pick(f: File | null) {
    setErr('')
    setDone(false)
    setFile(f)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(f ? URL.createObjectURL(f) : '')
  }

  function close() {
    setOpen(false)
    setDone(false)
  }

  async function submit() {
    if (!file || busy) return
    setBusy(true)
    setErr('')
    try {
      const supabase = getSupabase()
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error: upErr } = await supabase.storage.from('inquiry-images').upload(path, file, { contentType: file.type || 'image/jpeg' })
      if (upErr) throw new Error('图片上传失败(' + upErr.message + ')')
      const { data } = supabase.storage.from('inquiry-images').getPublicUrl(path)
      const { error: insErr } = await supabase
        .from('inquiries')
        .insert({ image_url: data.publicUrl, note: note.trim(), contact: contact.trim() })
      if (insErr) throw new Error('询价提交失败(' + insErr.message + ')')
      setDone(true)
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-900 border border-blue-200 hover:border-blue-400 bg-white rounded-lg px-3 py-1.5 transition"
      >
        📷 拍照询价
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="bg-white rounded-xl w-full max-w-md p-5 shadow-2xl">
            {done ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-lg font-semibold text-gray-900">已收到您的询价</p>
                <p className="text-sm text-gray-500 mt-1">客服将通过微信尽快联系您</p>
                <button
                  onClick={close}
                  className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-lg"
                >
                  好的
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">📷 拍照询价</h3>
                  <button onClick={close} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
                    ×
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-3">拍一张配件照片上传,客服帮您查价,微信回复</p>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => pick(e.target.files?.[0] ?? null)}
                />
                {preview ? (
                  <div className="relative mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="preview" className="w-full h-44 object-contain bg-gray-50 rounded-lg border" />
                    <button
                      onClick={() => pick(null)}
                      className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
                    >
                      重新选
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-28 mb-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition flex flex-col items-center justify-center gap-1"
                  >
                    <span className="text-2xl">📸</span>
                    <span className="text-sm">点击拍照 / 选择图片</span>
                  </button>
                )}

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="备注(选填):品名 / OE号 / 数量"
                  rows={2}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:border-blue-500"
                />
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="您的微信 / 手机号(选填)"
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
                />
                {err && <p className="text-xs text-red-600 mb-2">提交失败:{err}。也可直接微信联系客服。</p>}
                <button
                  onClick={submit}
                  disabled={!file || busy}
                  className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {busy ? '提交中…' : '提交询价'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
