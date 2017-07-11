export default {
    git: {
        conflicts: "CONFLICT (content): Merge conflict in",
        upToDate: "Already up-to-date",
        noMerge: "There is no merge to abort",
        getBranches: "git for-each-ref --format='%(HEAD)%(refname:short):%(objectname:short)'",
        getCurrentBranch: "git rev-parse --abbrev-ref HEAD",
        merge: (flags: Array < string > , branchName ? : string) => {
            let command = "git merge " + (branchName || "");
            if (flags) {
                flags.forEach(flag => {
                    command += " --" + flag;
                });
            }
            return command;
        },
        stash: (stashCommand: string, includeFlag:boolean = false, stashName ? : string) => {
            let flag = includeFlag ? '--pretty=format:"{\'detail\':\'%gd \u2022 %h \u2022 %cr\',\'label\':\'%s\',\'index\':\'%gd\'}"' : "",
                command = "git stash " + stashCommand + flag + (stashName || "");
            return command;
        }
    },
    error:
        (errorWhile: string) => {
            return "Error while " + errorWhile;
        },
    timeForamt: {
        fullDate: "MM.DD.YYYY HH:mm:ss",
        hours: "HH:mm:ss"
    },
    windowConflictsMessage: "Seems like there are some conflicts to handle check the \'Git Merger Log\' for more inforamtion",
    actionButtons: {
        openLog: "open log"
    },
    warnings: {
        conflicts: "Conflicts while mergning in the following files:"
    },
    windowErrorMessage: "Oops! something didn't work check the \'Git Merger Log\' for more inforamtion",
    quickPick: {
        chooseBranch: "Choose destination branch"
    },
    success: {
        general: (operation, functionality) => {
            return operation + " was successfully " + functionality;
        },
        merge: (choosenBranch, currentBranch) => {
            return "Branch " + choosenBranch + " was merged into the current branch " + currentBranch;
        }
    }
}