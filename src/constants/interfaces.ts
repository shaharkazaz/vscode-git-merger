import {QuickPickItem} from "vscode";

export interface IBranchObj {
    currentBranch: string;
    branchList: IGitBranchResponse[];
}

export interface IGitBranchResponse extends QuickPickItem {
    current: string;
}

export interface IGitStashResponse extends QuickPickItem {
    index: string;
}

export interface IOptionsObj {
        validOptions: string[];
        requireCommitMessage: boolean;
        invalidOptions: string[];
        addMessage: boolean;
}