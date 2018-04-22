import {Command} from '../command-base';
import {window} from 'vscode';
import strings from '../../constants/string-constnats';
import {gitExecutor} from "../../services/executer.service";
import {LOG_TYPE} from "../../services/logger/logger.types";

export class GitContinueMerge extends Command {
    getCommandName(): string {
        return 'continue';
    }

    async execute(): Promise<any> {
        const cmds = {
            checkMergeInProcess: 'merge HEAD',
            searchConflicts: 'diff -S <<<<<<< HEAD -S ======= -S >>>>>>> --raw',
            commitMerge: 'commit --all --no-edit'
        };
        gitExecutor(cmds.checkMergeInProcess)
            .then(() => {
                window.showInformationMessage('No merge in progress');
            })
            .catch(() => {
                gitExecutor(cmds.searchConflicts)
                    .then((searchResults) => {
                        if (!searchResults) {
                            return gitExecutor(cmds.commitMerge)
                                .then(() => {
                                    window.showInformationMessage('Merge was successfully completed');
                                });
                        } else {
                            const msg = 'You still have some unresolved conflicts, please resolve before continuing';
                            Command.logger.logMessage(msg, LOG_TYPE.WARNING);
                            window.showWarningMessage(msg);
                        }
                    })
                    .catch((err) => {
                        Command.logger.logError(strings.error('continuing merge'), err);
                    })
            })
    }
}
