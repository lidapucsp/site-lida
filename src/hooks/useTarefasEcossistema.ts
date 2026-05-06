import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface TarefaEcossistema {
  id: string
  titulo: string
  descricao: string | null
  equipe_id: string | null
  atribuido_para: string | null
  criado_por: string | null
  status: 'pendente' | 'em_andamento' | 'em_revisao' | 'concluida' | 'cancelada'
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  prazo: string | null
  tags: string[] | null
  ordem: number
  created_at: string
  updated_at: string
  concluida_em: string | null
  atribuido?: {
    username: string
    full_name: string | null
    avatar_url: string | null
  }
  criador?: {
    username: string
    full_name: string | null
  }
}

export interface Entrega {
  id: string
  tarefa_id: string
  membro_id: string
  descricao: string | null
  arquivo_url: string | null
  observacoes: string | null
  avaliacao: 'pendente' | 'aprovada' | 'revisao_necessaria' | 'rejeitada' | null
  avaliado_por: string | null
  avaliado_em: string | null
  created_at: string
  updated_at: string
  membro?: {
    username: string
    full_name: string | null
    avatar_url: string | null
  }
}

interface UseTarefasEcossistemaOptions {
  equipeId?: string
  userId?: string
  status?: 'pendente' | 'em_andamento' | 'em_revisao' | 'concluida' | 'cancelada'
}

export function useTarefasEcossistema(options: UseTarefasEcossistemaOptions = {}) {
  const [tarefas, setTarefas] = useState<TarefaEcossistema[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchTarefas()
  }, [options.equipeId, options.userId, options.status])

  const fetchTarefas = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('tarefas_ecossistema')
        .select(`
          *,
          atribuido:profiles!tarefas_ecossistema_atribuido_para_fkey(username, full_name, avatar_url),
          criador:profiles!tarefas_ecossistema_criado_por_fkey(username, full_name)
        `)
        .order('ordem', { ascending: true })
        .order('prazo', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false })

      if (options.equipeId) {
        query = query.eq('equipe_id', options.equipeId)
      }

      if (options.userId) {
        query = query.eq('atribuido_para', options.userId)
      }

      if (options.status) {
        query = query.eq('status', options.status)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setTarefas(data || [])
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar tarefas:', err)
    } finally {
      setLoading(false)
    }
  }

  const criarTarefa = async (tarefa: {
    titulo: string
    descricao?: string
    equipe_id?: string
    atribuido_para?: string
    prioridade?: 'baixa' | 'media' | 'alta' | 'urgente'
    prazo?: string
    tags?: string[]
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error: insertError } = await supabase
        .from('tarefas_ecossistema')
        .insert({
          ...tarefa,
          criado_por: user.id,
          status: 'pendente'
        })

      if (insertError) throw insertError

      await fetchTarefas()
      return { success: true }
    } catch (err) {
      console.error('Erro ao criar tarefa:', err)
      return { success: false, error: err }
    }
  }

  const atualizarTarefa = async (id: string, updates: Partial<TarefaEcossistema>) => {
    try {
      const updateData: any = { ...updates, updated_at: new Date().toISOString() }
      
      if (updates.status === 'concluida' && !updates.concluida_em) {
        updateData.concluida_em = new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('tarefas_ecossistema')
        .update(updateData)
        .eq('id', id)

      if (updateError) throw updateError

      await fetchTarefas()
      return { success: true }
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err)
      return { success: false, error: err }
    }
  }

  const deletarTarefa = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('tarefas_ecossistema')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      await fetchTarefas()
      return { success: true }
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err)
      return { success: false, error: err }
    }
  }

  return { 
    tarefas, 
    loading, 
    error, 
    refetch: fetchTarefas, 
    criarTarefa,
    atualizarTarefa,
    deletarTarefa
  }
}

export function useEntregas(tarefaId?: string) {
  const [entregas, setEntregas] = useState<Entrega[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (tarefaId) {
      fetchEntregas()
    }
  }, [tarefaId])

  const fetchEntregas = async () => {
    if (!tarefaId) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('entregas')
        .select(`
          *,
          membro:profiles(username, full_name, avatar_url)
        `)
        .eq('tarefa_id', tarefaId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setEntregas(data || [])
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar entregas:', err)
    } finally {
      setLoading(false)
    }
  }

  const criarEntrega = async (entrega: {
    descricao?: string
    arquivo_url?: string
    observacoes?: string
  }) => {
    if (!tarefaId) return { success: false }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error: insertError } = await supabase
        .from('entregas')
        .insert({
          tarefa_id: tarefaId,
          membro_id: user.id,
          ...entrega,
          avaliacao: 'pendente'
        })

      if (insertError) throw insertError

      await fetchEntregas()
      return { success: true }
    } catch (err) {
      console.error('Erro ao criar entrega:', err)
      return { success: false, error: err }
    }
  }

  const avaliarEntrega = async (
    entregaId: string, 
    avaliacao: 'aprovada' | 'revisao_necessaria' | 'rejeitada'
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error: updateError } = await supabase
        .from('entregas')
        .update({
          avaliacao,
          avaliado_por: user.id,
          avaliado_em: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', entregaId)

      if (updateError) throw updateError

      await fetchEntregas()
      return { success: true }
    } catch (err) {
      console.error('Erro ao avaliar entrega:', err)
      return { success: false, error: err }
    }
  }

  return { 
    entregas, 
    loading, 
    error, 
    refetch: fetchEntregas,
    criarEntrega,
    avaliarEntrega
  }
}
