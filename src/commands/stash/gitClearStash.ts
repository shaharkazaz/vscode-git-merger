'use strict';
import { commands, workspace, ExtensionContext, window } from 'vscode';
import strings from '../../constants/string-constnats';
import { Command } from '../command-base';
import { gitExecutor, stashCmd } from '../../services/executer';

export class GitClearStash extends Command {

    getCommandName(): string {
        return "clearStash";
    }

    async execute(): Promise<any> {
        const clearCmd = stashCmd('clear');
        gitExecutor(clearCmd)
        .then(() => {
            const msg = strings.success.general('Stash list', 'cleared');
            Command.logger.logMessage(strings.msgTypes.INFO, msg);
            window.showInformationMessage(msg);
        })
        .catch((err) => {
            Command.logger.logError(strings.error('fetching stash list'), err);
        });
    }
}