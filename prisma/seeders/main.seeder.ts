import DBClient from "../../src/database/client.database";
import LevelsSeeder from "./levels.seeder";

const prisma = DBClient.instance;

async function main() {
    new LevelsSeeder();
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });