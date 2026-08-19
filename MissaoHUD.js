/*:
 * @plugindesc v0.1.0 - HUD permanente de missões para o projeto Missão UAI.
 * @author Gustavo Pestana
 *
 * @param Largura
 * @desc Largura da janela da HUD.
 * @default 360
 *
 * @param Margem
 * @desc Distância da HUD em relação às bordas da tela.
 * @default 12
 *
 * @param Opacidade
 * @desc Opacidade da moldura da janela. 0 a 255.
 * @default 190
 *
 * @param Fundo
 * @desc Opacidade do fundo da janela. 0 a 255.
 * @default 150
 *
 * @param OcultarDuranteDialogo
 * @desc Esconde temporariamente a HUD enquanto mensagens são exibidas.
 * @type boolean
 * @on Sim
 * @off Não
 * @default true
 *
 * @help
 * ============================================================================
 * MissaoHUD - RPG Maker MV
 * ============================================================================
 *
 * Plugin desenvolvido para o projeto acadêmico "Missão UAI".
 *
 * Exibe a missão atualmente rastreada no canto superior direito da tela.
 *
 * ---------------------------------------------------------------------------
 * SCRIPT CALLS
 * ---------------------------------------------------------------------------
 *
 * MissaoHUD.setObjective(0);
 * Define um objetivo da missão principal.
 *
 * MissaoHUD.set("Nome da missão", "Objetivo atual");
 * Define manualmente uma missão e um objetivo.
 *
 * MissaoHUD.show();
 * Mostra a HUD.
 *
 * MissaoHUD.hide();
 * Esconde a HUD.
 *
 * MissaoHUD.clear();
 * Limpa e esconde a HUD.
 *
 * MissaoHUD.complete();
 * Mostra a missão principal como concluída.
 *
 * ---------------------------------------------------------------------------
 * OBJETIVOS DA MISSÃO PRINCIPAL
 * ---------------------------------------------------------------------------
 *
 * 0  - Converse com vovó
 * 1  - Converse com sua mãe
 * 2  - Pegue seu cartão
 * 3  - Realize o processo no computador
 * 4  - Espere até dar o horário
 * 5  - Vá para fora do prédio
 * 6  - Pegue o ônibus para o shopping
 * 7  - Encontre a UAI
 * 8  - Espere na fila
 * 9  - Tire a foto 3x4
 * 10 - Pegue o passaporte
 *
 * ============================================================================
 */

var Imported = Imported || {};
Imported.MissaoHUD = true;

