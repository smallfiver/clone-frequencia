# Clone Frequência Vibracional

Clone funcional do funil de quiz "Leitura de Frequência Vibracional" originalmente hospedado em `testefrequencia.misteriosdaalma.com`.

## Visão Geral

Este é um quiz interativo de frequência vibracional que coleta informações do usuário (gênero, data de nascimento, estado civil, maior desafio e nome) e, ao final, apresenta uma "leitura" personalizada com áudios condicionais e um VSL (Video Sales Letter) via ConverteAI/VTurb.

## Estrutura do Projeto

```
clone-frequencia/
├── index.html          # SPA principal (Single Page Application)
├── styles.css          # CSS completo do projeto
├── app.js              # Lógica do quiz em JavaScript vanilla
├── step1.html          # Referência: Step 1 - Seleção de Gênero
├── step2.html          # Referência: Step 2 - Mês de Nascimento
├── step3.html          # Referência: Step 3 - Dia de Nascimento
├── step4.html          # Referência: Step 4 - Década de Nascimento
├── step5.html          # Referência: Step 5 - Ano de Nascimento
├── step6.html          # Referência: Step 6 - Estado Civil
├── step7.html          # Referência: Step 7 - Maior Desafio
├── step8.html          # Referência: Step 8 - Nome
├── manifest.json       # Mapa completo do funil
├── README.md           # Esta documentação
├── img/                # Imagens do projeto
│   ├── female.png      # Card feminino
│   ├── masculine.png   # Card masculino
│   ├── bg_divino.png   # Background da tela de loading
│   ├── dark-bg-wide.jpg # Background da tela de áudio
│   ├── stop.png        # Ícone de stop (warning modal)
│   ├── pause.png       # Ícone de pause
│   ├── favicon.png     # Favicon
│   ├── casado.png      # Ícone estado civil
│   ├── namorando.png   # Ícone estado civil
│   ├── noivo.png       # Ícone estado civil
│   ├── solteiro.png    # Ícone estado civil
│   ├── divorciado.png  # Ícone estado civil
│   ├── viuvo.png       # Ícone estado civil
│   └── assets/         # Imagens do resultado/VSL
│       ├── certidao.png
│       ├── famosos.png
│       ├── img_nome_vibracao.png
│       ├── frequencia.png
│       ├── fardo.png
│       ├── frequencia_justa.png
│       ├── mantra.png
│       ├── biblico.png
│       ├── raro.png
│       ├── relax.png
│       ├── revelacao.png
│       ├── bloqueio_frequencia.png
│       ├── caminho_frequencia.png
│       └── loop1.gif
├── audio/
│   ├── p1v2/           # Áudios parte 1 (condicionais por gênero/idade/civil)
│   │   ├── h_20_c.mp3  # Homem, 20-29 anos, casado/namorando/noivo
│   │   ├── h_20_s.mp3  # Homem, 20-29 anos, solteiro/separado/viúvo
│   │   ├── h_30_c.mp3
│   │   ├── h_30_s.mp3
│   │   ├── h_40_c.mp3
│   │   ├── h_40_s.mp3
│   │   ├── h_50_c.mp3
│   │   ├── h_50_s.mp3
│   │   ├── h_60_c.mp3
│   │   ├── h_60_s.mp3
│   │   ├── m_20_c.mp3  # Mulher, 20-29 anos, casada/namorando/noiva
│   │   ├── m_20_s.mp3  # Mulher, 20-29 anos, solteira/separada/viúva
│   │   ├── m_30_c.mp3
│   │   ├── m_30_s.mp3
│   │   ├── m_40_c.mp3
│   │   ├── m_40_s.mp3
│   │   ├── m_50_c.mp3
│   │   ├── m_50_s.mp3
│   │   ├── m_60_c.mp3
│   │   └── m_60_s.mp3
│   └── p2v2/           # Áudios parte 2 (condicionais por desafio)
│       ├── dinheiro.mp3     # Desafio: Finanças
│       ├── felicidade.mp3   # Desafio: Felicidade
│       ├── saude.mp3        # Desafio: Saúde
│       ├── h_casado.mp3     # Desafio: Amor + Homem casado
│       ├── h_solteiro.mp3   # Desafio: Amor + Homem solteiro
│       ├── m_casada.mp3     # Desafio: Amor + Mulher casada
│       └── m_solteira.mp3   # Desafio: Amor + Mulher solteira
└── captures/           # Arquivos de captura originais (referência)
```

