import {branchList, GitBranchResponse, GitStashResponse} from "../constants/interfaces";

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

export function getStashList(output: string): GitStashResponse[] {
    if (output.length === 0) {
        return [];
    }
    let stashList = parseGitJson<GitStashResponse>(output);
    stashList.forEach(stashItem => {
        stashItem.label = stashItem.label.replace("WIP ", "");
        stashItem.label = stashItem.label.charAt(0).toUpperCase() + stashItem.label.slice(1);
    });
    return stashList;
}

export function parseGitJson<T>(rawString: string): T[] {
    const jsonString = `[${rawString.substring(0, rawString.lastIndexOf("},"))}}]`;
    return JSON.parse(jsonString);
}