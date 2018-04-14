import {QuickPickItem} from "vscode";
import {SpawnOptions} from "child_process";

export type branchList = {
    currentBranch: string;
    branchList: GitBranchResponse[];
};

export interface GitBranchResponse extends QuickPickItem {
    current: string;
}

export interface GitStashResponse extends QuickPickItem {
    index: string;
}

export type optionsObj = {
    validOptions: string[];
    requireCommitMessage: boolean;
    invalidOptions: string[];
    addMessage: boolean;
};

export type commandConfig = {
    execOptions?: SpawnOptions;
    logProcess?: boolean;
    customMsg?: string;
};