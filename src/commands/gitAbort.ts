'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import strings from '../constants/string-constnats';
import { exec } from 'child_process';
import * as logger from "../logger";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.gitAbortMerge', () => {
        // The code you place here will be executed every time your command is executed
        exec(strings.git.merge(["abort"]), {
            cwd: vscode.workspace.rootPath
        }, (error, stdout, stderr) => {
            if (error) {
                if(stderr.indexOf(strings.git.noMerge)){
                    logger.logInfo(strings.git.noMerge);
                    return;
                }
                logger.logError(strings.error("aborting merge"), stderr || error);
                return;
            }
            logger.logInfo(strings.success.general("Merge", "aborted"));
        });
    });

    context.subscriptions.push(disposable);
}