'use strict';

import {window} from 'vscode';
import strings from '../../constants/string-constnats';
import {Command} from '../command-base';
import {buildMergeCmd} from "../../utils/git.util";
import {gitExecutor} from "../../services/executer.service";

export class GitAbortMerge extends Command {

    getCommandName(): string {
        return "abortMerge";
    }

    async execute(): Promise<any> {
        const abortCmd = buildMergeCmd(['abort']);
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