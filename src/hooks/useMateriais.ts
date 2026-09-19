import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Material = Database['public']['Tables']['materiais']['Row']

interface UseMateriaisOptions {
  eixoId?: string
  includeInactive?: boolean
}

export function useMateriais(options: UseMateriaisOptions = {}) {
  const [materiais, setMateriais] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchMateriais()
  }, [options.eixoId, options.includeInactive])

  async function fetchMateriais() {
    try {
      setLoading(true)
      let query = supabase
        .from('materiais')
        .select('*')
        .order('data_material', { ascending: false })
        .order('ordem', { ascending: true })

      if (options.eixoId) {
        query = query.eq('eixo_id', options.eixoId)
      }

      if (!options.includeInactive) {
        query = query.eq('ativo', true)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      console.log(data)
      setMateriais(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('[MATERIAIS] Erro ao buscar materiais:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    materiais,
    loading,
    error,
    refetch: fetchMateriais
  }
}
