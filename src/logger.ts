import * as vscode from 'vscode';

let outLogChannel: vscode.OutputChannel;

function getLogChannel() {
    if (outLogChannel === undefined) {
         outLogChannel = vscode.window.createOutputChannel('Git Merger');
    }
    return outLogChannel;
}

export function logError(error: any) {
    getLogChannel().appendLine(`[Error-${getTimeAndms()}] ${error.toString()}`.replace(/(\r\n|\n|\r)/gm, ''));
}

export function logInfo(message: string) {
    getLogChannel().appendLine(`[Info -${getTimeAndms()}] ${message}`);
}

export function logDebug(message: string) {
    getLogChannel().appendLine(`[Debug-${getTimeAndms()}] ${message}`);
}

export function openLog():void{
    getLogChannel().show();
}

function getTimeAndms(): string {
    const time = new Date();
    return ('0' + time.getHours()).slice(-2)   + ':' +
    ('0' + time.getMinutes()).slice(-2) + ':' +
    ('0' + time.getSeconds()).slice(-2) + '.' +
    ('00' + time.getMilliseconds()).slice(-3);
}
