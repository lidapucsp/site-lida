import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Publicacao = Database['public']['Tables']['publicacoes']['Row'];

interface UsePublicacoesOptions {
  eixo?: string;
  ano?: string;
  tipo?: string;
  status?: 'todos' | 'ativos';
}

export function usePublicacoes(options: UsePublicacoesOptions = {}) {
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPublicacoes = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('publicacoes')
        .select('*');
      
      // Filtrar por status ativo (padrão) ou todos
      if (options.status !== 'todos') {
        query = query.eq('ativo', true);
      }
      
      query = query.order('data_publicacao', { ascending: false });

      // Aplicar filtros se fornecidos
      if (options.eixo && options.eixo !== 'Todos') {
        query = query.eq('eixo_nome', options.eixo);
      }
      if (options.ano && options.ano !== 'Todos') {
        query = query.eq('ano', parseInt(options.ano));
      }
      if (options.tipo && options.tipo !== 'Todos') {
        query = query.eq('tipo', options.tipo);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPublicacoes(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Erro ao buscar publicações:', err);
    } finally {
      setLoading(false);
    }
  }, [options.eixo, options.ano, options.tipo, options.status]);

  useEffect(() => {
    fetchPublicacoes();
  }, [fetchPublicacoes]);

  return { publicacoes, loading, error, refetch: fetchPublicacoes };
}
