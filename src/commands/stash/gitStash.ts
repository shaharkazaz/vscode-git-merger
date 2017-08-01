'use strict';
/** 
 *  @fileOverview The git stash command executer file
 *  @author       Shahar Kazaz
 *  @requires     vscode
 *  @requires     strings: The extension string constants
 *  @requires     exec
 *  @requires     logger
 */

import {commands, workspace, window, ExtensionContext} from 'vscode';
import strings from '../../constants/string-constnats';
import { exec } from 'child_process';
import * as logger from "../../logger";

export function stash(stashName:string, hideMsg){
    let promise = new Promise((resolve, reject) => {
                exec(strings.git.stash("save ", false, stashName), {
                cwd: workspace.rootPath
            }, (error, stdout, stderr) => {
                if (error) {
                    logger.logError(strings.error("creating stash:"), stderr || error);
                    reject();
                    return;
                } 
                if(stdout.indexOf("No local changes to save") != -1){
                    logger.logInfo("No local changes detected in tracked files");
                    resolve()
                    return;
                }
                if(!hideMsg){
                    logger.logInfo(strings.success.general("Stash", "created"));
                }
                resolve();
            });
    });
        return promise;

}

export function activate(context: ExtensionContext) {
    let disposable = commands.registerCommand('gitMerger.stash', () => {
        window.showInputBox({placeHolder: "Enter stash message (default will show no message)", validateInput: (input) => {
            if(input[0] == "-"){
                return "The name can't start with '-'";
            } else if(new RegExp("[()&`|!]", 'g').test(input)){
                return "The name can't contain the following characters: '|', '&', '!', '(', ')' or '`'";
            } return "";
        }}).then((userInput) => {
            if(userInput === undefined){return;}
            stash(userInput, false);
        });
    });

    context.subscriptions.push(disposable);
}


