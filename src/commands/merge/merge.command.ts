'use strict';

import {workspace, window, scm} from 'vscode';
import strings from '../../constants/string-constnats';
import {exec, execSync} from 'child_process';
import {branchObj, GitBranchResponse, optionsObj} from "../../constants/interfaces";
import {Command} from '../command-base';
import {getBranchList} from "../../utils/git.util";
import {GitStash, GitUnstash} from "../stash";
import {processUserOptions} from "../../utils/config.util";


export class GitMerge extends Command {

    /** Holds a list of all the branches and the current branch */
    branchObj: branchObj;
    /** Holds all the git commands options info */
    optionsObj: optionsObj;
    /** Holds the targeted merge branch info*/
    targetBranch: GitBranchResponse;
    /** Flag that indicates rather a stash has been created or not */
    stashCreated: boolean;
    /** a custom message for the merge commit */
    userCommitMessage: string;

    getCommandName(): string {
        return "mergeFrom";
    }

    async execute(): Promise<any> {
        this.branchObj = this._fetchBranchs();
        this._showBranchQuickPick();
    }


    /**
     * Exexute the git merge command
     * @param   {string} [customCommitMsg] The user's custom commit message
     * @returns {void}
     */
    merge(customCommitMsg ?) {
        exec(strings.git.merge(this.optionsObj.validOptions, this.targetBranch.label, this.userCommitMessage), {
            cwd: workspace.rootPath
        }, (error, stdout, stderr) => {
            if (this.optionsObj.invalidOptions.length > 0) {
                window.showWarningMessage("Some of your options were invalid and were exluded, check the log for more info", strings.actionButtons.openLog).then((chosenitem) => {
                    if (chosenitem) {
                        Command.logger.openLog();
                    }
                });
            }
            if (stdout) {
                if (stdout.toLowerCase().indexOf("conflict") != -1) {
                    let conflictedFiles = stdout.split("\n"),
                        conflictedFilesLength = conflictedFiles.length - 1;
                    Command.logger.logMessage(strings.msgTypes.WARNING, strings.warnings.conflicts);
                    for (let i = 0; i < conflictedFilesLength; i++) {
                        let conflictIndex = conflictedFiles[i].indexOf(strings.git.conflicts);
                        if (conflictIndex != -1) {
                            Command.logger.logMessage(strings.msgTypes.WARNING, conflictedFiles[i].substr(38, conflictedFiles[i].length));
                        }
                    }
                    let message = strings.windowConflictsMessage;

                    if (this.stashCreated) {
                        message += ", stash was not applied";
                    }
                    window.showWarningMessage(message);
                    this._setGitMessage();
                    return;
                } else if (stdout.indexOf(strings.git.upToDate) != -1) {
                    Command.logger.logMessage(strings.msgTypes.INFO, strings.git.upToDate);
                    window.showInformationMessage(strings.git.upToDate);
                    return;
                }
            } else if (error) {
                if (stderr.indexOf("Your local changes") != -1) {
                    window.showWarningMessage("Merge will fail due to uncommited changes, either commit\
                        the changes or use stash & patch option", "Stash & Patch").then((action) => {
                        if (action) {
                            GitStash.stash("Temp stash - merge branch '" + this.targetBranch.label + "' into '" +
                                this.branchObj.currentBranch + "'", true).then(() => {
                                this.stashCreated = true;
                                this.merge();
                            });
                        }
                    });
                    return;
                } else {
                    Command.logger.logError(strings.error("merging"), stderr);
                    return;
                }
            }
            if (this.optionsObj.addMessage) {
                this._setGitMessage();
            }
            if (this.stashCreated) {
                GitUnstash.unstash();
            }
            Command.logger.logMessage(strings.msgTypes.INFO, strings.success.merge(this.targetBranch.label, this.branchObj.currentBranch));
            window.showInformationMessage(strings.success.merge(this.targetBranch.label, this.branchObj.currentBranch));
        });
    }

    private _setGitMessage() {
        if (scm.inputBox && scm.inputBox.value.length === 0) {
            scm.inputBox.value = "Merge branch '" + this.targetBranch.label + "' into branch '" + this.branchObj.currentBranch + "'";
        }
    }

    /**
     * Process the options, handle invalid ones and require a commit message if necessary
     * @returns {void}
     */
    private _processMergeOptions() {
        this.optionsObj = processUserOptions(strings.userSettings.get("mergeCommandOptions"), "merge");
        if (this.optionsObj.invalidOptions.length > 0) {
            Command.logger.logMessage(strings.msgTypes.WARNING, "The following commands are not valid merge commands: " + this.optionsObj.invalidOptions.toString());
            Command.logger.logMessage(strings.msgTypes.WARNING, "Yoc can check out which commands are valid at: https://git-scm.com/docs/git-merge");
        }
        if (this.optionsObj.requireCommitMessage) {
            window.showInputBox({
                placeHolder: "Enter a custom commit message"
            }).then((customCommitMsg) => {
                if (strings.userSettings.get("extendAutoCommitMessage")) {
                    customCommitMsg = "Merge branch '" + this.targetBranch.label + "' into '" +
                        this.branchObj.currentBranch + "'\n" + customCommitMsg;
                }
                this.userCommitMessage = customCommitMsg;
                this.merge();
            });
        } else {
            this.merge();
        }
    }

    /**
     * Get the list of all the branches
     * @returns {void}
     */
    private _fetchBranchs() {
        return getBranchList(execSync(strings.git.getBranches, {
            cwd: workspace.rootPath
        }).toString());
    }

    private _showBranchQuickPick() {
        window.showQuickPick(this.branchObj.branchList, {
            placeHolder: strings.quickPick.chooseBranch
        }).then(chosenitem => {
            if (chosenitem) {
                this.targetBranch = chosenitem;
                this._processMergeOptions();
            }
        });
    }
}