import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface AreaInteresse {
  id: string;
  nome: string;
  descricao: string;
  icone: string | null;
  created_at: string;
  updated_at: string;
}

export interface MembroInteresse {
  id: string;
  user_id: string;
  area_id: string;
  created_at: string;
  area?: AreaInteresse;
  profile?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function useInteresses(userId?: string) {
  const [areas, setAreas] = useState<AreaInteresse[]>([]);
  const [meusInteresses, setMeusInteresses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('areas_interesse')
        .select('*')
        .order('nome');

      if (error) throw error;
      setAreas(data || []);
    } catch (err) {
      setError(err as Error);
    }
  };

  const fetchMeusInteresses = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('membros_interesses')
        .select('area_id')
        .eq('user_id', userId);

      if (error) throw error;
      setMeusInteresses(data?.map(i => i.area_id) || []);
    } catch (err) {
      setError(err as Error);
    }
  };

  const adicionarInteresse = async (areaId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('membros_interesses')
        .insert({ user_id: userId, area_id: areaId });

      if (error) throw error;
      await fetchMeusInteresses();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const removerInteresse = async (areaId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('membros_interesses')
        .delete()
        .eq('user_id', userId)
        .eq('area_id', areaId);

      if (error) throw error;
      await fetchMeusInteresses();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const fetchMembrosInteressados = async (areaId: string) => {
    try {
      // Primeiro buscar os membros_interesses
      const { data: interessesData, error: interessesError } = await supabase
        .from('membros_interesses')
        .select('id, user_id, area_id, created_at')
        .eq('area_id', areaId);

      if (interessesError) throw interessesError;
      
      if (!interessesData || interessesData.length === 0) {
        return [];
      }

      // Buscar os profiles relacionados
      const userIds = interessesData.map(i => i.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combinar os dados
      return interessesData.map(interesse => ({
        ...interesse,
        profiles: profilesData?.find(p => p.id === interesse.user_id)
      }));
    } catch (err) {
      setError(err as Error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAreas(), fetchMeusInteresses()]);
      setLoading(false);
    };

    loadData();
  }, [userId]);

  return {
    areas,
    meusInteresses,
    loading,
    error,
    adicionarInteresse,
    removerInteresse,
    fetchMembrosInteressados,
    refetch: async () => {
      await Promise.all([fetchAreas(), fetchMeusInteresses()]);
    },
  };
}
