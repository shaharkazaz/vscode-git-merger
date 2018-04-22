'use strict';

import {window} from 'vscode';
import strings from '../../constants/string-constnats';
import {GitStashResponse} from "../../constants/types";
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
                    Command.logger.logMessage('No stashes exists');
                    window.showInformationMessage('No stashes exists');
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
            .catch((err) =>  Command.logger.logError(strings.error('fetching stash list'), err));
    }

    static deleteStash({index}: GitStashResponse): void {
        const stashCmd = buildStashCmd(`drop ${index}`);
        gitExecutor(stashCmd)
            .then((std: string) => {
                if (std.indexOf('Dropped') !== -1) {
                    const msg = strings.success.general('Stash', 'removed');
                    Command.logger.logMessage(msg);
                    window.showInformationMessage(msg);
                }
            })
            .catch((err) => Command.logger.logError(strings.error('dropping stash:'), err));
    }

}