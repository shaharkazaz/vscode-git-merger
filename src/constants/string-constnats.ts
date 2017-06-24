export default {
    commands: {
        git: {
            getBranches: "git for-each-ref --format='%(HEAD)%(refname:short):%(objectname:short)'",
            merge: (flags: Array < string > , branchName ? : string) => {
                let command = "git merge " + branchName || "";
                if (flags) {
                    flags.forEach(flag => {
                        command += " --" + flag;
                    });
                }
                return command;
            }
        }
    },
    messages: {
        actionButtons: {
            openLog: "open log"
        },
        log: {
            error: {
                abortMerge: "Error while aborting merge",
                getBranches: "Error while fetching branches",
                merging: "Error while mergning"
            },
            warnings: {
                conflicts: "Conflicts while mergning in the following files:"
            }
        },
        windowMessages: {
            error: "Oops! something didn't work check the \'Git Merger Log\' for more inforamtion",
            warnings: {
                conflicts: "Seems like there are some conflicts to handle (Conflicted files list in \'Git Merger Log\')"
            }
        },
        quickPick: {
            chooseBranch: "Choose destination branch"
        },
        common: {
            success: {
                abortMerge: "Merge was successfully aborted",
                merge: (choosenBranch, currentBranch) => {
                    return choosenBranch + " was merged into " + currentBranch;
                }
            }
        }
    },
    git: {
        conflicts: "CONFLICT (content): Merge conflict in",
        upToDate: "Already up-to-date"
    }
}