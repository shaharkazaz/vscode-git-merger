/** 
 *  @fileOverview This file the initilzor of the extension
 *  @author       Shahar Kazaz
 *  @requires     vscode
 *  @requires     ./commands(/index.ts): All the extensions commands
 */

import {ExtensionContext, commands} from 'vscode';
import {commands as localCommands} from './commands';

export abstract class Command {
    abstract getCommandName(): string;
    abstract async execute(): Promise<any>;
}

/**
 * this method is called when your extension is activated
 * your extension is activated the very first time the command is executed
 */ 
export async function activate(context: ExtensionContext): Promise<any> {
    localCommands.forEach((gitCommand: any) => {
        const comm: Command = new gitCommand();
        const disposable = commands.registerCommand('gitMerger.' + comm.getCommandName(), comm.execute.bind(comm));
        context.subscriptions.push(disposable);  
    });
}