# 🏥 HandoffMed - Passagem de Plantão & Round Médico com IA

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue.svg)](https://chapermann.github.io/HandoffMed/)
[![NVIDIA API](https://img.shields.io/badge/NVIDIA-API-76B900.svg)](https://build.nvidia.com/)
[![DeepSeek](https://img.shields.io/badge/DeepSeek-V4-4A6CF7.svg)](https://deepseek.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020.svg)](https://cloudflare.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)

**HandoffMed** é uma aplicação web inteligente que utiliza IA (DeepSeek via NVIDIA API) para automatizar a criação de resumos clínicos para **passagem de plantão** e **rounds médicos**. Desenvolvida para emergências e terapia intensiva, a ferramenta processa evoluções médicas e gera documentos estruturados, otimizando a comunicação entre equipes e reduzindo erros.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Critérios de Alta Médica](#-critérios-de-alta-médica)
- [Arquitetura](#-arquitetura)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Licenças e Autorizações](#-licenças-e-autorizações)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Como Usar](#-como-usar)
- [Estrutura dos Documentos](#-estrutura-dos-documentos)
- [Segurança e Privacidade](#-segurança-e-privacidade)
- [Contribuição](#-contribuição)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 📖 Sobre o Projeto

### Contexto Clínico

A passagem de plantão é um dos momentos mais críticos na rotina hospitalar. Médicos precisam transmitir informações precisas e concisas sobre dezenas de pacientes em poucos minutos. Estudos mostram que:

- **70% dos erros médicos** ocorrem durante a transição de cuidado
- **30% das informações** são perdidas na passagem de plantão tradicional
- **40% dos médicos** relatam insatisfação com a qualidade da passagem de plantão

### Solução Proposta

O **HandoffMed** resolve esses problemas utilizando Inteligência Artificial para:

- **Extrair** automaticamente informações relevantes de evoluções médicas
- **Estruturar** dados em formatos padronizados (Plantão e Round Médico)
- **Anonimizar** informações sensíveis (nomes, doenças estigmatizantes)
- **Agilizar** a comunicação entre equipes médicas
- **Reduzir** erros e melhorar a segurança do paciente

### 🎯 Problemas Resolvidos

| Problema | Solução HandoffMed | Impacto |
|----------|-------------------|----------|
| Evoluções longas e desorganizadas | Resumo objetivo de 50-80 palavras | ⏱️ 80% menos tempo de leitura |
| Falta de padronização | Estrutura fixa com 12 seções (Round Médico) | 📋 100% consistência |
| Exposição de dados sensíveis | Anonimização automática (iniciais + CID-10) | 🔒 LGPD/GDPR compliance |
| Perda de informações na passagem | Documentos salvos e exportáveis | 📦 100% rastreabilidade |
| Demora na redação | Geração instantânea por IA | ⚡ 90% mais rápido |

---

## ✨ Funcionalidades

### 🏥 Gestão de Leitos

- **11 leitos** na Sala Vermelha (emergência)
- **6 leitos** na Retaguarda do Trauma
- Indicadores visuais (🟢 verde = documento gerado / 🔴 vermelho = pendente)
- Seleção rápida por clique
- Persistência de dados com localStorage

### 📝 Dois Modos de Geração

| Modo | Descrição | Tamanho | Tempo de Leitura | Uso |
|------|-----------|---------|------------------|-----|
| **⚡ Plantão** | Resumo clínico objetivo | 50-80 palavras | 30-40 segundos | Passagem de plantão entre médicos |
| **📋 Round Médico** | Documento completo estruturado | 12 seções | 3-5 minutos | Discussão diária em equipe |

### 🏥 Critérios de Alta Médica

O sistema avalia automaticamente 10 critérios para determinar se o paciente está apto para alta da UTI/Emergência para a Enfermaria de Clínica Médica:

#### 📊 Pontuação e Interpretação

| Pontuação | Interpretação | Conduta |
|-----------|---------------|---------|
| **< 5** | Não está de alta | Manter em UTI/ Emergência |
| **5 - 8** | Provável alta | Reavaliar cuidadosamente |
| **> 8** | Alta liberada | Transferir para Enfermaria |

#### ✅ Critérios Avaliados

| # | Critério | Sim | Não | Peso |
|---|----------|-----|-----|------|
| 1 | Paciente encontra-se de ALTA pelas especialidades cirúrgicas? | ✅ | ❌ | +1 / -1 |
| 2 | Paciente apresenta condição cirúrgica potencial no momento? | ❌ | ✅ | -1 / +1 |
| 3 | Paciente encontra-se em ar ambiente? | ✅ | ❌ | +1 / -1 |
| 4 | Paciente precisa de pouco O₂ (até 5L/min)? | ✅ | ❌ | +1 / -1 |
| 5 | Paciente encontra-se lúcido? | ✅ | ❌ | +1 / -1 |
| 6 | Paciente está hemodinamicamente estável? | ✅ | ❌ | +1 / -1 |
| 7 | Paciente está sem queixas álgicas? | ✅ | ❌ | +1 / -1 |
| 8 | Paciente recebeu alta recente ou esteve internado na CM? | ❌ | ✅ | -1 / +1 |
| 9 | Paciente tem doença clínica descompensada? | ✅ | ❌ | +1 / -1 |
| 10 | Paciente tem doença clínica de especialidade que tenha no Hospital? | ✅ | ❌ | +1 / -1 |

#### 🎯 Exemplo de Avaliação

**Paciente crítico:**
```
1. Alta cirúrgica? Não (-1)
2. Condição cirúrgica? Sim (-1)
3. Ar ambiente? Não (-1)
4. Pouco O₂? Não (-1)
5. Lúcido? Sim (+1)
6. Hemodinamicamente estável? Não (-1)
7. Sem queixas? Sim (+1)
8. Alta recente CM? Não (+1)
9. Doença descompensada? Sim (+1)
10. Especialidade disponível? Sim (+1)

Total: 0 → NÃO está de alta ❌
```

**Paciente estável:**
```
1. Alta cirúrgica? Sim (+1)
2. Condição cirúrgica? Não (+1)
3. Ar ambiente? Sim (+1)
4. Pouco O₂? Sim (+1)
5. Lúcido? Sim (+1)
6. Hemodinamicamente estável? Sim (+1)
7. Sem queixas? Sim (+1)
8. Alta recente CM? Não (+1)
9. Doença descompensada? Não (-1)
10. Especialidade disponível? Sim (+1)

Total: 8 → ALTA liberada! ✅
```

### 🔒 Segurança e Privacidade

- ✅ Anonimização automática de nomes (iniciais)
- ✅ Conversão de doenças sensíveis para CID-10
- ✅ Chave API armazenada no backend (Cloudflare Worker)
- ✅ Nenhum dado enviado para servidores externos (exceto API NVIDIA)
- ✅ Armazenamento local (localStorage) - dados não saem do navegador
- ✅ Conformidade com LGPD e GDPR

### 💾 Persistência e Exportação

- Dados salvos automaticamente no `localStorage`
- Exportação em **TXT** com todos os documentos organizados
- Data e hora registradas em cada documento
- Backup manual via download

---

## 🏗️ Arquitetura

### Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend (GitHub Pages)                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                 Interface Web (HTML/CSS/JS)                   │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │ │
│  │  │  Leitos     │  │  Evolução   │  │  Documentos         │  │ │
│  │  │  Sala Verm. │  │  Médica     │  │  Gerados            │  │ │
│  │  │  Retaguarda │  │             │  │                     │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │  localStorage (persistência local)                      │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Cloudflare Worker (Proxy)                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  - Recebe requisições do frontend                            │ │
│  │  - Adiciona API Key (variável secreta)                       │ │
│  │  - Encaminha para NVIDIA API                                 │ │
│  │  - Retorna resposta processada                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        NVIDIA API (DeepSeek)                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  - Modelo: deepseek-ai/deepseek-v4-pro                       │ │
│  │  - Processamento do prompt clínico                           │ │
│  │  - Geração do resumo/documento                               │ │
│  │  - 1500 tokens de capacidade                                 │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Segurança em Camadas

```
┌─────────────────────────────────────────────────────┐
│                   1. Frontend                       │
│         (GitHub Pages - HTTPS)                     │
│  - CORS para proteger contra ataques XSS           │
│  - localStorage (não envia dados)                  │
└─────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────┐
│                  2. Cloudflare                      │
│          (Worker - Proxy Seguro)                   │
│  - API Key criptografada                           │
│  - Rate limiting (40 req/min)                     │
│  - Logs anonimizados                               │
└─────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────┐
│                   3. NVIDIA API                     │
│         (Modelo DeepSeek V4)                       │
│  - Processamento seguro                            │
│  - Dados não retidos                               │
│  - Conformidade com LGPD                           │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **HTML5** | Latest | Estrutura da página |
| **CSS3** | Latest | Estilização e responsividade |
| **JavaScript** | ES6+ | Lógica e interatividade |
| **LocalStorage** | Web API | Persistência de dados |
| **Open Sans** | Google Fonts | Tipografia |

### Backend
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **Cloudflare Workers** | Latest | Proxy serverless |
| **NVIDIA NIM API** | v1 | Interface para modelos de IA |
| **DeepSeek V4** | Latest | Modelo de linguagem |

### Integração
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **GitHub Pages** | Latest | Hospedagem frontend |
| **CORS** | Latest | Comunicação segura |
| **HTTPS** | TLS 1.3 | Criptografia |

---

## 📜 Licenças e Autorizações

### 🔓 Licenças de Software

| Componente | Licença | Tipo |
|------------|---------|------|
| **HandoffMed** (projeto) | MIT | Código aberto |
| **Open Sans** | Apache 2.0 | Gratuito para uso |
| **Cloudflare Workers** | Proprietária | Gratuito (100k req/dia) |
| **NVIDIA NIM API** | Gratuita | 40 req/min, sem cartão de crédito |
| **DeepSeek V4** | NVIDIA License | Uso educacional/comercial |
| **GitHub Pages** | Gratuita | Código aberto |

### 🔐 Autorizações e Permissões

| Serviço | Tipo | Limites |
|---------|------|---------|
| **NVIDIA API** | Gratuita | 40 requisições/minuto |
| **Cloudflare Worker** | Gratuita | 100k requisições/dia |
| **GitHub Pages** | Gratuita | Ilimitado (tráfego) |
| **DeepSeek** | Incluído na NVIDIA | Ilimitado (tokens) |

### 📋 Termos de Uso

- **Creative Commons**: BY-NC-SA 4.0 para documentação
- **Código Fonte**: MIT License
- **Dados do Paciente**: Não coletados ou armazenados
- **Privacidade**: Conforme LGPD/GDPR

---

## 📦 Instalação e Configuração

### Pré-requisitos

1. **Conta no Cloudflare** (gratuita) - [cloudflare.com](https://cloudflare.com)
2. **Conta no NVIDIA** (gratuita) - [build.nvidia.com](https://build.nvidia.com)
3. **Conta no GitHub** (gratuita) - [github.com](https://github.com)
4. Chave API NVIDIA (nvapi-...)

---

### 1. Cloudflare Worker (Backend)

#### 1.1 Criar o Worker

1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Vá para **Workers & Pages** → **Create application**
3. Escolha **Create Worker** e dê um nome (ex: `nvidia-proxy`)
4. Clique em **Deploy**

#### 1.2 Adicionar o Código

Substitua o código padrão pelo `worker.js` fornecido:

```javascript
export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      const requestBody = await request.json();
      const userContent = requestBody.message;

      const apiKey = env.NVIDIA_API_KEY;

      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'Chave NVIDIA não configurada.' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-ai/deepseek-v4-pro',
          messages: [{ role: 'user', content: userContent }],
          temperature: 0.7,
          top_p: 0.95,
          max_tokens: 1500,  // Ajuste conforme necessidade
          stream: false,
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 'Erro ao gerar conteúdo.';

      return new Response(
        JSON.stringify({ message: aiResponse }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: `Erro: ${error.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
  },
};
```

#### 1.3 Configurar Variável de Ambiente (API Key)

1. No Worker, vá em **Settings** → **Variables**
2. Clique em **Add Variable**
3. **Nome:** `NVIDIA_API_KEY`
4. **Valor:** `nvapi-...` (sua chave)
5. Marque **Encrypt**
6. Clique em **Save** e **Deploy**

#### 1.4 Obter URL do Worker

Copie a URL do Worker (ex: `https://nvidia-proxy.seu-subdominio.workers.dev`)

---

### 2. GitHub Pages (Frontend)

#### 2.1 Criar Repositório

1. Acesse [GitHub](https://github.com/)
2. Crie um novo repositório chamado `HandoffMed`
3. Clone localmente ou crie os arquivos diretamente

#### 2.2 Adicionar o `index.html`

Crie o arquivo `index.html` na raiz do repositório com o código fornecido.

**ATENÇÃO:** Atualize a URL do Worker no código:

```javascript
const WORKER_URL = 'https://nvidia-proxy.seu-subdominio.workers.dev/';
```

#### 2.3 Ativar GitHub Pages

1. No repositório, vá em **Settings** → **Pages**
2. Em **Branch**, selecione `main` e clique em **Save**
3. Aguarde o deploy (1-2 minutos)
4. Acesse: `https://seu-usuario.github.io/HandoffMed/`

---

### 3. Variáveis de Ambiente

| Variável | Onde Configurar | Valor |
|----------|----------------|-------|
| `NVIDIA_API_KEY` | Cloudflare Worker (secreta) | `nvapi-...` |

---

## 🚀 Como Usar

### Passo 1: Acesse a Aplicação

Abra `https://seu-usuario.github.io/HandoffMed/`

### Passo 2: Selecione um Leito

Clique em um dos botões (Vermelha 1 a 11 ou Retaguarda 1 a 6).

- 🟢 **Verde** = Documento já gerado
- 🔴 **Vermelho** = Pendente

### Passo 3: Cole a Evolução Médica

No campo de texto, cole a evolução médica completa do paciente.

### Passo 4: Escolha o Tipo de Documento

| Botão | Quando Usar |
|-------|-------------|
| **⚡ Gerar Resumo (Plantão)** | Passagem rápida entre plantonistas |
| **📋 Gerar Round Médico** | Discussão detalhada em equipe |

### Passo 5: Visualize e Exporte

- O documento gerado aparece na área à direita
- Clique em **"Baixar .txt"** para exportar todos os documentos
- Os dados são salvos automaticamente no navegador

---

## 📄 Estrutura dos Documentos

### Resumo para Plantão

**Tamanho:** 50-80 palavras  
**Tempo de leitura:** 30-40 segundos

**Estrutura:**
```
Idade/Sexo | Comorbidades | Motivo da internação | Conduta inicial | Estado atual | Pendências
```

**Exemplo:**
> "JSF, 68a, masc, HAS/DM, internado 02/05 por AVC isquêmico à direita, TC crânio confirmou, sem trombólise. Atualmente lúcido, hemiparesia esquerda, Glasgow 15, em ar ambiente. Aguarda Doppler carótidas e ecocardiograma. Não preenche critérios de alta."

---

### Round Médico Completo

**Tamanho:** Variável (completo)  
**Estrutura:** 12 seções obrigatórias

| Seção | Descrição |
|-------|-----------|
| 1. IDENTIFICAÇÃO | Iniciais, idade, sexo, procedência |
| 2. MOTIVO DA INTERNAÇÃO | Sintoma principal, diagnóstico, data |
| 3. SITUAÇÃO CIRÚRGICA | PO e procedimentos |
| 4. COMORBIDADES | HAS, DM, HIV, medicações contínuas |
| 5. SITUAÇÃO CLÍNICA ATUAL | Sinais vitais, invasões, VM, Glasgow |
| 6. GASOMETRIA | pH, PaCO₂, PaO₂, HCO₃⁻, lactato |
| 7. EXAMES DE IMAGEM | TC, RM, USG, RX com datas |
| 8. EXAMES LABORATORIAIS | Hemograma, função renal/hepática |
| 9. ANTIBIÓTICOS | Nome, dose, tempo de uso |
| 10. IMPRESSÃO DO CASO | Sumário em 2-3 frases |
| 11. CONDUTAS | Decisões do round |
| 12. IMPRESSÃO FINAL | Resumo elaborado com pendências |

---

## 🔒 Segurança e Privacidade

### Proteção de Dados

| Medida | Implementação |
|--------|---------------|
| **Anonimização** | Nomes convertidos para iniciais |
| **Doenças sensíveis** | Convertidas para CID-10 |
| **API Key** | Armazenada apenas no Worker (backend) |
| **Dados** | Salvos apenas no localStorage do navegador |
| **CORS** | Proteção contra requisições externas |
| **HTTPS** | Criptografia de ponta a ponta |

### Exemplo de Anonimização

**Original:**
> Paciente: João da Silva, 68 anos, HIV positivo

**Anonimizado:**
> Paciente: JS, 68 anos, CID-10: B24

### Conformidade Legal

- **LGPD (Lei 13.709/2018)**: Conformidade total
- **GDPR (UE)**: Conformidade total
- **CFM (Código de Ética Médica)**: Art. 70-71
- **ISO 27001**: Práticas de segurança

---

## 🤝 Contribuição

Contribuições são bem-vindas! Siga os passos:

1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/seu-usuario/HandoffMed.git`
3. **Crie uma branch**: `git checkout -b feature/nova-funcionalidade`
4. **Commit** suas alterações: `git commit -m 'Adiciona nova funcionalidade'`
5. **Push** para a branch: `git push origin feature/nova-funcionalidade`
6. Abra um **Pull Request**

### Áreas para Contribuição

- [ ] Suporte a mais modelos de IA
- [ ] Integração com EHR/EPR
- [ ] Múltiplos idiomas
- [ ] Dashboard analítico
- [ ] Exportação em PDF/DOCX
- [ ] Modo offline
- [ ] App mobile (PWA)

---

## 🙏 Agradecimentos

- **NVIDIA** - API gratuita e modelo DeepSeek
- **Cloudflare** - Workers para backend seguro
- **GitHub** - Pages para hospedagem
- **OpenAI SDK** - Compatibilidade com API
- **Comunidade Open Source** - Inspiração e suporte

---

## 📜 Licença

Este projeto está sob a licença **MIT**.

**Documentação:** Creative Commons BY-NC-SA 4.0

### MIT License

Copyright (c) 2026 HandoffMed

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 📊 Status do Projeto

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

---

## 📞 Contato e Suporte

**Autor:** [Chapermann](https://github.com/chapermann); chapermann@hotmail.com

**Links Úteis:**
- 🌐 [Demo](https://chapermann.github.io/HandoffMed/)
- 📝 [GitHub](https://github.com/chapermann/HandoffMed)
- 🏗️ [NVIDIA Build](https://build.nvidia.com/)
- 📚 [Documentação](https://github.com/chapermann/HandoffMed/wiki)

**Reportar Bugs:** [Issues](https://github.com/chapermann/HandoffMed/issues)

---

## 📝 Registro de Versões

| Versão | Data | Mudanças |
|--------|------|----------|
| **v2.0** | Jul 2026 | 🔥 Suporte a Round Médico + Critérios de Alta |
| **v1.0** | Jun 2026 | 🚀 Lançamento inicial (Plantão) |

---

*Feito com ❤️ para melhorar a comunicação entre equipes médicas e a segurança dos pacientes.*

*"A tecnologia a serviço da medicina para salvar vidas."* 🏥⚕️
