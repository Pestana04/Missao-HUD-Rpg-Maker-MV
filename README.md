# MissaoHUD — RPG Maker MV

Plugin desenvolvido para adicionar uma **HUD permanente de missões** ao RPG Maker MV, integrada ao **Galv's Quest Log**.

O projeto foi criado originalmente para o jogo educacional **Missão UAI**, desenvolvido como Trabalho de Conclusão de Curso.

A principal função do plugin é permitir que o jogador acompanhe a missão rastreada e o objetivo atual diretamente pela tela do mapa, sem precisar abrir constantemente o Diário de Missões.

---

## Versão atual

**v0.3.0**

Versão atualmente em desenvolvimento e testes.

A versão 0.3.0 adiciona um sistema visual de **Missão Concluída**, além de ampliar a integração com o Galv's Quest Log e preparar o plugin para funcionamento conjunto com o **TutorialHUD**.

---

## Funcionalidades

O MissaoHUD possui:

- HUD permanente no canto superior direito;
- exibição da missão atualmente rastreada;
- exibição automática do objetivo atual;
- integração com o Galv's Quest Log;
- atualização automática quando um objetivo muda;
- suporte ao rastreamento manual pelo Quest Log;
- indicador **Novo** ao rastrear uma nova missão;
- atraso configurável antes da exibição de uma nova missão;
- fade-in e fade-out;
- ocultação durante diálogos;
- atraso de segurança após diálogos;
- design compacto com bordas quadradas;
- integração com missões principais e secundárias;
- novo aviso central de **Missão Concluída**;
- animação de entrada e saída no aviso de conclusão;
- suporte opcional a efeito sonoro de conclusão;
- possibilidade de concluir uma missão silenciosamente;
- compatibilidade planejada com o **TutorialHUD**.

---

# Estrutura visual

A HUD principal apresenta:

```text
┌──────────────────────────┐
│ MISSÃO ATUAL        Novo │
│ ──────────────────────── │
│ Em Busca do Passaporte   │
│ • Converse com vovó      │
└──────────────────────────┘
```

A HUD permanece no canto superior direito da tela.

O indicador:

```text
Novo
```

é exibido temporariamente quando uma nova missão passa a ser rastreada.

---

# Missão concluída

A versão `0.3.0` adiciona uma nova notificação central.

Quando uma missão é concluída:

```javascript
Galv.QUEST.complete(id);
```

o MissaoHUD pode apresentar:

```text
┌──────────────────────────────────────┐
│                                      │
│          MISSÃO CONCLUÍDA            │
│          ───────────────             │
│                                      │
│       Em Busca do Passaporte         │
│                                      │
└──────────────────────────────────────┘
```

O aviso aparece no centro da tela através de uma animação suave.

O fluxo é:

```text
Missão concluída
       ↓
Pequeno atraso
       ↓
Fade-in
       ↓
MISSÃO CONCLUÍDA
Nome da missão
       ↓
Permanece na tela
       ↓
Fade-out
```

Também pode ser reproduzido um efeito sonoro configurável.

---

# Dependências

O plugin utiliza:

- **RPG Maker MV**
- **Galv's Quest Log**

O Galv's Quest Log deve estar instalado e ativo.

---

# Compatibilidade com TutorialHUD

Quando utilizado juntamente com o TutorialHUD, a ordem recomendada é:

```text
Galv_QuestLog
MissaoHUD
TutorialHUD
```

O MissaoHUD continua responsável pela missão rastreada.

O TutorialHUD pode ser utilizado simultaneamente para fornecer instruções adicionais ao jogador.

Exemplo:

```text
TutorialHUD                            MissaoHUD

┌──────────────────────────┐          ┌──────────────────────┐
│ MOVIMENTAÇÃO             │          │ MISSÃO ATUAL         │
│                          │          │ Conclua o Tutorial   │
│ Use as teclas para andar │          │ • Aprenda a andar    │
│                          │          └──────────────────────┘
│         [ ↑ ]            │
│      [←][↓][→]           │
└──────────────────────────┘

Canto superior esquerdo                Canto superior direito
```

---

# Instalação

1. Baixe o arquivo:

```text
MissaoHUD.js
```

