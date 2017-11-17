'use strict';
import {commands, workspace, ExtensionContext} from 'vscode';
import strings from '../../constants/string-constnats';
import {exec} from 'child_process';
import { Command } from '../command-base';

export class GitClearStash extends Command {

    getCommandName(): string {
        return "clearStash";
    }

    async execute(): Promise<any> {
        exec(strings.git.stash("clear"), {
            cwd: workspace.rootPath
        }, (error, stdout, stderr) => {
            if(error) {
                Command.logger.logError(strings.error("fetching stash list"), stderr);
                return;
            }
            Command.logger.logMessage(strings.msgTypes.INFO, strings.success.general("Stash list", "cleared"));
        });
    }
}