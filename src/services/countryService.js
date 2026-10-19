import { getCountries as getCountriesRequest } from './api/country.api.js'

let countriesCache = null
let countriesRequest = null

function normalizeCountry(country = {}) {
  return {
    name: String(country.name || '').trim(),
    code: String(country.code || '').trim(),
    isoCode: String(country.iso_code || country.isoCode || '').trim().toUpperCase(),
  }
}

async function getCountries() {
  if (countriesCache) return countriesCache
  if (!countriesRequest) {
    countriesRequest = getCountriesRequest()
      .then((data) => {
        const normalized = Array.isArray(data) ? data.map(normalizeCountry).filter((country) => country.name && country.code) : []
        countriesCache = normalized
        return normalized
      })
      .finally(() => {
        countriesRequest = null
      })
  }
  return countriesRequest
}

export { getCountries }
