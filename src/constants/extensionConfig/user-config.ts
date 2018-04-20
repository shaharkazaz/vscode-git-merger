const doubleDash = '--';
const dash = '-';

export enum ConfigProperty {
    MERGE_OPTIONS = 'mergeCommandOptions',
    CUSTOM_MSG = 'customCommitMessage',
    EXTEND_AUTO_MSG = 'extendAutoCommitMessage'
}

export const allowedOptions = {
    merge: {
        abort: doubleDash,
        commit: doubleDash,
        "no-commit": doubleDash,
        ff: doubleDash,
        "no-ff": doubleDash,
        "ff-only": doubleDash,
        log: doubleDash,
        stat: doubleDash,
        n: dash,
        m: dash,
        "no-stat": doubleDash,
        squash: doubleDash,
        "no-squash": doubleDash,
        s: dash,
        strategy: doubleDash,
        X: dash,
        "strategy-option": doubleDash,
        "verify-signatures": doubleDash,
        "no-verify-signatures": doubleDash
    }

};

export enum OptionsSections {
    MERGE = 'merge'
}