import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Evento = Database['public']['Tables']['eventos']['Row'];

interface UseEventosOptions {
  status?: 'agendado' | 'realizado' | 'todos';
}

export function useEventos(options: UseEventosOptions = { status: 'todos' }) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEventos = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('eventos')
        .select('*');
      
      // Filtrar por status ativo (padrão) ou todos
      if (options.status !== 'todos') {
        query = query.eq('ativo', true);
      }

      // Filtrar por status
      if (options.status === 'agendado') {
        query = query.in('status', ['agendado', 'em_andamento']);
      } else if (options.status === 'realizado') {
        query = query.eq('status', 'realizado');
      }

      query = query.order('data_evento', { ascending: options.status === 'agendado' });

      const { data, error } = await query;

      if (error) throw error;
      setEventos(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Erro ao buscar eventos:', err);
    } finally {
      setLoading(false);
    }
  }, [options.status]);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  return { eventos, loading, error, refetch: fetchEventos };
}
