import { useState, type FormEvent } from 'react'
import './AuthDemo.css'

type Step = 'phone' | 'card' | 'caught'

function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  const withoutCountry = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits
  const rest = withoutCountry.slice(0, 10)

  let result = '+7'
  if (rest.length > 0) result += ' ' + rest.slice(0, 3)
  if (rest.length > 3) result += ' ' + rest.slice(3, 6)
  if (rest.length > 6) result += '-' + rest.slice(6, 8)
  if (rest.length > 8) result += '-' + rest.slice(8, 10)
  return result
}

function formatCard(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatPassport(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 10)
  const series = digits.slice(0, 4)
  const number = digits.slice(4)
  return number ? `${series} ${number}` : series
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A11 11 0 0 1 12 5c6.4 0 10 7 10 7a18 18 0 0 1-2.7 3.6" />
      <path d="M6.7 6.7A18 18 0 0 0 2 12s3.6 7 10 7a11 11 0 0 0 4.1-.8" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  )
}

export function AuthDemo() {
  const [step, setStep] = useState<Step>('phone')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [card, setCard] = useState('')
  const [cvv, setCvv] = useState('')
  const [passport, setPassport] = useState('')
  const [error, setError] = useState('')
  const [showCvv, setShowCvv] = useState(false)

  const phoneDigits = phone.replace(/\D/g, '')
  const cardDigits = card.replace(/\D/g, '')
  const passportDigits = passport.replace(/\D/g, '')
  const cardStepFilled =
    cardDigits.length === 16 && cvv.length === 3 && passportDigits.length === 10

  function handlePhoneSubmit(event: FormEvent) {
    event.preventDefault()
    if (name.trim().length < 1) {
      setError('Введите имя - хотя бы 1 символ')
      return
    }
    if (phoneDigits.length < 11) {
      setError('Введите номер телефона полностью')
      return
    }
    setError('')
    setStep('card')
  }

  function handleCardSubmit(event: FormEvent) {
    event.preventDefault()
    if (!cardStepFilled) return
    setStep('caught')
  }

  function goBack() {
    setError('')
    setShowCvv(false)
    setStep('phone')
  }

  function restart() {
    setName('')
    setPhone('')
    setCard('')
    setCvv('')
    setPassport('')
    setError('')
    setShowCvv(false)
    setStep('phone')
  }

  return (
    <div className="demo-page">
      <div className="demo-logo">MAX</div>

      <main className="demo-card">
        <div className="demo-steps">
          <i className="is-done" />
          <i className={step === 'phone' ? '' : 'is-done'} />
          <i className={step === 'caught' ? 'is-done' : ''} />
        </div>

        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="demo-zone" noValidate>
            <h1>Вход в мессенджер Max</h1>

            <div className="demo-field">
              <label htmlFor="demo-name">Имя</label>
              <input
                id="demo-name"
                className="demo-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Владимир V"
                maxLength={30}
                autoComplete="off"
              />
            </div>

            <div className="demo-field">
              <label htmlFor="demo-phone">Телефон</label>
              <input
                id="demo-phone"
                className="demo-input"
                value={phone}
                onChange={(event) => setPhone(formatPhone(event.target.value))}
                placeholder="+7 800 555-35-35"
                inputMode="tel"
                autoComplete="off"
              />
            </div>

            {error && <p className="demo-error">{error}</p>}

            <button className="demo-btn" type="submit">
              Продолжить
            </button>
          </form>
        )}

        {step === 'card' && (
          <form onSubmit={handleCardSubmit} className="demo-zone" noValidate>
            <h1>Цифровой рубль</h1>
            <p>
              Привет, {name.trim()}. Мы ввели цифровой рубль, это очень удобно, чтобы начать им пользоваться введите необходимые данные
            </p>
            <div className="demo-field">
              <label htmlFor="demo-card">Номер карты</label>
              <input
                id="demo-card"
                className="demo-input"
                value={card}
                onChange={(event) => setCard(formatCard(event.target.value))}
                placeholder="1337 5678 6767 1111"
                inputMode="numeric"
                autoComplete="off"
              />
            </div>

            <div className="demo-row">
              <div className="demo-field">
                <label htmlFor="demo-cvv">CVC</label>
                <div className="demo-input-wrap">
                  <input
                    id="demo-cvv"
                    className="demo-input demo-input-toggleable"
                    type={showCvv ? 'text' : 'password'}
                    value={cvv}
                    onChange={(event) => setCvv(event.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="•••"
                    inputMode="numeric"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="demo-eye"
                    onClick={() => setShowCvv((visible) => !visible)}
                    aria-label={showCvv ? 'Скрыть CVC' : 'Показать CVC'}
                    aria-pressed={showCvv}
                  >
                    {showCvv ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <div className="demo-field">
                <label htmlFor="demo-passport">Паспорт: серия и номер</label>
                <input
                  id="demo-passport"
                  className="demo-input"
                  value={passport}
                  onChange={(event) => setPassport(formatPassport(event.target.value))}
                  placeholder="0000 000000"
                  inputMode="numeric"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="demo-badge">
              <span aria-hidden="true">✅</span>
              Все данные защищены государством
            </div>

            <button className="demo-btn" type="submit" disabled={!cardStepFilled}>
              Зарегестрироваться
            </button>
            <button className="demo-btn demo-btn-ghost" type="button" onClick={goBack}>
              Назад
            </button>
          </form>
        )}

        {step === 'caught' && (
          <div className="demo-zone">
            <h1>Вот вы и попались!!!</h1>
            <h2>Я украл все ваши данные</h2>
            <p className="demo-sub-ink">
              Ладно, вы человек хороший, нажмите кнопку ниже и ваши данные никуда не попадут
            </p>

            <button className="demo-btn" type="button" onClick={restart}>
              абоба
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
