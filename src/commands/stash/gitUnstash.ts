/** 
 *  @fileOverview The git unstash (stash apply) command executer file
 *  @author       Shahar Kazaz
 *  @requires     vscode
 *  @requires     strings: The extension string constants
 *  @requires     exec
 *  @requires     logger
 */
'use strict';

import {
    commands,
    workspace,
    window,
    ExtensionContext
} from 'vscode';
import strings from '../../constants/string-constnats';
import {
    exec,
    execSync
} from 'child_process';
import * as logger from "../../logger";
import {
    getStashList
} from "../../services/util";
import {
    IGitStashResponse
} from "../../constants/interfaces";
import {
    deleteStash
} from "./gitDeleteStash";

export function unstash(stashItem ? ) {
    let command = stashItem ? strings.git.stash("apply " + stashItem.index) : strings.git.stash("pop ");
    exec(command, {
        cwd: workspace.rootPath
    }, (error, stdout, stderr) => {
        if (error) {
            logger.logError(strings.error("unstashing:"), stderr || error);
            return;
        }
        let button;
        if (stashItem) {
            button = {
                name: "delete stash",
                callback: () => {
                    deleteStash(stashItem);
                }
            };
        }
        logger.logInfo(strings.success.general("Stash", "applied on current branch"), button);
    });
}

export function activate(context: ExtensionContext) {

    /**
     * An array of all the stash objects
     * @type {Array < IGitStashResponse > }
     */
    let stashList: Array < IGitStashResponse > ,
        /**
         * The selected stash item to unstash
         * @type {IGitStashResponse}
         */
        stashItem: IGitStashResponse;

    /**
     * Get the list of all the stashs
     * @returns {void}
     */
    function fetchStashList() {
        return getStashList(execSync(strings.git.stash("list ", true), {
            cwd: workspace.rootPath
        }).toString());
    }

    let disposable = commands.registerCommand('gitMerger.unstash', () => {
        try {
            stashList = fetchStashList();
            if (stashList.length === 0) {
                logger.logInfo("No stash exists");
                return
            }
            window.showQuickPick(stashList, {
                matchOnDescription: true,
                placeHolder: "Choose stash to apply"
            }).then(choosenStashItem => {
                if (choosenStashItem) {
                    stashItem = choosenStashItem;
                    unstash(stashItem);
                }
            });
        } catch (error) {
            logger.logError(strings.error("fetching branch list"), error.message);
        }
    });
    context.subscriptions.push(disposable);
}