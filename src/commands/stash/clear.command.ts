'use strict';
import {window} from 'vscode';
import strings from '../../constants/string-constnats';
import {Command} from '../command-base';
import {buildStashCmd} from "../../utils/git.util";
import {gitExecutor} from "../../services/executer.service";

export class GitClearStash extends Command {

    getCommandName(): string {
        return "clearStash";
    }

    async execute(): Promise<any> {
        const clearCmd = buildStashCmd('clear');
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