'use strict';

import {commands, workspace, window, ExtensionContext} from 'vscode';
import strings from '../../constants/string-constnats';
import {exec} from 'child_process';
import {Command} from "../../extension";
import {logError, logMessage} from "../../logger";

export class GitStash {

    getCommandName(): string {
        return "stash";
    }

    async execute(): Promise<any> {
        this._openStashSelection();
    }

    private _openStashSelection() {
        window.showInputBox({
            placeHolder: "Enter stash message (default will show no message)", validateInput: (input) => {
                if (input[0] == "-") {
                    return "The name can't start with '-'";
                } else if (new RegExp("[()&`|!]", 'g').test(input)) {
                    return "The name can't contain the following characters: '|', '&', '!', '(', ')' or '`'";
                }
                return "";
            }
        }).then((userInput) => {
            if (userInput === undefined) {
                return;
            }
            stash(userInput, false);
        });
    }
}

export function stash(stashName: string, hideMsg) {
    return new Promise((resolve, reject) => {
        exec(strings.git.stash("save ", false, stashName), {
            cwd: workspace.rootPath
        }, (error, stdout, stderr) => {
            if (error) {
                logError(strings.error("creating stash:"), stderr);
                reject();
                return;
            }
            if (stdout.indexOf("No local changes to save") != -1) {
                logMessage(strings.msgTypes.INFO, "No local changes detected in tracked files");
                resolve();
                return;
            }
            if (!hideMsg) {
                logMessage(strings.msgTypes.INFO,strings.success.general("Stash", "created"));
            }
            resolve();
        });
    });

}