2. Copie o arquivo para:

```text
SeuProjeto/
└── js/
    └── plugins/
        └── MissaoHUD.js
```

3. Abra o projeto no RPG Maker MV.

4. Acesse:

```text
Ferramentas
→ Gerenciador de Plugins
```

5. Adicione:

```text
MissaoHUD
```

6. Defina o plugin como:

```text
ON
```

7. Coloque o MissaoHUD abaixo do Galv's Quest Log.

Exemplo:

```text
Galv_QuestLog
MissaoHUD
```

Caso também utilize o TutorialHUD:

```text
Galv_QuestLog
MissaoHUD
TutorialHUD
```

---

# Parâmetros da HUD

## Largura

Define a largura da HUD principal.

Valor padrão:

```text
250
```

---

## Altura

Define a altura da HUD principal.

Valor padrão:

```text
92
```

---

## Margem

Define a distância da HUD em relação às bordas da tela.

Valor padrão:

```text
12
```

---

## AtrasoNovaMissao

Tempo, em frames, antes de uma missão recém-rastreada aparecer.

Valor padrão:

```text
120
```

Considerando aproximadamente 60 FPS:

```text
120 frames ≈ 2 segundos
```

---

## TempoNovo

Tempo durante o qual o texto:

```text
Novo
```

permanece visível.

Valor padrão:

```text
600
```

Aproximadamente:

```text
10 segundos
```

---

## AtrasoAposDialogo

Tempo de segurança após o fechamento de uma caixa de diálogo.

Isso evita que a HUD apareça e desapareça rapidamente durante mudanças entre mensagens.

Valor padrão:

```text
30
```

---

## VelocidadeFade

Controla a velocidade da animação de fade da HUD principal.

Valor padrão:

```text
18
```

---

# Parâmetros de conclusão

## LarguraConclusao

Largura do banner central de missão concluída.

Valor padrão:

```text
440
```

---

## AlturaConclusao

Altura do banner central.

Valor padrão:

```text
96
```

---

## AtrasoConclusao

Tempo entre a conclusão da missão e o início da animação.

Valor padrão:

```text
20
```

---

## TempoConclusao

Tempo em que o aviso permanece completamente visível.

Valor padrão:

```text
180
```

Em aproximadamente 60 FPS:

```text
180 frames ≈ 3 segundos
```

---

## FadeConclusao

Velocidade da animação de entrada e saída do banner.

Valor padrão:

```text
18
```

---

## SomConclusao

Permite selecionar um arquivo da pasta:

```text
audio/se/
```

para ser executado quando o banner aparecer.

O parâmetro pode ser deixado vazio.

---

## VolumeConclusao

Volume do efeito sonoro.

Valor padrão:

```text
80
```

---

## PitchConclusao

Pitch do efeito sonoro.

Valor padrão:

```text
100
```

---

# Integração com Galv's Quest Log

O MissaoHUD acompanha automaticamente chamadas realizadas pelo Galv's Quest Log.

---

## Rastrear missão

```javascript
Galv.QUEST.track(1);
```

A HUD passa a mostrar automaticamente a missão rastreada.

---

## Alterar objetivo

Exemplo:

```javascript
Galv.QUEST.objective(1, 0, 'complete');
Galv.QUEST.objective(1, 1, 'activate');
```

O MissaoHUD identifica a alteração e passa a apresentar o novo objetivo ativo.

---

## Concluir missão

```javascript
Galv.QUEST.complete(1);
```

Na versão 0.3.0, essa chamada também pode gerar o aviso:

```text
MISSÃO CONCLUÍDA

Em Busca do Passaporte
```

Caso a missão concluída estivesse sendo rastreada, a HUD principal é limpa.

---

## Falhar missão

```javascript
Galv.QUEST.fail(1);
```

Caso a missão falhada esteja sendo rastreada, ela deixa de permanecer na HUD principal.

---

# Script Calls do MissaoHUD

## Ocultar

```javascript
MissaoHUD.hide();
```

Oculta temporariamente a HUD principal.

---

## Mostrar

```javascript
MissaoHUD.show();
```

Mostra novamente a HUD.

---

## Limpar

```javascript
MissaoHUD.clear();
```

