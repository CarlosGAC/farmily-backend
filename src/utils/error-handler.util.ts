import { Prisma } from "@prisma/client";

export function errorHandler(error: unknown) {
    let message = "Sucedió un error en la validación";

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == "P2002") {
            message = `El nombre de usuario ya se encuentra registrado`;
        }

        if (error.code == "P2025") {
            message = "El registro a actualizar no existe";
        }
    }

    return message;
}