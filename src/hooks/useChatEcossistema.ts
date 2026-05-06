import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface ChatMensagem {
  id: string
  equipe_id: string
  autor_id: string
  autor_nome: string
  autor_avatar: string | null
  mensagem: string
  anexo_url: string | null
  anexo_nome: string | null
  respondendo_id: string | null
  editada: boolean
  created_at: string
  updated_at: string
  respondendo?: ChatMensagem
}

export interface Comunicado {
  id: string
  titulo: string
  mensagem: string
  tipo: 'informacao' | 'alerta' | 'urgente' | 'celebracao'
  enviado_por: string | null
  enviado_por_nome: string | null
  equipe_id: string | null
  destinatarios: string[] | null
  todos_membros: boolean
  lido_por: string[] | null
  created_at: string
}

export function useChatEquipe(equipeId?: string) {
  const [mensagens, setMensagens] = useState<ChatMensagem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (equipeId) {
      fetchMensagens()
      subscribeToMensagens()
    } else {
      setLoading(false)
    }

    return () => {
      // Cleanup subscription
      supabase.channel('chat_mensagens').unsubscribe()
    }
  }, [equipeId])

  const fetchMensagens = async () => {
    if (!equipeId) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('chat_mensagens')
        .select('*')
        .eq('equipe_id', equipeId)
        .order('created_at', { ascending: true })
        .limit(100)

      if (fetchError) throw fetchError

      setMensagens(data || [])
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar mensagens:', err)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToMensagens = () => {
    if (!equipeId) return

    const channel = supabase
      .channel('chat_mensagens')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_mensagens',
          filter: `equipe_id=eq.${equipeId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMensagens((prev) => [...prev, payload.new as ChatMensagem])
          } else if (payload.eventType === 'UPDATE') {
            setMensagens((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? (payload.new as ChatMensagem) : msg
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setMensagens((prev) => prev.filter((msg) => msg.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return channel
  }

  const enviarMensagem = async (mensagem: {
    mensagem: string
    anexo_url?: string
    anexo_nome?: string
    respondendo_id?: string
  }) => {
    if (!equipeId) return { success: false }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', user.id)
        .single()

      const { error: insertError } = await supabase
        .from('chat_mensagens')
        .insert({
          equipe_id: equipeId,
          autor_id: user.id,
          autor_nome: profile?.full_name || profile?.username || 'Usuário',
          autor_avatar: profile?.avatar_url,
          ...mensagem
        })

      if (insertError) throw insertError

      return { success: true }
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err)
      return { success: false, error: err }
    }
  }

  const editarMensagem = async (mensagemId: string, novoTexto: string) => {
    try {
      const { error: updateError } = await supabase
        .from('chat_mensagens')
        .update({
          mensagem: novoTexto,
          editada: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', mensagemId)

      if (updateError) throw updateError

      return { success: true }
    } catch (err) {
      console.error('Erro ao editar mensagem:', err)
      return { success: false, error: err }
    }
  }

  return {
    mensagens,
    loading,
    error,
    refetch: fetchMensagens,
    enviarMensagem,
    editarMensagem
  }
}

export function useComunicados() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [naoLidos, setNaoLidos] = useState(0)

  useEffect(() => {
    fetchComunicados()
  }, [])

  const fetchComunicados = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { data, error: fetchError } = await supabase
        .from('comunicados_ecossistema')
        .select('*')
        .or(`todos_membros.eq.true,destinatarios.cs.{${user.id}}`)
        .order('created_at', { ascending: false })
        .limit(50)

      if (fetchError) throw fetchError

      setComunicados(data || [])
      
      // Contar não lidos
      const naoLidosCount = (data || []).filter(
        (c) => !c.lido_por || !c.lido_por.includes(user.id)
      ).length
      setNaoLidos(naoLidosCount)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar comunicados:', err)
    } finally {
      setLoading(false)
    }
  }

  const enviarComunicado = async (comunicado: {
    titulo: string
    mensagem: string
    tipo?: 'informacao' | 'alerta' | 'urgente' | 'celebracao'
    equipe_id?: string
    destinatarios?: string[]
    todos_membros?: boolean
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('id', user.id)
        .single()

      const { error: insertError } = await supabase
        .from('comunicados_ecossistema')
        .insert({
          ...comunicado,
          enviado_por: user.id,
          enviado_por_nome: profile?.full_name || profile?.username || 'Admin'
        })

      if (insertError) throw insertError

      await fetchComunicados()
      return { success: true }
    } catch (err) {
      console.error('Erro ao enviar comunicado:', err)
      return { success: false, error: err }
    }
  }

  const marcarComoLido = async (comunicadoId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      // Buscar comunicado atual
      const { data: comunicado } = await supabase
        .from('comunicados_ecossistema')
        .select('lido_por')
        .eq('id', comunicadoId)
        .single()

      const lidoPor = comunicado?.lido_por || []
      if (!lidoPor.includes(user.id)) {
        lidoPor.push(user.id)

        const { error: updateError } = await supabase
          .from('comunicados_ecossistema')
          .update({ lido_por: lidoPor })
          .eq('id', comunicadoId)

        if (updateError) throw updateError

        await fetchComunicados()
      }

      return { success: true }
    } catch (err) {
      console.error('Erro ao marcar como lido:', err)
      return { success: false, error: err }
    }
  }

  return {
    comunicados,
    loading,
    error,
    naoLidos,
    refetch: fetchComunicados,
    enviarComunicado,
    marcarComoLido
  }
}
