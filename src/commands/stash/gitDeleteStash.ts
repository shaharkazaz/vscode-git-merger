'use strict';

import * as vscode from 'vscode';
import * as moment from 'moment'; 
import strings from '../../constants/string-constnats';
import {
    exec
} from 'child_process';
import * as logger from "../../logger";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('gitMerger.deleteStash', () => {
        exec(strings.git.stash("list ", true), {
            cwd: vscode.workspace.rootPath
        }, (error, stdout, stderr) => {
            if(error) {
                logger.logError(strings.error("fetching stash list"), stderr || error);
                return;
            }
            if(stdout.length == 0){
                logger.logInfo("No stash exists");
                return;
            }
            let stashList: Array<any> = stdout.split("\n").map((stashItem):vscode.QuickPickItem => {
                let tempStashItem = JSON.parse(stashItem
                .replace(/([:{,]')/g, (matcher):string => matcher.replace("'", '"'))
                .replace(/'[,}:]/g, (matcher):string => matcher.replace("'", '"')));
                tempStashItem.label = tempStashItem.label.replace("WIP ", "");
                tempStashItem.label = tempStashItem.label.charAt(0).toUpperCase() + tempStashItem.label.slice(1);
                return tempStashItem;
            });
            vscode.window.showQuickPick(stashList, {matchOnDescription: true, placeHolder: "Choose the stash you wish to drop"}).then(chosenitem => {
                if(chosenitem === undefined){return}
                exec(strings.git.stash("drop " + chosenitem.index), { cwd: vscode.workspace.rootPath}, (error, stdout, stderr) => {
                    if(error) {
                        logger.logError(strings.error("droping stash:"), stderr || error);
                        return;
                    }
                    if(stdout.indexOf("Dropped") != -1){
                        logger.logInfo(strings.success.general("Stash", "removed"));
                    }
                });
            });
        });
    });

    context.subscriptions.push(disposable);
}