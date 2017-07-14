'use strict';

import * as vscode from 'vscode';
import strings from '../../constants/string-constnats';
import { exec } from 'child_process';
import * as logger from "../../logger";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('gitMerger.stash', () => {
        vscode.window.showInputBox({placeHolder: "Enter stash message (default will show no message)", validateInput: (input) => {
            if(input[0] == "-"){
                return "The name can't start with '-'";
            } else if(new RegExp("[()&`|!]", 'g').test(input)){
                return "The name can't contain the following characters: '|', '&', '!', '(', ')' or '`'";
            } return "";
        }}).then((userInput) => {
            if(userInput === undefined){return;}
            //prevent duplicate names? 
            exec(strings.git.stash("save ", false, userInput.trim()), {
                cwd: vscode.workspace.rootPath
            }, (error, stdout, stderr) => {
                if (error) {
                    logger.logError(strings.error("creating stash:"), stderr || error);
                    return;
                } 
                if(stdout.indexOf("No local changes to save") != -1){
                    logger.logInfo("No local changes detected in tracked files");
                    return;
                }
                logger.logInfo(strings.success.general("Stash", "created"));
            });

        });
    });

    context.subscriptions.push(disposable);
}


