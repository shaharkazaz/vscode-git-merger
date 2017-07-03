'use strict';

import * as vscode from 'vscode';
import strings from '../../constants/string-constnats';
import { exec } from 'child_process';
import * as logger from "../../logger";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('gitMerger.abortMerge', () => {
        exec(strings.git.merge(["abort"]), {
            cwd: vscode.workspace.rootPath
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