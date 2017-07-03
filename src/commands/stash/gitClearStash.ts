'use strict';

import * as vscode from 'vscode';
import strings from '../../constants/string-constnats';
import {
    exec
} from 'child_process';
import * as logger from "../../logger";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('gitMerger.clearStash', () => {
        exec(strings.git.stash("clear"), {
            cwd: vscode.workspace.rootPath
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