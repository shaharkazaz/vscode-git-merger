import {window} from 'vscode';
import * as moment from 'moment';
import strings from '../../constants/string-constnats';
import {OutputChannel} from "vscode";
import {LOG_TYPE} from "./logger.types";

export class LoggerService {

    /** The output channel instance */
    private outLogChannel: OutputChannel;

    constructor() {
        this.outLogChannel = window.createOutputChannel('Git merger');
    }

    /**
     * Post an Error log message to vscode output channel.
     * @param {string} message - The error message
     * @param {string} errorHeader - the error's stderr
     */
    logError(message: string, errorHeader?: string) {
        message = errorHeader ? strings.error(errorHeader) + "\n" + message : message;
        this.logMessage(message, LOG_TYPE.ERROR);
        window.showErrorMessage(strings.windowErrorMessage, strings.actionButtons.openLog).then((action) => {
            if (action) {
                this.openLog();
            }
        });
    }

    /**
     * Post any log message to vscode output channel.
     * @param {string} msgType - Error, Warning, Info etc.
     * @param {string} message - The message to post.
     */
    logMessage(message: string, msgType: LOG_TYPE = LOG_TYPE.INFO) {
        this.outLogChannel.appendLine(`[${msgType}-${moment().format(strings.timeForamt.hours)}] ${message}`);
    }

    /**
     * Opens the vscode output channel
     * @returns {void}
     */
    openLog(): void {
        this.outLogChannel.show();
    }

}