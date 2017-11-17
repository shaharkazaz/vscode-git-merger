'use strict';

import {commands, workspace, window, ExtensionContext} from 'vscode';
import strings from '../../constants/string-constnats';
import {exec} from 'child_process';
import { Command } from '../command-base';

export class GitStash extends Command {

    getCommandName(): string {
        return "stash";
    }

    async execute(): Promise<any> {
        this._openStashSelection();
    }

    static stash(stashName: string, hideMsg) {
        return new Promise((resolve, reject) => {
            exec(strings.git.stash("save ", false, stashName), {
                cwd: workspace.rootPath
            }, (error, stdout, stderr) => {
                if (error) {
                    Command.logger.logError(strings.error("creating stash:"), stderr);
                    reject();
                    return;
                }
                if (stdout.indexOf("No local changes to save") != -1) {
                    Command.logger.logMessage(strings.msgTypes.INFO, "No local changes detected in tracked files");
                    resolve();
                    return;
                }
                if (!hideMsg) {
                    let msg = strings.success.general("Stash", "created")
                    Command.logger.logMessage(strings.msgTypes.INFO, msg);
                    window.showInformationMessage(msg);
                }
                resolve();
            });
        });
    
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
            GitStash.stash(userInput, false);
        });
    }
}