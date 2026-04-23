import { createClient } from 'jsr:@supabase/supabase-js@2'
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ManageUserRequest {
  action: 'create' | 'delete'
  user_id: string
  target_user_id?: string
  email?: string
  password?: string
  username?: string
  full_name?: string
  send_welcome_email?: boolean
}

async function sendWelcomeEmail(
  recipientEmail: string, 
  recipientName: string, 
  username: string,
  password: string
): Promise<void> {
  const GMAIL_EMAIL = Deno.env.get('GMAIL_EMAIL')
  const GMAIL_PASSWORD = Deno.env.get('GMAIL_PASSWORD')

  if (!GMAIL_EMAIL || !GMAIL_PASSWORD) {
    throw new Error('Gmail credentials not configured')
  }

  const client = new SMTPClient({
    connection: {
      hostname: 'smtp.gmail.com',
      port: 465,
      tls: true,
      auth: {
        username: GMAIL_EMAIL,
        password: GMAIL_PASSWORD,
      },
    },
  })

  const emailHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;line-height:1.6;color:#1a1a2e;margin:0;padding:0}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:linear-gradient(135deg,#1a1a2e 0%,#2d3561 100%);color:#f5f0e8;padding:30px;text-align:center;border-radius:10px 10px 0 0}.content{background:#ffffff;padding:30px;border:1px solid #d4af37;border-top:none;border-radius:0 0 10px 10px}.credentials{background:#f5f0e8;border-left:4px solid #d4af37;padding:20px;margin:20px 0;border-radius:5px}.credentials strong{color:#1a1a2e}.credentials code{background:#ffffff;padding:4px 8px;border-radius:3px;font-family:'Courier New',monospace;color:#d4af37;font-weight:bold}.footer{text-align:center;margin-top:30px;color:#666;font-size:0.9em}.button{display:inline-block;background:#d4af37;color:#1a1a2e;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:bold;margin:20px 0}.warning{background:#fff3cd;border-left:4px solid #ffc107;padding:15px;margin:20px 0;border-radius:5px}</style></head><body><div class="container"><div class="header"><h1 style="margin:0">🎉 Bem-vindo(a) ao LIDA!</h1></div><div class="content"><p>Olá <strong>${recipientName}</strong>,</p><p>Sua conta de membro para acessar a área de membros do site do LIDA foi criada com sucesso!</p><div class="credentials"><h3 style="margin-top:0;color:#1a1a2e">🔐 Suas Credenciais de Acesso</h3><p><strong>Email:</strong> <code>${recipientEmail}</code></p><p><strong>Senha:</strong> <code>${password}</code></p></div><div style="text-align:center"><a href="https://lida.puc-sp.br/membros/login" class="button">Acessar Área de Membros</a></div><div class="warning"><strong>⚠️ Importante:</strong> Por segurança, recomendamos que você altere sua senha após o primeiro login. Você pode fazer isso acessando a área de membros e indo em "Perfil" > "Alterar Senha".</div><p>Se você tiver alguma dúvida ou precisar de ajuda, não hesite em entrar em contato conosco.</p><p>Bem-vindo(a) à comunidade!</p><p style="margin-top:30px"><strong>Atenciosamente,</strong><br>Equipe LIDA - PUC-SP</p></div><div class="footer"><p>LIDA - Laboratório de Inteligência de Dados e Algoritmos<br>Pontifícia Universidade Católica de São Paulo</p></div></div></body></html>`

  await client.send({
    from: GMAIL_EMAIL,
    to: recipientEmail,
    subject: '🎉 Bem-vindo ao LIDA - Credenciais de Acesso',
    content: 'Sua conta foi criada com sucesso!',
    html: emailHTML,
  })

  await client.close()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, user_id, target_user_id, email, password, username, full_name, send_welcome_email } = await req.json() as ManageUserRequest

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Cliente admin com service_role key (bypassa RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Verificar se o usuário requisitante é admin usando service_role (bypassa RLS)
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user_id)
      .single()

    if (profileError || !profileData) {
      return new Response(
        JSON.stringify({ error: 'User profile not found', user_id, profileError }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!profileData.is_admin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required - User is not admin', is_admin: profileData.is_admin }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let result

    if (action === 'create') {
      if (!email || !password || !username) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: email, password, username' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Criar usuário via Admin API
      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          username: username.trim(),
          full_name: full_name?.trim() || null
        }
      })

      if (createError) {
        throw createError
      }

      // Enviar email de boas-vindas se solicitado
      if (send_welcome_email) {
        try {
          await sendWelcomeEmail(
            email,
            full_name?.trim() || username.trim(),
            username.trim(),
            password
          )
        } catch (emailError: any) {
          // Log erro mas não falha a criação do usuário
          console.error('Erro ao enviar email de boas-vindas:', emailError)
        }
      }

      result = { 
        success: true, 
        user: userData.user,
        message: 'Usuário criado com sucesso' + (send_welcome_email ? ' e email enviado' : '')
      }
    } else if (action === 'delete') {
      if (!target_user_id) {
        return new Response(
          JSON.stringify({ error: 'Missing target_user_id for delete action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Deletar usuário via Admin API
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(target_user_id)

      if (deleteError) {
        throw deleteError
      }

      result = { 
        success: true,
        message: 'Usuário removido com sucesso'
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Use "create" or "delete"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
