'use strict';

import {workspace, window} from 'vscode';
import strings from '../../constants/string-constnats';
import {exec, execSync} from 'child_process';
import {GitStashResponse} from "../../constants/interfaces";
import {getStashList} from "../../utils/git.util";
import {Command} from '../command-base';

export class GitDeleteStash extends Command {

    /** An array of all the stash objects */
    stashList: GitStashResponse[];

    getCommandName(): string {
        return "deleteStash";
    }

    async execute(): Promise<any> {
        try {
            this.stashList = this._fetchStashList();
            if (this.stashList.length === 0) {
                Command.logger.logMessage(strings.msgTypes.INFO, "No stash exists");
                window.showInformationMessage(strings.msgTypes.INFO, "No stash exists");
            }
        } catch (error) {
            Command.logger.logError(strings.error("fetching branch list"), error.message);
        }
        window.showQuickPick(this.stashList, {
            matchOnDescription: true,
            placeHolder: "Choose the stash you wish to drop"
        }).then(stashItem => {
            if (stashItem) {
                GitDeleteStash.deleteStash(stashItem);
            }
        });
    }

    static deleteStash(stashItem): void {
        exec(strings.git.stash("drop " + stashItem.index), {
            cwd: workspace.rootPath
        }, (error, stdout, stderr) => {
            if (error) {
                Command.logger.logError(strings.error("droping stash:"), stderr);
                return;
            }
            if (stdout.indexOf("Dropped") != -1) {
                let msg = strings.success.general("Stash", "removed");
                Command.logger.logMessage(strings.msgTypes.INFO, msg);
                window.showInformationMessage(msg);
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