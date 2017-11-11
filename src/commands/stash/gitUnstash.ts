'use strict';

import {commands, workspace, window, ExtensionContext} from 'vscode';
import strings from '../../constants/string-constnats';
import {exec, execSync} from 'child_process';
import {getStashList} from "../../services/util";
import {IGitStashResponse} from "../../constants/interfaces";
import {Command} from "../../extension";
import {logError, logMessage} from "../../logger";
import { deleteStash } from './gitDeleteStash';

export class GitUnstash extends Command {

    /** An array of all the stash objects */
    private _stashList: IGitStashResponse[];
    /** The selected stash item to unstash */
    private _stashItem: IGitStashResponse;

    getCommandName(): string {
        return "unstash";
    }

    execute(): Promise<any> {
        try {
            this._stashList = this._fetchStashList();
            if (this._stashList.length === 0) {
                logMessage(strings.msgTypes.INFO, "No stash exists");
                return
            }
            window.showQuickPick(this._stashList, {
                matchOnDescription: true,
                placeHolder: "Choose stash to apply"
            }).then(choosenStashItem => {
                if (choosenStashItem) {
                    this._stashItem = choosenStashItem;
                    unstash(this._stashItem);
                }
            });
        } catch (error) {
            logError(strings.error("fetching branch list"), error.message);
        }
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

export function unstash(stashItem?) {
    let command = stashItem ? strings.git.stash("apply " + stashItem.index) : strings.git.stash("pop ");
    exec(command, {
        cwd: workspace.rootPath
    }, (error, stdout, stderr) => {
        if (error) {
            logError(strings.error("unstashing:"), stderr);
            return;
        }
        let msg = strings.success.general("Stash", "applied on current branch");
        logMessage(strings.msgTypes.INFO, msg);
        if (stashItem) {
            window.showInformationMessage(msg, "delete stash").then((action) => {
                if (action) {
                    deleteStash(stashItem);
                }
            });
        }
    });
}
