import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Reuniao = Database['public']['Tables']['aulas']['Row']

interface UseReunioesOptions {
  eixoId?: string
  includeInactive?: boolean
}

export function useReunioes(options: UseReunioesOptions = {}) {
  const [reunioes, setReunioes] = useState<Reuniao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchReunioes()
  }, [options.eixoId, options.includeInactive])

  async function fetchReunioes() {
    try {
      setLoading(true)
      let query = supabase
        .from('reunioes')
        .select('*')
        .order('data_reuniao', { ascending: false })
        .order('ordem', { ascending: true })

      if (options.eixoId) {
        query = query.eq('eixo_id', options.eixoId)
      }

      if (!options.includeInactive) {
        query = query.eq('ativo', true)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      setReunioes(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('[REUNIOES] Erro ao buscar reuniões:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    reunioes,
    loading,
    error,
    refetch: fetchReunioes
  }
}
