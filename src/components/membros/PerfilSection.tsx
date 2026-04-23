import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase'
import { Loader2, User, Briefcase, Building2, Linkedin, Mail, Lock, Save, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'

export default function PerfilSection() {
  const { profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Estado do formulário de perfil
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    linkedin: '',
    instituicao: '',
    funcao: '',
    avatar_url: ''
  })

  // Atualizar formData quando profile carregar ou mudar
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        linkedin: profile.linkedin || '',
        instituicao: profile.instituicao || '',
        funcao: profile.funcao || '',
        avatar_url: profile.avatar_url || ''
      })
    }
  }, [profile])

  // Estado do formulário de email
  const [newEmail, setNewEmail] = useState('')

  // Estado do formulário de senha
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          linkedin: formData.linkedin,
          instituicao: formData.instituicao,
          funcao: formData.funcao,
          avatar_url: formData.avatar_url
        })
        .eq('id', profile?.id)

      if (error) throw error

      await refreshProfile()
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao atualizar perfil' })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!newEmail || !newEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Email inválido' })
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail })

      if (error) throw error

      setMessage({
        type: 'success',
        text: 'Um email de confirmação foi enviado para o novo endereço. Verifique sua caixa de entrada.'
      })
      setNewEmail('')
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao atualizar email' })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (passwordData.new !== passwordData.confirm) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' })
      setLoading(false)
      return
    }

    if (passwordData.new.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres' })
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' })
      setPasswordData({ current: '', new: '', confirm: '' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao alterar senha' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mensagens de feedback */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="border-gold/30">
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Card de Informações do Perfil */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="text-navy font-display flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações do Perfil
          </CardTitle>
          <CardDescription>
            Essas informações serão visíveis para outros membros do LIDA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-gold/20">
                <AvatarImage src={formData.avatar_url} />
                <AvatarFallback className="bg-navy text-cream text-2xl">
                  {formData.full_name
                    ? formData.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                    : profile?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="avatar_url">URL da Foto de Perfil</Label>
                <Input
                  id="avatar_url"
                  type="url"
                  placeholder="https://exemplo.com/foto.jpg"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  className="border-gold/30"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Cole o link de uma imagem hospedada na web
                </p>
              </div>
            </div>

            <Separator className="bg-gold/20" />

            {/* Nome Completo */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="border-gold/30"
                required
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre você, suas áreas de interesse, projetos..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="border-gold/30 min-h-[120px]"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.bio.length}/500 caracteres
              </p>
            </div>

            {/* Instituição */}
            <div className="space-y-2">
              <Label htmlFor="instituicao" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Instituição
              </Label>
              <Input
                id="instituicao"
                placeholder="Ex: PUC-SP, USP, Empresa X..."
                value={formData.instituicao}
                onChange={(e) => setFormData({ ...formData, instituicao: e.target.value })}
                className="border-gold/30"
              />
              <p className="text-xs text-muted-foreground">
                Onde você estuda ou trabalha atualmente
              </p>
            </div>

            {/* Função */}
            <div className="space-y-2">
              <Label htmlFor="funcao" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Função
              </Label>
              <Input
                id="funcao"
                placeholder="Ex: Pesquisador, Estudante de Doutorado, Desenvolvedor..."
                value={formData.funcao}
                onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                className="border-gold/30"
              />
              <p className="text-xs text-muted-foreground">
                Seu cargo ou função atual
              </p>
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                type="url"
                placeholder="https://www.linkedin.com/in/seu-perfil"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="border-gold/30"
              />
              <p className="text-xs text-muted-foreground">
                URL completa do seu perfil no LinkedIn
              </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full" variant="hero">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Card de Segurança - Email */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="text-navy font-display flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Alterar Email
          </CardTitle>
          <CardDescription>
            Seu email atual: <strong>{profile?.email || 'Não definido'}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new_email">Novo Email</Label>
              <Input
                id="new_email"
                type="email"
                placeholder="novo@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="border-gold/30"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full" variant="outline">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Atualizar Email
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Card de Segurança - Senha */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="text-navy font-display flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Alterar Senha
          </CardTitle>
          <CardDescription>
            Use uma senha forte com no mínimo 6 caracteres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new_password">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="border-gold/30 pr-10"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="border-gold/30 pr-10"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full" variant="outline">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Alterando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Alterar Senha
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
