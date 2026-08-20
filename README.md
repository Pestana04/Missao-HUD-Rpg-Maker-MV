# Missão HUD - RPG Maker MV

Plugin desenvolvido para o projeto acadêmico **Missão UAI**, utilizando o RPG Maker MV.

O `MissaoHUD` adiciona uma HUD permanente no canto superior direito da tela para exibir a missão atualmente rastreada e seu objetivo atual.

A partir da versão **0.2.1**, o plugin possui integração automática com o **Galv's Quest Log v1.3**, acompanhando tanto mudanças de objetivos realizadas por eventos quanto a troca manual da missão rastreada dentro do próprio Quest Log.

> O MissaoHUD não substitui o Galv's Quest Log. Ele funciona como um complemento visual para apresentar ao jogador o objetivo atual durante a exploração.

---

## Funcionalidades

- Exibição da missão atual no canto superior direito
- Exibição automática do objetivo atual
- Integração com Galv's Quest Log
- Sincronização com o rastreamento manual realizado no Quest Log
- Atualização automática quando um objetivo é ativado
- Ocultação automática durante diálogos
- Pequeno atraso após diálogos para evitar piscadas na interface
- Entrada da HUD através de efeito de fade
- Atraso de aproximadamente 2 segundos ao rastrear uma nova missão
- Indicador `Novo` para missões recém-rastreadas
- Indicador `Novo` exibido durante aproximadamente 10 segundos
- Salvamento do estado da HUD através do `$gameSystem`
- Possibilidade de esconder e mostrar a HUD manualmente
- Possibilidade de utilizar a HUD sem o Galv's Quest Log
- Visual compacto desenvolvido para RPG Maker MV

---

## Requisitos

O plugin foi desenvolvido para:

- RPG Maker MV
- JavaScript
- Galv's Quest Log v1.3

Para utilizar a integração automática com o sistema de missões, é necessário possuir o arquivo:

```text
Galv_QuestLog.js
```

ativo no projeto.

---

## Estrutura do repositório

```text
missao-hud-rpg-maker-mv/
├── MissaoHUD.js
├── README.md
├── LICENSE
└── .gitignore
```

---

## Instalação

### 1. Obtenha o plugin

Baixe ou copie o arquivo:

```text
MissaoHUD.js
```

### 2. Adicione ao projeto

Coloque o arquivo dentro da pasta:

```text
SeuProjeto/
└── js/
    └── plugins/
        └── MissaoHUD.js
```

### 3. Abra o RPG Maker MV

No RPG Maker MV, acesse:

```text
Ferramentas → Gerenciador de Plugins
```

### 4. Adicione o plugin

Adicione:

```text
MissaoHUD
```

e configure o status como:

```text
ON
```

### 5. Ordem dos plugins

Quando utilizado juntamente com o Galv's Quest Log, o `MissaoHUD` deve ficar **abaixo** dele.

Exemplo:

```text
Galv_QuestLog    ON
MissaoHUD        ON
```

Essa ordem é importante porque o `MissaoHUD` estende algumas funções já criadas pelo Galv's Quest Log.

---

## Como funciona a integração

O Galv's Quest Log continua sendo responsável pelo sistema principal de missões.

Ele controla:

- missões ativas;
- missões concluídas;
- missões falhadas;
- objetivos;
- categorias;
- missão rastreada;
- arquivo `Quests.txt`.

O `MissaoHUD` utiliza essas informações para apresentar a missão atual durante o jogo.

A integração é realizada sem alterar diretamente o arquivo:

```text
Galv_QuestLog.js
```

O plugin intercepta determinadas funções públicas do Galv e executa a sincronização da HUD depois que o comportamento original é concluído.

---

## Arquivo Quests.txt

As missões continuam sendo definidas normalmente pelo Galv's Quest Log através do arquivo:

```text
data/Quests.txt
```

Exemplo:

