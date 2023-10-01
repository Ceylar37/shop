import {Item} from '@prisma/client';

export type ItemData = Omit<Item, 'id'>;
