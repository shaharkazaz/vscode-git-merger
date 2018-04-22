import {QuickPickItem} from "vscode";
import {SpawnOptions} from "child_process";

export type branchDetail = {
    currentBranch: string;
    branchList: GitBranchResponse[];
};

export interface GitBranchResponse extends QuickPickItem {
    current: string;
}

export interface GitStashResponse extends QuickPickItem {
    index: string;
}

export type userOptions = {
    validOptions: string[];
    requireCommitMessage: boolean;
    invalidOptions: string[];
    addMessage: boolean;
    customMsg?: string;
};

export type commandConfig = {
    execOptions?: SpawnOptions;
    logProcess?: boolean;
    customMsg?: string;
};