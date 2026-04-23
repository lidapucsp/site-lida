import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type ForumPost = Database['public']['Tables']['forum_posts']['Row']
type ForumComentario = Database['public']['Tables']['forum_comentarios']['Row']

interface UseForumPostsOptions {
  tipo?: string
  eixoId?: string
  includeInactive?: boolean
}

export function useForumPosts(options: UseForumPostsOptions = {}) {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [options.tipo, options.eixoId, options.includeInactive])

  async function fetchPosts() {
    try {
      setLoading(true)
      let query = supabase
        .from('forum_posts')
        .select('*')
        .order('fixado', { ascending: false })
        .order('created_at', { ascending: false })

      if (options.tipo) {
        query = query.eq('tipo', options.tipo)
      }

      if (options.eixoId) {
        query = query.eq('eixo_id', options.eixoId)
      }

      if (!options.includeInactive) {
        query = query.eq('ativo', true)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      setPosts(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('[FORUM] Erro ao buscar posts:', err)
    } finally {
      setLoading(false)
    }
  }

  return { posts, loading, error, refetch: fetchPosts }
}

export function useForumComentarios(postId: string) {
  const [comentarios, setComentarios] = useState<ForumComentario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (postId) {
      fetchComentarios()
    }
  }, [postId])

  async function fetchComentarios() {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('forum_comentarios')
        .select('*')
        .eq('post_id', postId)
        .eq('ativo', true)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError
      setComentarios(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('[FORUM] Erro ao buscar comentários:', err)
    } finally {
      setLoading(false)
    }
  }

  return { comentarios, loading, error, refetch: fetchComentarios }
}
