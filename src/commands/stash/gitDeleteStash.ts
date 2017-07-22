'use strict';
/** 
 *  @fileOverview The git delete stash command executer file
 *  @author       Shahar Kazaz
 *  @requires     vscode
 *  @requires     strings: The extension string constants
 *  @requires     exec
 *  @requires     logger
 */
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
    IGitStashResponse
} from "../../constants/interfaces";
import {
    getStashList
} from "../../services/util";

export function activate(context: ExtensionContext) {

    /**
     * An array of all the stash objects
     * @type {Array < IGitStashResponse > }
     */
    let stashList: Array < IGitStashResponse > ;


    function deleteStash(stashItem) {
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
     * Register the command into the extension
     * @returns {void}
     */
    function registerCommand() {
        let disposable = commands.registerCommand('gitMerger.deleteStash', () => {
            window.showQuickPick(stashList, {
                matchOnDescription: true,
                placeHolder: "Choose the stash you wish to drop"
            }).then(stashItem => {
                if (stashItem) {
                    deleteStash(stashItem);
                }
            });
        });
        context.subscriptions.push(disposable);
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

    try {
        stashList = fetchStashList();
        if (stashList.length > 0) {
            registerCommand();
        } else {
            logger.logInfo("No stash exists");
        }
    } catch (error) {
        logger.logError(strings.error("fetching branch list"), error.message);
    }
}