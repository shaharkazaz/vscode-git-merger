'use strict';

import {commands, workspace, ExtensionContext, window} from 'vscode';
import strings from '../../constants/string-constnats';
import {exec} from 'child_process';
import { Command } from '../command-base';

export class GitAbort extends Command{

    getCommandName(): string {
        return "abortMerge";
    }

    async execute(): Promise<any> {
        exec(strings.git.merge(["abort"]), {
            cwd: workspace.rootPath
        }, (error, stdout, stderr) => {
            if (error) {
                if (stderr.indexOf(strings.git.noMerge)) {
                    Command.logger.logError(strings.git.noMerge);
                    return;
                }
                let message = stderr ? stderr.toString() : error.toString();
                Command.logger.logError(message, strings.error("aborting merge"));
                return;
            }
            let msg = strings.success.general("Merge", "aborted");
            Command.logger.logMessage(strings.msgTypes.INFO, msg);
            window.showInformationMessage(msg);
        });
    }
}