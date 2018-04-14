import {optionsObj} from "../constants/interfaces";
import {allowedOptions} from "../constants/extensionConfig/allowedOptions";
import strings from '../constants/string-constnats';

export function processUserOptions(userSettings, optionsType): optionsObj {
    let invalidOptions: Array<string> = [],
        requireCommitMessage = false,
        addMessage = false;
    for (let index = 0; index < userSettings.length; index++) {
        let option = userSettings[index];
        if (option == "no-commit") {
            addMessage = true;
        }
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
        invalidOptions: invalidOptions,
        addMessage: addMessage
    }
}