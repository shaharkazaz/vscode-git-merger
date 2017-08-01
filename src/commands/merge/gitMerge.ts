'use strict';
/** 
 *  @fileOverview The git merge command executer file
 *  @author       Shahar Kazaz
 *  @requires     vscode
 *  @requires     strings: The extension string constants
 *  @requires     exec
 *  @requires     logger
 */
import {
    commands,
    workspace,
    window,
    ExtensionContext,
    scm
} from 'vscode';
import {
    stash
} from "../stash/gitStash";
import strings from '../../constants/string-constnats';
import {
    exec,
    execSync
} from 'child_process';
import {logger} from "../../logger";
import {
    getBranchList,
    processUserOptions
} from "../../services/util";
import {
    IBranchObj,
    IOptionsObj
} from "../../constants/interfaces";
import {
    unstash
} from "../stash/gitUnstash";
import { Command } from "../../extension";


export class GitMerge extends Command {
        /**
     * Holds a list of all the branchs and the current branch
     * @type {IBranchObj}
     */
     branchObj: IBranchObj;
        /**
         * Holds all the git commands options info
         * @type {IOptionsObj}
         */
        optionsObj: IOptionsObj;
        /**
         * Holds the targeted merge branch info
         * @type {IgitBranchResponse}
         */
        targetBranch;
        patchCreated;
        userCommitMessage;
    getCommandName(): string {
        return "mergeFrom";
    }
    async execute():Promise<any> {
        this.branchObj = fetchBranchs();
            showBranchQuickPick();
    }
}



    /**
     * Exexute the git merge command
     * @param   {string} [customCommitMsg] The user's custom commit message
     * @returns {void}
     */
    function merge(customCommitMsg ? ) {
        exec(strings.git.merge(optionsObj.validOptions, targetBranch.label, userCommitMessage), {
            cwd: workspace.rootPath
        }, (error, stdout, stderr) => {
            if (optionsObj.invalidOptions.length > 0) {
                window.showWarningMessage("Some of your options were invalid and were exluded, check the log for more info", strings.actionButtons.openLog).then((chosenitem) => {
                    if (chosenitem) {
                        logger.openLog();
                    }
                });
            }
            if (stdout) {
                if (stdout.toLowerCase().indexOf("conflict") != -1) {
                    let conflictedFiles = stdout.split("\n"),
                        conflictedFilesLength = conflictedFiles.length - 1;
                    logger.logWarning(strings.warnings.conflicts);
                    for (let i = 0; i < conflictedFilesLength; i++) {
                        let conflictIndex = conflictedFiles[i].indexOf(strings.git.conflicts);
                        if (conflictIndex != -1) {
                            logger.logWarning(conflictedFiles[i].substr(38, conflictedFiles[i].length));
                        }
                    }
                    let message = strings.windowConflictsMessage;

                    if (patchCreated) {
                        message += ", stash was not applied";
                    }
                    window.showWarningMessage(message);
                    setGitMessage();
                    return;
                } else if (stdout.indexOf(strings.git.upToDate) != -1) {
                    logger.logInfo(strings.git.upToDate);
                    return;
                }
            } else if (error) {
                if (stderr.indexOf("Your local changes") != -1) {
                    window.showWarningMessage("Merge will fail due to uncommited changes, either commit\
                        the changes or use stash & patch option", "Stash & Patch").then((action) => {
                        if (action) {
                            stash("Temp stash - merge branch '" + targetBranch.label + "' into '" + branchObj.currentBranch + "'", true).then(() => {
                                patchCreated = true;
                                merge();
                            });
                        }
                    });
                    return;
                } else {
                    logger.logError(strings.error("merging"), stderr || error);
                    return;
                }
            }
            if (optionsObj.addMessage) {
                setGitMessage();
            }
            if (patchCreated) {
                unstash();
            }
            logger.logInfo(strings.success.merge(targetBranch.label, branchObj.currentBranch));
        });
    }

    function setGitMessage() {
        if(scm.inputBox.value.length == 0){
            scm.inputBox.value = "Merge branch '" + targetBranch.label + "' into branch '" + branchObj.currentBranch + "'";
        }
    }

    /**
     * Process the options, handle invalid ones and require a commit message if necessary
     * @returns {void}
     */
    function processMergeOptions() {
        optionsObj = processUserOptions(strings.userSettings.get("mergeCommandOptions"), "merge");
        if (optionsObj.invalidOptions.length > 0) {
            logger.logWarning("The following commands are not valid merge commands: " + optionsObj.invalidOptions.toString());
            logger.logWarning("Yoc can check out which commands are valid at: https://git-scm.com/docs/git-merge");
        }
        if (optionsObj.requireCommitMessage) {
            window.showInputBox({
                placeHolder: "Enter a custom commit message"
            }).then((customCommitMsg) => {
                if (strings.userSettings.get("extendAutoCommitMessage")) {
                    customCommitMsg = "Merge branch '" + targetBranch.label + "' into '" + branchObj.currentBranch + "'\n" + customCommitMsg;
                }
                userCommitMessage = customCommitMsg;
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
        window.showQuickPick(branchObj.branchList, {
            placeHolder: strings.quickPick.chooseBranch
        }).then(chosenitem => {
            if (chosenitem) {
                targetBranch = chosenitem;
                processMergeOptions();
            }
        });
    }