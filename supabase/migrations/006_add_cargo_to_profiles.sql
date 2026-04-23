-- Migration: Add cargo field to profiles table
-- Description: Add optional cargo field to distinguish between regular members and members with specific roles
-- Created: 2026-04-22

-- Add cargo column to profiles table
ALTER TABLE public.profiles
ADD COLUMN cargo TEXT;

-- Add comment explaining the field
COMMENT ON COLUMN public.profiles.cargo IS 'Cargo do membro na diretoria (ex: Presidente, Coordenador). NULL para membros participantes regulares.';

-- Create index for better query performance when filtering by cargo
CREATE INDEX idx_profiles_cargo ON public.profiles(cargo) WHERE cargo IS NOT NULL;
