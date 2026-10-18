'use client'

import { useEffect, useState } from 'react'

/**
 * 展会落地页（Jinan Auto Parts Expo · Oct 20, 2026）
 * 独立页：不属于站点常规导航；QR 定版 URL /expo?utm_source=expo2026&utm_medium=qr&utm_campaign=jn1020
 * 表单 → POST /api/expo-lead → inquiries 表 + 销售/企微通知
 */

const CSS = `
:root{--blue:#1F6FEB;--red:#C00000;--dark:#0f172a;--gray:#64748b}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Microsoft YaHei',sans-serif;background:#f8fafc;color:var(--dark);line-height:1.6}
.wrap{max-width:860px;margin:0 auto;padding:0 20px}
header{background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;padding:60px 0 50px;text-align:center}
.lang{display:flex;justify-content:center;gap:8px;margin-bottom:24px}
.lang button{padding:6px 18px;border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;border-radius:20px;cursor:pointer;font-size:13px}
.lang button.on{background:#fff;color:var(--dark);font-weight:700}
h1{font-size:clamp(26px,5vw,40px);font-weight:800;margin-bottom:16px}
h1 .hl{color:#93c5fd}
.sub{color:#cbd5e1;font-size:16px;max-width:640px;margin:0 auto 28px}
.badge{display:inline-block;background:rgba(147,197,253,.15);border:1px solid rgba(147,197,253,.4);color:#93c5fd;padding:6px 14px;border-radius:6px;font-size:13px;margin-bottom:6px}
.cta{display:inline-block;background:var(--blue);color:#fff;padding:14px 36px;border-radius:10px;font-size:17px;font-weight:700;text-decoration:none;transition:.2s}
.cta:hover{background:#1557b5;transform:translateY(-2px)}
section{padding:48px 0}
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px;margin-top:28px}
.step{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:26px 22px}
.step .n{width:34px;height:34px;border-radius:50%;background:var(--blue);color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.step h3{font-size:16px;margin-bottom:8px}
.step p{font-size:13.5px;color:var(--gray)}
.why{background:#fff;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0}
.why .big{font-size:clamp(20px,3vw,28px);font-weight:800;text-align:center;max-width:640px;margin:0 auto 10px}
.why .sub2{text-align:center;color:var(--gray);font-size:15px}
form{background:#fff;border:2px solid var(--blue);border-radius:16px;padding:34px;margin-top:26px}
.frow{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:14px}
label{font-size:13px;font-weight:600;display:block;margin-bottom:5px}
input,textarea{width:100%;padding:12px 14px;border:1px solid #cbd5e1;border-radius:8px;font-size:15px;font-family:inherit}
input:focus,textarea:focus{outline:2px solid var(--blue);border-color:transparent}
button.submit{width:100%;background:var(--red);color:#fff;border:none;padding:15px;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer}
button.submit:hover{background:#a00000}
button.submit:disabled{background:#94a3b8;cursor:default}
.note{font-size:12px;color:var(--gray);text-align:center;margin-top:12px}
.ok{background:#dcfce7;border:1px solid #86efac;color:#166534;border-radius:12px;padding:24px;text-align:center;font-size:16px;font-weight:600;margin-top:26px}
.err{color:var(--red);text-align:center;font-size:14px;margin-top:10px}
footer{background:var(--dark);color:#94a3b8;padding:30px 0;font-size:13px;text-align:center}
footer a{color:#93c5fd;text-decoration:none}
.hidden{display:none}
`

