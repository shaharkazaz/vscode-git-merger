import {branchList, GitBranchResponse, GitStashResponse} from "../constants/interfaces";
import * as capitalize from "lodash.capitalize";
import {Command} from "../commands/command-base";
import {allowedOptions} from "../constants/extensionConfig/user-config";

export function getBranchList(output: string): branchList {
    const branchList: branchList = {
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

export function buildMergeCmd(options: string[] = [], branchName = '', commitMessage?: string): string[] {
    if (!options.length && !branchName) {
        Command.logger.logError('No options were passed to mergeCmd gen!');
        return [];
    }

    if (options.some((opt) => typeof opt !== 'string')) {
        Command.logger.logError('Options are accepted only as a string array!');
        return [];
    }

    const command = branchName ? ['merge', branchName] : ['merge'];
    options.forEach((option) => {
        const allowedOption = allowedOptions.merge[option];
        if (allowedOption && option !== 'm') {
            command.push(`${allowedOption}${option}`);
        }
    });
    if (commitMessage) {
        command.concat(['-m', commitMessage]);
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