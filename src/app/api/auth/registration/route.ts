import {LoginData} from '@/schemas/LoginData';
import prisma from '@/server';
import {createToken} from '@/server/utils';
import {Role} from '@prisma/client';
import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  const payload: LoginData = await request.json();

  const user = await prisma.user.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (user) {
    return NextResponse.json(
      {message: 'User already exists', status: 400},
      {
        status: 400,
      }
    );
  }

  const {
    password,
    token: emptyToken,
    ...userData
  } = await prisma.user.create({
    data: {
      ...payload,
      role: Role.CLIENT,
      cart: [],
    },
  });

  const token = createToken(userData);

  await prisma.user.update({
    where: {
      name: userData.name,
    },
    data: {
      token,
    },
  });

  const response = NextResponse.json(
    {
      ...userData,
    },
    {status: 200}
  );

  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 2,
  });

  return response;
}
