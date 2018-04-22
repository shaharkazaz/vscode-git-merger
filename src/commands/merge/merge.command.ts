'use strict';

import {window, scm} from 'vscode';
import strings from '../../constants/string-constnats';
import {branchDetail, GitBranchResponse} from "../../constants/types";
import {Command} from '../command-base';
import {buildMergeCmd, getBranchList, getMergeOptions} from "../../utils/git.util";
import {GitStash, GitUnstash} from "../stash";
import {gitExecutor} from "../../services/executer.service";
import {LOG_TYPE} from "../../services/logger/logger.types";


export class GitMerge extends Command {

    /** Holds a list of all the branches and the current branch */
    branches: branchDetail;
    /** Holds the targeted merge branch info*/
    targetBranch: GitBranchResponse;

    getCommandName(): string {
        return "mergeFrom";
    }

    async execute(): Promise<any> {
        gitExecutor(strings.git.getBranches)
            .then((rawBranchList: string) => {
                this.branches = getBranchList(rawBranchList);
                return window.showQuickPick(this.branches.branchList, {
                    placeHolder: strings.quickPick.chooseBranch
                })
            })
            .then((mergeFrom) => {
                if (mergeFrom) {
                    this.targetBranch = mergeFrom;
                    getMergeOptions(this.targetBranch, this.branches)
                        .then((userOptions) =>
                            GitMerge.merge(this.branches, this.targetBranch, {userOptions}));
                }
            })
            .catch((err) => Command.logger.logError(strings.error("fetching branch list"), err));
    }


    /**
     * Exexute the git merge command
     * @returns {void}
     * @param branches
     * @param targetBranch
     * @param stashCreated
     * @param userOptions
     */
    static merge(branches: branchDetail, targetBranch: GitBranchResponse, {stashCreated, userOptions}: any) {
        const mergeCmd = buildMergeCmd(userOptions ? userOptions.validOptions : [], targetBranch.label, userOptions.customMsg);
        gitExecutor(mergeCmd)
            .then((mergeResult: string) => {
                if (mergeResult.toLowerCase().indexOf('conflict') !== -1) {
                    const conflictedFiles = mergeResult.split("\n");
                    Command.logger.logMessage(strings.warnings.conflicts, LOG_TYPE.WARNING);
                    for (let i = 0; i < conflictedFiles.length - 1; i++) {
                        const conflictIndex = conflictedFiles[i].indexOf(strings.git.conflicts);
                        if (conflictIndex != -1) {
                            Command.logger.logMessage(conflictedFiles[i].substr(38, conflictedFiles[i].length), LOG_TYPE.WARNING);
                        }
                    }
                    let msg = strings.windowConflictsMessage;

                    if (stashCreated) {
                        msg += ', stash was not applied';
                    }
                    window.showWarningMessage(msg);
                    // this.setScmMsg();
                } else if (mergeResult.indexOf(strings.git.upToDate) !== -1) {
                    Command.logger.logMessage(strings.git.upToDate);
                    window.showInformationMessage(strings.git.upToDate);
                } else {
                    // if (userOptions.addMessage) {
                    //     this.setScmMsg();
                    // }
                    if (stashCreated) {
                        GitUnstash.unstash();
                    }

                    Command.logger.logMessage(strings.success.merge(targetBranch.label, branches.currentBranch));
                    window.showInformationMessage(strings.success.merge(targetBranch.label, branches.currentBranch));
                }
            })
            .catch((err) => {
                if (err.indexOf('Your local changes') !== -1) {
                    window.showWarningMessage('Merge will fail due to uncommitted changes, either commit' +
                        ' the changes or use stash & patch option', 'Stash & Patch').then((action) => {
                        if (action) {
                            GitStash.stash(`Temp stash - merge branch '${targetBranch.label}' into '${branches.currentBranch}'`)
                                .then(() => GitMerge.merge(branches, targetBranch, {stashCreated: true, userOptions}));
                        }
                    });
                } else {
                    Command.logger.logError(strings.error('merging'), err);
                }
            });
    }

    static setScmMsg(targetBranch, branches) {
        if (scm.inputBox && scm.inputBox.value.length === 0) {
            scm.inputBox.value = `Merge branch '${targetBranch.label}' into branch '${branches.currentBranch}'`;
        }
    }

}