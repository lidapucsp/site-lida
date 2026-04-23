-- Migration: Add presidente to membros tipo
-- Description: Add 'presidente' option to the tipo field in membros table
-- Created: 2026-04-22

-- Remove o constraint antigo
ALTER TABLE membros DROP CONSTRAINT IF EXISTS membros_tipo_check;

-- Adiciona o novo constraint com 'presidente'
ALTER TABLE membros ADD CONSTRAINT membros_tipo_check 
CHECK (tipo IN ('coordenador', 'diretor', 'presidente', 'membro'));

-- Comentário explicativo
COMMENT ON COLUMN membros.tipo IS 'Tipo do membro: coordenador (orientador/coordenador acadêmico), diretor (membro da diretoria), presidente (presidente da organização), membro (membro regular)';
