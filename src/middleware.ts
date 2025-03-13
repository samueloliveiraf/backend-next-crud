import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";  // Use a função do 'jose' para verificar o token

const SECRET_KEY = process.env.JWT_SECRET;

export async function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    return NextResponse.next();
  } catch (error) {
    console.error("Erro na verificação do token:", error);
    return NextResponse.json({ error: "Token inválido" }, { status: 403 });
  }
}

// Aplica o middleware apenas às rotas protegidas
export const config = {
  matcher: ["/api/users/:path*"],
};
