import {ItemData} from '@/schemas/ItemData';
import prisma from '@/server';
import {authGuard} from '@/server/utils/auth';
import {Role} from '@prisma/client';
import {NextRequest, NextResponse} from 'next/server';

export const POST = authGuard(
  async (request: NextRequest) => {
    const id = request.nextUrl.searchParams.get('id') || '';
    const data: ItemData = await request.json();

    const prevItemData = await prisma.item.findFirst({where: {id}});

    if (!prevItemData) {
      return NextResponse.json(
        {
          message: 'Item not found',
          status: 404,
        },
        {
          status: 404,
        }
      );
    }

    const newItemData = await prisma.item.update({where: {id}, data});

    return NextResponse.json(
      {
        ...newItemData,
      },
      {
        status: 200,
      }
    );
  },
  [Role.ADMIN]
);
