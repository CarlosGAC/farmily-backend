import { Prisma, User } from "@prisma/client";
import { Request, Response } from "express";
import DBClient from "../database/client.database";
import { errorHandler } from "../utils/error-handler.util";

export async function getUser(
    req: Request,
    res: Response
): Promise<Response | void> {
    const { username } = req.params;
    console.log(username);
    const user = await getUserById(username);

    if (!user) return res.status(403).json({
        status: false,
        message: "El usuario solicitado no existe"
    });

    res.json({ ...user });
}

export async function getUsers(
    req: Request,
    res: Response
): Promise<Response | void> {
    const prisma = DBClient.instance;
    const usersCount = await prisma.user.count();
    const users = await prisma.user.findMany();

    prisma.$disconnect();
    // Pagination settings
    const page: any = req.query.page || 1;
    const limit: any = req.query.limit || 5;

    res.json({
        status: true,
        data: users,
        pagination: {
            total: usersCount,
            page_count: Math.ceil(usersCount / limit),
            current_page: parseInt(page),
            per_page: parseInt(limit),
            from: (page - 1) * limit + 1,
            to: (page - 1) * limit + users.length,
        },
    });
}

export async function createUser(
    req: Request,
    res: Response
): Promise<Response | void> {
    const { username, age } = req.body;

    if (typeof (age) != "number") return res.status(403).json({
        status: false,
        message: "La edad debe de ser un número"
    });

    try {
        const prisma = DBClient.instance;
        const user = Prisma.validator<Prisma.UserCreateInput>()({
            username,
            age
        });

        // Create user process
        await prisma.user.create({
            data: user
        });

        // Return response
        res.json({
            status: true,
            data: user
        });
    } catch (error) {
        const message = errorHandler(error);

        console.error(error);
        res.status(403).json({
            status: false,
            message
        });
    }
}

export async function updateUser(
    req: Request,
    res: Response
): Promise<Response | void> {
    const { username } = req.params;
    const { age, new_username } = req.body;

    if (typeof (age) != "number") return res.status(403).json({
        status: false,
        message: "La edad debe de ser un número"
    });

    try {
        const prisma = DBClient.instance;
        let user;
        let userUpdated: User;

        if (!new_username) {
            user = Prisma.validator<Prisma.UserUpdateInput>()({ age });

            userUpdated = await prisma.user.update({
                where: { username },
                data: user
            });
        } else {
            user = Prisma.validator<Prisma.UserUpdateInput>()({
                username: new_username,
                age
            });

            userUpdated = await prisma.user.update({
                where: { username },
                data: user
            });
        }

        // Return response
        res.json({
            status: true,
            data: userUpdated
        });
    } catch (error) {
        const message = errorHandler(error);

        console.error(error);
        res.status(403).json({
            status: false,
            message
        });
    }
}

export async function deleteUser(
    req: Request,
    res: Response
): Promise<Response | void> {
    const { username } = req.params;
    const user = await getUserById(username);

    if (!user) return res.status(404).json({
        status: false,
        message: "El usuario no se encuentra registrado"
    });

    try {
        const prisma = DBClient.instance;
        await prisma.user.delete({ where: { username } });

        res.json({ status: true });
    } catch (error) {
        console.error(error);
        res.status(403).json({
            status: false,
            message: error
        });
    }
}

export async function getUserById(username: string): Promise<User | void> {
    try {
        const prisma = DBClient.instance;
        const requestedUser = await prisma.user.findUnique({
            where: { username }
        });

        // Close prisma connection
        prisma.$disconnect();

        if (!requestedUser) return;

        return requestedUser;
    } catch (error) {
        console.error(error);
    }
}