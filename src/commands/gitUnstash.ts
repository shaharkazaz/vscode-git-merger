'use strict';

import * as vscode from 'vscode';
import * as moment from 'moment';
import strings from '../constants/string-constnats';
import {
    exec
} from 'child_process';
import * as logger from "../logger";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.gitUnstash', () => {
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
            stashList = stashList.map((stashItem) => {
                let stashString = stashItem.split(" "),
                stashIndex = stashString[0].substring(7, stashString[0].indexOf("}")),
                timestamp = stashString.pop(),
                stashObject = {
                    label: stashString[2].substring(0, stashString[2].indexOf(":")),
                    description: "("+stashIndex+") "
                };
                if(stashString.length >= 4){
                    let tempArray = stashString.slice(3, stashString.length),
                    tempArrayLength = tempArray.length;
                    stashObject.label = "";
                    for (let i = 0; i < tempArrayLength; i++) {
                        stashObject.label += i+1 < tempArrayLength ? tempArray[i] + " " : tempArray[i];
                    }
                }
                if(parseInt(timestamp)){
                    stashObject.description += "Created " + moment(timestamp, "x").fromNow();
                } else {
                    stashObject.label += timestamp;
                }
                return stashObject;
            });
            vscode.window.showQuickPick(stashList, {matchOnDescription: true, placeHolder: "Choose what to unstash"}).then(chosenitem => {});
        });
    });

    context.subscriptions.push(disposable);
}