import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Membro = Database['public']['Tables']['membros']['Row'];

interface UseMembrosOptions {
  tipo?: 'coordenador' | 'diretor' | 'presidente' | 'membro' | 'todos';
}

export function useMembros(options: UseMembrosOptions = { tipo: 'todos' }) {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMembros = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('membros')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      // Filtrar por tipo se não for 'todos'
      if (options.tipo !== 'todos') {
        query = query.eq('tipo', options.tipo);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMembros(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Erro ao buscar membros:', err);
    } finally {
      setLoading(false);
    }
  }, [options.tipo]);

  useEffect(() => {
    fetchMembros();
  }, [fetchMembros]);

  return { membros, loading, error, refetch: fetchMembros };
}
