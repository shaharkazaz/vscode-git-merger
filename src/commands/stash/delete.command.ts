'use strict';

import {window} from 'vscode';
import strings from '../../constants/string-constnats';
import {GitStashResponse} from "../../constants/interfaces";
import {Command} from '../command-base';
import {buildStashCmd, parseGitJson} from "../../utils/git.util";
import {gitExecutor} from "../../services/executer.service";

export class GitDeleteStash extends Command {

    getCommandName(): string {
        return 'deleteStash';
    }

    async execute(): Promise<any> {
        const stashCmd = buildStashCmd('list');
        gitExecutor(stashCmd)
            .then((stashListRaw: string) => {
                const stashList = parseGitJson<GitStashResponse>(stashListRaw);
                if (stashList.length === 0) {
                    Command.logger.logMessage(strings.msgTypes.INFO, 'No stash exists');
                    window.showInformationMessage(strings.msgTypes.INFO, 'No stash exists');
                } else {
                    window.showQuickPick(stashList, {
                        matchOnDescription: true,
                        placeHolder: 'Choose the stash you wish to delete'
                    }).then((stashItem) => {
                        if (stashItem) {
                            GitDeleteStash.deleteStash(stashItem);
                        }
                    });
                }
            })
            .catch((err) =>  Command.logger.logError(strings.error('fetching branch list'), err));
    }

    static deleteStash({index}: GitStashResponse): void {
        const stashCmd = buildStashCmd(`drop ${index}`);
        gitExecutor(stashCmd)
            .then((std: string) => {
                if (std.indexOf('Dropped') !== -1) {
                    const msg = strings.success.general('Stash', 'removed');
                    Command.logger.logMessage(strings.msgTypes.INFO, msg);
                    window.showInformationMessage(msg);
                }
            })
            .catch((err) => Command.logger.logError(strings.error('dropping stash:'), err));
    }

}