```text
<quest 1:Em Busca do Passaporte|1|0>
Converse com vovó,Converse com sua mãe,Pegue seu cartão,Realize o processo no computador
Você conseguiu emitir seu passaporte.
Seu objetivo é realizar todo o processo necessário para emitir seu primeiro passaporte.
</quest>
```

O `MissaoHUD` lê diretamente os dados carregados pelo Galv's Quest Log.

Por isso, não é necessário cadastrar novamente dentro do `MissaoHUD.js`:

- nome da missão;
- nome dos objetivos;
- quantidade de objetivos.

Alterações realizadas no `Quests.txt` são automaticamente refletidas pela HUD.

---

## Rastreamento de uma missão

Para rastrear uma missão através do Galv's Quest Log:

```javascript
Galv.QUEST.track(1);
```

O `MissaoHUD` detectará automaticamente a alteração.

Não é necessário executar nenhum comando adicional.

Por exemplo:

```javascript
Galv.QUEST.activate(1);
Galv.QUEST.track(1);
Galv.QUEST.objective(1,0,'activate');
```

A HUD passará a exibir automaticamente a missão de ID `1`.

---

## Rastreamento manual pelo Quest Log

O jogador também pode trocar a missão rastreada diretamente através da interface do Galv's Quest Log.

Por exemplo:

```text
História Principal
    Em Busca do Passaporte

Missões Secundárias
    O Relógio Quebrado
```

Caso o jogador selecione:

```text
O Relógio Quebrado
```

como missão rastreada, o Galv's Quest Log executa internamente sua função de rastreamento.

O `MissaoHUD` identifica essa alteração e atualiza automaticamente sua interface.

Assim, não é necessário criar eventos adicionais para sincronizar a HUD quando o jogador troca manualmente de missão.

---

## Remover rastreamento

Caso o jogador selecione novamente uma missão que já está sendo rastreada, o Galv's Quest Log remove o rastreamento.

Quando nenhuma missão estiver sendo rastreada, o `MissaoHUD` também será ocultado automaticamente.

---

## Atualização de objetivos

Quando um objetivo for concluído:

```javascript
Galv.QUEST.objective(1,0,'complete');
```

e o próximo for ativado:

```javascript
Galv.QUEST.objective(1,1,'activate');
```

o `MissaoHUD` identifica automaticamente o novo objetivo.

Exemplo completo:

```javascript
Galv.QUEST.objective(1,0,'complete');
Galv.QUEST.objective(1,1,'activate');
```

A HUD pode mudar automaticamente de:

```text
MISSÃO ATUAL

Em Busca do Passaporte
• Converse com vovó
```

para:

```text
MISSÃO ATUAL

Em Busca do Passaporte
• Converse com sua mãe
```

Não é necessário utilizar um segundo comando específico do `MissaoHUD`.

---

## Comportamento visual

Quando uma nova missão é rastreada, a HUD não aparece imediatamente.

O comportamento padrão é:

```text
Missão rastreada
        ↓
Aguarda aproximadamente 2 segundos
        ↓
HUD aparece através de fade
        ↓
Exibe "Novo"
        ↓
"Novo" permanece por aproximadamente 10 segundos
        ↓
Indicador desaparece
```

A missão continua sendo exibida normalmente após o desaparecimento do indicador.

---

## Comportamento durante diálogos

Durante caixas de diálogo do RPG Maker MV, a HUD é temporariamente escondida.

Esse comportamento evita que a HUD fique sobreposta aos diálogos e ajuda a manter a tela mais limpa.

Depois que o diálogo termina, existe um pequeno período de segurança antes da HUD reaparecer.

Isso evita o efeito de piscada que poderia ocorrer ao avançar rapidamente mensagens utilizando:

```text
Enter
Espaço
Clique
```

---

## Interface

O estilo visual atual utiliza:

- largura compacta;
- formato retangular;
- cantos quadrados;
- fundo escuro semitransparente;
- borda laranja suave;
- título `MISSÃO ATUAL` em tom alaranjado;
- indicador `Novo` em amarelo;
- texto da missão em branco;
- objetivo atual exibido abaixo do nome da missão.

