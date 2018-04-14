'use strict';

import {workspace, window} from 'vscode';
import strings from '../../constants/string-constnats';
import {exec, execSync} from 'child_process';
import {getStashList} from "../../utils/git.util";
import {GitStashResponse} from "../../constants/interfaces";
import {Command} from '../command-base';
import {GitDeleteStash} from './delete.command';

export class GitUnstash extends Command {

    /** An array of all the stash objects */
    private _stashList: GitStashResponse[];
    /** The selected stash item to unstash */
    private _stashItem: GitStashResponse;

    getCommandName(): string {
        return "unstash";
    }

    execute(): Promise<any> {
        try {
            this._stashList = this._fetchStashList();
            if (this._stashList.length === 0) {
                Command.logger.logMessage(strings.msgTypes.INFO, "No stash exists");
                window.showInformationMessage("No stash exists");
                return
            }
            window.showQuickPick(this._stashList, {
                matchOnDescription: true,
                placeHolder: "Choose stash to apply"
            }).then(choosenStashItem => {
                if (choosenStashItem) {
                    this._stashItem = choosenStashItem;
                    GitUnstash.unstash(this._stashItem);
                }
            });
        } catch (error) {
            Command.logger.logError(strings.error("fetching branch list"), error.message);
        }
    }

    static unstash(stashItem?) {
        let command = stashItem ? strings.git.stash("apply " + stashItem.index) : strings.git.stash("pop ");
        exec(command, {
            cwd: workspace.rootPath
        }, (error, stdout, stderr) => {
            if (error) {
                Command.logger.logError(strings.error("unstashing:"), stderr);
                return;
            }
            const msg = strings.success.general("Stash", "applied on current branch");
            Command.logger.logMessage(strings.msgTypes.INFO, msg);
            if (stashItem) {
                window.showInformationMessage(msg, "delete stash").then((action) => {
                    if (action) {
                        GitDeleteStash.deleteStash(stashItem);
                    }
                });
            }
        });
    }

    /**
     * Return a list of all the stashed items
     * @return {GitStashResponse[]}
     * @private
     */
    private _fetchStashList() {
        return getStashList(execSync(strings.git.stash("list ", true), {
            cwd: workspace.rootPath
        }).toString());
    }

}