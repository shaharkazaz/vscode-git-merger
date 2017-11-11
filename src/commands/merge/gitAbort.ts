'use strict';

import {commands, workspace, ExtensionContext} from 'vscode';
import strings from '../../constants/string-constnats';
import {exec} from 'child_process';
import {logError, logMessage} from "../../logger";
import {Command} from "../../extension";

export class GitAbort extends Command {

    getCommandName(): string {
        return "abortMerge";
    }

    async execute(): Promise<any> {

        exec(strings.git.merge(["abort"]), {
            cwd: workspace.rootPath
        }, (error, stdout, stderr) => {
            if (error) {
                if (stderr.indexOf(strings.git.noMerge)) {
                    logError(strings.git.noMerge);
                    return;
                }
                let message = stderr ? stderr.toString() : error.toString();
                logError(message, strings.error("aborting merge"));
                return;
            }
            logMessage(strings.msgTypes.INFO, strings.success.general("Merge", "aborted"));
        });
    }
}