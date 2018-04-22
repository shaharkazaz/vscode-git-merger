import {userOptions} from "../constants/types";
import {workspace} from "vscode";
import {allowedOptions, ConfigProperty, OptionsSections} from "../constants/extensionConfig/user-config";

export function processUserOptions(userSettings: string[], optionsType: OptionsSections): userOptions {
    const processedOptions: userOptions = {
        validOptions: [],
        requireCommitMessage: false,
        addMessage: userSettings.some((option) => option === 'no-commit'),
        invalidOptions: []
    };
    const customCommitMsg = getConfig<boolean>(ConfigProperty.CUSTOM_MSG);
    processedOptions.validOptions = userSettings.filter((option) => {
        if (!allowedOptions[optionsType][option]) {
            processedOptions.invalidOptions.push(option);

            return false;
        } else if (optionsType === OptionsSections.MERGE
            && (option === 'm' || customCommitMsg)) {
            processedOptions.requireCommitMessage = true;
        }

        return true;
    });

    return processedOptions;
}

export function getConfig<T>(section: ConfigProperty): T {
    return section ? workspace.getConfiguration('gitMerger').get(section): null;
}

