# Change Log
### v0.4.0
**Added**

* Added `GitMerger: Continue merge` command which allows you to continue the merge once the conflicts were resolved
### v0.3.7
**Updated**

* Updated project's structure.

**Fixed**

* Error is thrown from accessing SCM input box
### v0.3.6
**Added** 

* Stash & Patch - stash uncommitted changes and apply after a successful merge.
* Git merge message will be added in the vcm commit message box after a successful merge.

**Fixed** 

* Fixed "abort merge" command.

**Updated**

* The default options for the git merge command are now: `["commit", "no-ff"]`

### v0.3.5
**Fixed** 

* Fixed bug ([issue #15](https://github.com/shaharkazaz/vscode-git-merger/issues/15))

### v0.3.4  
**Added** 

* User can now add basic configuration to the merge command, for more info check out the repo [wiki](https://github.com/shaharkazaz/vscode-git-merger/wiki/User-config)  
* Custom commit message to replace/extend the auto commit message.  
* Documentation of the project.

**Updated** 

* Code improvements.

### v0.3.3  
**Added** 

* Delete stash after unstash option ([issue #11](https://github.com/shaharkazaz/vscode-git-merger/issues/11))

**Updated** 

* Code improvements in git merge function

### v0.3.2  
**Updated** 

* New design for stash quick pick item ([issue #12](https://github.com/shaharkazaz/vscode-git-merger/issues/12))

### v0.3.1  
**Fixed** 

* Fixed [bug](https://github.com/shaharkazaz/vscode-git-merger/issues/10)  

**Updated** 

* Changed "GitMerger: Drop stash" into: "GitMerger: Delete stash"
* Removed "GitMerger: Pop"

### v0.3.0
**Added**  

* "GitMerger: Stash", "GitMerger: Unstash", "GitMerger: Drop stash", "GitMerger: Pop"  & "GitMerger: Clear stash" commands.
* Information Log 'Git merger info'(sperated for the error log)  

### v0.2.5  
**Fixed**

* Fixed bug ([issue #2](https://github.com/shaharkazaz/vscode-git-merger/issues/2))

### v0.2.3  
**Fixed**  

* Fix extension auto update

### v0.2.2  
**Added**  

* Branches list now showing commit hash.  
* Open output log from the error message. (not by default)

**Updated** 

* The project's code structure.

### v0.2.1
**Fixed**  

* Minor bug fix 
 
### v0.2.0
**Fixed** 

* Conflicts were showing as errors.
* Logger didn't work properly.  

### v0.1.2
**Added** 

* Logger
