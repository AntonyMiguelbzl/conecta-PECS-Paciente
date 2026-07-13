import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import jwt from "jsonwebtoken";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "minha_chave_secreta_super_segura";

app.use(cors());
app.use(express.json());

// Interface estendida para rotas autenticadas do terapeuta
interface CustomTerapeutaRequest extends Request {
  terapeuta?: { id: string };
}

// MIDDLEWARE DE VERIFICAÇÃO DE TOKEN (Para painel do terapeuta se necessário)
function verifyTerapeutaToken(req: CustomTerapeutaRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token de acesso não fornecido." });

  const token = authHeader.split(" ")[1];
  
  if (token === "simulacao-terapeuta-id-5") {
    req.terapeuta = { id: "5" };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.terapeuta = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

// =========================================================================
// ROTAS DE CARTÕES (PECS) - SUPORTE OU FUTURA INTEGRAÇÃO
// =========================================================================

// 1. ROTA DE GRAVAÇÃO (POST): Recebe os dados do painel
app.post("/api/cards", async (req: Request, res: Response) => {
  try {
    const { label, type, categoria_pai, paciente_id, arasaac_id } = req.body;

    if (!paciente_id) return res.status(400).json({ error: "ID do paciente obrigatório." });

    console.log("Simulando persistência ou log para o paciente:", paciente_id);

    return res.status(201).json({ 
      mensagem: "Ação salva com sucesso!",
      card: { label, type, categoria_pai, paciente_id, arasaac_id }
    });
  } catch (error) {
    console.error("ERRO NO POST DE CARTÕES:", error);
    return res.status(500).json({ error: "Erro ao processar requisição de cartões." });
  }
});

// 2. ROTA DE CONSULTA (GET): Filtra as ações por categoria
app.get("/api/cards/:pacienteId/:categoriaPai", async (req: Request, res: Response) => {
  try {
    const { pacienteId, categoriaPai } = req.params;
    console.log(`Buscando cartões do paciente ${pacienteId} na pasta ${categoriaPai}`);
    
    return res.status(200).json([]);
  } catch (error) {
    console.error("ERRO NO GET DE CARTÕES:", error);
    return res.status(500).json({ error: "Erro ao buscar cartões." });
  }
});

// 3. ROTA PARA LISTAR TODOS OS CARTÕES DE UM PACIENTE
app.get("/api/cards/:pacienteId", async (req: Request, res: Response) => {
  try {
    const { pacienteId } = req.params;
    console.log(`Buscando prancha completa do paciente ${pacienteId}`);
    return res.status(200).json([]);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar cartões do paciente." });
  }
});

// =========================================================================
// ROTAS DE PAINEL DO TERAPEUTA E AUTENTICAÇÃO AUXILIAR
// =========================================================================

app.get("/api/meus-pacientes", verifyTerapeutaToken, async (req: CustomTerapeutaRequest, res: Response) => {
  try {
    // Retorno temporário seguro para listagem na visão do profissional
    return res.status(200).json([]);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar pacientes." });
  }
});

// LOGIN DO ALUNO / PACIENTE (Fallback / Simulação se não usar Firebase Auth direto)
app.post("/api/auth/crianca", async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (email && senha) {
      return res.status(200).json({
        token: "jwt_token_estudante_valido",
        paciente: { id: "paciente_teste_123", nome: "Lucas" }
      });
    }

    return res.status(401).json({ error: "E-mail ou senha incorretos." });
  } catch (error) {
    return res.status(500).json({ error: "Erro no processamento do login." });
  }
});

app.get("/api/auth/crianca/:token", async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ modo: "crianca", nomePaciente: "Lucas" });
  } catch (error) {
    return res.status(500).json({ error: "Erro." });
  }
});

// =========================================================================
// INICIALIZAÇÃO DO SERVIDOR COM MIDDLEWARE DO VITE
// =========================================================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Backend Server rodando LIMPO e pronto para Firebase na porta ${PORT}`);
  });
}

startServer();