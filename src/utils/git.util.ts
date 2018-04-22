import {branchDetail, GitBranchResponse, GitStashResponse} from "../constants/types";
import * as capitalize from "lodash.capitalize";
import {Command} from "../commands/command-base";
import {allowedOptions, ConfigProperty, OptionsSections} from "../constants/extensionConfig/user-config";
import {getConfig, processUserOptions} from "./config.util";
import {LOG_TYPE} from "../services/logger/logger.types";
import strings from "../constants/string-constnats";
import {window} from "vscode";

export function getMergeOptions(targetBranch: GitBranchResponse, branches: branchDetail) {
    return new Promise((resolve, reject) => {
        let userOptions = processUserOptions(getConfig<string[]>(ConfigProperty.MERGE_OPTIONS), OptionsSections.MERGE);
        if (userOptions.invalidOptions.length > 0) {
            Command.logger.logMessage(strings.config.invalidOptions(userOptions.invalidOptions), LOG_TYPE.WARNING);
        }
        if (userOptions.requireCommitMessage) {
            window.showInputBox({placeHolder: 'Enter a custom commit message'})
                .then((customCommitMsg) => {
                    let commitMsg = customCommitMsg;
                    if (getConfig<boolean>(ConfigProperty.EXTEND_AUTO_MSG)) {
                        commitMsg = `Merge branch '${targetBranch.label}' into ${branches.currentBranch}' \n ${customCommitMsg}`;
                    }
                    resolve({...userOptions, commitMsg});
                })
        } else {
            resolve(userOptions);
        }
    });

}

export function getBranchList(output: string): branchDetail {
    const branchList: branchDetail = {
        branchList: [],
        currentBranch: ''
    };

    branchList.branchList = parseGitJson<GitBranchResponse>(output).filter((branch) => {
        if (branch.current === '*') {
            branchList.currentBranch = branch.label;
        } else {
            if (branch.label.indexOf('origin') !== -1) {
                branch.description = `Remote branch at ${branch.description}`;
            }
            return true;
        }
    });

    return branchList;
}

export function getStashList(rawString: string): GitStashResponse[] {
    if (rawString.length === 0) {
        return [];
    }

    const stashList = parseGitJson<GitStashResponse>(rawString);
    stashList.forEach((stash)  => {
        stash.label = capitalize(stash.label.replace('WIP ', ''));
    });

    return stashList;
}

export function parseGitJson<T>(rawString: string): T[] {
    if (!rawString) {
        return [];
    }

    const jsonString = `[${rawString.substring(0, rawString.lastIndexOf("},"))}}]`;
    return JSON.parse(jsonString);
}

export function buildMergeCmd(options: string[] = [], branchName = '', customMsg?: string): string[] {
    if (!options && !branchName) {
        Command.logger.logError('No options were passed to mergeCmd gen!');
        return [];
    }

    if (options.some((opt) => typeof opt !== 'string')) {
        Command.logger.logError('Options are accepted only as a string array!');
        return [];
    }

    let command = branchName ? ['merge', branchName] : ['merge'];
    options.forEach((option) => {
        const allowedOption = allowedOptions.merge[option];
        if (allowedOption && option !== 'm') {
            command.push(`${allowedOption}${option}`);
        }
    });
    if (customMsg) {
        command.push('-m', customMsg);
    }

    return command;
}

export function buildStashCmd(cmd: string, stashName = ''): string[] {
    if (!cmd) {
        Command.logger.logError('No stash command given!');
        return [];
    }

    const fullCmd = ['stash', ...cmd.split(' ')];
    if (cmd === 'list') {
        fullCmd.push(`--pretty=format:{"detail":"%gd \u2022 %h \u2022 %cr","label":"%s","index":"%gd"},`);
    }
    if (stashName) {
        fullCmd.push(stashName);
    }

    return fullCmd;
}