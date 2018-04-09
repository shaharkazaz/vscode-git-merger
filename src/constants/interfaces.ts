import {QuickPickItem} from "vscode";
import {SpawnOptions} from "child_process";
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

export interface commandConfig {
    execOptions?: SpawnOptions;
    logProcess?: boolean;
    customMsg?: string;
}