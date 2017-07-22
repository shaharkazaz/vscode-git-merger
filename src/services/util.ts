import {
    IBranchObj,
    IFlagsObj,
    IGitStashResponse
} from "../constants/interfaces";
import {
    allowedFlags
} from "../constants/allowedFlags";
import strings from '../constants/string-constnats';

export function getBranchList(output: string): IBranchObj {
    let responseObj = {
        branchList: this.parseGitJson(output),
        currentBranch: ""
    };
    responseObj.branchList = responseObj.branchList.filter((branch) => {
        if (branch.current === "*") {
            responseObj.currentBranch = branch.label;
        } else {
            if (branch.label.indexOf("origin") != -1) {
                branch.description = "Remote branch at " + branch.description;
            }
            return true;
        }
    });
    return responseObj;
}

export function getStashList(output: string): Array < IGitStashResponse > {
    if (output.length == 0) {
        return [];
    }
    let stashList = this.parseGitJson(output);
    stashList.forEach(stashItem => {
        stashItem.label = stashItem.label.replace("WIP ", "");
        stashItem.label = stashItem.label.charAt(0).toUpperCase() + stashItem.label.slice(1);
    });
    return stashList;
}

export function processUserFlags(userSettings, flagsType): IFlagsObj {
    let invalidFlags: Array < string > = [],
        requireCommitMessage = false;
    for (let index = 0; index < userSettings.length; index++) {
        let flag = userSettings[index];
        if (!allowedFlags[flagsType][flag]) {
            invalidFlags.push(flag);
            userSettings.splice(index, 1);
            index--;
        } else if (flagsType === "merge" && (flag === "m" || strings.userSettings.get("customCommitMessage"))) {
            requireCommitMessage = true;
        }
    }
    return {
        validFlags: userSettings,
        requireCommitMessage: requireCommitMessage,
        invalidFlags: invalidFlags
    }
}

export function parseGitJson(jsonString: string): any {
    jsonString = "[" + jsonString.substring(0, jsonString.lastIndexOf("},")) + "}]";
    return JSON.parse(jsonString);
}