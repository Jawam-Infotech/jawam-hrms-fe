import { useEffect, useMemo, useRef, useState } from 'react'
import useCountries from '../../hooks/useCountries.js'

function flagForIso(isoCode = '') {
  return isoCode.length === 2
    ? [...isoCode].map((letter) => String.fromCodePoint(letter.charCodeAt(0) + 127397)).join('')
    : '🌐'
}

function CountryCodeSelect({ value = '', onChange, onBlur, disabled = false, className = '' }) {
  const { countries, loading, error } = useCountries()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef(null)
  const selected = countries.find((country) => country.code === value)
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase()
    if (!search) return countries
    return countries.filter((country) => `${country.name} ${country.code} ${country.isoCode}`.toLowerCase().includes(search))
  }, [countries, query])

  useEffect(() => {
    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={rootRef} className="relative">
      <label className="mb-[4px] block text-[18px] leading-[1.2] font-extrabold" htmlFor="countryCode">Country Code<span className="ml-1 text-[#3b82f6]">*</span></label>
      <button type="button" id="countryCode" disabled={disabled || loading || Boolean(error)} onClick={() => setOpen((current) => !current)} onBlur={onBlur} className={`flex h-[48px] w-[150px] max-w-full items-center justify-between rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] text-left text-[#111827] outline-none transition-[border-color,box-shadow] focus:border-[#3a7be0] ${className}`}>
        <span>{selected?.code || value || (loading ? 'Loading...' : 'Select')}</span><span>⌄</span>
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {open && !error && (
        <div className="absolute z-50 mt-2 max-h-72 w-[min(360px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-xl">
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search country..." className="w-full border-b border-[#e5e7eb] px-3 py-2.5 text-sm outline-none" aria-label="Search country" />
          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.map((country) => (
              <button key={`${country.isoCode}-${country.code}`} type="button" onClick={() => { onChange?.({ target: { name: 'countryCode', value: country.code } }); setOpen(false); setQuery('') }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-[#eff6ff]">
                <span>{flagForIso(country.isoCode)}</span><span className="min-w-0 truncate" title={`${country.name} (${country.code})`}>{country.name} ({country.code})</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="px-3 py-3 text-sm text-[#6b7280]">No countries found.</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export default CountryCodeSelect
