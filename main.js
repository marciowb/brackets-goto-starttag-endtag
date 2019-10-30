/*
 * Brackets 'go to start tag / end tag' extension.
 *
 * Copyright (c) 2019 Marcio Wesley Borges. All rights reserved.
 * Distributed under an MIT license:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*jslint vars: true, plusplus: true, devel: true, regexp: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets */

define(function (require) {

    "use strict";

    const CommandManager = brackets.getModule("command/CommandManager");
    const EditorManager = brackets.getModule("editor/EditorManager");
    const Menus = brackets.getModule("command/Menus");

    function isBetween(cur, range) {
        if (!cur || !range)
            return false;
        if (cur.line<range.from.line)
            return false;
        if (cur.line>range.to.line)
            return false;
        if ((cur.line==range.from.line) && (cur.ch<range.from.ch))
            return false;
        if ((cur.line==range.to.line) && (cur.ch>range.to.ch))
            return false;
        return true;
    }

    function gotoStartTagOrEndTag() {

        const editor = EditorManager.getActiveEditor();        
        const marks = editor._codeMirror.getAllMarks().filter( (m) => m.className=="CodeMirror-matchingtag");

        if (!!marks && marks.length>1) {
            const cursorPos = editor.getCursorPos();
            if (!!cursorPos) {
                let range = marks[1].find();
                if (isBetween(cursorPos, range))
                    range = marks[0].find(); 
                if (!!range) 
                    editor.setCursorPos(range.from.line, range.from.ch + 1);
                console.log( "De/Para: ", cursorPos, range, marks);
            }
        }

    }


    function init() {

        const COMMAND_ID = "marciowb.goToStartTagOrEndTag";
        CommandManager.register("Goto Start Tag or End Tag", COMMAND_ID, gotoStartTagOrEndTag);

        const menu = Menus.getMenu(Menus.AppMenuBar.NAVIGATE_MENU);
        menu.addMenuItem(
            COMMAND_ID,
            "Ctrl-Alt-Shift-/",
            Menus.LAST_IN_SECTION,
            Menus.MenuSection.NAVIGATE_GOTO_COMMANDS
        );

    }


    init();

});
