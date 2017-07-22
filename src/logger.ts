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
let outLogChannel;

/**
 * Creates an output channel instance or retrives it if already exists.
 * @returns {vscode.OutputChannel} The output channel instance
 */
function getLogChannel() {
    if (outLogChannel === undefined) {
        outLogChannel = vscode.window.createOutputChannel('Git merger');
    }
    return outLogChannel;
}

/**
 * Print a error message to the log and shows a ui error message.
 * @returns {void} 
 */
export function logError(errorTitle: string, error: any) {
    getLogChannel().appendLine(`[Error-${moment().format(strings.timeForamt.hours)}] ${errorTitle}\n${error.toString()}`);
    vscode.window.showErrorMessage(strings.windowErrorMessage, strings.actionButtons.openLog).then((action) => {
        if (action) {
            this.openLog();
        }
    });
}

/**
 * Print a info message to the log and shows a ui error message.
 * @returns {void} 
 */
export function logInfo(message: string, actionButton?) {
    getLogChannel().appendLine(`[Info-${moment().format(strings.timeForamt.hours)}] ${message}`);
    vscode.window.showInformationMessage(message, actionButton ? actionButton.name : []).then((action) => {
        if(action){
            actionButton.callback();
        }
    });
}

/**
 * Print a warning message to the log
 * @returns {void} 
 */
export function logWarning(message: string) {
    getLogChannel().appendLine(`[Warning-${moment().format(strings.timeForamt.hours)}] ${message}`);
}

/**
 * Print a debug message to the log
 * @returns {void} 
 */
export function logDebug(message: string) {
    getLogChannel().appendLine(`[Debug-${moment().format(strings.timeForamt.hours)}] ${message}`);
}

/**
 * Opens a wanted output log
 * @returns {void} 
 */
export function openLog(): void {
    getLogChannel().show();
}