import {ChangeItemCountInCart} from '@/schemas/ChangeItemCountInCart';
import prisma from '@/server';
import {authGuard} from '@/server/utils/auth';
import {Role} from '@prisma/client';
import {NextRequest, NextResponse} from 'next/server';

export const POST = authGuard(
  async (request: NextRequest, {id, ...authData}) => {
    const payload: ChangeItemCountInCart = await request.json();

    const itemInCart = authData.cart.find((item) => item.id === payload.itemId);

    if (itemInCart) {
      itemInCart.count += payload.count;
      if (itemInCart.count === 0) {
        authData.cart = authData.cart.filter((item) => item.id !== payload.itemId);
      }
    } else {
      const item = await prisma.item.findUnique({
        where: {
          id: payload.itemId,
        },
      });

      if (!item) {
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

      authData.cart.push({...item, count: 1});
    }

    await prisma.user.update({
      where: {
        id: id,
      },
      data: authData,
    });
    return NextResponse.json(
      {
        ...authData,
      },
      {
        status: 200,
      }
    );
  },
  [Role.CLIENT]
);
