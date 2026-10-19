import { useEffect, useState } from 'react'
import { getCountries } from '../services/countryService.js'

function useCountries() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getCountries()
      .then((data) => {
        if (!cancelled) setCountries(data)
      })
      .catch(() => {
        if (!cancelled) setError('Unable to load country codes.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return { countries, loading, error }
}

export default useCountries
