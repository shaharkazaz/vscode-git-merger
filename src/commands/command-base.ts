import { Logger } from "../logger";

export abstract class Command {

    static logger: Logger;

    constructor() {
        Command.logger = new Logger();
    }

    abstract async execute(): Promise<any>;
    abstract getCommandName(): string;
}