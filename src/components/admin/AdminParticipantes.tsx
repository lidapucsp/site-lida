import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Shield, ShieldOff, Pencil, Award, Plus, Trash2, AlertTriangle, Link2, RefreshCw, Mail } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export function AdminParticipantes() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [cargoDialog, setCargoDialog] = useState(false)
  const [cargoInput, setCargoInput] = useState('')
  
  // Estados para criar/editar usuário
  const [userDialog, setUserDialog] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    full_name: ''
  })
  
  // Estados para deletar
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deletingProfile, setDeletingProfile] = useState<Profile | null>(null)

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProfiles(data || [])
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os participantes.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleAdmin = async (profileId: string, currentValue: boolean) => {
    setUpdating(profileId)
    try {
      const { error } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase types issue with update
        .update({ is_admin: !currentValue })
        .eq('id', profileId)

      if (error) throw error

      toast({
        title: 'Permissões atualizadas',
        description: `Usuário ${!currentValue ? 'promovido a' : 'removido de'} administrador.`,
      })

      fetchProfiles()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as permissões.',
        variant: 'destructive',
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleEditCargo = (profile: Profile) => {
    // Se o profile tem membro_id, o cargo vem da tabela membros (não editável aqui)
    if (profile.membro_id) {
      toast({
        title: 'Cargo sincronizado',
        description: 'Este cargo é sincronizado da tabela Membros da Diretoria. Para alterar, edite na aba "Diretoria".',
        variant: 'default',
      })
      return
    }
    
    setEditingProfile(profile)
    setCargoInput(profile.cargo || '')
    setCargoDialog(true)
  }

  const handleSaveCargo = async () => {
    if (!editingProfile) return

    setUpdating(editingProfile.id)
    try {
      const { error } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase types issue with update
        .update({ cargo: cargoInput.trim() || null })
        .eq('id', editingProfile.id)

      if (error) throw error

      toast({
        title: 'Cargo atualizado',
        description: cargoInput.trim() 
          ? `Cargo definido como "${cargoInput.trim()}"`
          : 'Cargo removido (agora é Membro participante)',
      })

      setCargoDialog(false)
      fetchProfiles()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o cargo.',
        variant: 'destructive',
      })
    } finally {
      setUpdating(null)
    }
  }

  const generateRandomPassword = () => {
    const length = 12
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
    let password = ''
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setFormData({ ...formData, password })
  }

  const handleNewUser = () => {
    setEditingProfile(null)
    setSendWelcomeEmail(false)
    setFormData({
      email: '',
      password: '',
      username: '',
      full_name: ''
    })
    setUserDialog(true)
  }

  const handleEditUser = (profile: Profile) => {
    setEditingProfile(profile)
    setFormData({
      email: '', // Não vamos mostrar o email atual por segurança
      password: '',
      username: profile.username,
      full_name: profile.full_name || ''
    })
    setUserDialog(true)
  }

  const handleSaveUser = async () => {
    if (!formData.username.trim()) {
      toast({
        title: 'Erro',
        description: 'Username é obrigatório.',
        variant: 'destructive',
      })
      return
    }

    if (!editingProfile && (!formData.email || !formData.password)) {
      toast({
        title: 'Erro',
        description: 'Email e senha são obrigatórios para criar um novo usuário.',
        variant: 'destructive',
      })
      return
    }

    setIsCreating(true)
    try {
      if (editingProfile) {
        // Editar usuário existente (apenas profile)
        const { error } = await supabase
          .from('profiles')
          // @ts-expect-error - Supabase types issue with update
          .update({
            username: formData.username.trim(),
            full_name: formData.full_name.trim() || null
          })
          .eq('id', editingProfile.id)

        if (error) throw error

        toast({
          title: 'Usuário atualizado',
          description: 'As informações foram atualizadas com sucesso.',
        })
      } else {
        // Criar novo usuário via Edge Function
        const { data: { session } } = await supabase.auth.getSession()
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-users`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${anonKey}`,
            },
            body: JSON.stringify({
              action: 'create',
              user_id: user?.id,
              email: formData.email,
              password: formData.password,
              username: formData.username.trim(),
              full_name: formData.full_name.trim() || null,
              send_welcome_email: sendWelcomeEmail
            })
          }
        )

        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || 'Erro ao criar usuário')
        }

        toast({
          title: 'Usuário criado',
          description: sendWelcomeEmail 
            ? `Usuário ${formData.username} criado com sucesso! Email de boas-vindas enviado para ${formData.email}.`
            : `Usuário ${formData.username} criado com sucesso. Senha inicial: ${formData.password}`,
        })
      }

      setUserDialog(false)
      fetchProfiles()
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível salvar o usuário.',
        variant: 'destructive',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteUser = (profile: Profile) => {
    setDeletingProfile(profile)
    setDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deletingProfile) return

    setUpdating(deletingProfile.id)
    try {
      // Deletar via Edge Function
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({
            action: 'delete',
            user_id: user?.id,
            target_user_id: deletingProfile.id
          })
        }
      )

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao deletar usuário')
      }

      // O profile será deletado automaticamente pelo cascade
      toast({
        title: 'Usuário removido',
        description: `${deletingProfile.full_name || deletingProfile.username} foi removido do sistema.`,
      })

      setDeleteDialog(false)
      fetchProfiles()
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível remover o usuário.',
        variant: 'destructive',
      })
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <>
      {/* Botão adicionar */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleNewUser}
          className="bg-navy text-cream hover:bg-navy-dark"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Participante
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Nome Completo</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles && profiles.length > 0 ? (
            profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">{profile.username}</TableCell>
                <TableCell>{profile.full_name || '-'}</TableCell>
                <TableCell>
                  {profile.cargo ? (
                    <div className="flex items-center gap-1.5">
                      <Badge className="bg-gold/20 text-gold-dark border border-gold/30">
                        {profile.cargo}
                      </Badge>
                      {profile.membro_id && (
                        <div className="flex items-center gap-1 text-xs text-navy-light" title="Sincronizado da Diretoria">
                          <Link2 className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-navy-light text-sm">Membro</span>
                  )}
                </TableCell>
                <TableCell>
                  {profile.is_admin ? (
                    <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1 w-fit">
                      <Shield className="w-3 h-3" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                      <ShieldOff className="w-3 h-3" />
                      Usuário
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(profile)}
                      className="text-navy hover:text-navy-dark hover:bg-navy/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCargo(profile)}
                      className="text-gold hover:text-gold-dark hover:bg-gold/10"
                    >
                      <Award className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(profile)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-2 border-l pl-2">
                      <span className="text-xs text-navy-light">Admin:</span>
                      <Switch
                        checked={profile.is_admin}
                        onCheckedChange={() => toggleAdmin(profile.id, profile.is_admin)}
                        disabled={updating === profile.id}
                      />
                      {updating === profile.id && (
                        <Loader2 className="w-4 h-4 animate-spin text-gold" />
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-navy-light">
                Nenhum participante cadastrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Dialog para editar cargo */}
      <Dialog open={cargoDialog} onOpenChange={setCargoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-navy">Editar Cargo</DialogTitle>
            <DialogDescription>
              Defina o cargo de <span className="font-semibold">{editingProfile?.full_name || editingProfile?.username}</span> na diretoria.
              Deixe em branco para membro participante regular.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo na Diretoria</Label>
              <Input
                id="cargo"
                placeholder="Ex: Presidente, Vice-Coordenador, Diretor de Comunicação..."
                value={cargoInput}
                onChange={(e) => setCargoInput(e.target.value)}
                className="border-gold/30"
              />
              <p className="text-xs text-navy-light">
                Deixe vazio para que apareça apenas como "Membro" na área de membros.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCargoDialog(false)}
              className="border-gold/30"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveCargo}
              disabled={updating === editingProfile?.id}
              className="bg-navy text-cream hover:bg-navy-dark"
            >
              {updating === editingProfile?.id && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para criar/editar usuário */}
      <Dialog open={userDialog} onOpenChange={setUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy">
              {editingProfile ? 'Editar Participante' : 'Novo Participante'}
            </DialogTitle>
            <DialogDescription>
              {editingProfile 
                ? 'Atualize as informações do participante.' 
                : 'Crie um novo participante. A senha inicial deve ser alterada pelo usuário após o primeiro login.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!editingProfile && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-gold/30"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha Inicial *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="password"
                      type="text"
                      placeholder="Senha temporária (mínimo 6 caracteres)"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="border-gold/30"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={generateRandomPassword}
                      className="border-gold/30 shrink-0"
                      title="Gerar senha aleatória"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-navy-light">
                    O usuário deverá alterar esta senha após o primeiro login.
                  </p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                placeholder="nomedeusuario"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="border-gold/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input
                id="full_name"
                placeholder="Nome completo do participante"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="border-gold/30"
              />
            </div>

            {!editingProfile && (
              <>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-gold/30 bg-gold/5">
                  <Switch
                    id="send-email"
                    checked={sendWelcomeEmail}
                    onCheckedChange={setSendWelcomeEmail}
                  />
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-navy" />
                    <Label htmlFor="send-email" className="text-sm cursor-pointer">
                      Enviar email de boas-vindas automaticamente
                    </Label>
                  </div>
                </div>
                <Alert className="bg-gold/10 border-gold/30">
                  <AlertDescription className="text-sm text-navy-light">
                    {sendWelcomeEmail ? (
                      <>
                        <strong>Email automático:</strong> O usuário receberá um email com as credenciais de acesso.
                      </>
                    ) : (
                      <>
                        <strong>Importante:</strong> Anote a senha inicial criada para passar ao usuário.
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUserDialog(false)}
              className="border-gold/30"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveUser}
              disabled={isCreating}
              className="bg-navy text-cream hover:bg-navy-dark"
            >
              {isCreating && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editingProfile ? 'Atualizar' : 'Criar Usuário'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação para deletar */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-navy flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover <span className="font-semibold">{deletingProfile?.full_name || deletingProfile?.username}</span>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <Alert variant="destructive">
            <AlertDescription>
              Todos os dados associados a este usuário serão permanentemente removidos do sistema.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(false)}
              className="border-gold/30"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={updating === deletingProfile?.id}
              variant="destructive"
            >
              {updating === deletingProfile?.id && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Sim, Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
