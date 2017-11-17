'use strict';

import {commands, workspace, window, ExtensionContext} from 'vscode';
import strings from '../../constants/string-constnats';
import {exec, execSync} from 'child_process';
import {IGitStashResponse} from "../../constants/interfaces";
import {getStashList} from "../../services/util";
import {Command} from "../../extension";
import {logError, logMessage} from "../../logger";

export class GitDeleteStash {

    /** An array of all the stash objects */
    stashList: IGitStashResponse[];

    getCommandName(): string {
        return "deleteStash";
    }

    async execute(): Promise<any> {
        try {
            this.stashList = this._fetchStashList();
            if (this.stashList.length === 0) {
                logMessage(strings.msgTypes.INFO, "No stash exists");
            }
        } catch (error) {
            logError(strings.error("fetching branch list"), error.message);
        }
        window.showQuickPick(this.stashList, {
            matchOnDescription: true,
            placeHolder: "Choose the stash you wish to drop"
        }).then(stashItem => {
            if (stashItem) {
                deleteStash(stashItem);
            }
        });
    }

    /**
     * Return a list of all the stashed items
     * @return {IGitStashResponse[]}
     * @private
     */
    private _fetchStashList() {
        return getStashList(execSync(strings.git.stash("list ", true), {
            cwd: workspace.rootPath
        }).toString());
    }

}

export function deleteStash(stashItem): void {
    exec(strings.git.stash("drop " + stashItem.index), {
        cwd: workspace.rootPath
    }, (error, stdout, stderr) => {
        if (error) {
            logError(strings.error("droping stash:"), stderr);
            return;
        }
        if (stdout.indexOf("Dropped") != -1) {
            logMessage(strings.msgTypes.INFO, strings.success.general("Stash", "removed"));
        }
    });
}
