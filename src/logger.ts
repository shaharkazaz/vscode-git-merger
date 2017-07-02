/** 
 *  @fileOverview This file is in charge of logging and displaying messages
 *  @author       Shahar Kazaz
 *  @requires     vscode
 *  @requires     npm:moment
 *  @requires     ./constants/string-constnats: string-constants
 */

import * as vscode from 'vscode';
import * as moment from 'moment';
import strings from './constants/string-constnats';

/**
 * The output channel instance
 * @type {vscode.OutputChannel}
 */
let outLogChannel: vscode.OutputChannel;

/**
 * Creates an output channel instance or retrives it if already exists.
 * @returns {vscode.OutputChannel} The output channel instance
 */
function getLogChannel() {
    if (outLogChannel === undefined) {
        outLogChannel = vscode.window.createOutputChannel('Git Merger');
    }
    return outLogChannel;
}

export function logError(errorTitle: string, error: any) {
    getLogChannel().appendLine(`[Error-${moment().format(strings.timeForamt.hours)}] ${errorTitle}\n${error.toString()}`);
    vscode.window.showErrorMessage(strings.windowErrorMessage, strings.actionButtons.openLog).then((action) => {
        if (action == strings.actionButtons.openLog) {
            this.openLog();
        }
    });
}

export function logInfo(message: string) {
    getLogChannel().appendLine(`[Info-${moment().format(strings.timeForamt.hours)}] ${message}`);
    vscode.window.showInformationMessage(message);
}

export function logWarning(message: string) {
    getLogChannel().appendLine(`[Warning-${moment().format(strings.timeForamt.hours)}] ${message}`);
}

export function logDebug(message: string) {
    getLogChannel().appendLine(`[Debug-${moment().format(strings.timeForamt.hours)}] ${message}`);
}

export function openLog(): void {
    getLogChannel().show();
}