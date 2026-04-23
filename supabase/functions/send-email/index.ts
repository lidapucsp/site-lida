import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  assunto: string
  mensagem: string
  user_id: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Pegar dados do request (incluindo user_id enviado pelo cliente)
    const { assunto, mensagem, user_id }: EmailRequest = await req.json()

    if (!assunto || !mensagem || !user_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Subject, message and user_id are required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }
    
    // Pegar credenciais
    const GMAIL_EMAIL = Deno.env.get('GMAIL_EMAIL')
    const GMAIL_PASSWORD = Deno.env.get('GMAIL_PASSWORD')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    if (!GMAIL_EMAIL || !GMAIL_PASSWORD) {
      return new Response(
        JSON.stringify({ success: false, error: 'Gmail credentials not configured' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    // Buscar todos os usuários usando Auth Admin API
    const usersResponse = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    )

    if (!usersResponse.ok) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch users' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    const usersData = await usersResponse.json()
    const emails = usersData.users
      .map((user: any) => user.email)
      .filter((email: string | null) => email) as string[]

    if (emails.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No recipients found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Configurar cliente SMTP do Gmail
    const client = new SMTPClient({
      connection: {
        hostname: 'smtp.gmail.com',
        port: 465,
        tls: true,
        auth: {
          username: GMAIL_EMAIL!,
          password: GMAIL_PASSWORD!,
        },
      },
    })

    // HTML do email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #1e3a5f;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
              color: #f5f1e8;
              padding: 30px 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background: #ffffff;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .message {
              white-space: pre-wrap;
              margin: 20px 0;
            }
            .footer {
              background: #f5f1e8;
              padding: 20px;
              border-radius: 0 0 8px 8px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">LIDA - PUC-SP</div>
            <p style="margin: 0; opacity: 0.9;">Laboratório Interdisciplinar de Dados</p>
          </div>
          <div class="content">
            <div class="message">${mensagem.replace(/\n/g, '<br>')}</div>
          </div>
          <div class="footer">
            <p style="margin: 0 0 5px 0;">—</p>
            <p style="margin: 0;">Este email foi enviado pelo LIDA - PUC-SP</p>
            <p style="margin: 5px 0 0 0;">${GMAIL_EMAIL}</p>
          </div>
        </body>
      </html>
    `

    // Enviar email para cada destinatário
    const errors: string[] = []
    let successCount = 0

    for (const email of emails) {
      try {
        await client.send({
          from: `LIDA PUC-SP <${GMAIL_EMAIL}>`,
          to: email,
          subject: assunto,
          content: mensagem,
          html: htmlContent,
        })
        successCount++
      } catch (error: any) {
        errors.push(`${email}: ${error.message}`)
      }
    }

    await client.close()

    // Registrar comunicado no banco de dados via REST API
    const status = errors.length === 0 ? 'enviado' 
      : successCount === 0 ? 'falha' 
      : 'parcial'

    await fetch(
      `${SUPABASE_URL}/rest/v1/comunicados`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          assunto,
          mensagem,
          enviado_por: user_id,
          destinatarios: emails,
          status
        })
      }
    )

    return new Response(
      JSON.stringify({
        success: true,
        message: `Email enviado para ${successCount} de ${emails.length} destinatário(s)`,
        data: {
          total: emails.length,
          success: successCount,
          failed: errors.length,
          errors: errors.length > 0 ? errors : undefined
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
