export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      eixos: {
        Row: {
          id: string
          titulo: string
          icone: string
          definicao: string
          temas: string[]
          entregas: string[]
          ordem: number
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          icone: string
          definicao: string
          temas: string[]
          entregas: string[]
          ordem?: number
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          icone?: string
          definicao?: string
          temas?: string[]
          entregas?: string[]
          ordem?: number
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      publicacoes: {
        Row: {
          id: string
          titulo: string
          autores: string
          data_publicacao: string
          ano: number
          eixo_id: string | null
          eixo_nome: string | null
          tipo: 'Artigo' | 'Nota Técnica' | 'Relatório' | 'Guia' | 'Resumo'
          resumo: string
          citacao: string
          arquivo_url: string | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          autores: string
          data_publicacao: string
          ano: number
          eixo_id?: string | null
          eixo_nome?: string | null
          tipo: 'Artigo' | 'Nota Técnica' | 'Relatório' | 'Guia' | 'Resumo'
          resumo: string
          citacao: string
          arquivo_url?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          autores?: string
          data_publicacao?: string
          ano?: number
          eixo_id?: string | null
          eixo_nome?: string | null
          tipo?: 'Artigo' | 'Nota Técnica' | 'Relatório' | 'Guia' | 'Resumo'
          resumo?: string
          citacao?: string
          arquivo_url?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      eventos: {
        Row: {
          id: string
          titulo: string
          descricao: string
          tipo: 'Seminário' | 'Workshop' | 'Palestra' | 'Congresso' | 'Reunião' | 'Mesa Redonda'
          data_evento: string
          horario: string | null
          local: string | null
          status: 'agendado' | 'em_andamento' | 'realizado' | 'cancelado'
          possui_materiais: boolean
          url_inscricao: string | null
          url_materiais: string | null
          capacidade: number | null
          organizador: string | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descricao: string
          tipo: 'Seminário' | 'Workshop' | 'Palestra' | 'Congresso' | 'Reunião' | 'Mesa Redonda'
          data_evento: string
          horario?: string | null
          local?: string | null
          status?: 'agendado' | 'em_andamento' | 'realizado' | 'cancelado'
          possui_materiais?: boolean
          url_inscricao?: string | null
          url_materiais?: string | null
          capacidade?: number | null
          organizador?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string
          tipo?: 'Seminário' | 'Workshop' | 'Palestra' | 'Congresso' | 'Reunião' | 'Mesa Redonda'
          data_evento?: string
          horario?: string | null
          local?: string | null
          status?: 'agendado' | 'em_andamento' | 'realizado' | 'cancelado'
          possui_materiais?: boolean
          url_inscricao?: string | null
          url_materiais?: string | null
          capacidade?: number | null
          organizador?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      calendario: {
        Row: {
          id: string
          titulo: string
          data: string
          tipo: 'Reunião' | 'Estudo' | 'Prazo' | 'Evento' | 'Seletivo'
          descricao: string | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          data: string
          tipo: 'Reunião' | 'Estudo' | 'Prazo' | 'Evento' | 'Seletivo'
          descricao?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          data?: string
          tipo?: 'Reunião' | 'Estudo' | 'Prazo' | 'Evento' | 'Seletivo'
          descricao?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      membros: {
        Row: {
          id: string
          nome: string
          cargo: string
          tipo: 'coordenador' | 'diretor' | 'presidente' | 'membro'
          bio: string
          foto_url: string
          linkedin_url: string | null
          is_founder: boolean
          ordem: number
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          cargo: string
          tipo: 'coordenador' | 'diretor' | 'presidente' | 'membro'
          bio: string
          foto_url: string
          linkedin_url?: string | null
          is_founder?: boolean
          ordem?: number
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          cargo?: string
          tipo?: 'coordenador' | 'diretor' | 'presidente' | 'membro'
          bio?: string
          foto_url?: string
          linkedin_url?: string | null
          is_founder?: boolean
          ordem?: number
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          is_admin: boolean
          membro_id: string | null
          avatar_url: string | null
          bio: string | null
          linkedin: string | null
          instituicao: string | null
          funcao: string | null
          cargo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          is_admin?: boolean
          membro_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          linkedin?: string | null
          instituicao?: string | null
          funcao?: string | null
          cargo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          is_admin?: boolean
          membro_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          linkedin?: string | null
          instituicao?: string | null
          funcao?: string | null
          cargo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
