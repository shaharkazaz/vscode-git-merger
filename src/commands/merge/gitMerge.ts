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
import * as logger from "../../logger";
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

export function activate(context: ExtensionContext) {
    /**
     * Holds a list of all the branchs and the current branch
     * @type {IBranchObj}
     */
    let branchObj: IBranchObj,
        /**
         * Holds all the git commands options info
         * @type {IOptionsObj}
         */
        optionsObj: IOptionsObj,
        /**
         * Holds the targeted merge branch info
         * @type {IgitBranchResponse}
         */
        targetBranch,
        patchCreated;


    /**
     * Exexute the git merge command
     * @param   {string} [customCommitMsg] The user's custom commit message
     * @returns {void}
     */
    function merge(customCommitMsg ? ) {
        if (customCommitMsg && strings.userSettings.get("extendAutoCommitMessage")) {
            customCommitMsg = "Merge branch '" + targetBranch.label + "' into '" + branchObj.currentBranch + "'\n" + customCommitMsg;
        }
        exec(strings.git.merge(optionsObj.validOptions, targetBranch.label, customCommitMsg), {
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
                    if(patchCreated) {
                        message += ", stash was not applied";
                    }
                    window.showWarningMessage(message);
                    setGitMessage();
                    return;
                } else if (stdout.indexOf(strings.git.upToDate) != -1) {
                    if (patchCreated) {
                        unstash();
                    }
                    logger.logInfo(strings.git.upToDate);
                    return;
                }
            } else if (error) {
                logger.logError(strings.error("merging"), stderr || error);
                return;
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
        scm.inputBox.value = "Merge branch '" + targetBranch.label + "' into branch '" + branchObj.currentBranch + "'";
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
                merge(customCommitMsg);
            });
        } else {
            merge();
        }
    }

    function checkUncommitedFiles() {
        let gitStatus = execSync(strings.git.status, {
            cwd: workspace.rootPath
        }).toString();
        if (gitStatus.indexOf("nothing to commit") != -1) {
            try {
                branchObj = fetchBranchs();
            } catch (error) {
                logger.logError(strings.error("Fetching git branches"), error.message);
            }
            showBranchQuickPick()
        } else {
            window.showWarningMessage("Merge will fail due to uncommited changes, either commit\
         the changes or use stash & patch option", "Stash & Patch").then((action) => {
                if (action) {
                    try {
                        branchObj = fetchBranchs();
                    } catch (error) {
                        logger.logError(strings.error("Fetching git branches"), error.message);
                    }
                    patchCreated = true;
                    showBranchQuickPick()
                }
            })
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
                if (patchCreated) {
                    targetBranch = chosenitem;
                    stash("Temp stash - merge branch '" + targetBranch.label + "' into '" + branchObj.currentBranch + "'", true).then(() => {
                        processMergeOptions();
                    });
                } else {
                    targetBranch = chosenitem;
                    processMergeOptions();
                }

            }
        });
    }

    let disposable = commands.registerCommand('gitMerger.mergeFrom', () => {
        try {
            checkUncommitedFiles();
        } catch (error) {
            logger.logError(strings.error("Getting git status"), error.message);
        }
    });
    context.subscriptions.push(disposable);
}