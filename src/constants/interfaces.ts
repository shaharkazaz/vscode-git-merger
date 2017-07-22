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

export interface IFlagsObj {
        validFlags: Array<string>;
        requireCommitMessage: boolean;
        invalidFlags: Array<string>;
}