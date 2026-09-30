'use client'

import { DragEvent, ClipboardEvent, useRef, useState } from 'react'
import { getSupabase } from '@/lib/supabase'

export default function PhotoInquiryButton() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [note, setNote] = useState('')
  const [contact, setContact] = useState('')
  const [busy, setBusy] = useState(false)
  const [stage, setStage] = useState('')
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

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

  async function submit() {
    if (!file || busy) return
    setBusy(true)
    setErr('')
    setStage('正在处理图片…')
    try {
      const payload = await compressImage(file)
      setStage('正在上传…')
      const supabase = getSupabase()
      const ext = (payload.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('inquiry-images')
        .upload(path, payload, { contentType: payload.type || 'image/jpeg' })
      if (upErr) throw new Error('图片上传失败(' + upErr.message + ')')
      const { data } = supabase.storage.from('inquiry-images').getPublicUrl(path)
      setStage('正在提交…')
      const { error: insErr } = await supabase
        .from('inquiries')
        .insert({ image_url: data.publicUrl, note: note.trim(), contact: contact.trim() })
      if (insErr) throw new Error('询价提交失败(' + insErr.message + ')')
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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-sm rounded-lg px-3.5 py-1.5 transition active:scale-95"
      >
        <span className="text-base leading-none">📷</span> 拍照询价
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
                <p className="text-lg font-semibold text-gray-900">已收到您的询价</p>
                <div className="mt-4 bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-600 space-y-1.5">
                  {preview && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">图片</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt="已提交" className="w-12 h-12 object-cover rounded-md border" />
                      <span className="text-green-600">已上传</span>
                    </div>
                  )}
                  {contact.trim() && (
                    <p>
                      <span className="text-gray-400">联系 </span>
                      {contact}
                    </p>
                  )}
                  {note.trim() && (
                    <p>
                      <span className="text-gray-400">备注 </span>
                      {note}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-4">工作时间约 30 分钟内回复您</p>
                <button
                  onClick={close}
                  className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                >
                  好的
                </button>
              </div>
            ) : (
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 text-base">📷 拍照询价</h3>
                  <button
                    onClick={() => !busy && close()}
                    className="text-gray-300 hover:text-gray-600 text-2xl leading-none w-8 h-8 rounded-full hover:bg-gray-100 transition"
                    aria-label="关闭"
                  >
                    ×
                  </button>
                </div>
                <p className="text-xs text-gray-400 mb-4">拍一张配件照片,客服帮您查价并回复</p>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => pick(e.target.files?.[0] ?? null)}
                />
                {preview ? (
                  <div className="relative mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="预览"
                      className="w-full h-44 object-contain bg-gray-50 rounded-xl border"
                    />
                    <button
                      onClick={() => pick(null)}
                      className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      更换照片
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
                    <span className="text-sm text-gray-600 font-medium">点击拍照 / 选择图片</span>
                    <span className="text-xs text-gray-400">支持拖拽图片、Ctrl+V 粘贴截图</span>
                  </button>
                )}

                <div className="space-y-2.5">
                  <div>
                    <label className="text-xs font-medium text-gray-500">备注(选填)</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="品名 / OE号 / 数量,如:豪沃T7H 驾驶室减震器 ×2"
                      rows={2}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 mt-1 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">联系方式(选填)</label>
                    <input
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="手机号或微信号"
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 mt-1 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    />
                    <p className="text-[11px] text-gray-300 mt-1">仅用于本次报价联系,不会公开</p>
                  </div>
                </div>

                {err && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-3">
                    {err}。也可直接微信联系客服。
                  </p>
                )}
                <button
                  onClick={submit}
                  disabled={!file || busy}
                  className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {busy && (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                  {busy ? stage || '提交中…' : '提交询价'}
                </button>
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
