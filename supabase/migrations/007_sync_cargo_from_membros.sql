-- Migration: Sync cargo from membros to profiles
-- Description: Automatically sync cargo field from membros table to profiles when membro_id is set
-- Created: 2026-04-22

-- Função para sincronizar cargo de membros para profiles
CREATE OR REPLACE FUNCTION sync_cargo_from_membros()
RETURNS TRIGGER AS $$
BEGIN
  -- Se membro_id foi definido, buscar o cargo correspondente
  IF NEW.membro_id IS NOT NULL THEN
    UPDATE profiles
    SET cargo = (SELECT cargo FROM membros WHERE id = NEW.membro_id)
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para sincronizar cargo quando profile é inserido ou atualizado
CREATE TRIGGER trigger_sync_cargo_from_membros
AFTER INSERT OR UPDATE OF membro_id ON profiles
FOR EACH ROW
EXECUTE FUNCTION sync_cargo_from_membros();

-- Atualizar profiles existentes que já têm membro_id mas ainda não têm cargo sincronizado
UPDATE profiles p
SET cargo = m.cargo
FROM membros m
WHERE p.membro_id = m.id
  AND (p.cargo IS NULL OR p.cargo != m.cargo);

-- Comentário explicativo
COMMENT ON FUNCTION sync_cargo_from_membros IS 'Sincroniza automaticamente o campo cargo da tabela membros para profiles quando membro_id é definido';
COMMENT ON TRIGGER trigger_sync_cargo_from_membros ON profiles IS 'Mantém o campo cargo sincronizado com a tabela membros';
