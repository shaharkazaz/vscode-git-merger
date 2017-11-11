'use strict';

import {commands, workspace, window, ExtensionContext, scm} from 'vscode';
import strings from '../../constants/string-constnats';
import {exec, execSync} from 'child_process';
import {openLog, logMessage, logError} from "../../logger";
import {IBranchObj, IGitBranchResponse, IOptionsObj} from "../../constants/interfaces";
import {getBranchList, processUserOptions} from "../../services/util";
import {Command} from "../../extension";
import {stash} from "../stash/gitStash";
import {unstash} from "../stash/gitUnstash";


export class GitMerge extends Command {
    /** Holds a list of all the branchs and the current branch */
    branchObj: IBranchObj;
    /** Holds all the git commands options info */
    optionsObj: IOptionsObj;
    /** Holds the targeted merge branch info*/
    targetBranch: IGitBranchResponse;
    /** Flag that indicates rather a stash has been created or not */
    stashCreated: boolean;
    /** a custom message for the merge commit */
    userCommitMessage: string;

    getCommandName(): string {
        return "mergeFrom";
    }

    async execute(): Promise<any> {
        this.branchObj = fetchBranchs();
        showBranchQuickPick();
    }
}


/**
 * Exexute the git merge command
 * @param   {string} [customCommitMsg] The user's custom commit message
 * @returns {void}
 */
function merge(customCommitMsg ?) {
    exec(strings.git.merge(this.optionsObj.validOptions, this.targetBranch.label, this.userCommitMessage), {
        cwd: workspace.rootPath
    }, (error, stdout, stderr) => {
        if (this.optionsObj.invalidOptions.length > 0) {
            window.showWarningMessage("Some of your options were invalid and were exluded, check the log for more info", strings.actionButtons.openLog).then((chosenitem) => {
                if (chosenitem) {
                    openLog();
                }
            });
        }
        if (stdout) {
            if (stdout.toLowerCase().indexOf("conflict") != -1) {
                let conflictedFiles = stdout.split("\n"),
                    conflictedFilesLength = conflictedFiles.length - 1;
                logMessage(strings.msgTypes.WARNING, strings.warnings.conflicts);
                for (let i = 0; i < conflictedFilesLength; i++) {
                    let conflictIndex = conflictedFiles[i].indexOf(strings.git.conflicts);
                    if (conflictIndex != -1) {
                        logMessage(strings.msgTypes.WARNING, conflictedFiles[i].substr(38, conflictedFiles[i].length));
                    }
                }
                let message = strings.windowConflictsMessage;

                if (this.stashCreated) {
                    message += ", stash was not applied";
                }
                window.showWarningMessage(message);
                setGitMessage();
                return;
            } else if (stdout.indexOf(strings.git.upToDate) != -1) {
                logMessage(strings.msgTypes.INFO, strings.git.upToDate);
                return;
            }
        } else if (error) {
            if (stderr.indexOf("Your local changes") != -1) {
                window.showWarningMessage("Merge will fail due to uncommited changes, either commit\
                        the changes or use stash & patch option", "Stash & Patch").then((action) => {
                    if (action) {
                        stash("Temp stash - merge branch '" + this.targetBranch.label + "' into '" +
                            this.branchObj.currentBranch + "'", true).then(() => {
                            this.stashCreated = true;
                            merge();
                        });
                    }
                });
                return;
            } else {
                logError(strings.error("merging"), stderr);
                return;
            }
        }
        if (this.optionsObj.addMessage) {
            setGitMessage();
        }
        if (this.stashCreated) {
            unstash();
        }
        logMessage(strings.msgTypes.INFO, strings.success.merge(this.targetBranch.label, this.branchObj.currentBranch));
    });
}

function setGitMessage() {
    if (scm.inputBox.value.length == 0) {
        scm.inputBox.value = "Merge branch '" + this.targetBranch.label + "' into branch '" + this.branchObj.currentBranch + "'";
    }
}

/**
 * Process the options, handle invalid ones and require a commit message if necessary
 * @returns {void}
 */
function processMergeOptions() {
    this.optionsObj = processUserOptions(strings.userSettings.get("mergeCommandOptions"), "merge");
    if (this.optionsObj.invalidOptions.length > 0) {
        logMessage(strings.msgTypes.WARNING, "The following commands are not valid merge commands: " + this.optionsObj.invalidOptions.toString());
        logMessage(strings.msgTypes.WARNING, "Yoc can check out which commands are valid at: https://git-scm.com/docs/git-merge");
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
            merge();
        });
    } else {
        merge();
    }
}

/**
 * Get the list of all the branches
 * @returns {void}
 */
function fetchBranchs() {
    return getBranchList(execSync(strings.git.getBranches, {
        cwd: workspace.rootPath
    }).toString());
}

function showBranchQuickPick() {
    window.showQuickPick(this.branchObj.branchList, {
        placeHolder: strings.quickPick.chooseBranch
    }).then(chosenitem => {
        if (chosenitem) {
            this.targetBranch = chosenitem;
            processMergeOptions();
        }
    });
}