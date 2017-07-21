'use strict';
/** 
 *  @fileOverview The git clear stash (delete all stashs) command executer file
 *  @author       Shahar Kazaz
 *  @requires     vscode
 *  @requires     strings: The extension string constants
 *  @requires     exec
 *  @requires     logger
 */
import {commands, workspace, ExtensionContext} from 'vscode';
import strings from '../../constants/string-constnats';
import {exec} from 'child_process';
import * as logger from "../../logger";

export function activate(context: ExtensionContext) {
    let disposable = commands.registerCommand('gitMerger.clearStash', () => {
        exec(strings.git.stash("clear"), {
            cwd: workspace.rootPath
        }, (error, stdout, stderr) => {
            if(error) {
                logger.logError(strings.error("fetching stash list"), stderr || error);
                return;
            }
            logger.logInfo(strings.success.general("Stash list", "cleared"));
        });
    });

    context.subscriptions.push(disposable);
}