Exemplo:

```text
┌─────────────────────────────┐
│ MISSÃO ATUAL          Novo  │
│ ─────────────────────────── │
│ Em Busca do Passaporte      │
│ • Converse com vovó         │
└─────────────────────────────┘
```

---

## Parâmetros

Os principais parâmetros podem ser alterados através do Gerenciador de Plugins.

### Largura

Define a largura da HUD.

Valor padrão:

```text
250
```

### Altura

Define a altura da HUD.

Valor padrão:

```text
92
```

### Margem

Define a distância entre a HUD e as bordas da tela.

Valor padrão:

```text
12
```

### AtrasoNovaMissao

Define quantos frames serão aguardados antes de uma nova missão aparecer.

Valor padrão:

```text
120
```

Em aproximadamente 60 FPS:

```text
120 frames ≈ 2 segundos
```

### TempoNovo

Define por quanto tempo a indicação `Novo` será exibida.

Valor padrão:

```text
600
```

Em aproximadamente 60 FPS:

```text
600 frames ≈ 10 segundos
```

### AtrasoAposDialogo

Define um pequeno intervalo depois do fechamento de uma mensagem antes da HUD reaparecer.

Isso ajuda a impedir piscadas durante diálogos.

### VelocidadeFade

Controla a velocidade do efeito de entrada e saída da HUD.

---

## Comandos do MissaoHUD

A maior parte da progressão normal deve ser controlada pelo Galv's Quest Log.

Mesmo assim, existem alguns comandos auxiliares.

---

### Forçar sincronização

Para obrigar a HUD a verificar novamente a missão rastreada pelo Galv:

```javascript
MissaoHUD.sync();
```

Normalmente esse comando não é necessário.

---

### Esconder temporariamente

```javascript
MissaoHUD.hide();
```

Pode ser utilizado em cenas nas quais a HUD não deve aparecer.

Por exemplo:

```text
Computador
Cutscene
Tela especial
Minigame
```

---

### Mostrar novamente

```javascript
MissaoHUD.show();
```

O conteúdo anterior continua armazenado.

---

### Limpar a HUD

```javascript
MissaoHUD.clear();
```

Esse comando remove o conteúdo exibido e limpa o rastreamento visual da HUD.

---

### Definir uma missão manualmente

Mesmo sendo desenvolvido para integração com o Galv's Quest Log, o plugin também permite exibir informações manualmente.

Exemplo:

```javascript
MissaoHUD.set(
    "O Relógio Quebrado",
    "Consiga dinheiro para o conserto"
);
```

Isso pode ser útil para testes ou sistemas que não utilizem o Galv's Quest Log.

---

## Exemplo no projeto Missão UAI

### Início da missão

No final da introdução:

```javascript
Galv.QUEST.activate(1);
Galv.QUEST.track(1);

Galv.QUEST.objective(1,0,'activate');
Galv.QUEST.objective(1,1,'hide');
Galv.QUEST.objective(1,2,'hide');
Galv.QUEST.objective(1,3,'hide');
Galv.QUEST.objective(1,4,'hide');
Galv.QUEST.objective(1,5,'hide');
Galv.QUEST.objective(1,6,'hide');
Galv.QUEST.objective(1,7,'hide');
Galv.QUEST.objective(1,8,'hide');
Galv.QUEST.objective(1,9,'hide');
Galv.QUEST.objective(1,10,'hide');
```

A HUD será atualizada automaticamente.

---

### Conversa com vovó

Ao finalizar corretamente a conversa:

```javascript
Galv.QUEST.objective(1,0,'complete');
Galv.QUEST.objective(1,1,'activate');
```

O próximo objetivo será exibido automaticamente.

---

### Conversa com a mãe

```javascript
Galv.QUEST.objective(1,1,'complete');
Galv.QUEST.objective(1,2,'activate');
```

---

### Obtenção do cartão

