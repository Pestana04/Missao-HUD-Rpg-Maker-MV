// SPDX-License-Identifier: MIT

/*:
 * @plugindesc v0.2.1 - HUD permanente integrada ao Galv's Quest Log.
 * @author Gustavo Pestana
 *
 * @param Largura
 * @type number
 * @default 250
 *
 * @param Altura
 * @type number
 * @default 92
 *
 * @param Margem
 * @type number
 * @default 12
 *
 * @param AtrasoNovaMissao
 * @type number
 * @desc Frames antes de uma nova missão aparecer. 120 = aproximadamente 2 segundos.
 * @default 120
 *
 * @param TempoNovo
 * @type number
 * @desc Tempo que a palavra Novo permanece. 600 = aproximadamente 10 segundos.
 * @default 600
 *
 * @param AtrasoAposDialogo
 * @type number
 * @desc Tempo de segurança após fechar uma mensagem para evitar piscadas.
 * @default 30
 *
 * @param VelocidadeFade
 * @type number
 * @default 18
 *
 * @help
 * ============================================================================
 * MissaoHUD
 * ============================================================================
 *
 * HUD de missões desenvolvida para o projeto Missão UAI.
 *
 * Coloque este plugin ABAIXO do Galv_QuestLog.
 *
 * A HUD acompanha automaticamente:
 *
 * Galv.QUEST.track(id);
 * Galv.QUEST.objective(id, objetivo, status);
 *
 * Também acompanha o rastreamento realizado manualmente
 * dentro da interface do Galv's Quest Log.
 *
 * ---------------------------------------------------------------------------
 * SCRIPT CALLS
 * ---------------------------------------------------------------------------
 *
 * MissaoHUD.hide();
 * Esconde temporariamente.
 *
 * MissaoHUD.show();
 * Mostra novamente.
 *
 * MissaoHUD.clear();
 * Limpa a HUD.
 *
 * MissaoHUD.sync();
 * Força sincronização com a quest rastreada pelo Galv.
 *
 * MissaoHUD.set("Missão", "Objetivo");
 * Permite exibição manual sem utilizar o Galv.
 *
 * ============================================================================
 */

var Imported = Imported || {};
Imported.MissaoHUD = true;

