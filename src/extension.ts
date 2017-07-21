/** 
 *  @fileOverview This file the initilzor of the extension
 *  @author       Shahar Kazaz
 *  @requires     vscode
 *  @requires     ./commands(/index.ts): All the extensions commands
 */

import * as vscode from 'vscode';
import {commands} from './commands';


/**
 * this method is called when your extension is activated
 * your extension is activated the very first time the command is executed
 */ 
export async function activate(context: vscode.ExtensionContext): Promise<any> {
    commands.forEach((command) => {
        command.activate(context);
    });
}