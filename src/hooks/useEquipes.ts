import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Equipe {
  id: string
  nome: string
  descricao: string | null
  diretor_id: string | null
  diretor_nome: string | null
  cor: string
  icone: string | null
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface MembroEquipe {
  id: string
  user_id: string
  equipe_id: string
  funcao_id: string | null
  nivel: 'iniciante' | 'ativo' | 'lider' | 'coordenador'
  data_entrada: string
  ativo: boolean
  created_at: string
  updated_at: string
  profile?: {
    username: string
    full_name: string | null
    avatar_url: string | null
  }
  funcao?: {
    nome: string
  }
}

export interface FuncaoEquipe {
  id: string
  equipe_id: string
  nome: string
  descricao: string | null
  ordem: number
  created_at: string
}

export function useEquipes() {
  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchEquipes()
  }, [])

  const fetchEquipes = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('equipes')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true })

      if (fetchError) throw fetchError

      setEquipes(data || [])
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar equipes:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateEquipe = async (id: string, updates: Partial<Equipe>) => {
    try {
      const { error: updateError } = await supabase
        .from('equipes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (updateError) throw updateError

      await fetchEquipes()
      return { success: true }
    } catch (err) {
      console.error('Erro ao atualizar equipe:', err)
      return { success: false, error: err }
    }
  }

  return { equipes, loading, error, refetch: fetchEquipes, updateEquipe }
}

export function useMembrosEquipe(equipeId?: string) {
  const [membros, setMembros] = useState<MembroEquipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (equipeId) {
      fetchMembros()
    } else {
      setLoading(false)
    }
  }, [equipeId])

  const fetchMembros = async () => {
    if (!equipeId) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('membros_equipe')
        .select(`
          *,
          profile:profiles(username, full_name, avatar_url),
          funcao:funcoes_equipe(nome)
        `)
        .eq('equipe_id', equipeId)
        .eq('ativo', true)
        .order('data_entrada', { ascending: false })

      if (fetchError) throw fetchError

      setMembros(data || [])
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar membros da equipe:', err)
    } finally {
      setLoading(false)
    }
  }

  const adicionarMembro = async (userId: string, funcaoId?: string) => {
    if (!equipeId) return { success: false }

    try {
      const { error: insertError } = await supabase
        .from('membros_equipe')
        .insert({
          user_id: userId,
          equipe_id: equipeId,
          funcao_id: funcaoId || null,
          nivel: 'iniciante'
        })

      if (insertError) throw insertError

      await fetchMembros()
      return { success: true }
    } catch (err) {
      console.error('Erro ao adicionar membro:', err)
      return { success: false, error: err }
    }
  }

  const atualizarMembro = async (membroId: string, updates: Partial<MembroEquipe>) => {
    try {
      const { error: updateError } = await supabase
        .from('membros_equipe')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', membroId)

      if (updateError) throw updateError

      await fetchMembros()
      return { success: true }
    } catch (err) {
      console.error('Erro ao atualizar membro:', err)
      return { success: false, error: err }
    }
  }

  const removerMembro = async (membroId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('membros_equipe')
        .update({ ativo: false, updated_at: new Date().toISOString() })
        .eq('id', membroId)

      if (deleteError) throw deleteError

      await fetchMembros()
      return { success: true }
    } catch (err) {
      console.error('Erro ao remover membro:', err)
      return { success: false, error: err }
    }
  }

  return { 
    membros, 
    loading, 
    error, 
    refetch: fetchMembros, 
    adicionarMembro,
    atualizarMembro,
    removerMembro
  }
}

export function useFuncoesEquipe(equipeId?: string) {
  const [funcoes, setFuncoes] = useState<FuncaoEquipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (equipeId) {
      fetchFuncoes()
    }
  }, [equipeId])

  const fetchFuncoes = async () => {
    if (!equipeId) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('funcoes_equipe')
        .select('*')
        .eq('equipe_id', equipeId)
        .order('ordem', { ascending: true })

      if (fetchError) throw fetchError

      setFuncoes(data || [])
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar funções:', err)
    } finally {
      setLoading(false)
    }
  }

  return { funcoes, loading, error, refetch: fetchFuncoes }
}
