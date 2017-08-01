import {exec} from 'child_process';  
import {workspace} from 'vscode';

export function execAsync (command){
    return new Promise((resolve) => {
        exec(command, {
            cwd: workspace.rootPath
        }, (error, stdout, stderr) => {
            resolve({
                error: error,
                stdout: stdout,
                stderr: stderr
            });
        });
    });
}

export async function execSync (command){
    await exec(command, {
            cwd: workspace.rootPath
        }, (error, stdout, stderr) => {
            return {
                error: error,
                stdout: stdout,
                stderr: stderr
            };
        });
}