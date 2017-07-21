'use strict';
/** 
 *  @fileOverview The git abort merge command executer file
 *  @author       Shahar Kazaz
 *  @requires     vscode
 *  @requires     strings: The extension string constants
 *  @requires     exec
 *  @requires     logger
 */
import {commands, workspace, ExtensionContext} from 'vscode';
import strings from '../../constants/string-constnats';
import { exec } from 'child_process';
import * as logger from "../../logger";

export function activate(context: ExtensionContext) {
    let disposable = commands.registerCommand('gitMerger.abortMerge', () => {
        exec(strings.git.merge(["abort"]), {
            cwd: workspace.rootPath
        }, (error, stdout, stderr) => {
            if (error) {
                if(stderr.indexOf(strings.git.noMerge)){
                    logger.logInfo(strings.git.noMerge);
                    return;
                }
                logger.logError(strings.error("aborting merge"), stderr || error);
                return;
            }
            logger.logInfo(strings.success.general("Merge", "aborted"));
        });
    });

    context.subscriptions.push(disposable);
}