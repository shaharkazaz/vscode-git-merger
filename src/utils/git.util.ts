import {branchList, GitBranchResponse, GitStashResponse} from "../constants/interfaces";
import * as capitalize from "lodash.capitalize";

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
    const jsonString = `[${rawString.substring(0, rawString.lastIndexOf("},"))}}]`;
    return JSON.parse(jsonString);
}