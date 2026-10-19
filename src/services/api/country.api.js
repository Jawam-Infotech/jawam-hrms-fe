import api from './axios.js'

async function getCountries() {
  const { data } = await api.get('countries/')
  return data
}

export { getCountries }