(function() {

    "use strict";

    // ========================================================================
    // CONFIGURAÇÃO
    // ========================================================================

    var parameters = PluginManager.parameters("MissaoHUD");

    var CFG = {

        width:
            Number(parameters["Largura"] || 250),

        height:
            Number(parameters["Altura"] || 92),

        margin:
            Number(parameters["Margem"] || 12),

        trackDelay:
            Number(parameters["AtrasoNovaMissao"] || 120),

        newTime:
            Number(parameters["TempoNovo"] || 600),

        messageCooldown:
            Number(parameters["AtrasoAposDialogo"] || 30),

        fadeSpeed:
            Number(parameters["VelocidadeFade"] || 18),

        objectiveDelay: 15,

        background:
            "rgba(18,18,22,0.78)",

        border:
            "rgba(214,145,78,0.82)",

        separator:
            "rgba(214,145,78,0.35)",

        title:
            "#e1a05f",

        newText:
            "#ffd65a",

        quest:
            "#ffffff",

        objective:
            "#f2f2f2"
    };


    // ========================================================================
    // DADOS
    // ========================================================================

    function createDefaultData() {

        return {

            visible: true,

            trackedQuestId: 0,

            objectiveIndex: 0,

            title: "",

            objective: "",

            pendingShowFrames: 0,

            messageCooldown: 0,

            newBadgeFrames: 0,

            newBadgePending: false

        };

    }


    // ========================================================================
    // GAME SYSTEM
    // ========================================================================

    var _Game_System_initialize =
        Game_System.prototype.initialize;


    Game_System.prototype.initialize = function() {

        _Game_System_initialize.call(this);

        this._missaoHudData =
            createDefaultData();

    };


    // ========================================================================
    // OBJETO GLOBAL
    // ========================================================================

    window.MissaoHUD =
        window.MissaoHUD || {};


    MissaoHUD.data = function() {

        if (!$gameSystem._missaoHudData) {

            $gameSystem._missaoHudData =
                createDefaultData();

        }

        return $gameSystem._missaoHudData;

    };


    // ========================================================================
    // ACESSAR QUEST DO GALV
    // ========================================================================

    MissaoHUD.getGalvQuest = function(id) {

        if (
            !window.Galv ||
            !Galv.QUEST ||
            !$gameSystem ||
            !$gameSystem._quests ||
            !$gameSystem._quests.quest
        ) {

            return null;

        }

        return (
            $gameSystem._quests.quest[id] ||
            null
        );

    };


    // ========================================================================
    // DESCOBRIR OBJETIVO ATUAL
    // ========================================================================

    MissaoHUD.findCurrentObjective = function(quest) {

        if (!quest) {
            return 0;
        }

        var objectives =
            quest.objectives();

        if (!objectives.length) {
            return 0;
        }

        var statuses =
            quest._objectives || [];


        // Primeiro procura um objetivo explicitamente ACTIVE = 0.
        for (
            var i = 0;
            i < objectives.length;
            i++
        ) {

            if (statuses[i] === 0) {

                return i;

            }

        }


        // Se a quest acabou de ser criada e ainda não possui
        // estados definidos, assume o primeiro objetivo.
        if (statuses.length === 0) {

            return 0;

        }


        // Se acabamos de completar um objetivo e o próximo
        // ainda não foi ativado, mantém o objetivo atual.
        var state =
            this.data();

        if (
            state.objectiveIndex >= 0 &&
            state.objectiveIndex <
            objectives.length
        ) {

            return state.objectiveIndex;

        }


        return 0;

    };


    // ========================================================================
    // SINCRONIZAR COM GALV
    // ========================================================================

    MissaoHUD.syncFromGalv = function(isNewTrack) {

        if (
            !window.Galv ||
            !Galv.QUEST ||
            !Galv.QUEST.isTracked
        ) {

            return;

        }

        var trackedId =
            Galv.QUEST.isTracked();


        // Nenhuma missão rastreada
        if (!trackedId) {

            this.clear();

            return;

        }


        var quest =
            this.getGalvQuest(trackedId);

        if (!quest) {

            return;

        }


        var state =
            this.data();

        var oldQuestId =
            state.trackedQuestId;

        var oldObjective =
            state.objectiveIndex;


        // IMPORTANTE:
        // Antes de alterar trackedQuestId,
        // calcula corretamente o objetivo.
        var objectiveIndex =
            this.findCurrentObjective(quest);

        var objectives =
            quest.objectives();


        state.trackedQuestId =
            trackedId;

        state.objectiveIndex =
            objectiveIndex;

        state.title =
            quest.name();

        state.objective =
            objectives[objectiveIndex] || "";

        state.visible = true;


        // Nova missão rastreada
        if (
            isNewTrack ||
            oldQuestId !== trackedId
        ) {

            state.pendingShowFrames =
                CFG.trackDelay;

            state.newBadgePending =
                true;

            state.newBadgeFrames =
                0;

        }

        // Apenas mudança de objetivo
        else if (
            oldObjective !==
            objectiveIndex
        ) {

            state.pendingShowFrames =
                CFG.objectiveDelay;

        }

    };


    // ========================================================================
    // SINCRONIZAÇÃO MANUAL
    // ========================================================================

    MissaoHUD.sync = function() {

        this.syncFromGalv(false);

    };


    // ========================================================================
    // DEFINIR MANUALMENTE
    // ========================================================================

    MissaoHUD.set = function(title, objective) {

        var state =
            this.data();

        state.trackedQuestId = -1;

        state.title =
            title || "";

        state.objective =
            objective || "";

        state.visible = true;

        state.pendingShowFrames =
            CFG.trackDelay;

        state.newBadgePending =
            true;

        state.newBadgeFrames = 0;

    };


    // ========================================================================
    // ESCONDER
    // ========================================================================

    MissaoHUD.hide = function() {

        this.data().visible = false;

    };


    // ========================================================================
    // MOSTRAR
    // ========================================================================

    MissaoHUD.show = function() {

        var state =
            this.data();

        if (
            state.title &&
            state.objective
        ) {

            state.visible = true;

        }

    };


    // ========================================================================
    // LIMPAR
    // ========================================================================

    MissaoHUD.clear = function() {

        var state =
            this.data();

        state.visible = false;

        state.trackedQuestId = 0;

        state.objectiveIndex = 0;

        state.title = "";

        state.objective = "";

        state.pendingShowFrames = 0;

        state.newBadgeFrames = 0;

        state.newBadgePending = false;

    };


    // ========================================================================
    // SPRITE
    // ========================================================================

    function Sprite_MissaoHUD() {

        this.initialize.apply(
            this,
            arguments
        );

    }


    Sprite_MissaoHUD.prototype =
        Object.create(Sprite.prototype);


    Sprite_MissaoHUD.prototype.constructor =
        Sprite_MissaoHUD;


    Sprite_MissaoHUD.prototype.initialize = function() {

        Sprite.prototype.initialize.call(this);

        this.bitmap =
            new Bitmap(
                CFG.width,
                CFG.height
            );

        this.opacity = 0;

        this._lastSignature = "";

        this.updatePosition();

        this.redraw();

    };


    // ========================================================================
    // POSIÇÃO
    // ========================================================================

    Sprite_MissaoHUD.prototype.updatePosition = function() {

        this.x =
            Graphics.boxWidth -
            CFG.width -
            CFG.margin;

        this.y =
            CFG.margin;

    };


    // ========================================================================
    // MESSAGE BUSY
    // ========================================================================

    Sprite_MissaoHUD.prototype.isMessageBusy = function() {

        if (
            $gameMessage &&
            $gameMessage.isBusy()
        ) {

            return true;

        }


        var scene =
            SceneManager._scene;


        if (
            scene &&
            scene._messageWindow
        ) {

            var window =
                scene._messageWindow;


            // A janela ainda está fisicamente aberta,
            // mesmo durante a troca entre páginas.
            if (
                window.openness > 0
            ) {

                return true;

            }

        }


        return false;

    };


    // ========================================================================
    // FADE
    // ========================================================================

    Sprite_MissaoHUD.prototype.fadeIn = function() {

        this.opacity =
            Math.min(
                255,
                this.opacity +
                CFG.fadeSpeed
            );

    };


    Sprite_MissaoHUD.prototype.fadeOut = function() {

        this.opacity =
            Math.max(
                0,
                this.opacity -
                CFG.fadeSpeed
            );

    };


    // ========================================================================
    // UPDATE
    // ========================================================================

    Sprite_MissaoHUD.prototype.update = function() {

        Sprite.prototype.update.call(this);

        this.updatePosition();

        var state =
            MissaoHUD.data();


        // ------------------------------------------------------------
        // Durante diálogos
        // ------------------------------------------------------------

        if (this.isMessageBusy()) {

            state.messageCooldown =
                CFG.messageCooldown;

            this.fadeOut();

            this.redrawIfNeeded();

            return;

        }


        // ------------------------------------------------------------
        // Segurança após diálogo
        // ------------------------------------------------------------

        if (
            state.messageCooldown > 0
        ) {

            state.messageCooldown--;

            this.fadeOut();

            this.redrawIfNeeded();

            return;

        }


        // ------------------------------------------------------------
        // Delay antes de mostrar
        // ------------------------------------------------------------

        if (
            state.pendingShowFrames > 0
        ) {

            state.pendingShowFrames--;

            this.fadeOut();

            this.redrawIfNeeded();

            return;

        }


        // ------------------------------------------------------------
        // Mostrar?
        // ------------------------------------------------------------

        var canShow =

            state.visible &&

            !!state.title &&

            !!state.objective;


        if (canShow) {


            // O contador de "Novo" só começa
            // quando a HUD realmente vai aparecer.

            if (
                state.newBadgePending
            ) {

                state.newBadgePending =
                    false;

                state.newBadgeFrames =
                    CFG.newTime;

            }


            this.fadeIn();


            // Tempo visível do "Novo"
            if (
                this.opacity > 0 &&
                state.newBadgeFrames > 0
            ) {

                state.newBadgeFrames--;

            }

        }

        else {

            this.fadeOut();

        }


        this.redrawIfNeeded();

    };


    // ========================================================================
    // ASSINATURA
    // ========================================================================

    Sprite_MissaoHUD.prototype.signature = function() {

        var state =
            MissaoHUD.data();

        return [

            state.title,

            state.objective,

            state.newBadgeFrames > 0
                ? 1
                : 0

        ].join("|");

    };


    Sprite_MissaoHUD.prototype.redrawIfNeeded = function() {

        var signature =
            this.signature();

        if (
            signature !==
            this._lastSignature
        ) {

            this._lastSignature =
                signature;

            this.redraw();

        }

    };


    // ========================================================================
    // BORDA QUADRADA
    // ========================================================================

    Sprite_MissaoHUD.prototype.drawBorder = function() {

        var bitmap =
            this.bitmap;

        var w =
            CFG.width;

        var h =
            CFG.height;

        var t = 2;


        bitmap.fillRect(
            0,
            0,
            w,
            t,
            CFG.border
        );

        bitmap.fillRect(
            0,
            h - t,
            w,
            t,
            CFG.border
        );

        bitmap.fillRect(
            0,
            0,
            t,
            h,
            CFG.border
        );

        bitmap.fillRect(
            w - t,
            0,
            t,
            h,
            CFG.border
        );

    };


    // ========================================================================
    // REDRAW
    // ========================================================================

    Sprite_MissaoHUD.prototype.redraw = function() {

        var bitmap =
            this.bitmap;

        var state =
            MissaoHUD.data();


        bitmap.clear();


        if (
            !state.title ||
            !state.objective
        ) {

            return;

        }


        // Fundo
        bitmap.fillRect(
            0,
            0,
            CFG.width,
            CFG.height,
            CFG.background
        );


        // Borda
        this.drawBorder();


        // Configuração geral da fonte
        bitmap.fontFace =
            "GameFont";

        bitmap.outlineColor =
            "rgba(0,0,0,0.85)";

        bitmap.outlineWidth = 3;


        // ------------------------------------------------------------
        // MISSÃO ATUAL
        // ------------------------------------------------------------

        bitmap.fontSize = 16;

        bitmap.textColor =
            CFG.title;

        bitmap.drawText(
            "MISSÃO ATUAL",
            10,
            4,
            135,
            24,
            "left"
        );


        // ------------------------------------------------------------
        // NOVO
        // ------------------------------------------------------------

        if (
            state.newBadgeFrames > 0
        ) {

            bitmap.fontSize = 12;

            bitmap.textColor =
                CFG.newText;

            bitmap.drawText(
                "Novo",
                CFG.width - 60,
                6,
                48,
                20,
                "right"
            );

        }


        // ------------------------------------------------------------
        // LINHA
        // ------------------------------------------------------------

        bitmap.fillRect(
            10,
            29,
            CFG.width - 20,
            1,
            CFG.separator
        );


        // ------------------------------------------------------------
        // NOME DA QUEST
        // ------------------------------------------------------------

        bitmap.fontSize = 14;

        bitmap.textColor =
            CFG.quest;

        bitmap.drawText(
            state.title,
            10,
            32,
            CFG.width - 20,
            22,
            "left"
        );


        // ------------------------------------------------------------
        // OBJETIVO
        // ------------------------------------------------------------

        bitmap.fontSize = 13;

        bitmap.textColor =
            CFG.objective;

        bitmap.drawText(
            "• " + state.objective,
            10,
            57,
            CFG.width - 20,
            22,
            "left"
        );

    };


    // ========================================================================
    // SCENE MAP
    // ========================================================================

    var _Scene_Map_createDisplayObjects =
        Scene_Map.prototype.createDisplayObjects;


    Scene_Map.prototype.createDisplayObjects = function() {

        _Scene_Map_createDisplayObjects.call(
            this
        );

        this._missaoHudSprite =
            new Sprite_MissaoHUD();

        this.addChild(
            this._missaoHudSprite
        );

    };


    // ========================================================================
    // INTEGRAÇÃO COM GALV
    // ========================================================================

    function installGalvIntegration() {

        if (
            !Imported.Galv_QuestLog ||
            !window.Galv ||
            !Galv.QUEST
        ) {

            console.warn(
                "MissaoHUD: Galv_QuestLog não encontrado."
            );

            return;

        }


        if (
            Galv.QUEST._missaoHudIntegrated
        ) {

            return;

        }


        Galv.QUEST._missaoHudIntegrated =
            true;


        // --------------------------------------------------------------------
        // TRACK
        // --------------------------------------------------------------------

        var _Galv_QUEST_track =
            Galv.QUEST.track;


        Galv.QUEST.track = function(id) {

            var before =
                Galv.QUEST.isTracked
                    ? Galv.QUEST.isTracked()
                    : 0;


            var result =
                _Galv_QUEST_track.apply(
                    this,
                    arguments
                );


            var after =
                Galv.QUEST.isTracked
                    ? Galv.QUEST.isTracked()
                    : 0;


            // Uma missão foi rastreada
            if (after) {

                MissaoHUD.syncFromGalv(
                    after !== before
                );

            }

                // O jogador clicou novamente
            // e removeu o rastreamento
            else {

                MissaoHUD.clear();

            }


            return result;

        };


        // --------------------------------------------------------------------
        // OBJECTIVE
        // --------------------------------------------------------------------

        var _Galv_QUEST_objective =
            Galv.QUEST.objective;


        Galv.QUEST.objective =
            function(
                id,
                objId,
                status,
                hidePopup
            ) {

                var result =
                    _Galv_QUEST_objective.apply(
                        this,
                        arguments
                    );


                // Só atualiza a HUD se esta
                // for a missão rastreada.
                if (
                    Galv.QUEST.isTracked &&
                    Galv.QUEST.isTracked() === id
                ) {

                    MissaoHUD.syncFromGalv(
                        false
                    );

                }


                return result;

            };


        // --------------------------------------------------------------------
        // COMPLETE
        // --------------------------------------------------------------------

        var _Galv_QUEST_complete =
            Galv.QUEST.complete;


        Galv.QUEST.complete =
            function(id, hidePopup) {

                var wasTracked =
                    Galv.QUEST.isTracked();


                var result =
                    _Galv_QUEST_complete.apply(
                        this,
                        arguments
                    );


                if (
                    wasTracked === id
                ) {

                    MissaoHUD.syncFromGalv(
                        false
                    );

                }


                return result;

            };


        // --------------------------------------------------------------------
        // FAIL
        // --------------------------------------------------------------------

        var _Galv_QUEST_fail =
            Galv.QUEST.fail;


        Galv.QUEST.fail =
            function(id, hidePopup) {

                var wasTracked =
                    Galv.QUEST.isTracked();


                var result =
                    _Galv_QUEST_fail.apply(
                        this,
                        arguments
                    );


                if (
                    wasTracked === id
                ) {

                    MissaoHUD.syncFromGalv(
                        false
                    );

                }


                return result;

            };


        console.log(
            "MissaoHUD: integração com Galv_QuestLog instalada."
        );

    }


    installGalvIntegration();


})();