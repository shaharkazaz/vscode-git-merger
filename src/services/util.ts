import {
    IBranchObj,
    IOptionsObj,
    IGitStashResponse
} from "../constants/interfaces";
import {
    allowedOptions
} from "../constants/allowedOptions";
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

export function processUserOptions(userSettings, optionsType): IOptionsObj {
    let invalidOptions: Array < string > = [],
        requireCommitMessage = false;
    for (let index = 0; index < userSettings.length; index++) {
        let option = userSettings[index];
        if (!allowedOptions[optionsType][option]) {
            invalidOptions.push(option);
            userSettings.splice(index, 1);
            index--;
        } else if (optionsType === "merge" && (option === "m" || strings.userSettings.get("customCommitMessage"))) {
            requireCommitMessage = true;
        }
    }
    return {
        validOptions: userSettings,
        requireCommitMessage: requireCommitMessage,
        invalidOptions: invalidOptions
    }
}

export function parseGitJson(jsonString: string): any {
    jsonString = jsonString.replace(/[:{,\s]'/g, (matcher): string => matcher.replace("'", '"'))
        .replace(/'[,}:\s]/g, (matcher): string => matcher.replace("'", '"'));
    jsonString = "[" + jsonString.substring(0, jsonString.lastIndexOf("},")) + "}]";
    return JSON.parse(jsonString);
}