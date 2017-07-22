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
    ExtensionContext
} from 'vscode';
import strings from '../../constants/string-constnats';
import {
    exec,
    execSync
} from 'child_process';
import * as logger from "../../logger";
import {
    getBranchList,
    processUserFlags
} from "../../services/util";
import {
    IBranchObj
} from "../../constants/interfaces";

export function activate(context: ExtensionContext) {
  /**
   * Holds a list of all the branchs and the current branch
   * @type {IBranchObj}
   */
    let branchObj: IBranchObj,
      /**
   * Holds all the git commands flag info
   * @type {IFlagsObj}
   */
     flagsObj,
       /**
   * Holds the targeted merge branch info
   * @type {IgitBranchResponse}
   */
     targetBranch;

    /**
   * Exexute the git merge command
   * @param   {string} [customCommitMsg] The user's custom commit message
   * @returns {void}
   */
function merge(customCommitMsg?) {
    if(customCommitMsg && strings.userSettings.get("extendAutoCommitMessage")){
        customCommitMsg = "Merge branch '" + targetBranch.label + "' into '" + branchObj.currentBranch + "'\n" + customCommitMsg;
    }
    exec(strings.git.merge(flagsObj.validFlags , targetBranch.label, customCommitMsg), {
        cwd: workspace.rootPath
    }, (error, stdout, stderr) => {
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
                window.showWarningMessage(strings.windowConflictsMessage, strings.actionButtons.openLog).then((action) => {
                    if (action == strings.actionButtons.openLog) {
                        logger.openLog();
                    }
                });
                return;
            } else if (stdout.indexOf(strings.git.upToDate) != -1) {
                logger.logInfo(strings.git.upToDate);
                return;
            }
        } else if (error) {
            logger.logError(strings.error("merging"), stderr || error);
            return;
        }
        logger.logInfo(strings.success.merge(targetBranch.label, branchObj.currentBranch));
    });
}

    /**
   * Process the flags, handle invalid ones and require a commit message if necessary
   * @returns {void}
   */
function processMergeFlags() {
    flagsObj = processUserFlags(strings.userSettings.get("mergeCommandFlags"), "merge");
    if (flagsObj.invalidFlags.length > 0) {
        logger.logWarning("The following commands are not valid merge commands: " + flagsObj.invalidFlags.toString());
        logger.logWarning("Yoc can check out which commands are valid at: https://git-scm.com/docs/git-merge");
        window.showWarningMessage("Some of your flags were invalid and were exluded, check the log for more info", strings.actionButtons.openLog).then((chosenitem) => {
            if (chosenitem) {
                logger.openLog();
            }
        });
    }
    if (flagsObj.requireCommitMessage) {
        window.showInputBox({placeHolder: "Enter a custom commit message"}).then((customCommitMsg) => {
            merge(customCommitMsg);
        });
    } else {
        merge();
    }
}
    /**
   * Register the command into the extension
   * @returns {void}
   */
function registerCommand() {
    let disposable = commands.registerCommand('gitMerger.mergeFrom', () => {
        window.showQuickPick(branchObj.branchList, {
            placeHolder: strings.quickPick.chooseBranch
        }).then(chosenitem => {
            if (chosenitem) {
                targetBranch = chosenitem;
                processMergeFlags();
            }
        });
    });
    context.subscriptions.push(disposable);
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

    try {
        branchObj = fetchBranchs();
        registerCommand();
    } catch (error) {
        logger.logError(strings.error("fetching branch list"), error.message);
    }
}