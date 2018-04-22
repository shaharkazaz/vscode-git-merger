'use strict';

import {window} from 'vscode';
import strings from '../../constants/string-constnats';
import {Command} from '../command-base';
import {buildStashCmd} from "../../utils/git.util";
import {gitExecutor} from "../../services/executer.service";

export class GitStash extends Command {

    getCommandName(): string {
        return "stash";
    }

    async execute(): Promise<any> {
        window.showInputBox({
            placeHolder: 'Enter stash message (default will show no message)',
            validateInput: this.validateInput
        }).then((userInput) => {
            if (userInput !== undefined) {
                GitStash.stash(userInput, false);
            }
        });
    }

    static stash(stashName: string, hideMsg = true) {
        return new Promise((resolve, reject) => {
            const stashCmd = buildStashCmd('save', stashName);
            gitExecutor(stashCmd)
                .then((stashResult: string) => {
                    let msg = hideMsg ? '' : strings.success.general('Stash', 'created');
                    if (stashResult.indexOf('No local changes to save') !== -1) {
                        msg = 'No local changes detected in tracked files';
                    }

                    if (msg) {
                        Command.logger.logMessage(msg);
                        window.showInformationMessage(msg);
                    }
                    resolve();
                })
                .catch((err) => {
                    Command.logger.logError(strings.error('creating stash:'), err);
                    reject();
                });
        });

    }

    private validateInput(input: string) {
        if (input[0] == '-') {
            return `The name can't start with '-'`;
        } else if ((/[()&`|!]/g).test(input)) {
            return `The name can't contain the following characters: '|', '&', '!', '(', ')' or '\`'`;
        }

        return '';
    }
}