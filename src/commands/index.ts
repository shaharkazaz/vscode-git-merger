import {GitAbortMerge, GitContinueMerge, GitMerge} from './merge';
import {GitClearStash, GitDeleteStash, GitStash, GitUnstash} from './stash';

export const gitCommands = [GitMerge, GitAbortMerge, GitStash,
    GitUnstash, GitClearStash, GitDeleteStash, GitContinueMerge];