'use strict';

import {window} from 'vscode';
import strings from '../../constants/string-constnats';
import {buildStashCmd, getStashList} from "../../utils/git.util";
import {Command} from '../command-base';
import {GitDeleteStash} from './delete.command';
import {gitExecutor} from "../../services/executer.service";

export class GitUnstash extends Command {

    getCommandName(): string {
        return "unstash";
    }

    async execute(): Promise<any> {
        const stashCmd = 'list';
        gitExecutor(stashCmd)
            .then((rawStashList: string) => {
                const stashList = getStashList(rawStashList);
                if (stashList.length === 0) {
                    const msg = 'No stash exists';
                    Command.logger.logMessage(msg);
                    window.showInformationMessage(msg);
                } else {
                    window.showQuickPick(stashList, {
                        matchOnDescription: true,
                        placeHolder: 'Choose stash to apply'
                    }).then((chosenItem) => {
                        if (chosenItem) {
                            GitUnstash.unstash(chosenItem);
                        }
                    });
                }
            })
            .catch((err) => Command.logger.logError(strings.error("fetching stash list"), err));
    }

    static unstash(stashItem?) {
        const unstashCmd = buildStashCmd(stashItem ? `apply ${stashItem.index}` : 'pop');
        gitExecutor(unstashCmd)
            .then(() => {
                const msg = strings.success.general('Stash', 'applied on current branch');
                Command.logger.logMessage(msg);
                if (stashItem) {
                    window.showInformationMessage(msg, 'delete stash')
                        .then((action) => {
                            if (action) {
                                GitDeleteStash.deleteStash(stashItem);
                            }
                        });
                }
            })
            .catch((err) => {
                Command.logger.logError(strings.error('unstashing:'), err);
            });
    }

}