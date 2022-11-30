import { Prisma, User } from "@prisma/client";
import { Request, Response } from "express";
import DBClient from "../database/client.database";
import { errorHandler } from "../utils/error-handler.util";
import bcrypt from "bcrypt"
import { getHashedPassword } from "../utils/password.util";

export async function getUser(
    req: Request,
    res: Response
): Promise<Response | void> {
    const { username } = req.params;
    const user = await getUserByUsername(username);

    if (!user) return res.status(403).json({
        status: false,
        message: "El usuario solicitado no existe"
    });

    const { password, ...userWithoutPassword } = user;

    res.json({ ...userWithoutPassword });
}

export async function getUsers(
    req: Request,
    res: Response
): Promise<Response | void> {
    const prisma = DBClient.instance;
    const usersCount = await prisma.user.count();
    const users = await prisma.user.findMany({
        select: {
            userId: true,
            username: true,
            password: false,
            age: true,
            userLevel: true,
            levelProgress: true
        }
    });

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
    let { password } = req.body;

    if (typeof (age) != "number") return res.status(403).json({
        status: false,
        message: "La edad debe de ser un número"
    });

    try {
        password = await getHashedPassword(password);

        const prisma = DBClient.instance;
        const user = Prisma.validator<Prisma.UserCreateInput>()({
            username,
            password,
            age
        });

        // Create user process
        const createdUser = await prisma.user.create({ data: user });

        // Return response
        res.json({
            status: true,
            data: {
                userId: createdUser.userId,
                username: createdUser.username,
                userLevel: createdUser.userLevel,
                levelProgress: createdUser.levelProgress
            }
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
    const { password, age, userLevel, levelProgress, newUsername } = req.body;

    if (typeof (age) != "number") return res.status(403).json({
        status: false,
        message: "La edad debe de ser un número"
    });

    try {
        const prisma = DBClient.instance;
        let user;
        let userUpdated: User;

        if (!newUsername) {
            user = Prisma.validator<Prisma.UserUpdateInput>()({
                password,
                age,
                userLevel,
                levelProgress
            });

            userUpdated = await prisma.user.update({
                where: { username },
                data: user
            });
        } else {
            user = Prisma.validator<Prisma.UserUpdateInput>()({
                username: newUsername,
                password,
                age,
                userLevel,
                levelProgress
            });

            userUpdated = await prisma.user.update({
                where: { username },
                data: user
            });
        }

        const { password: pass, ...userUpdatedWithoutPassword } = userUpdated;

        // Return response
        res.json({
            status: true,
            data: userUpdatedWithoutPassword
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
    const user = await getUserByUsername(username);

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

export async function getUserByUsername(username: string): Promise<User | void> {
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

export async function getUserById(userId: number): Promise<User | void> {
    try {
        const prisma = DBClient.instance;
        const requestedUser = await prisma.user.findUnique({
            where: { userId }
        });

        // Close prisma connection
        prisma.$disconnect();

        if (!requestedUser) return;

        return requestedUser;
    } catch (error) {
        console.error(error);
    }
}

export async function loginUser(
    req: Request,
    res: Response
): Promise<Response | void> {
    const { username, password } = req.body;

    try {
        const user = await getUserByUsername(username);

        if (!user) return res.status(403).json({
            status: false,
            message: "El usuario no existe"
        });

        const validPassword = user != null ? await bcrypt.compare(password, user.password || "") : false;

        if (validPassword) {
            const { password: pass, age, ...userWithoutPassword } = user;

            return res.json({
                status: true,
                data: userWithoutPassword
            });
        } else {
            return res.status(403).json({
                status: false,
                message: "El username y/o contraseña son inválidos."
            });
        }
    } catch (error) {
        console.error(error);

        return res.json({ error });
    }
}