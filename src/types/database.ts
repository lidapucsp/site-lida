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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      tarefas: {
        Row: {
          id: string
          titulo: string
          descricao: string | null
          status: 'a_fazer' | 'em_progresso' | 'concluido'
          prioridade: 'baixa' | 'media' | 'alta'
          atribuido_para: string
          criado_por: string
          prazo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descricao?: string | null
          status?: 'a_fazer' | 'em_progresso' | 'concluido'
          prioridade?: 'baixa' | 'media' | 'alta'
          atribuido_para: string
          criado_por: string
          prazo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string | null
          status?: 'a_fazer' | 'em_progresso' | 'concluido'
          prioridade?: 'baixa' | 'media' | 'alta'
          atribuido_para?: string
          criado_por?: string
          prazo?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      areas_interesse: {
        Row: {
          id: string
          nome: string
          descricao: string
          icone: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nome: string
          descricao: string
          icone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string
          icone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      aulas: {
        Row: {
          id: string
          titulo: string
          descricao: string | null
          video_url: string
          thumbnail_url: string | null
          duracao: number | null
          data_aula: string
          eixo_id: string | null
          palestrante: string | null
          materiais_url: string | null
          ordem: number | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descricao?: string | null
          video_url: string
          thumbnail_url?: string | null
          duracao?: number | null
          data_aula: string
          eixo_id?: string | null
          palestrante?: string | null
          materiais_url?: string | null
          ordem?: number | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string | null
          video_url?: string
          thumbnail_url?: string | null
          duracao?: number | null
          data_aula?: string
          eixo_id?: string | null
          palestrante?: string | null
          materiais_url?: string | null
          ordem?: number | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      comunicados: {
        Row: {
          id: string
          assunto: string
          mensagem: string
          enviado_por: string | null
          destinatarios: string[]
          enviado_em: string | null
          status: 'enviado' | 'falha' | 'parcial'
        }
        Insert: {
          id?: string
          assunto: string
          mensagem: string
          enviado_por?: string | null
          destinatarios: string[]
          enviado_em?: string | null
          status?: 'enviado' | 'falha' | 'parcial'
        }
        Update: {
          id?: string
          assunto?: string
          mensagem?: string
          enviado_por?: string | null
          destinatarios?: string[]
          enviado_em?: string | null
          status?: 'enviado' | 'falha' | 'parcial'
        }
        Relationships: []
      }
      contatos: {
        Row: {
          id: string
          nome: string
          email: string
          assunto: string
          mensagem: string
          status: string | null
          lido: boolean | null
          resposta: string | null
          respondido_por: string | null
          respondido_em: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nome: string
          email: string
          assunto: string
          mensagem: string
          status?: string | null
          lido?: boolean | null
          resposta?: string | null
          respondido_por?: string | null
          respondido_em?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          assunto?: string
          mensagem?: string
          status?: string | null
          lido?: boolean | null
          resposta?: string | null
          respondido_por?: string | null
          respondido_em?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      forum_comentarios: {
        Row: {
          id: string
          post_id: string
          conteudo: string
          autor_id: string
          autor_nome: string
          autor_avatar: string | null
          parent_id: string | null
          total_curtidas: number
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          conteudo: string
          autor_id: string
          autor_nome: string
          autor_avatar?: string | null
          parent_id?: string | null
          total_curtidas?: number
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          conteudo?: string
          autor_id?: string
          autor_nome?: string
          autor_avatar?: string | null
          parent_id?: string | null
          total_curtidas?: number
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      forum_curtidas: {
        Row: {
          id: string
          post_id: string | null
          comentario_id: string | null
          usuario_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id?: string | null
          comentario_id?: string | null
          usuario_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string | null
          comentario_id?: string | null
          usuario_id?: string
          created_at?: string
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          id: string
          titulo: string
          conteudo: string
          tipo: string
          link_url: string | null
          link_titulo: string | null
          link_descricao: string | null
          autor_id: string
          autor_nome: string
          autor_avatar: string | null
          total_comentarios: number
          total_curtidas: number
          eixo_id: string | null
          tags: string[] | null
          fixado: boolean
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          conteudo: string
          tipo?: string
          link_url?: string | null
          link_titulo?: string | null
          link_descricao?: string | null
          autor_id: string
          autor_nome: string
          autor_avatar?: string | null
          total_comentarios?: number
          total_curtidas?: number
          eixo_id?: string | null
          tags?: string[] | null
          fixado?: boolean
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          conteudo?: string
          tipo?: string
          link_url?: string | null
          link_titulo?: string | null
          link_descricao?: string | null
          autor_id?: string
          autor_nome?: string
          autor_avatar?: string | null
          total_comentarios?: number
          total_curtidas?: number
          eixo_id?: string | null
          tags?: string[] | null
          fixado?: boolean
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      membros_interesses: {
        Row: {
          id: string
          user_id: string
          area_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          area_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          area_id?: string
          created_at?: string | null
        }
        Relationships: []
      }
      processo_seletivo_aprovados: {
        Row: {
          id: string
          processo_id: string | null
          nome: string
          instituicao: string | null
          ordem: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          processo_id?: string | null
          nome: string
          instituicao?: string | null
          ordem?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          processo_id?: string | null
          nome?: string
          instituicao?: string | null
          ordem?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      processo_seletivo_compromissos: {
        Row: {
          id: string
          processo_id: string | null
          descricao: string
          ordem: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          processo_id?: string | null
          descricao: string
          ordem?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          processo_id?: string | null
          descricao?: string
          ordem?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      processo_seletivo_cronograma: {
        Row: {
          id: string
          processo_id: string | null
          etapa: string
          data_inicio: string | null
          data_fim: string | null
          descricao: string | null
          ordem: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          processo_id?: string | null
          etapa: string
          data_inicio?: string | null
          data_fim?: string | null
          descricao?: string | null
          ordem?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          processo_id?: string | null
          etapa?: string
          data_inicio?: string | null
          data_fim?: string | null
          descricao?: string | null
          ordem?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      processo_seletivo_faqs: {
        Row: {
          id: string
          processo_id: string | null
          pergunta: string
          resposta: string
          ordem: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          processo_id?: string | null
          pergunta: string
          resposta: string
          ordem?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          processo_id?: string | null
          pergunta?: string
          resposta?: string
          ordem?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      processo_seletivo_infos: {
        Row: {
          id: string
          processo_id: string | null
          texto: string
          ordem: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          processo_id?: string | null
          texto: string
          ordem?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          processo_id?: string | null
          texto?: string
          ordem?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      processo_seletivo_requisitos: {
        Row: {
          id: string
          processo_id: string | null
          titulo: string
          descricao: string | null
          ordem: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          processo_id?: string | null
          titulo: string
          descricao?: string | null
          ordem?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          processo_id?: string | null
          titulo?: string
          descricao?: string | null
          ordem?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      processo_seletivo_resultados_anteriores: {
        Row: {
          id: string
          processo_id: string | null
          titulo: string
          url: string | null
          ordem: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          processo_id?: string | null
          titulo: string
          url?: string | null
          ordem?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          processo_id?: string | null
          titulo?: string
          url?: string | null
          ordem?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      processos_seletivos: {
        Row: {
          id: string
          titulo: string
          periodo: string
          descricao: string | null
          edital_url: string | null
          edital_descricao: string | null
          inscricao_url: string | null
          inscricao_inicio: string | null
          inscricao_fim: string | null
          vagas: number | null
          ativo: boolean | null
          exibir_site: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          titulo: string
          periodo: string
          descricao?: string | null
          edital_url?: string | null
          edital_descricao?: string | null
          inscricao_url?: string | null
          inscricao_inicio?: string | null
          inscricao_fim?: string | null
          vagas?: number | null
          ativo?: boolean | null
          exibir_site?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          titulo?: string
          periodo?: string
          descricao?: string | null
          edital_url?: string | null
          edital_descricao?: string | null
          inscricao_url?: string | null
          inscricao_inicio?: string | null
          inscricao_fim?: string | null
          vagas?: number | null
          ativo?: boolean | null
          exibir_site?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      materiais: {
        Row: {
          id: string
          titulo: string
          descricao: string | null
          thumbnail_url: string | null
          duracao: number | null
          data_material: string
          eixo_id: string | null
          criador_material: string | null
          materiais_url: string | null
          ordem: number | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descricao?: string | null
          thumbnail_url?: string | null
          duracao?: number | null
          data_material: string
          eixo_id?: string | null
          criador_material?: string | null
          materiais_url?: string | null
          ordem?: number | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string | null
          thumbnail_url?: string | null
          duracao?: number | null
          data_material?: string
          eixo_id?: string | null
          criador_material?: string | null
          materiais_url?: string | null
          ordem?: number | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipes: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          diretor_id: string | null
          diretor_nome: string | null
          cor: string | null
          icone: string | null
          ordem: number | null
          ativo: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          diretor_id?: string | null
          diretor_nome?: string | null
          cor?: string | null
          icone?: string | null
          ordem?: number | null
          ativo?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          diretor_id?: string | null
          diretor_nome?: string | null
          cor?: string | null
          icone?: string | null
          ordem?: number | null
          ativo?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      funcoes_equipe: {
        Row: {
          id: string
          equipe_id: string | null
          nome: string
          descricao: string | null
          ordem: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          equipe_id?: string | null
          nome: string
          descricao?: string | null
          ordem?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          equipe_id?: string | null
          nome?: string
          descricao?: string | null
          ordem?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      membros_equipe: {
        Row: {
          id: string
          user_id: string | null
          equipe_id: string | null
          funcao_id: string | null
          nivel: 'iniciante' | 'ativo' | 'lider' | 'coordenador'
          data_entrada: string | null
          ativo: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          equipe_id?: string | null
          funcao_id?: string | null
          nivel?: 'iniciante' | 'ativo' | 'lider' | 'coordenador'
          data_entrada?: string | null
          ativo?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          equipe_id?: string | null
          funcao_id?: string | null
          nivel?: 'iniciante' | 'ativo' | 'lider' | 'coordenador'
          data_entrada?: string | null
          ativo?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          { foreignKeyName: 'membros_equipe_user_id_fkey', columns: ['user_id'], isOneToOne: false, referencedRelation: 'profiles', referencedColumns: ['id'] },
          { foreignKeyName: 'membros_equipe_funcao_id_fkey', columns: ['funcao_id'], isOneToOne: false, referencedRelation: 'funcoes_equipe', referencedColumns: ['id'] },
          { foreignKeyName: 'membros_equipe_equipe_id_fkey', columns: ['equipe_id'], isOneToOne: false, referencedRelation: 'equipes', referencedColumns: ['id'] }
        ]
      }
      tarefas_ecossistema: {
        Row: {
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
          ordem: number | null
          created_at: string | null
          updated_at: string | null
          concluida_em: string | null
        }
        Insert: {
          id?: string
          titulo: string
          descricao?: string | null
          equipe_id?: string | null
          atribuido_para?: string | null
          criado_por?: string | null
          status?: 'pendente' | 'em_andamento' | 'em_revisao' | 'concluida' | 'cancelada'
          prioridade?: 'baixa' | 'media' | 'alta' | 'urgente'
          prazo?: string | null
          tags?: string[] | null
          ordem?: number | null
          created_at?: string | null
          updated_at?: string | null
          concluida_em?: string | null
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string | null
          equipe_id?: string | null
          atribuido_para?: string | null
          criado_por?: string | null
          status?: 'pendente' | 'em_andamento' | 'em_revisao' | 'concluida' | 'cancelada'
          prioridade?: 'baixa' | 'media' | 'alta' | 'urgente'
          prazo?: string | null
          tags?: string[] | null
          ordem?: number | null
          created_at?: string | null
          updated_at?: string | null
          concluida_em?: string | null
        }
        Relationships: [
          { foreignKeyName: 'tarefas_ecossistema_atribuido_para_fkey', columns: ['atribuido_para'], isOneToOne: false, referencedRelation: 'profiles', referencedColumns: ['id'] },
          { foreignKeyName: 'tarefas_ecossistema_criado_por_fkey', columns: ['criado_por'], isOneToOne: false, referencedRelation: 'profiles', referencedColumns: ['id'] },
          { foreignKeyName: 'tarefas_ecossistema_equipe_id_fkey', columns: ['equipe_id'], isOneToOne: false, referencedRelation: 'equipes', referencedColumns: ['id'] }
        ]
      }
      entregas: {
        Row: {
          id: string
          tarefa_id: string | null
          membro_id: string | null
          descricao: string | null
          arquivo_url: string | null
          observacoes: string | null
          avaliacao: 'pendente' | 'aprovada' | 'revisao_necessaria' | 'rejeitada' | null
          avaliado_por: string | null
          avaliado_em: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          tarefa_id?: string | null
          membro_id?: string | null
          descricao?: string | null
          arquivo_url?: string | null
          observacoes?: string | null
          avaliacao?: 'pendente' | 'aprovada' | 'revisao_necessaria' | 'rejeitada' | null
          avaliado_por?: string | null
          avaliado_em?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          tarefa_id?: string | null
          membro_id?: string | null
          descricao?: string | null
          arquivo_url?: string | null
          observacoes?: string | null
          avaliacao?: 'pendente' | 'aprovada' | 'revisao_necessaria' | 'rejeitada' | null
          avaliado_por?: string | null
          avaliado_em?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          { foreignKeyName: 'entregas_membro_id_fkey', columns: ['membro_id'], isOneToOne: false, referencedRelation: 'profiles', referencedColumns: ['id'] },
          { foreignKeyName: 'entregas_avaliado_por_fkey', columns: ['avaliado_por'], isOneToOne: false, referencedRelation: 'profiles', referencedColumns: ['id'] },
          { foreignKeyName: 'entregas_tarefa_id_fkey', columns: ['tarefa_id'], isOneToOne: false, referencedRelation: 'tarefas_ecossistema', referencedColumns: ['id'] }
        ]
      }
      chat_mensagens: {
        Row: {
          id: string
          equipe_id: string | null
          autor_id: string | null
          autor_nome: string
          autor_avatar: string | null
          mensagem: string
          anexo_url: string | null
          anexo_nome: string | null
          respondendo_id: string | null
          editada: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          equipe_id?: string | null
          autor_id?: string | null
          autor_nome: string
          autor_avatar?: string | null
          mensagem: string
          anexo_url?: string | null
          anexo_nome?: string | null
          respondendo_id?: string | null
          editada?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          equipe_id?: string | null
          autor_id?: string | null
          autor_nome?: string
          autor_avatar?: string | null
          mensagem?: string
          anexo_url?: string | null
          anexo_nome?: string | null
          respondendo_id?: string | null
          editada?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      comunicados_ecossistema: {
        Row: {
          id: string
          titulo: string
          mensagem: string
          tipo: 'informacao' | 'alerta' | 'urgente' | 'celebracao'
          enviado_por: string | null
          enviado_por_nome: string | null
          equipe_id: string | null
          destinatarios: string[] | null
          todos_membros: boolean | null
          lido_por: string[] | null
          created_at: string | null
        }
        Insert: {
          id?: string
          titulo: string
          mensagem: string
          tipo?: 'informacao' | 'alerta' | 'urgente' | 'celebracao'
          enviado_por?: string | null
          enviado_por_nome?: string | null
          equipe_id?: string | null
          destinatarios?: string[] | null
          todos_membros?: boolean | null
          lido_por?: string[] | null
          created_at?: string | null
        }
        Update: {
          id?: string
          titulo?: string
          mensagem?: string
          tipo?: 'informacao' | 'alerta' | 'urgente' | 'celebracao'
          enviado_por?: string | null
          enviado_por_nome?: string | null
          equipe_id?: string | null
          destinatarios?: string[] | null
          todos_membros?: boolean | null
          lido_por?: string[] | null
          created_at?: string | null
        }
        Relationships: []
      }
      metricas_membros: {
        Row: {
          id: string
          membro_id: string | null
          equipe_id: string | null
          mes_referencia: string
          tarefas_concluidas: number | null
          tarefas_atrasadas: number | null
          qualidade_media: number | null
          participacao_chat: number | null
          pontuacao_total: number | null
          observacoes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          membro_id?: string | null
          equipe_id?: string | null
          mes_referencia: string
          tarefas_concluidas?: number | null
          tarefas_atrasadas?: number | null
          qualidade_media?: number | null
          participacao_chat?: number | null
          pontuacao_total?: number | null
          observacoes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          membro_id?: string | null
          equipe_id?: string | null
          mes_referencia?: string
          tarefas_concluidas?: number | null
          tarefas_atrasadas?: number | null
          qualidade_media?: number | null
          participacao_chat?: number | null
          pontuacao_total?: number | null
          observacoes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
