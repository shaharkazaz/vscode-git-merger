'use strict';
import {commands, workspace, ExtensionContext} from 'vscode';
import strings from '../../constants/string-constnats';
import {exec} from 'child_process';
import {logMessage, logError} from "../../logger";
import {Command} from "../../extension";

export class GitClearStash {
    getCommandName(): string {
        return "clearStash";
    }

    async execute(): Promise<any> {
        exec(strings.git.stash("clear"), {
            cwd: workspace.rootPath
        }, (error, stdout, stderr) => {
            if(error) {
                logError(strings.error("fetching stash list"), stderr);
                return;
            }
            logMessage(strings.msgTypes.INFO, strings.success.general("Stash list", "cleared"));
        });
    }
}