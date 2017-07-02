// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as gitMerge from './commands/gitMerge';
import * as gitAbort from './commands/gitAbort';
import * as gitStash from './commands/gitStash';
import * as gitUnstash from './commands/gitUnstash';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext): Promise<any> {
    gitMerge.activate(context);
    gitAbort.activate(context);
    gitStash.activate(context);
    gitUnstash.activate(context);
}