import { useState } from 'react'
import { useForumPosts, useForumComentarios } from '@/hooks/useForum'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MessageSquare,
  Plus,
  ThumbsUp,
  ExternalLink,
  Loader2,
  Pin,
  Send,
  Trash2
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ForumSection() {
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos')
  const [dialogNovoPost, setDialogNovoPost] = useState(false)
  const [postAberto, setPostAberto] = useState<any>(null)
  const { user, profile } = useAuth()

  const { posts, loading, refetch } = useForumPosts({
    tipo: tipoFiltro === 'todos' ? undefined : tipoFiltro
  })

  const getTipoLabel = (tipo: string) => {
    const tipos: Record<string, { label: string; color: string }> = {
      discussao: { label: 'Discussão', color: 'bg-blue-500' },
      link: { label: 'Link', color: 'bg-purple-500' },
      pergunta: { label: 'Pergunta', color: 'bg-orange-500' },
      noticia: { label: 'Notícia', color: 'bg-green-500' }
    }
    return tipos[tipo] || tipos.discussao
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com Filtros e Botão */}
      <Card className="border-gold/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-navy font-display">Fórum de Membros</CardTitle>
              <CardDescription>
                Compartilhe ideias, links interessantes e discuta com outros membros
              </CardDescription>
            </div>
            <Dialog open={dialogNovoPost} onOpenChange={setDialogNovoPost}>
              <DialogTrigger asChild>
                <Button className="bg-gold hover:bg-gold-dark text-navy">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Postagem
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <NovoPostForm
                  onSuccess={() => {
                    setDialogNovoPost(false)
                    refetch()
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={tipoFiltro} onValueChange={setTipoFiltro}>
            <TabsList className="grid w-full max-w-lg grid-cols-5">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="discussao">Discussões</TabsTrigger>
              <TabsTrigger value="pergunta">Perguntas</TabsTrigger>
              <TabsTrigger value="link">Links</TabsTrigger>
              <TabsTrigger value="noticia">Notícias</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Lista de Posts */}
      <div className="space-y-4">
        {posts.map((post) => {
          const tipoInfo = getTipoLabel(post.tipo)
          
          return (
            <Card
              key={post.id}
              className="border-gold/20 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setPostAberto(post)}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.autor_avatar || ''} />
                    <AvatarFallback className="bg-gold text-navy">
                      {post.autor_nome.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-navy">{post.autor_nome}</span>
                      <span className="text-xs text-navy-light">
                        {formatDistanceToNow(new Date(post.created_at), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </span>
                      {post.fixado && (
                        <Pin className="w-3 h-3 text-gold" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={`${tipoInfo.color} text-white text-xs`}>
                        {tipoInfo.label}
                      </Badge>
                      {post.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="font-display font-semibold text-lg text-navy mb-2">
                      {post.titulo}
                    </h3>
                    
                    <p className="text-navy-light line-clamp-2 mb-3">
                      {post.conteudo}
                    </p>

                    {post.link_url && (
                      <div className="bg-cream p-3 rounded-lg border border-gold/20 mb-3">
                        <div className="flex items-start gap-2">
                          <ExternalLink className="w-4 h-4 text-gold shrink-0 mt-1" />
                          <div className="min-w-0">
                            {post.link_titulo && (
                              <p className="font-medium text-navy text-sm truncate">
                                {post.link_titulo}
                              </p>
                            )}
                            {post.link_descricao && (
                              <p className="text-xs text-navy-light line-clamp-2">
                                {post.link_descricao}
                              </p>
                            )}
                            <a
                              href={post.link_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gold hover:underline truncate block"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {post.link_url}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-navy-light">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.total_curtidas}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.total_comentarios}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {posts.length === 0 && (
        <Card className="border-gold/20">
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 text-gold mx-auto mb-4 opacity-60" />
            <p className="text-navy-light mb-4">
              Nenhuma postagem encontrada. Seja o primeiro a compartilhar!
            </p>
            <Button
              onClick={() => setDialogNovoPost(true)}
              className="bg-gold hover:bg-gold-dark text-navy"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Postagem
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Post Completo com Comentários */}
      {postAberto && (
        <PostDialog
          post={postAberto}
          onClose={() => setPostAberto(null)}
          onUpdate={refetch}
        />
      )}
    </div>
  )
}

// Componente para criar novo post
function NovoPostForm({ onSuccess }: { onSuccess: () => void }) {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [tipo, setTipo] = useState('discussao')
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [linkTitulo, setLinkTitulo] = useState('')
  const [linkDescricao, setLinkDescricao] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return

    setLoading(true)
    try {
      const { error } = await supabase.from('forum_posts').insert({
        titulo,
        conteudo,
        tipo,
        link_url: linkUrl || null,
        link_titulo: linkTitulo || null,
        link_descricao: linkDescricao || null,
        autor_id: user.id,
        autor_nome: profile.full_name || profile.username,
        autor_avatar: profile.avatar_url
      })

      if (error) throw error
      onSuccess()
    } catch (error) {
      console.error('[FORUM] Erro ao criar post:', error)
      alert('Erro ao criar postagem. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-navy font-display">Nova Postagem</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="tipo">Tipo de Postagem</Label>
          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discussao">Discussão</SelectItem>
              <SelectItem value="pergunta">Pergunta</SelectItem>
              <SelectItem value="link">Compartilhar Link</SelectItem>
              <SelectItem value="noticia">Notícia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="titulo">Título*</Label>
          <Input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Dê um título para sua postagem"
            required
            minLength={5}
          />
        </div>

        <div>
          <Label htmlFor="conteudo">Conteúdo*</Label>
          <Textarea
            id="conteudo"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Compartilhe suas ideias, perguntas ou informações..."
            rows={6}
            required
          />
        </div>

        {(tipo === 'link' || tipo === 'noticia') && (
          <div className="space-y-3 p-4 bg-cream rounded-lg border border-gold/20">
            <h4 className="font-semibold text-navy text-sm">Informações do Link</h4>
            <div>
              <Label htmlFor="linkUrl">URL*</Label>
              <Input
                id="linkUrl"
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                required={tipo === 'link' || tipo === 'noticia'}
              />
            </div>
            <div>
              <Label htmlFor="linkTitulo">Título do Link</Label>
              <Input
                id="linkTitulo"
                value={linkTitulo}
                onChange={(e) => setLinkTitulo(e.target.value)}
                placeholder="Título da página ou artigo"
              />
            </div>
            <div>
              <Label htmlFor="linkDescricao">Descrição</Label>
              <Textarea
                id="linkDescricao"
                value={linkDescricao}
                onChange={(e) => setLinkDescricao(e.target.value)}
                placeholder="Breve descrição do conteúdo"
                rows={2}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={loading} className="bg-gold hover:bg-gold-dark text-navy">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Publicar
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

// Dialog para visualizar post completo com comentários
function PostDialog({ post, onClose, onUpdate }: any) {
  const { user, profile } = useAuth()
  const { comentarios, refetch: refetchComentarios } = useForumComentarios(post.id)
  const [novoComentario, setNovoComentario] = useState('')
  const [loading, setLoading] = useState(false)
  const [curtido, setCurtido] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleCurtir = async () => {
    if (!user) return

    try {
      if (curtido) {
        await supabase
          .from('forum_curtidas')
          .delete()
          .eq('post_id', post.id)
          .eq('usuario_id', user.id)
        setCurtido(false)
      } else {
        await supabase.from('forum_curtidas').insert({
          post_id: post.id,
          usuario_id: user.id
        })
        setCurtido(true)
      }
      onUpdate()
    } catch (error) {
      console.error('[FORUM] Erro ao curtir:', error)
    }
  }

  const handleDeletePost = async () => {
    if (!user || user.id !== post.autor_id) return
    if (!confirm('Tem certeza que deseja deletar esta postagem?')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', post.id)
        .eq('autor_id', user.id) // Segurança adicional no banco

      if (error) throw error
      onUpdate()
      onClose()
    } catch (error) {
      console.error('[FORUM] Erro ao deletar post:', error)
      alert('Erro ao deletar postagem. Tente novamente.')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteComentario = async (comentarioId: string, autorId: string) => {
    if (!user || user.id !== autorId) return
    if (!confirm('Tem certeza que deseja deletar este comentário?')) return

    try {
      const { error } = await supabase
        .from('forum_comentarios')
        .delete()
        .eq('id', comentarioId)
        .eq('autor_id', user.id) // Segurança adicional no banco

      if (error) throw error
      refetchComentarios()
      onUpdate()
    } catch (error) {
      console.error('[FORUM] Erro ao deletar comentário:', error)
      alert('Erro ao deletar comentário. Tente novamente.')
    }
  }

  const handleComentar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile || !novoComentario.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase.from('forum_comentarios').insert({
        post_id: post.id,
        conteudo: novoComentario,
        autor_id: user.id,
        autor_nome: profile.full_name || profile.username,
        autor_avatar: profile.avatar_url
      })

      if (error) throw error
      setNovoComentario('')
      refetchComentarios()
      onUpdate()
    } catch (error) {
      console.error('[FORUM] Erro ao comentar:', error)
    } finally {
      setLoading(false)
    }
  }

  const tipoInfo = {
    discussao: { label: 'Discussão', color: 'bg-blue-500' },
    link: { label: 'Link', color: 'bg-purple-500' },
    pergunta: { label: 'Pergunta', color: 'bg-orange-500' },
    noticia: { label: 'Notícia', color: 'bg-green-500' }
  }[post.tipo]

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header do Post */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.autor_avatar || ''} />
                <AvatarFallback className="bg-gold text-navy">
                  {post.autor_nome.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-navy">{post.autor_nome}</span>
                  <Badge className={`${tipoInfo?.color} text-white text-xs`}>
                    {tipoInfo?.label}
                  </Badge>
                </div>
                <span className="text-xs text-navy-light">
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
              </div>
              {user?.id === post.autor_id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeletePost}
                  disabled={deleting}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>

            <h2 className="text-2xl font-display font-bold text-navy mb-4">
              {post.titulo}
            </h2>

            <p className="text-navy-light whitespace-pre-wrap mb-4">
              {post.conteudo}
            </p>

            {post.link_url && (
              <Card className="bg-cream border-gold/20 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <ExternalLink className="w-5 h-5 text-gold shrink-0 mt-1" />
                    <div>
                      {post.link_titulo && (
                        <h4 className="font-semibold text-navy mb-1">{post.link_titulo}</h4>
                      )}
                      {post.link_descricao && (
                        <p className="text-sm text-navy-light mb-2">{post.link_descricao}</p>
                      )}
                      <a
                        href={post.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gold hover:underline break-all"
                      >
                        {post.link_url}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCurtir}
                className={curtido ? 'border-gold bg-gold/10' : ''}
              >
                <ThumbsUp className={`w-4 h-4 mr-1 ${curtido ? 'fill-gold text-gold' : ''}`} />
                {post.total_curtidas}
              </Button>
              <div className="flex items-center gap-1 text-sm text-navy-light">
                <MessageSquare className="w-4 h-4" />
                {post.total_comentarios} comentários
              </div>
            </div>
          </div>

          <div className="border-t border-gold/20 pt-6">
            <h3 className="font-semibold text-navy mb-4">Comentários</h3>

            {/* Lista de Comentários */}
            <div className="space-y-4">
              {comentarios.map((comentario) => (
                <div key={comentario.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comentario.autor_avatar || ''} />
                    <AvatarFallback className="bg-navy text-cream text-xs">
                      {comentario.autor_nome.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-cream rounded-lg p-3 border border-gold/20">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-navy text-sm">
                          {comentario.autor_nome}
                        </span>
                        <span className="text-xs text-navy-light">
                          {formatDistanceToNow(new Date(comentario.created_at), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </span>
                        {user?.id === comentario.autor_id && (
                          <button
                            onClick={() => handleDeleteComentario(comentario.id, comentario.autor_id)}
                            className="ml-auto text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Deletar comentário"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-navy-light text-sm whitespace-pre-wrap">
                        {comentario.conteudo}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {comentarios.length === 0 && (
              <p className="text-center text-navy-light py-8">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            )}

            {/* Form de Novo Comentário */}
            <form onSubmit={handleComentar} className="mt-6 pt-6 border-t border-gold/20">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="bg-gold text-navy text-xs">
                    {profile?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    placeholder="Adicione um comentário..."
                    rows={3}
                    className="mb-2"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={loading || !novoComentario.trim()}
                    className="bg-gold hover:bg-gold-dark text-navy"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Comentar'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
