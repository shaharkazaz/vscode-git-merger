import {GitAbort, GitContinue, GitMerge} from './merge';
import {GitClearStash, GitDeleteStash, GitStash, GitUnstash} from './stash';

export const gitCommands = [GitMerge, GitAbort, GitStash, 
    GitUnstash, GitClearStash, GitDeleteStash, GitContinue];