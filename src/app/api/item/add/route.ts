import {ItemData} from '@/schemas/ItemData';
import prisma from '@/server';
import {authGuard} from '@/server/utils/auth';
import {Role} from '@prisma/client';
import {NextResponse} from 'next/server';

export const POST = authGuard(
  async (request: Request) => {
    const payload: ItemData = await request.json();

    const newItem = await prisma.item.create({data: payload});

    return NextResponse.json(
      {
        ...newItem,
      },
      {
        status: 200,
      }
    );
  },
  [Role.ADMIN]
);
