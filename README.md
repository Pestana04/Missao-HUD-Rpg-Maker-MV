# Missão HUD - RPG Maker MV

Plugin desenvolvido para o projeto **Missão UAI**, Trabalho de Conclusão de Curso em Sistemas de Informação.

O objetivo do plugin é adicionar ao RPG Maker MV uma HUD permanente para exibição da missão e do objetivo atualmente rastreados pelo jogador.

## Funcionalidades

- Exibição da missão atual no canto superior direito
- Exibição do objetivo atual
- Persistência do objetivo nos arquivos de salvamento
- Ocultação automática durante diálogos
- Possibilidade de ocultar e mostrar a HUD manualmente
- Suporte a missões personalizadas
- Integração complementar com o Galv's Quest Log

## Instalação

1. Baixe o arquivo `MissaoHUD.js`.

2. Copie o arquivo para a pasta de plugins do seu projeto RPG Maker MV:

```text
SeuProjeto/
└── js/
    └── plugins/
        └── MissaoHUD.js
```

3. Abra o projeto no RPG Maker MV.

4. Acesse:

```text
Ferramentas → Gerenciador de Plugins
```

5. Adicione o plugin:

```text
MissaoHUD
```

6. Defina o status como:

```text
ON
```

Caso o projeto também utilize o **Galv's Quest Log**, recomenda-se deixar o `MissaoHUD` abaixo dele na lista de plugins:

```text
Galv_QuestLog    ON
MissaoHUD        ON
```

---

## Utilização

O plugin pode ser controlado através de chamadas de Script dentro dos eventos do RPG Maker MV.

### Definir um objetivo da missão principal

```javascript
MissaoHUD.setObjective(0);
```

O número representa o índice do objetivo.

Exemplo:

```javascript
MissaoHUD.setObjective(1);
```

Altera a HUD para o segundo objetivo da missão principal.

---

## Objetivos da missão principal

Os índices utilizados atualmente são:

```text
0  - Converse com vovó
1  - Converse com sua mãe
2  - Pegue seu cartão
3  - Realize o processo no computador
4  - Espere até dar o horário
5  - Vá para fora do prédio
6  - Pegue o ônibus para o shopping
7  - Encontre a UAI
8  - Espere na fila
9  - Tire a foto 3x4
10 - Pegue o passaporte
```

Exemplo de progressão:

```javascript
MissaoHUD.setObjective(0);
```

Depois:

```javascript
MissaoHUD.setObjective(1);
```

E assim sucessivamente.

---

## Missão personalizada

Também é possível definir manualmente o nome da missão e o objetivo atual.

```javascript
MissaoHUD.set(
    "O Relógio Quebrado",
    "Consiga dinheiro para o conserto"
);
```

A HUD exibirá:

```text
MISSÃO ATUAL

O Relógio Quebrado
• Consiga dinheiro para o conserto
```

---

## Esconder a HUD

Para esconder temporariamente a HUD:

```javascript
MissaoHUD.hide();
```

Isso pode ser útil durante cenas especiais ou interfaces que ocupem grande parte da tela.

Por exemplo, durante o uso do computador do jogo:

```javascript
MissaoHUD.hide();
```

---

## Mostrar a HUD novamente

Para voltar a exibir a HUD:

```javascript
MissaoHUD.show();
```

---

## Limpar a HUD

Para remover completamente a missão atualmente exibida:

```javascript
MissaoHUD.clear();
```

---

## Concluir a missão principal

Para indicar que a missão principal foi concluída:

```javascript
MissaoHUD.complete();
```

A HUD passará a exibir:

```text
Em Busca do Passaporte
• Missão concluída!
```

---

## Integração com Galv's Quest Log

O `MissaoHUD` foi desenvolvido para funcionar como complemento ao plugin **Galv's Quest Log**.

O Galv's Quest Log continua responsável pelo gerenciamento completo das missões, enquanto o `MissaoHUD` apresenta o objetivo atual permanentemente durante a exploração.

Exemplo:

```javascript
Galv.QUEST.activate(1);
Galv.QUEST.track(1);
MissaoHUD.setObjective(0);
```

Ao concluir o primeiro objetivo:

```javascript
Galv.QUEST.objective(1,0,'complete');
Galv.QUEST.objective(1,1,'activate');

MissaoHUD.setObjective(1);
```

Dessa forma, os dois sistemas permanecem sincronizados.

---

## Salvamento

As informações da HUD são armazenadas através do objeto `$gameSystem`.

Isso permite que o objetivo atual seja preservado juntamente com o arquivo de salvamento do RPG Maker MV.

---

## Projeto Missão UAI

O plugin foi desenvolvido inicialmente para o projeto acadêmico **Missão UAI**.

O projeto utiliza o RPG Maker MV para criar uma experiência educativa e interativa relacionada às etapas necessárias para a emissão de um passaporte.

Entre as etapas representadas no jogo estão:

- preparação do personagem;
- obtenção de um cartão pré-pago;
- solicitação do passaporte;
- pagamento da taxa;
- agendamento do atendimento;
- deslocamento até a UAI;
- atendimento presencial;
- recebimento do passaporte.

---

## Tecnologias

- JavaScript
- RPG Maker MV
- Galv's Quest Log
- Git
- GitHub

---

## Versão

Versão atual:

```text
0.1.0
```

---

## Licença

Este projeto é disponibilizado sob a licença MIT.

Consulte o arquivo `LICENSE` para mais informações.
