import {QuickPickItem} from "vscode"
export interface IBranchsObject {
    currentBranch:string,
    branchList: Array<QuickPickItem>
}
