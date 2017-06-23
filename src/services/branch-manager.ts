// 'use strict';
// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';
// import stringConstants from '../constants/string-constnats';
// import {
//     execSync
// } from 'child_process';
// import * as logger from "../logger";
// import {
//     IBranchObject
// } from "../constants/interfaces";

// export function getBranches(): IBranchObject {
//     let branchsObject: IBranchObject = {
//         currentBranch: "",
//         branchList: []
//     }
//     let stdout = execSync(stringConstants.commands.git.getBranches, {
//         cwd: vscode.workspace.rootPath
//     });
//     debugger;
//     // if (error) {
//     //     logger.logError(stringConstants.messages.log.error.getBranches);
//     //     logger.logError(stderr || error);
//     //     vscode.window.showErrorMessage(stringConstants.messages.windowMessages.error);
//     //     return;
//     // }
//     // branchsObject.branchList = stdout.split("\n").filter((branch) => {
//     //     if (branch.indexOf("*") != -1) {
//     //         branchsObject.currentBranch = branch.replace('*', '').trim();
//     //         return false;
//     //     }
//     //     return (branch.trim().length > 0 && branch.indexOf("*") == -1 && branch.indexOf("HEAD") == -1)
//     // });
//     return branchsObject;
// }