Remove da HUD os dados atualmente apresentados.

---

## Sincronizar

```javascript
MissaoHUD.sync();
```

Força uma nova leitura da missão rastreada pelo Galv's Quest Log.

---

# Exibição manual

Também é possível utilizar a HUD sem depender diretamente de uma missão do Galv.

Exemplo:

```javascript
MissaoHUD.set(
    "Missão de Teste",
    "Encontre o objeto"
);
```

Isso produzirá algo semelhante a:

```text
MISSÃO ATUAL

Missão de Teste
• Encontre o objeto
```

---

# Concluir missão silenciosamente

Algumas missões podem não precisar do grande aviso central.

Para isso:

```javascript
MissaoHUD.silentComplete(id);
```

Exemplo:

```javascript
MissaoHUD.silentComplete(6);
```

A missão é concluída normalmente, mas não apresenta:

```text
MISSÃO CONCLUÍDA
```

Esse recurso foi pensado inicialmente para a:

```text
Quest 6 — Quest Exemplo
```

utilizada pelo TutorialHUD.

Como essa missão existe apenas para ensinar o funcionamento do rastreamento, sua conclusão não precisa receber o mesmo destaque de uma missão narrativa.

---

# Mostrar conclusão manualmente

Também é possível solicitar manualmente uma notificação:

```javascript
MissaoHUD.notifyComplete(id);
```

Exemplo:

```javascript
MissaoHUD.notifyComplete(2);
```

O plugin tenta obter automaticamente o nome da missão.

Também existe suporte interno para fornecer diretamente o nome:

```javascript
MissaoHUD.notifyComplete(
    2,
    "O Relógio Quebrado"
);
```

---

# Rastreamento manual

O plugin também acompanha alterações realizadas diretamente pelo jogador dentro do Galv's Quest Log.

Exemplo:

```text
Em Busca do Passaporte
        ↓
Jogador abre Missões
        ↓
Seleciona O Relógio Quebrado
        ↓
Define como rastreada
        ↓
MissaoHUD atualiza automaticamente
```

Não é necessário criar um evento separado apenas para atualizar a HUD.

---

# Comportamento durante diálogos

Quando uma caixa de diálogo é aberta, a HUD principal é escondida através de fade.

Isso evita que elementos da interface disputem espaço visual com os diálogos.

Fluxo:

```text
HUD visível
    ↓
Diálogo começa
    ↓
Fade-out
    ↓
Diálogo termina
    ↓
Pequeno tempo de segurança
    ↓
Fade-in
```

Esse sistema também reduz o problema de piscadas causado por múltiplas páginas de diálogo.

---

# Sistema de objetivos

O plugin procura o objetivo atualmente ativo dentro da missão rastreada.

Exemplo:

```text
Quest 1 — Em Busca do Passaporte

✓ Converse com vovó
• Converse com sua mãe
○ Pegue seu cartão
```

A HUD mostra:

```text
MISSÃO ATUAL

Em Busca do Passaporte
• Converse com sua mãe
```

Quando o evento executar:

```javascript
Galv.QUEST.objective(1, 1, 'complete');
Galv.QUEST.objective(1, 2, 'activate');
```

a HUD passa para:

```text
MISSÃO ATUAL

Em Busca do Passaporte
• Pegue seu cartão
```

---

# Uso com o TutorialHUD

Durante o tutorial do projeto Missão UAI, o MissaoHUD continua funcionando normalmente.

A missão utilizada é:

```text
Quest 5 — Conclua o Tutorial
```

Enquanto o TutorialHUD ensina os controles, o MissaoHUD mostra o objetivo correspondente.

Exemplo:

```text
TutorialHUD:

MOVIMENTAÇÃO

Use as teclas direcionais.

       [ ↑ ]
    [←][↓][→]
```

ao mesmo tempo em que:

```text
MissaoHUD:

MISSÃO ATUAL

Conclua o Tutorial
• Aprenda a se movimentar
```

---

# Quest Exemplo

O TutorialHUD utiliza uma missão temporária:

```text
Quest 6 — Quest Exemplo
```

Ela serve para ensinar o jogador a alterar manualmente a missão rastreada.

Fluxo:

