import { Score } from "@prisma/client";
import { Request, Response } from "express";
import DBClient from "../database/client.database";
import { ResponseObject } from "../ts/response.type";
import { errorHandler } from "../utils/error-handler.util";
import { getLevelById } from "./level.controller";
import { getUserById } from "./user.controller";

export async function getScores(
    req: Request,
    res: Response
): Promise<Response | void> {
    const prisma = DBClient.instance;
    // Query
    const gameplayLevelId: number = Number(req.params.gameplayLevelId) || -1;
    // Pagination settings
    const page: any = req.query.page || 1;
    const limit: any = req.query.limit || 10;
    // Score DB operations
    let scoresCount: number;
    let scores: Score[];

    if (gameplayLevelId != -1) {
        scoresCount = await prisma.score.count({
            where: { gameplayLevelId }
        });

        scores = await prisma.score.findMany({
            skip: limit * (page - 1),
            take: parseInt(limit),
            where: { gameplayLevelId },
            orderBy: { generalScore: "desc" },
            include: { user: true }
        });
    } else {
        scoresCount = await prisma.score.count();

        scores = await prisma.score.findMany({
            skip: limit * (page - 1),
            take: parseInt(limit),
            orderBy: { generalScore: "desc" },
            include: { user: true }
        });
    }

    prisma.$disconnect();

    res.json({
        status: true,
        data: scores,
        pagination: {
            total: scoresCount,
            page_count: Math.ceil(scoresCount / limit),
            current_page: parseInt(page),
            per_page: parseInt(limit),
            from: (page - 1) * limit + 1,
            to: (page - 1) * limit + scores.length,
        },
    });
}


export async function scoreOperation(
    req: Request,
    res: Response
): Promise<Response | void> {
    const { userId, gameplayLevelId, generalScore,
        productionScore, economyScore, familyScore, sustainabilityScore } = req.body;
    const numbersValidation: ResponseObject = validateScoresAndLevel(gameplayLevelId,
        generalScore, productionScore, economyScore, familyScore, sustainabilityScore);

    // Validates if there are numbers in the score
    if (!numbersValidation.status) return res.status(403).json(numbersValidation);

    // Creates score object
    const currentScore: Score = {
        userId,
        gameplayLevelId,
        generalScore,
        productionScore,
        familyScore,
        economyScore,
        sustainabilityScore
    }

    try {
        const previousScore = await getScoreByIds(currentScore.userId, currentScore.gameplayLevelId);

        if (previousScore) await updateScore(currentScore, previousScore, res);
        else await createScore(currentScore, res);

    } catch (error) {
        const message = errorHandler(error);

        console.error(error);
        res.status(403).json({
            status: false,
            message
        });
    }
}

async function createScore(
    score: Score,
    res: Response
): Promise<Response | void> {
    try {
        const prisma = DBClient.instance;
        const user = await getUserById(score.userId);
        const level = await getLevelById(score.gameplayLevelId);
        let response: ResponseObject;

        if (!user || !level) {
            response = {
                status: false,
                message: "El usuario o nivel no es correcto"
            }

            return res.status(403).json(response);
        }

        const scoreCreated = await prisma.score.create({
            data: score
        });

        response = {
            status: true,
            data: scoreCreated
        }

        return res.json(response);
    } catch (error) {
        const message = errorHandler(error);
        const response: ResponseObject = {
            status: false,
            message
        }

        console.error(error);
        return res.status(403).json(response);
    }
}

async function updateScore(
    currentScore: Score,
    previousScore: Score,
    res: Response
): Promise<Response | void> {
    if (previousScore.generalScore > currentScore.generalScore) return res.json({ status: true });

    try {
        const prisma = DBClient.instance;
        const scoreUpdated = await prisma.score.update({
            data: currentScore,
            where: {
                userId_gameplayLevelId: {
                    userId: currentScore.userId,
                    gameplayLevelId: currentScore.gameplayLevelId
                }
            }
        });
        const response: ResponseObject = {
            status: true,
            data: scoreUpdated
        }

        res.json(response);
    } catch (error) {
        const message = errorHandler(error);
        const response: ResponseObject = {
            status: false,
            message
        }

        console.error(error);
        return res.status(403).json(response);
    }
}

function validateScoresAndLevel(
    gameplayLevelId: number,
    generalScore: number,
    productionScore: number,
    healthScore: number,
    familyScore: number,
    sustainabilityScore: number
): ResponseObject {
    if (typeof (gameplayLevelId) != "number") return ({
        status: false,
        message: "El nivel debe de ser un número válido"
    });

    if (typeof (generalScore) != "number" || generalScore < 0 || generalScore > 5) return ({
        status: false,
        message: "El puntaje general debe de ser un número válido"
    });

    if (typeof (productionScore) != "number" || productionScore < 0 || productionScore > 5) return ({
        status: false,
        message: "El puntaje de producción debe de ser un número válido"
    });

    if (typeof (healthScore) != "number" || healthScore < 0 || healthScore > 5) return ({
        status: false,
        message: "El puntaje de salud debe de ser un número válido"
    });

    if (typeof (familyScore) != "number" || familyScore < 0 || familyScore > 5) return ({
        status: false,
        message: "El puntaje de familia debe de ser un número válido"
    });

    if (typeof (sustainabilityScore) != "number" || sustainabilityScore < 0 || sustainabilityScore > 5) return ({
        status: false,
        message: "El puntaje de sustentabilidad debe de ser un número válido"
    });

    return ({ status: true });
}


async function getScoreByIds(
    userId: number,
    gameplayLevelId: number
): Promise<Score | void> {
    try {
        const prisma = DBClient.instance;
        const requestedScore = await prisma.score.findUnique({
            where: {
                userId_gameplayLevelId: {
                    userId,
                    gameplayLevelId
                }
            }
        });

        // Close prisma connection
        prisma.$disconnect();

        if (!requestedScore) return;

        return requestedScore;
    } catch (error) {
        console.error(error);
    }
}