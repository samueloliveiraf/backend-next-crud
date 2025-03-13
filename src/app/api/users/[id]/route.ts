import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Atualizar um usuário (PUT)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, email, password } = await req.json();
    const { id } = params;

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Se houver senha nova, criptografa antes de salvar
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
  }
}

// Deletar um usuário (DELETE)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Deletar usuário
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "Usuário deletado com sucesso" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar usuário" }, { status: 500 });
  }
}
