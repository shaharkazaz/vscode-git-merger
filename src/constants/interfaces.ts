/**
 *  @fileOverview Holds the project's interfaces
 *  @author  Shahar Kazaz
 */
import {QuickPickItem} from "vscode";
export interface IBranchObj {
    currentBranch: string;
    branchList: Array<IGitBranchResponse>
}

export interface IGitBranchResponse extends QuickPickItem {
    current: string;
}

export interface IGitStashResponse extends QuickPickItem {
    index: string;
}

export interface IOptionsObj {
        validOptions: Array<string>;
        requireCommitMessage: boolean;
        invalidOptions: Array<string>;
        addMessage: boolean;
}