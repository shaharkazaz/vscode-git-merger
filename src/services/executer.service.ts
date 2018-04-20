import {spawn} from "child_process";
import {commandConfig} from "../constants/interfaces";
import {workspace} from "vscode";

const defaultConfig = {
    execOptions: {
        cwd: workspace.rootPath
    },
    logProcess: false
};

export function gitExecutor(args: string | string[], cmdConfig?: commandConfig) {
    return new Promise((resolve, reject) => {

        if (!args || !args.length) {
            reject("No arguments were given");
        }

        if (!Array.isArray(args)) {
            args = args.split(' ');
        }

        cmdConfig = {...defaultConfig, ...cmdConfig};

        if (cmdConfig.logProcess) {
            const message = cmdConfig.customMsg ? `${cmdConfig.customMsg}...` : `git ${args[0]} is executing...`;
            console.log('\x1b[36m%s\x1b[0m', message);
        }

        const commandExecuter = spawn('git', args, cmdConfig.execOptions);
        let stdOutData = '';
        let stderrData = '';

        commandExecuter.stdout.on('data', (data) => stdOutData += data);
        commandExecuter.stderr.on('data', (data) => stderrData += data);
        commandExecuter.on('close', (code) => code != 0
            ? reject(removeEmptyLine(stderrData.toString()))
            : resolve(removeEmptyLine(stdOutData.toString()))
        );
    });
}

function removeEmptyLine(str): string {
  return str.replace(/\n$/, '');
}