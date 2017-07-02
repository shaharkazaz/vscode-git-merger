'use strict';

import * as vscode from 'vscode';
import * as moment from 'moment';
import strings from '../constants/string-constnats';
import { exec } from 'child_process';
import * as logger from "../logger";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.gitStash', () => {
        vscode.window.showInputBox({placeHolder: "Enter stash name (the default name is the current branch)", validateInput: (input) => {
            if(input[0] == "-"){
                return "The name can't start with '-'";
            } else if(new RegExp("[()&`|]", 'g').test(input)){
                return "The name can't contain the following characters: '|', '&', '(', ')' or '`'";
            } return "";
        }}).then((userInput) => {
            if(userInput === undefined){return;}
            //prevent duplicate names? 
            let stashName = userInput && userInput.trim() != "" ? userInput : "";
            stashName += " " + moment().format("x");
            exec(strings.git.stash("save ", stashName), {
                cwd: vscode.workspace.rootPath
            }, (error, stdout, stderr) => {
                if (error) {
                    logger.logError(strings.error("creating stash"), stderr || error);
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