## Fluxo do Quiz

| Step | Tela | Descrição |
|------|------|-----------|
| 1 | Gênero | Seleção entre Mulher/Homem com cards visuais |
| 2 | Mês | Seleção do mês de nascimento (12 opções) |
| 3 | Dia | Seleção do dia de nascimento (01-31) |
| 4 | Década | Seleção da década de nascimento (1910-2010) |
| 5 | Ano | Seleção do ano específico dentro da década |
| 6 | Estado Civil | Casado/Namorando/Noivo/Solteiro/Separado/Viúvo |
| 7 | Desafio | Vida Amorosa/Finanças/Saúde/Felicidade |
| 8 | Nome | Input do primeiro nome |
| 9 | Loading | Tela de carregamento animada (3.5s) |
| 10 | Warning | Modal de urgência com botão COMEÇAR |
| 11 | Áudio/VSL | Player de áudio + VSL ConverteAI |

## Lógica de Áudios Condicionais

### Parte 1 (p1v2)
O áudio da parte 1 é selecionado com base em 3 variáveis:
- **Gênero**: `h` (homem) ou `m` (mulher)
- **Faixa etária**: `20`, `30`, `40`, `50`, `60` (calculada a partir da data de nascimento)
- **Status civil**: `c` (casado/namorando/noivo) ou `s` (solteiro/separado/viúvo)

Formato: `{gênero}_{idade}_{civil}.mp3` (ex: `m_30_s.mp3`)

### Parte 2 (p2v2)
O áudio da parte 2 depende do desafio selecionado:
- **Finanças** → `dinheiro.mp3`
- **Saúde** → `saude.mp3`
- **Felicidade** → `felicidade.mp3`
- **Amor** → depende do gênero e status civil:
  - Homem casado → `h_casado.mp3`
  - Homem solteiro → `h_solteiro.mp3`
  - Mulher casada → `m_casada.mp3`
  - Mulher solteira → `m_solteira.mp3`

## VSL (Video Sales Letter)

O player de VSL é carregado via ConverteAI (VTurb):
- **Account ID**: `0a246cdd-c6bd-48cb-b2bf-d2a8c03c2dd5`
- **Player ID**: `6841b662f59c67de93338696`
- **Script**: `https://scripts.converteai.net/0a246cdd-c6bd-48cb-b2bf-d2a8c03c2dd5/players/6841b662f59c67de93338696/player.js`

## Tecnologias

- **HTML5** + **CSS3** + **JavaScript ES6** (vanilla, sem frameworks)
- **SPA** com renderização dinâmica via JavaScript
- **Fontes**: Sora (Google Fonts)
- **Player de vídeo**: ConverteAI/VTurb (carregado externamente)

## Como Usar

1. Abra `index.html` em qualquer navegador moderno
2. Ou sirva com qualquer servidor HTTP estático:
   ```bash
   python3 -m http.server 8080
   # ou
   npx serve .
   ```
3. Todos os paths são relativos (`./`) para funcionar em qualquer hosting

## Notas

- Todos os trackers (Facebook Pixel, GTM, etc.) foram removidos
- Todas as proteções anti-devtools foram removidas
- O clone usa paths relativos para funcionar em qualquer diretório
- Os áudios são servidos localmente (total ~290MB)
- O VSL é carregado externamente via ConverteAI (requer internet)
