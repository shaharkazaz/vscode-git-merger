/** This is a barrel file for all the extensions commands */
import * as gitMerge from './merge/gitMerge';
import * as gitAbort from './merge/gitAbort';
import * as gitStash from './stash/gitStash';
import * as gitUnstash from './stash/gitUnstash';
import * as gitClearStash from './stash/gitClearStash';
import * as gitDeleteStash from './stash/gitDeleteStash';

export const commands = [gitMerge, gitAbort, gitStash, gitUnstash, gitClearStash, gitDeleteStash];