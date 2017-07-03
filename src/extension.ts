// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as gitMerge from './commands/merge/gitMerge';
import * as gitAbort from './commands/merge/gitAbort';
import * as gitStash from './commands/stash/gitStash';
import * as gitUnstash from './commands/stash/gitUnstash';
import * as gitClearStash from './commands/stash/gitClearStash';
import * as gitDropStash from './commands/stash/gitDropStash';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext): Promise<any> {
    gitMerge.activate(context);
    gitAbort.activate(context);
    gitStash.activate(context);
    gitUnstash.activate(context);
    gitClearStash.activate(context);
    gitDropStash.activate(context);
}