import { GameplayLevel } from "@prisma/client";
import DBClient from "../database/client.database";

export async function getLevelById(id: number): Promise<GameplayLevel | void> {
    try {
        const prisma = DBClient.instance;
        const requestedLevel = await prisma.gameplayLevel.findUnique({
            where: { id }
        });

        // Close prisma connection
        prisma.$disconnect();

        if (!requestedLevel) return;

        return requestedLevel;
    } catch (error) {
        console.error(error);
    }
}