import {branchObj, GitStashResponse} from "../constants/interfaces";

export function getBranchList(output: string): branchObj {
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

export function getStashList(output: string): GitStashResponse[] {
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

export function parseGitJson(jsonString: string): any {
    jsonString = jsonString.replace(/[:{,\s]'/g, (matcher): string => matcher.replace("'", '"'))
        .replace(/'[,}:\s]/g, (matcher): string => matcher.replace("'", '"'));
    jsonString = "[" + jsonString.substring(0, jsonString.lastIndexOf("},")) + "}]";
    return JSON.parse(jsonString);
}