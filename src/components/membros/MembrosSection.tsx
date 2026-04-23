import { useProfiles } from '@/hooks/useProfiles'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Search, Linkedin, Users, Building2, Briefcase, Mail, Shield } from 'lucide-react'
import { useState } from 'react'

export default function MembrosSection() {
  const { profiles, loading } = useProfiles()
  const [busca, setBusca] = useState('')

  const perfisFiltrados = profiles.filter((profile) => {
    if (!busca) return true
    const searchLower = busca.toLowerCase()
    return (
      profile.full_name?.toLowerCase().includes(searchLower) ||
      profile.username.toLowerCase().includes(searchLower) ||
      profile.bio?.toLowerCase().includes(searchLower) ||
      profile.instituicao?.toLowerCase().includes(searchLower) ||
      profile.funcao?.toLowerCase().includes(searchLower)
    )
  })

  // Ordenar: admins primeiro, depois por nome
  const perfisOrdenados = [...perfisFiltrados].sort((a, b) => {
    if (a.is_admin && !b.is_admin) return -1
    if (!a.is_admin && b.is_admin) return 1
    return (a.full_name || a.username).localeCompare(b.full_name || b.username)
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="text-navy font-display">Comunidade LIDA</CardTitle>
          <CardDescription>
            Conecte-se com outros membros e pesquisadores do laboratório
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-light" />
              <Input
                placeholder="Buscar por nome, instituição, função..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 border-gold/30"
              />
            </div>
            <Badge variant="outline" className="border-gold text-gold">
              {perfisFiltrados.length} {perfisFiltrados.length === 1 ? 'membro' : 'membros'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Perfis */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {perfisOrdenados.map((profile) => {
          return (
            <Card
              key={profile.id}
              className="border-gold/20 hover:shadow-lg transition-shadow relative overflow-hidden"
            >
              {profile.is_admin && (
                <div className="absolute top-0 right-0 bg-gold text-navy px-3 py-1 text-xs font-semibold flex items-center gap-1 rounded-bl-lg">
                  <Shield className="w-3 h-3" />
                  Admin
                </div>
              )}

              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-gold/20">
                  <AvatarImage src={profile.avatar_url || ''} />
                  <AvatarFallback className="bg-navy text-cream text-2xl font-bold">
                    {(profile.full_name || profile.username)
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <CardTitle className="text-lg font-display text-navy">
                  {profile.full_name || profile.username}
                </CardTitle>

                {/* Badge de Cargo */}
                <div className="mt-2">
                  <Badge 
                    variant="outline" 
                    className={profile.cargo ? "border-gold text-gold" : "border-navy/20 text-navy-light"}
                  >
                    {profile.cargo || 'Membro'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {profile.funcao && (
                  <div className="flex items-start gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-navy-light">{profile.funcao}</span>
                  </div>
                )}

                {profile.instituicao && (
                  <div className="flex items-start gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-navy-light">{profile.instituicao}</span>
                  </div>
                )}

                {profile.bio && (
                  <p className="text-sm text-navy-light line-clamp-3 pt-2 border-t border-gold/10">
                    {profile.bio}
                  </p>
                )}

                {profile.linkedin && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gold text-navy hover:bg-gold hover:text-navy"
                    onClick={() => window.open(profile.linkedin!, '_blank')}
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    Ver LinkedIn
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {perfisFiltrados.length === 0 && (
        <Card className="border-gold/20">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-gold mx-auto mb-4 opacity-60" />
            <p className="text-navy-light">
              {busca
                ? 'Nenhum membro encontrado com esses critérios'
                : 'Nenhum membro cadastrado no momento'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas */}
      <Card className="border-gold/20 bg-gradient-to-br from-navy to-navy-light text-cream">
        <CardHeader>
          <CardTitle className="text-cream font-display">Estatísticas da Comunidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">
                {profiles.length}
              </div>
              <div className="text-sm text-cream/80">Total de Membros</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">
                {profiles.filter((p) => p.is_admin).length}
              </div>
              <div className="text-sm text-cream/80">Administradores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">
                {profiles.filter((p) => p.bio).length}
              </div>
              <div className="text-sm text-cream/80">Perfis Completos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
