import { Level } from "@prisma/client";
import DBClient from "../database/client.database";

export async function getLevelById(id: number): Promise<Level | void> {
    try {
        const prisma = DBClient.instance;
        const requestedLevel = await prisma.level.findUnique({
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