export default function ExpoLandingPage() {
  const [lang, setLang] = useState<'en' | 'ru'>('en')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')
  const utm = { source: 'expo2026', medium: 'qr', campaign: 'jn1020' }

  useEffect(() => {
    // 俄语浏览器默认俄文
    if (typeof navigator !== 'undefined' && /^ru/i.test(navigator.language || '')) setLang('ru')
  }, [])

  const t = (en: string, ru: string) => (lang === 'en' ? en : ru)
  const cls = (l: 'en' | 'ru') => (lang === l ? '' : 'hidden')

  async function submit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    setSending(true); setErr('')
    const f = new FormData(ev.currentTarget)
    try {
      const res = await fetch('/api/expo-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oe: f.get('oe'), name: f.get('name'), company: f.get('company'),
          contact: f.get('contact'), notes: f.get('notes'), lang, utm,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Submit failed')
      setDone(true)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Network error')
    } finally {
      setSending(false)
    }
  }

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header>
        <div className="wrap">
          <div className="lang">
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>English</button>
            <button className={lang === 'ru' ? 'on' : ''} onClick={() => setLang('ru')}>Русский</button>
          </div>
          <div className="badge">🚛 Jinan Auto Parts Expo · Oct 20, 2026 · Booth 泉利汽配城 15 排 150 号</div>
          <h1 className={cls('en')}>Give us an OE number.<br />Get a quote in <span className="hl">10 minutes.</span></h1>
          <h1 className={cls('ru')}>Назовите OE-номер —<br />цену за <span className="hl">10 минут.</span></h1>
          <p className={`sub ${cls('en')}`}>Stop waiting three days for a price. Our AI operations team checks our 12,169-SKU catalog live and prices your parts in minutes. We did it with a 526-line quote in a single day. Bring us your hardest OE number — that&apos;s our lead, not your problem.</p>
          <p className={`sub ${cls('ru')}`}>Хватит ждать три дня. ИИ-команда проверяет каталог из 12 169 артикулов вживую и называет цену за минуты. Квиз на 526 позиций мы собрали за один день. Дайте нам самый сложный OE-номер — это наш повод блеснуть, а не ваша проблема.</p>
          <a className="cta" href="#lead">{t('Leave your OE number', 'Оставить OE-номер')}</a>
        </div>
      </header>

      <section>
        <div className="wrap">
          <h2>{t('How it works', 'Как это работает')}</h2>
          <div className="steps">
            <div className="step">
              <div className="n">1</div>
              <h3>{t('Tell us your OE number', 'Назовите OE-номер')}</h3>
              <p>{t('Type it on our site or hand it to us at the booth.', 'На сайте или на стенде.')}</p>
            </div>
            <div className="step">
              <div className="n">2</div>
              <h3>{t('We match it live', 'Проверяем вживую')}</h3>
              <p>{t('12,169 SKUs across engine, brake and belt-drive lines, in Chinese, English and Russian.', '12 169 артикулов: двигатель, тормоза, ремни. Каталог на китайском, английском и русском.')}</p>
            </div>
            <div className="step">
              <div className="n">3</div>
              <h3>{t('Quote in 10 minutes', 'Цена за 10 минут')}</h3>
              <p>{t('FOB Qingdao pricing, confirmed by our founder on the spot. No match? Sourcing plan within 24 hours.', 'Условия FOB Циндао, подтверждает основатель на месте. Не нашли? План поиска за 24 часа.')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why">
        <div className="wrap">
          <p className="big">{t('Response speed is the product.', 'Скорость ответа — и есть продукт.')}</p>
          <p className="sub2">{t('Ten minutes at the booth, 24 hours for anything we can\u2019t match on the spot.', '10 минут на стенде, 24 часа на всё остальное.')}</p>
        </div>
      </section>

      <section id="lead">
        <div className="wrap">
          <h2>{t('Leave your OE number — we\u2019ll reply within 24 hours', 'Оставьте OE-номер — ответим в течение 24 часов')}</h2>
          <p style={{ color: 'var(--gray)', marginTop: 8 }}>
            {t('Couldn\u2019t reach us at the fair? Drop your OE number below and we get back to you within 24 hours with a quote (FOB Qingdao) or a sourcing plan.', 'Не успели подойти на выставке? Оставьте OE-номер ниже — вернёмся с ценой (FOB Циндао) или планом поиска.')}
          </p>
          {done ? (
            <div className="ok">
              {t('✓ Got it! We\u2019ll reply within 24 hours. See you at Booth 150!', '✓ Получили! Ответим в течение 24 часов. Ждём вас на стенде 150!')}
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="frow">
                <div>
                  <label>{t('OE Number(s) *', 'OE-номер(а) *')}</label>
                  <input required name="oe" placeholder="e.g. 612600060225" />
                </div>
                <div>
                  <label>{t('Name *', 'Имя *')}</label>
                  <input required name="name" />
                </div>
              </div>
              <div className="frow">
                <div>
                  <label>{t('Company', 'Компания')}</label>
                  <input name="company" />
                </div>
                <div>
                  <label>WhatsApp / Email *</label>
                  <input required name="contact" />
                </div>
              </div>
              <div>
                <label>{t('Notes', 'Примечания')}</label>
                <textarea name="notes" rows={2} />
              </div>
              <button className="submit" type="submit" disabled={sending}>
                {sending ? '…' : t('Get my quote →', 'Получить цену →')}
              </button>
              {err && <p className="err">{err}</p>}
              <p className="note">{t('By submitting you agree we may contact you via WhatsApp/email with your quote.', 'Отправляя форму, вы соглашаетесь на связь по WhatsApp/email по вашему запросу.')}</p>
            </form>
          )}
        </div>
      </section>

      <footer>
        <div className="wrap">
          <p><strong style={{ color: '#e2e8f0' }}>Jinan DEDA Auto Parts Co., Ltd.</strong> — SINOTRUK · FAW · Shaanxi · Foton heavy truck parts</p>
          <p style={{ marginTop: 6 }}>WhatsApp: +86 17661969056 · Email: zuolw2010@gmail.com · <a href="https://products.dedaautoparts.com">products.dedaautoparts.com</a></p>
          <p style={{ marginTop: 6, opacity: 0.6 }}>Live build 2026-10-18 · UTM: utm_source=expo2026&amp;utm_medium=qr&amp;utm_campaign=jn1020</p>
        </div>
      </footer>
    </main>
  )
}
