import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RespostaContatoRequest {
  destinatario_email: string
  destinatario_nome: string
  assunto_original: string
  mensagem_original: string
  resposta: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      destinatario_email, 
      destinatario_nome, 
      assunto_original, 
      mensagem_original, 
      resposta 
    }: RespostaContatoRequest = await req.json()

    if (!destinatario_email || !destinatario_nome || !assunto_original || !resposta) {
      return new Response(
        JSON.stringify({ success: false, error: 'Campos obrigatórios faltando' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }
    
    // Pegar credenciais do Gmail
    const GMAIL_EMAIL = Deno.env.get('GMAIL_EMAIL')
    const GMAIL_PASSWORD = Deno.env.get('GMAIL_PASSWORD')

    if (!GMAIL_EMAIL || !GMAIL_PASSWORD) {
      return new Response(
        JSON.stringify({ success: false, error: 'Credenciais do Gmail não configuradas' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
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
          username: GMAIL_EMAIL,
          password: GMAIL_PASSWORD,
        },
      },
    })

    // HTML do email
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e3a5f; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f1e8; }
.container { background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.header { background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%); color: #f5f1e8; padding: 30px 20px; text-align: center; }
.logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; letter-spacing: 2px; }
.subtitle { font-size: 14px; opacity: 0.9; }
.content { padding: 30px; }
.greeting { font-size: 16px; color: #1e3a5f; margin-bottom: 20px; }
.resposta { background: #f9fafb; border-left: 4px solid #d4af37; padding: 20px; margin: 20px 0; white-space: pre-wrap; border-radius: 0 8px 8px 0; }
.original-message { margin-top: 30px; padding: 20px; background: #f5f1e8; border-radius: 8px; border: 1px solid #e5e7eb; }
.original-label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
.original-text { color: #4b5563; font-size: 14px; white-space: pre-wrap; }
.footer { background: #f5f1e8; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
.footer-logo { font-weight: bold; color: #d4af37; font-size: 14px; margin-bottom: 5px; }
</style>
</head>
<body>
<div class="container">
<div class="header">
<div class="logo">LIDA</div>
<div class="subtitle">Laboratório de Inteligência e Direito Aplicado</div>
</div>
<div class="content">
<div class="greeting">Olá <strong>${destinatario_nome}</strong>,</div>
<div class="resposta">${resposta.split('\n').map((linha: string) => `<p style="margin: 0 0 10px 0;">${linha || '&nbsp;'}</p>`).join('')}</div>
${mensagem_original ? `<div class="original-message"><div class="original-label">Em resposta à sua mensagem:</div><div class="original-text">${mensagem_original}</div></div>` : ''}
</div>
<div class="footer">
<div class="footer-logo">LIDA - PUC-SP</div>
<div>Laboratório de Inteligência e Direito Aplicado</div>
<div>Pontifícia Universidade Católica de São Paulo</div>
<div style="margin-top: 10px;"><a href="https://instagram.com/lidapucsp" style="color: #d4af37; text-decoration: none;">@lidapucsp</a> • <a href="mailto:lidapucsp@gmail.com" style="color: #d4af37; text-decoration: none;">lidapucsp@gmail.com</a></div>
</div>
</div>
</body>
</html>`

    // Enviar email
    await client.send({
      from: `LIDA - PUC-SP <${GMAIL_EMAIL}>`,
      to: destinatario_email,
      subject: `Re: ${assunto_original}`,
      content: resposta,
      html: htmlContent,
    })

    await client.close()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email enviado com sucesso' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao enviar email' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
