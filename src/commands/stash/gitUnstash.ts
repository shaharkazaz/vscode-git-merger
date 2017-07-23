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
     * Drops the currently unstashed stash item
     * @returns {void}
     */
    function dropStash() {
        exec(strings.git.stash("drop " + stashItem.index), {
            cwd: workspace.rootPath
        }, (error, stdout, stderr) => {
            if (error) {
                logger.logError(strings.error("droping stash:"), stderr || error);
                return;
            }
            if (stdout.indexOf("Dropped") != -1) {
                logger.logInfo(strings.success.general("Stash", "removed"));
            }
        });
    }
    /**
     * Execute git apply stash and call the "drop stash" if wanted by user
     * @returns {void}
     */
    function unstash() {
        exec(strings.git.stash("apply " + stashItem.index), {
            cwd: workspace.rootPath
        }, (error, stdout, stderr) => {
            if (error) {
                logger.logError(strings.error("unstashing:"), stderr || error);
                return;
            }
            logger.logInfo(strings.success.general("Stash", "applied on current branch"), {
                name: "delete stash",
                callback: dropStash
            });
        });
    }

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
                    unstash();
                }
            });
        } catch (error) {
            logger.logError(strings.error("fetching branch list"), error.message);
        }
    });
    context.subscriptions.push(disposable);
}