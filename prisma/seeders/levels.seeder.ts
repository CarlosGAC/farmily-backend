import { PrismaClient } from "@prisma/client";
import DBClient from "../../src/database/client.database";

export default class LevelsSeeder {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = DBClient.instance;
        this.executeSeeder();
    }

    private async executeSeeder() {
        let levels = [];

        for (let x = 1; x <= 15; x++) {
            levels.push({ id: x });
        }

        await this.prisma.gameplayLevel.createMany({ data: levels });
    }
}