import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type CalendarioEvento = Database['public']['Tables']['calendario']['Row']

interface UseCalendarioOptions {
  includeInactive?: boolean
}

export function useCalendario(options: UseCalendarioOptions = {}) {
  const [eventos, setEventos] = useState<CalendarioEvento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchEventos = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('calendario')
        .select('*')
        .order('data', { ascending: true })

      // Filtrar apenas ativos se não for incluir inativos
      if (!options.includeInactive) {
        query = query.eq('ativo', true)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setEventos(data || [])
    } catch (err: any) {
      console.error('[CALENDARIO] Erro ao buscar eventos:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventos()
  }, [options.includeInactive])

  return { eventos, loading, error, refetch: fetchEventos }
}