```javascript
Galv.QUEST.objective(1,2,'complete');
Galv.QUEST.objective(1,3,'activate');
```

---

### Processo no computador

Depois de finalizar solicitação, pagamento e agendamento:

```javascript
Galv.QUEST.objective(1,3,'complete');
Galv.QUEST.objective(1,4,'activate');
```

A HUD passará a indicar:

```text
Espere até dar o horário
```

---

## Missões secundárias

O sistema também funciona com missões secundárias.

Exemplo:

```javascript
Galv.QUEST.activate(2);
```

Para rastreá-la:

```javascript
Galv.QUEST.track(2);
```

O `MissaoHUD` buscará automaticamente:

- nome da Quest 2;
- objetivos da Quest 2;
- objetivo ativo;
- estado de rastreamento.

Não é necessário cadastrar os textos da missão dentro do plugin.

---

## Salvamento

O estado necessário para funcionamento da HUD é armazenado dentro do:

```javascript
$gameSystem
```

Como `$gameSystem` faz parte dos dados de salvamento do RPG Maker MV, informações relacionadas à HUD podem permanecer entre sessões do jogo.

---

## Compatibilidade com Galv's Quest Log

Versão utilizada durante o desenvolvimento:

```text
Galv's Quest Log v1.3
```

O `MissaoHUD` não altera o arquivo original do Galv.

A integração é feita através de extensão de funções JavaScript em tempo de execução.

Entre as funções observadas estão:

```javascript
Galv.QUEST.track();
Galv.QUEST.objective();
Galv.QUEST.complete();
Galv.QUEST.fail();
```

Isso permite preservar o plugin original e manter o `MissaoHUD` como um componente separado.

---

## Projeto Missão UAI

O `MissaoHUD` foi desenvolvido inicialmente para o Trabalho de Conclusão de Curso **Missão UAI**.

O projeto utiliza RPG Maker MV para desenvolver uma experiência educativa relacionada ao processo de emissão de passaporte.

O fluxo principal planejado inclui:

1. Conversar com vovó
2. Conversar com a mãe
3. Obter o cartão pré-pago
4. Realizar o processo no computador
5. Esperar o horário do atendimento
6. Sair do prédio
7. Utilizar o transporte até o shopping
8. Encontrar a UAI
9. Esperar o atendimento
10. Tirar a foto
11. Receber o passaporte

Também existem missões secundárias planejadas, como:

- O Relógio Quebrado
- O Notebook Velho
- Viajar o Mundo

---

## Tecnologias utilizadas

- JavaScript
- RPG Maker MV
- Galv's Quest Log
- Git
- GitHub
- IntelliJ IDEA

---

## Desenvolvimento

O plugin é desenvolvido de maneira independente do projeto principal do RPG Maker.

Fluxo utilizado:

```text
IntelliJ IDEA
      ↓
Desenvolvimento do MissaoHUD.js
      ↓
Git
      ↓
GitHub
      ↓
Versão do plugin
      ↓
RPG Maker MV
```

Isso permite manter um histórico de alterações e evolução do componente.

---

## Versionamento

O projeto utiliza versionamento semântico.

Formato:

```text
MAJOR.MINOR.PATCH
```

Exemplo:

```text
0.2.1
```

Onde:

```text
0 = ainda em desenvolvimento
2 = segunda evolução relevante de funcionalidades
1 = ajuste/correção dessa versão
```

---

## Versão atual

```text
0.2.1
```

Principais alterações desta versão:

- integração automática com Galv's Quest Log;
- sincronização do rastreamento manual;
- leitura direta dos dados de `Quests.txt`;
- remoção da duplicação de nomes e objetivos;
- novo visual da HUD;
- borda quadrada em tom alaranjado;
- indicador `Novo`;
- atraso antes da exibição de uma nova missão;
- efeito de fade;
- correção de piscadas durante diálogos.

---

## Autor

**Gustavo Pestana**

Projeto desenvolvido inicialmente como parte do TCC **Missão UAI**.