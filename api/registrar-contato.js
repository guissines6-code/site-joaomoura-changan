// api/registrar-contato.js — function serverless (Vercel) que recebe o
// formulário "Deixe seu contato" (index.html, #form-contato) e grava o
// lead numa fila compartilhada no Redis.
//
// Por quê Redis: este site é 100% estático, sem banco de dados próprio. O
// LeadFlow (CRM, outro projeto Vercel) também não tem backend — hoje ele só
// guarda dado no navegador de quem usa (localStorage). Esse Redis é o único
// ponto de armazenamento compartilhado entre os dois: aqui a gente só
// EMPILHA leads (RPUSH); quem consome é o endpoint api/leads-do-site.js do
// LeadFlow, chamado pelo botão "Importar do Site" — ele lê a fila inteira e
// esvazia (LPOP em lote), então cada lead é entregue exatamente uma vez.

const { createClient } = require('redis');

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CHAVE_FILA = 'leads_site_joao';
const TAMANHO_MAX_NOME = 120;

function pegarIp(req) {
  const encaminhado = req.headers['x-forwarded-for'];
  if (typeof encaminhado === 'string' && encaminhado.length > 0) return encaminhado.split(',')[0].trim();
  return req.socket?.remoteAddress || 'desconhecido';
}

// Rate limit simples em memória — reseta a cada cold start da function, mas
// já barra abuso sustentado dentro de uma mesma instância "quente". Limite
// baixo de propósito: é um formulário de lead, não uma API de uso frequente.
const tentativasPorIp = new Map();
function estaAcimaDoLimite(ip, { maxRequisicoes, janelaMs }) {
  const agora = Date.now();
  const registro = (tentativasPorIp.get(ip) || []).filter((t) => agora - t < janelaMs);
  registro.push(agora);
  tentativasPorIp.set(ip, registro);
  return registro.length > maxRequisicoes;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ erro: 'Método não permitido. Use POST.' });
    return;
  }

  const ip = pegarIp(req);
  if (estaAcimaDoLimite(ip, { maxRequisicoes: 10, janelaMs: 15 * 60 * 1000 })) {
    res.status(429).json({ erro: 'Muitas tentativas em pouco tempo. Tenta de novo daqui a pouco.' });
    return;
  }

  const { nome, telefone, email, origem } = req.body || {};

  if (!nome || !telefone || !email) {
    res.status(400).json({ erro: 'Campos obrigatórios: nome, telefone, email.' });
    return;
  }
  if (typeof nome !== 'string' || nome.trim().length < 2 || nome.length > TAMANHO_MAX_NOME) {
    res.status(400).json({ erro: 'Nome inválido.' });
    return;
  }
  if (typeof telefone !== 'string' || telefone.replace(/\D/g, '').length < 10) {
    res.status(400).json({ erro: 'Telefone inválido.' });
    return;
  }
  if (typeof email !== 'string' || !REGEX_EMAIL.test(email)) {
    res.status(400).json({ erro: 'E-mail inválido.' });
    return;
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    res.status(500).json({ erro: 'REDIS_URL não configurada no servidor.' });
    return;
  }

  const client = createClient({ url: redisUrl });
  client.on('error', () => {}); // evita crash da function por erro assíncrono do client; a falha real é tratada no catch abaixo

  try {
    await client.connect();
    const lead = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim(),
      origem: typeof origem === 'string' && origem.trim() ? origem.trim() : 'Site João',
      criadoEm: new Date().toISOString(),
    };
    await client.rPush(CHAVE_FILA, JSON.stringify(lead));
    res.status(200).json({ ok: true });
  } catch (erro) {
    res.status(502).json({ erro: 'Erro ao registrar o contato. Tenta de novo em instantes.' });
  } finally {
    try { await client.disconnect(); } catch { /* já desconectado ou nunca conectou */ }
  }
};
