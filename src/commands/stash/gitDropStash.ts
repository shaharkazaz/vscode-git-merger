'use strict';

import * as vscode from 'vscode';
import * as moment from 'moment'; 
import strings from '../../constants/string-constnats';
import {
    exec
} from 'child_process';
import * as logger from "../../logger";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.gitDropStash', () => {
        exec(strings.git.stash("list "), {
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
            //handle stashes not from this extension
            let stashList: Array<any> = stdout.split("\n");
            stashList.pop();
            stashList = stashList.map((stashItem:string) => {
                stashItem = stashItem.toLowerCase();
                let stashString = stashItem.split(" "),
                stashIndex = stashString[0].substring(7, stashString[0].indexOf("}")),
                timestamp = stashString.pop(),
                defaultMsg = stashString[2] == "on",
                stashObject:vscode.QuickPickItem = {
                    label: defaultMsg ? stashString[3].substring(0, stashString[3].indexOf(":")) : stashString[2].substring(0, stashString[2].indexOf(":")),
                    description: "("+stashIndex+") "
                };
                if(stashString.length >= 4){
                    let tempArray = stashString.slice(defaultMsg ? 4 : 3, stashString.length),
                    tempArrayLength = tempArray.length;
                    stashObject.detail= "";
                    for (let i = 0; i < tempArrayLength; i++) {
                        stashObject.detail += i+1 < tempArrayLength ? tempArray[i] + " " : tempArray[i];
                    }
                }
                if(parseInt(timestamp)){
                    stashObject.description += "Created " + moment(timestamp, "x").fromNow();
                } else {
                    stashObject.detail += timestamp;
                }
                return stashObject;
            });
            vscode.window.showQuickPick(stashList, {matchOnDescription: true, placeHolder: "Choose the stash you wish to drop"}).then(chosenitem => {
                if(chosenitem === undefined){return}
                let stashIndex = chosenitem.description.substring(chosenitem.description.indexOf("(")+1, chosenitem.description.indexOf(")"));
                exec(strings.git.stash("drop " + stashIndex), { cwd: vscode.workspace.rootPath}, (error, stdout, stderr) => {
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