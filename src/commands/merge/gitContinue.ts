import { Command } from "../command-base";
import {exec} from "child_process";
import { workspace, window } from "vscode";
import strings from "../../constants/string-constnats";
import { gitExecutor } from "../../services/executer";

export class GitContinue extends Command {
    getCommandName(): string {
        return "continue";
    }

    async execute(): Promise<any> {
        const cmds = {
            checkMergeInProcess: 'merge HEAD',
            searchConflicts: 'diff -S <<<<<<< HEAD -S ======= -S >>>>>>> --raw',
            commitMerge: 'commit --all --no-edit'
        };
        gitExecutor(cmds.checkMergeInProcess)
        .then(() => {
            window.showInformationMessage('No merge in process');
        })
        .catch(() => {
            gitExecutor(cmds.searchConflicts)
            .then((searchResults) => {
                if (!searchResults) {
                    return gitExecutor(cmds.commitMerge)
                    .then((commitMsg) => {
                        window.showInformationMessage('Merge was successfully completed');
                    });
                } else {
                    const msg = 'You still have some unresolved conflicts, please resolve before continuing';
                    Command.logger.logMessage(strings.msgTypes.WARNING, msg);
                    window.showWarningMessage(msg);
                }
            })
            .catch((err) => {
                Command.logger.logError(strings.error("continuing merge"), err);
            })
        })
    }
}
