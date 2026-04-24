import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type TarefaRow = Database['public']['Tables']['tarefas']['Row']
type TarefaInsert = Database['public']['Tables']['tarefas']['Insert']
type TarefaUpdate = Database['public']['Tables']['tarefas']['Update']

export interface Tarefa extends TarefaRow {
  membro?: {
    nome: string
    cargo: string
    foto_url: string
  }
  criador?: {
    username: string
    full_name: string | null
  }
}

interface UseTarefasOptions {
  membroId?: string
  status?: 'a_fazer' | 'em_progresso' | 'concluido'
}

export function useTarefas(options: UseTarefasOptions = {}) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchTarefas()
  }, [options.membroId, options.status])

  const fetchTarefas = async () => {
    try {
      setLoading(true)
      setError(null)

      // @ts-ignore - Supabase não reconhece a tabela tarefas até a migration ser executada
      let query = supabase
        .from('tarefas')
        .select('*')
        .order('prazo', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false })

      if (options.membroId) {
        query = query.eq('atribuido_para', options.membroId)
      }

      if (options.status) {
        query = query.eq('status', options.status)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        console.error('[TAREFAS] Erro ao buscar tarefas:', fetchError)
        throw fetchError
      }

      // Se temos tarefas, buscar dados relacionados
      if (data && data.length > 0) {
        // Buscar membros relacionados
        const membroIds = [...new Set(data.map(t => t.atribuido_para))]
        const { data: membrosData } = await supabase
          .from('membros')
          .select('id, nome, cargo, foto_url')
          .in('id', membroIds)

        // Buscar criadores relacionados
        const criadorIds = [...new Set(data.map(t => t.criado_por))]
        
        const { data: criadoresData } = await supabase
          .from('profiles')
          .select('id, username, full_name')
          .in('id', criadorIds)

        // Mapear dados relacionados
        const tarefasComRelacoes = data.map(tarefa => ({
          ...tarefa,
          membro: membrosData?.find(m => m.id === tarefa.atribuido_para),
          criador: criadoresData?.find(c => c.id === tarefa.criado_por)
        }))

        setTarefas(tarefasComRelacoes)
      } else {
        setTarefas([])
      }
    } catch (err) {
      setError(err as Error)
      console.error('[TAREFAS] Erro ao buscar tarefas:', err)
    } finally {
      setLoading(false)
    }
  }

  const criarTarefa = async (tarefa: {
    titulo: string
    descricao?: string
    status?: 'a_fazer' | 'em_progresso' | 'concluido'
    prioridade?: 'baixa' | 'media' | 'alta'
    atribuido_para: string
    prazo?: string
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const tarefaInsert = {
        titulo: tarefa.titulo,
        descricao: tarefa.descricao || null,
        status: tarefa.status || 'a_fazer' as const,
        prioridade: tarefa.prioridade || 'media' as const,
        atribuido_para: tarefa.atribuido_para,
        criado_por: user.id,
        prazo: tarefa.prazo || null,
      }

      // @ts-ignore - Supabase não reconhece a tabela tarefas até a migration ser executada
      const { data, error } = await supabase
        .from('tarefas')
        .insert(tarefaInsert)
        .select()
        .single()

      if (error) throw error
      await fetchTarefas()
      return data
    } catch (err) {
      console.error('[TAREFAS] Erro ao criar tarefa:', err)
      throw err
    }
  }

  const atualizarTarefa = async (id: string, updates: Partial<Omit<Tarefa, 'membro' | 'criador'>>) => {
    try {
      // @ts-ignore - Supabase não reconhece a tabela tarefas até a migration ser executada
      const { error } = await supabase
        .from('tarefas')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      await fetchTarefas()
    } catch (err) {
      console.error('[TAREFAS] Erro ao atualizar tarefa:', err)
      throw err
    }
  }

  const deletarTarefa = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tarefas')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchTarefas()
    } catch (err) {
      console.error('[TAREFAS] Erro ao deletar tarefa:', err)
      throw err
    }
  }

  const moverTarefa = async (id: string, novoStatus: 'a_fazer' | 'em_progresso' | 'concluido') => {
    await atualizarTarefa(id, { status: novoStatus })
  }

  return {
    tarefas,
    loading,
    error,
    criarTarefa,
    atualizarTarefa,
    deletarTarefa,
    moverTarefa,
    refetch: fetchTarefas,
  }
}
