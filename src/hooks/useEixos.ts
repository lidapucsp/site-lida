import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Eixo = Database['public']['Tables']['eixos']['Row'];

export function useEixos() {
  const [eixos, setEixos] = useState<Eixo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEixos() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('eixos')
          .select('*')
          .eq('ativo', true)
          .order('ordem', { ascending: true });

        if (error) throw error;
        setEixos(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Erro ao buscar eixos:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEixos();
  }, []);

  return { eixos, loading, error };
}
