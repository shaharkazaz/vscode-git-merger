'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as moment from 'moment';
import strings from '../constants/string-constnats';
import { exec } from 'child_process';
import * as logger from "../logger";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.gitStash', () => {
        vscode.window.showInputBox({placeHolder: "Enter stash name (default is the current branch name)", validateInput: (input) => {
            // input validation 
            // if(input.trim().length == 0){
            //     return "The name should have at least 1 charecter";
            // }
            return "";
        }}).then((userInput) => {
            //add time stamp into stash name
            //prevent duplicate names? 
            // any special cahrs to prevent?
            //get current branch while init branch manager
            let stashName = userInput && userInput != "" ? userInput : "current-branch ";
            stashName += "creation date: " + moment().format(strings.timeForamt.names);
            // moment(element.timestamp, strings.timeForamt).fromNow();
            exec(strings.git.stash("save ", stashName), {
                cwd: vscode.workspace.rootPath
            }, (error, stdout, stderr) => {
                if (error) {
                    logger.logError(strings.error("creating stash"), stderr || error);
                    return;
                } 
                if(stdout.indexOf("No local changes to save")){
                    logger.logInfo("No local changes detected in tracked files");
                    return;
                }
                logger.logInfo(strings.success.general("Stash", "created"));
            });
        });
    });

    context.subscriptions.push(disposable);
}