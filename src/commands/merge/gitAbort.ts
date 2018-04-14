'use strict';

import { commands, workspace, ExtensionContext, window } from 'vscode';
import strings from '../../constants/string-constnats';
import { exec } from 'child_process';
import { Command } from '../command-base';
import { gitExecutor, mergeCmd } from '../../services/executer';

export class GitAbort extends Command{

    getCommandName(): string {
        return "abortMerge";
    }

    async execute(): Promise<any> {
        const abortCmd = mergeCmd(['abort']);
        gitExecutor(abortCmd)
        .then(() => {
            const msg = strings.success.general('Merge', 'aborted');
            Command.logger.logMessage(strings.msgTypes.INFO, msg);
            window.showInformationMessage(msg);
        })
        .catch((err) => {
            if (err.indexOf(strings.git.noMerge)) {
                Command.logger.logMessage(strings.msgTypes.INFO, strings.git.noMerge);
                window.showInformationMessage(strings.git.noMerge);
            } else {
                Command.logger.logError(err, strings.error('aborting merge'));
            }
        });
    }
}