(function() {

    "use strict";

    // ------------------------------------------------------------------------
    // Parâmetros
    // ------------------------------------------------------------------------

    var parameters = PluginManager.parameters("MissaoHUD");

    var HUD_WIDTH =
        Number(parameters["Largura"] || 360);

    var HUD_MARGIN =
        Number(parameters["Margem"] || 12);

    var HUD_OPACITY =
        Number(parameters["Opacidade"] || 190);

    var HUD_BACK_OPACITY =
        Number(parameters["Fundo"] || 150);

    var HIDE_DURING_MESSAGE =
        String(parameters["OcultarDuranteDialogo"] || "true") === "true";

    var HUD_HEIGHT = 112;


    // ------------------------------------------------------------------------
    // Missão principal
    // ------------------------------------------------------------------------

    var MAIN_QUEST_TITLE =
        "Em Busca do Passaporte";

    var MAIN_OBJECTIVES = [
        "Converse com vovó",
        "Converse com sua mãe",
        "Pegue seu cartão",
        "Realize o processo no computador",
        "Espere até dar o horário",
        "Vá para fora do prédio",
        "Pegue o ônibus para o shopping",
        "Encontre a UAI",
        "Espere na fila",
        "Tire a foto 3x4",
        "Pegue o passaporte"
    ];


    // ------------------------------------------------------------------------
    // Dados salvos
    // ------------------------------------------------------------------------

    var _Game_System_initialize =
        Game_System.prototype.initialize;

    Game_System.prototype.initialize = function() {

        _Game_System_initialize.call(this);

        this._missaoHudData = {
            visible: false,
            title: "",
            objective: ""
        };

    };


    // ------------------------------------------------------------------------
    // Objeto global
    // ------------------------------------------------------------------------

    window.MissaoHUD = window.MissaoHUD || {};


    MissaoHUD.data = function() {

        if (!$gameSystem._missaoHudData) {

            $gameSystem._missaoHudData = {
                visible: false,
                title: "",
                objective: ""
            };

        }

        return $gameSystem._missaoHudData;

    };


    // ------------------------------------------------------------------------
    // Definir missão manualmente
    // ------------------------------------------------------------------------

    MissaoHUD.set = function(title, objective) {

        var data = this.data();

        data.title = title || "";
        data.objective = objective || "";
        data.visible = true;

    };


    // ------------------------------------------------------------------------
    // Definir objetivo da missão principal
    // ------------------------------------------------------------------------

    MissaoHUD.setObjective = function(index) {

        if (
            index < 0 ||
            index >= MAIN_OBJECTIVES.length
        ) {
            console.warn(
                "MissaoHUD: índice de objetivo inválido: " + index
            );

            return;
        }

        this.set(
            MAIN_QUEST_TITLE,
            MAIN_OBJECTIVES[index]
        );

    };


    // ------------------------------------------------------------------------
    // Mostrar
    // ------------------------------------------------------------------------

    MissaoHUD.show = function() {

        var data = this.data();

        if (data.title && data.objective) {
            data.visible = true;
        }

    };


    // ------------------------------------------------------------------------
    // Esconder
    // ------------------------------------------------------------------------

    MissaoHUD.hide = function() {

        this.data().visible = false;

    };


    // ------------------------------------------------------------------------
    // Limpar
    // ------------------------------------------------------------------------

    MissaoHUD.clear = function() {

        var data = this.data();

        data.visible = false;
        data.title = "";
        data.objective = "";

    };


    // ------------------------------------------------------------------------
    // Concluir missão
    // ------------------------------------------------------------------------

    MissaoHUD.complete = function() {

        this.set(
            MAIN_QUEST_TITLE,
            "Missão concluída!"
        );

    };


    // ========================================================================
    // Window_MissaoHUD
    // ========================================================================

    function Window_MissaoHUD() {

        this.initialize.apply(
            this,
            arguments
        );

    }


    Window_MissaoHUD.prototype =
        Object.create(Window_Base.prototype);

    Window_MissaoHUD.prototype.constructor =
        Window_MissaoHUD;


    Window_MissaoHUD.prototype.initialize = function() {

        var x =
            Graphics.boxWidth -
            HUD_WIDTH -
            HUD_MARGIN;

        var y =
            HUD_MARGIN;

        Window_Base.prototype.initialize.call(
            this,
            x,
            y,
            HUD_WIDTH,
            HUD_HEIGHT
        );

        this.opacity = HUD_OPACITY;
        this.backOpacity = HUD_BACK_OPACITY;

        this._lastTitle = null;
        this._lastObjective = null;
        this._lastVisible = null;

        this.refresh();

    };


    // ------------------------------------------------------------------------
    // Refresh
    // ------------------------------------------------------------------------

    Window_MissaoHUD.prototype.refresh = function() {

        this.contents.clear();

        var data = MissaoHUD.data();

        if (
            !data.visible ||
            !data.title ||
            !data.objective
        ) {

            this.visible = false;

            return;

        }

        this.visible = true;

        // Cabeçalho
        this.contents.fontSize = 16;

        this.changeTextColor(
            this.systemColor()
        );

        this.drawText(
            "MISSÃO ATUAL",
            0,
            -4,
            this.contentsWidth(),
            "left"
        );


        // Nome da missão
        this.resetTextColor();

        this.contents.fontSize = 18;

        this.drawText(
            data.title,
            0,
            22,
            this.contentsWidth(),
            "left"
        );


        // Objetivo
        this.contents.fontSize = 18;

        this.drawText(
            "• " + data.objective,
            0,
            50,
            this.contentsWidth(),
            "left"
        );

        this.resetFontSettings();

    };


    // ------------------------------------------------------------------------
    // Update
    // ------------------------------------------------------------------------

    Window_MissaoHUD.prototype.update = function() {

        Window_Base.prototype.update.call(this);

        var data = MissaoHUD.data();

        var temporaryHide =
            HIDE_DURING_MESSAGE &&
            $gameMessage &&
            $gameMessage.isBusy();

        this.visible =
            data.visible &&
            !temporaryHide &&
            !!data.objective;


        if (
            this._lastTitle !== data.title ||
            this._lastObjective !== data.objective ||
            this._lastVisible !== data.visible
        ) {

            this._lastTitle =
                data.title;

            this._lastObjective =
                data.objective;

            this._lastVisible =
                data.visible;

            this.refresh();

        }

        if (temporaryHide) {
            this.visible = false;
        }

    };


    // ========================================================================
    // Adicionar ao Scene_Map
    // ========================================================================

    var _Scene_Map_createAllWindows =
        Scene_Map.prototype.createAllWindows;

    Scene_Map.prototype.createAllWindows = function() {

        _Scene_Map_createAllWindows.call(this);

        this._missaoHudWindow =
            new Window_MissaoHUD();

        this.addWindow(
            this._missaoHudWindow
        );

    };


})();