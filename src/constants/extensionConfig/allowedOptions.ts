const doubleDash = '--';
const dash = '-';

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

}