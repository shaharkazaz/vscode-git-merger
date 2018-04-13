# ![alt text](./merger-icon.png "Git Merger") Git Merger [![](https://vsmarketplacebadge.apphb.com/version-short/shaharkazaz.git-merger.svg)](https://marketplace.visualstudio.com/items?itemName=shaharkazaz.git-merger) [![](https://vsmarketplacebadge.apphb.com/installs/shaharkazaz.git-merger.svg)](https://marketplace.visualstudio.com/items?itemName=shaharkazaz.git-merger) [![](https://vsmarketplacebadge.apphb.com/rating-short/shaharkazaz.git-merger.svg)](https://marketplace.visualstudio.com/items?itemName=shaharkazaz.git-merger)

Merging branches has never been easier.

# Key Features

* Stash & Patch - Uncommited changes handler while merging.
* Merge from - Merge any branch into your local branch.
* Configure options on the git merge command (more info in the repo's [wiki](https://github.com/shaharkazaz/vscode-git-merger/wiki/User-config)).

# Road Map

My vision is to create the merge resolver we all want, a 3 screen just click and fix merger.  
Coming soon to your VScode.

# Installation

First, you will need to [install Visual Studio Code](https://code.visualstudio.com/download).  
Once you have vscode installed access the marketplace and install "Git Merger" or launch the VScode quick open (<kbd>⌘</kbd>+<kbd>p</kbd>  | <kbd>Ctrl</kbd>+<kbd>p</kbd>) and run `ext install git-merger` 

# Commands
The extension commands that can be accessed from the command pallet (<kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>p</kbd> | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>p</kbd> ):

* ```GitMerger: Merge from...``` - Merge branch into working branch (write ```mf``` or ```gmf``` for short).
* ```GitMerger: Continue merge``` - Continue the merge once the conflicts are done.
* ```GitMerger: Abort merge``` - Abort the current merge. 
* ```GitMerger: Stash...``` - Stash your WIP for later usage.
* ```GitMerger: Unstash...``` - Apply stashed changes on working branch.
* ```GitMerger: Clear stash``` - Remove any saved stashes.
* ```GitMerger: Delete stash...``` - Delete a specific stash.

# Help this extension be great

If you want to contribute or have any feedback positive or negative, let me know!  
Contact via [Email](shahar.kazaz@gmail.com) or open an issue at this project's [Git Repo](https://github.com/shaharkazaz/vscode-git-merger/issues).  


# License

[MIT](https://github.com/shaharkazaz/vscode-git-merger/blob/master/LICENSE)
