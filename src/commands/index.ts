/** This is a barrel file for all the extensions commands */
import {GitMerge} from './merge/gitMerge';
import {GitAbort} from './merge/gitAbort';
import {GitStash} from "./stash/gitStash";
import {GitUnstash} from "./stash/gitUnstash";
import {GitClearStash} from './stash/gitClearStash';
import {GitDeleteStash} from "./stash/gitDeleteStash";
import { GitContinue } from './merge/gitContinue';

export const commands = [GitMerge, GitAbort, GitStash, 
    GitUnstash, GitClearStash, GitDeleteStash, GitContinue];