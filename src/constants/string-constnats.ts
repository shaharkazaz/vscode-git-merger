/**
 *  @fileOverview This file contains all the string constants
 *  @author       Shahar Kazaz
 *  @requires     workspace from vscode
 *  @requires     allowedOptions
 */
import {workspace} from 'vscode';
import {allowedOptions} from "./extensionConfig/user-config";

export default {
    git: {
        status: 'git status',
        conflicts: 'CONFLICT (content): Merge conflict in',
        upToDate: 'Already up-to-date',
        noMerge: 'There is no merge to abort',
        getBranches: `git for-each-ref --format='{"description":"%(objectname:short)","label":"%(refname:short)","current":"%(HEAD)"},' refs/heads refs/remotes`,
        getCurrentBranch: 'git rev-parse --abbrev-ref HEAD',
        merge: (options: string[], branchName ?: string, commitMessage?: string) => {
            let command = `git merge ${branchName || ''}`;
            if (options) {
                options.forEach((option) => {
                    if (option !== 'm') {
                        command += ` ${allowedOptions.merge[option]}${option}`;
                    }
                });
            }
            if (commitMessage) {
                command += ` -m '${commitMessage}'`;
            }
            return command;
        },
        stash: (stashCommand: string, includeOption: boolean = false, stashName = '') => {
            const option = includeOption ? `--pretty=format:'{"detail":"%gd \u2022 %h \u2022 %cr","label":"%s","index":"%gd"},'` : '';
            return `git stash ${stashCommand} ${option} ${stashName}`;
        }
    },
    msgTypes: {
        ERROR: 'Error',
        WARNING: 'Warning',
        INFO: 'Info',
        DEBUG: 'Debug'
    },
    error:
        (command: string) => `Error4 while ${command}`,
    timeForamt: {
        fullDate: 'MM.DD.YYYY HH:mm:ss',
        hours: 'HH:mm:ss'
    },
    windowConflictsMessage: 'Seems like there are some conflicts, resolve before commiting',
    actionButtons: {
        openLog: 'open log'
    },
    warnings: {
        conflicts: 'Conflicts while mergning in the following files:'
    },
    windowErrorMessage: `Oops! something didn't work check the 'Git Merger Log' for more inforamtion`,
    quickPick: {
        chooseBranch: 'Choose destination branch'
    },
    success: {
        general: (operation: string, functionality: string) => `${operation} was successfully ${functionality}`,
        merge: (choosenBranch: string, currentBranch: string) =>
            `Branch '${choosenBranch}' was successfully merged into branch '${currentBranch}'`

    }
}