import {LoggerService} from "../services/logger.service";

export abstract class Command {

    static logger: LoggerService;

    constructor() {
        Command.logger = new LoggerService();
    }

    abstract async execute(): Promise<any>;

    abstract getCommandName(): string;
}