import { useCallback, useState } from 'react'
import { fetchAssetTypes } from '../services/assetService'

function useAssetTypes() {
  const [assetTypes, setAssetTypes] = useState([])

  const loadAssetTypes = useCallback(async () => {
    const response = await fetchAssetTypes()

    setAssetTypes(
      Array.isArray(response)
        ? response
        : response?.results || [],
    )
  }, [])

  return {
    assetTypes,
    loadAssetTypes,
  }
}

export default useAssetTypes