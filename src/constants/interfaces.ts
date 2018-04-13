import {QuickPickItem} from "vscode";
import {SpawnOptions} from "child_process";
export type IBranchObj = {
    currentBranch: string;
    branchList: IGitBranchResponse[];
};

export interface IGitBranchResponse extends QuickPickItem {
    current: string;
}

export interface IGitStashResponse extends QuickPickItem {
    index: string;
}

export type IOptionsObj = {
        validOptions: string[];
        requireCommitMessage: boolean;
        invalidOptions: string[];
        addMessage: boolean;
};

export type commandConfig  = {
    execOptions?: SpawnOptions;
    logProcess?: boolean;
    customMsg?: string;
};