```text
Conclua o Tutorial
        ↓
Abra Missões
        ↓
Rastreie Quest Exemplo
        ↓
MissaoHUD muda automaticamente
        ↓
TutorialHUD detecta a ação
        ↓
Volte a rastrear Conclua o Tutorial
```

Ao terminar sua função, a Quest Exemplo pode ser concluída através de:

```javascript
MissaoHUD.silentComplete(6);
```

evitando uma notificação de conclusão desnecessária.

---

# Fluxo de exemplo

```text
Quest ativada
     ↓
Galv.QUEST.track(id)
     ↓
Aguarda aproximadamente 2 segundos
     ↓
MissaoHUD aparece
     ↓
"Novo"
     ↓
Jogador realiza objetivo
     ↓
Galv.QUEST.objective(...)
     ↓
HUD atualiza
     ↓
Último objetivo
     ↓
Galv.QUEST.complete(id)
     ↓
HUD principal desaparece
     ↓
MISSÃO CONCLUÍDA
Nome da missão
```

---

# Histórico de versões

## v0.3.0

Em desenvolvimento/testes.

### Adicionado

- sistema de aviso central de missão concluída;
- animação de fade-in;
- animação de fade-out;
- pequena animação de escala;
- nome da missão no banner;
- suporte opcional a efeito sonoro;
- fila de notificações de conclusão;
- `MissaoHUD.notifyComplete(id)`;
- `MissaoHUD.silentComplete(id)`;
- integração planejada com TutorialHUD.

### Alterado

- conclusão de uma missão rastreada passa a limpar a HUD principal;
- integração com `Galv.QUEST.complete()` ampliada;
- integração com `Galv.QUEST.fail()` revisada;
- documentação atualizada.

---

## v0.2.1

- integração direta com Galv's Quest Log;
- rastreamento manual sincronizado;
- leitura automática da missão rastreada;
- leitura automática do objetivo ativo;
- suporte a alteração de objetivos;
- indicador `Novo`;
- atraso de aproximadamente dois segundos para novas missões;
- correção de piscadas durante diálogos;
- fade da HUD;
- design quadrado;
- borda em tom alaranjado;
- largura padrão de 250 pixels.

---

# Roadmap

## v0.3.0

- [x] estrutura do banner de missão concluída;
- [x] nome da missão no banner;
- [x] fade-in;
- [x] fade-out;
- [x] animação suave de escala;
- [x] suporte a som;
- [x] conclusão silenciosa;
- [x] preparação para TutorialHUD;
- [ ] testes completos dentro do RPG Maker MV;
- [ ] validação da integração MissaoHUD + TutorialHUD;
- [ ] ajustes finos de design;
- [ ] escolha definitiva do efeito sonoro.

---

## Próximas versões

- [ ] aviso discreto de objetivo atualizado;
- [ ] novas opções de personalização;
- [ ] configuração de cores pelo Gerenciador de Plugins;
- [ ] controle individual de notificações;
- [ ] melhorias nas animações;
- [ ] tratamento visual para missão falhada;
- [ ] testes adicionais de compatibilidade;
- [ ] aprimorar integração com outros sistemas de HUD.

---

# Desenvolvimento

O MissaoHUD surgiu de uma necessidade específica encontrada durante o desenvolvimento do **Missão UAI**.

O Galv's Quest Log oferece o gerenciamento das missões, porém normalmente o jogador precisa acessar a interface de missões para verificar seus objetivos.

O MissaoHUD complementa esse sistema apresentando a missão rastreada permanentemente durante a exploração.

O plugin também passou a receber novas funcionalidades a partir de testes realizados com o jogo, como:

```text
melhor orientação
        ↓
HUD permanente
        ↓
feedback de nova missão
        ↓
feedback de conclusão
```

---

# Estado do projeto

O plugin continua em desenvolvimento.

A versão:

```text
v0.3.0
```

deve ser considerada uma versão de testes até que a integração completa com o **TutorialHUD** seja validada dentro do RPG Maker MV.

---

# Autor

**Gustavo Pestana**

Plugin desenvolvido para RPG Maker MV como parte do desenvolvimento do jogo educacional **Missão UAI**.

---