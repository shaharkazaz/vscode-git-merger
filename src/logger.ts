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

export default class Logger {

    /**
     * The output channel instance
     * @type {vscode.OutputChannel}
     */
    static outLogChannel = vscode.window.createOutputChannel('Git merger');

//TODO: remove from here
    static logError(message: string, errorHeader ? : string) {
        message = errorHeader ? strings.error(errorHeader) + "\n" + message : message;
        this.logMessage("Error", message);
        // vscode.window.showErrorMessage(strings.windowErrorMessage, strings.actionButtons.openLog).then((action) => {
        //     if (action) {
        //         this.openLog();
        //     }
        // });
    }

    static logMessage(msgType: string, message: string) {
        this.outLogChannel.appendLine(`[${msgType}-${moment().format(strings.timeForamt.hours)}] ${message}`);
    }

    /**
     * Opens a wanted output log
     * @returns {void} 
     */
    static openLog(): void {
        this.outLogChannel.show();
    }

    //TODO: remove from here
    // static logInfo(message: string, actionButton ? ) {
    //     this.logMessage("Info", message);
        
        // vscode.window.showInformationMessage(message, actionButton ? actionButton.name : []).then((action) => {
        //     if (action) {
        //         actionButton.callback();
        //     }
        // });
    // }


}

export const logError = Logger.logError;
export const logMessage = Logger.logMessage;
export const openLog = Logger.openLog;