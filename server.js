const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const fetch = require('node-fetch'); 

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
}));

const clients = new Set(); 

wss.on('connection', (ws) => {
    console.log('📡 Cliente conectado via WebSocket');
    clients.add(ws);

    ws.on('close', () => {
        console.log('🔌 Cliente desconectado');
        clients.delete(ws);
    });
});

app.post('/webhook/messages-upsert', (req, res) => {
    console.log('🔹 Webhook recebido:', JSON.stringify(req.body, null, 2));

    const messageData = req.body.data;
    const sender = messageData?.key?.remoteJid || 'Remetente desconhecido';
    const name = messageData?.pushName;
    const messageContent = messageData?.message?.conversation || 'Mensagem não encontrada';

    console.log(`📩 Nova mensagem de ${sender}: ${messageContent}`);

    const message = JSON.stringify({ from: sender, name: name, text: messageContent });

    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            try {
                client.send(message);
            } catch (err) {
                console.error("⚠️ Erro ao enviar mensagem WebSocket:", err);
            }
        }
    });

    res.status(200).send('Mensagem processada com sucesso!');
});

app.post('/webhook/connection-update', (req, res) => {
    console.log('🔗 Atualização de conexão recebida:', req.body);
    res.status(200).send('Webhook recebido!');
});

app.post('/message/sendText/Painel', async (req, res) => {
    console.log("📥 Requisição recebida:", req.body);

    const number = req.body.number || req.body.to;
    const text = req.body.text;
    const apiKey = "7B5A439A06D1-4128-966F-8D8B0C6DDDC2";
    const baseUrl = "http://localhost:8081"; 
    const instance = "Painel"; 

    if (!number || !text) {
        console.error("❌ Erro: Número ou texto vazio.");
        return res.status(400).json({ error: "Número do destinatário e mensagem são obrigatórios" });
    }

    console.log(`📤 Enviando mensagem para ${number}: ${text}`);

    try {
        const response = await fetch(`${baseUrl}/message/sendText/${instance}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'apikey': apiKey 
            },
            body: JSON.stringify({ number, text })
        });

        const data = await response.text();
        console.log("✅ Resposta da API:", data);

        if (!data) {
            console.error("❌ Erro: Resposta vazia da API.");
            return res.status(500).json({ status: "error", message: "A API do WhatsApp não retornou resposta." });
        }

        try {
            const jsonData = JSON.parse(data);
            return res.json({ status: "success", message: "Mensagem enviada com sucesso!", details: jsonData });
        } catch (parseError) {
            console.error("❌ Erro ao interpretar resposta:", data);
            return res.status(500).json({ status: "error", message: "A API do WhatsApp retornou um formato inesperado." });
        }

    } catch (error) {
        console.error("❌ Erro ao enviar requisição:", error);
        return res.status(500).json({ status: "error", message: "Erro ao enviar mensagem.", details: error.message });
    }
});
// 🚀 Iniciar o servidor
server.listen(3000, () => {
    console.log('🚀 Servidor rodando na porta 3000!');
});
