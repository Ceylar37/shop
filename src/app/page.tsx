'use client';

import {useAuthContext} from '@/client/components/AuthProvider';
import Loader from '@/client/components/Loader';
import {useChangeItemMutation} from '@/client/services/cart';
import {useItemsListQuery} from '@/client/services/item';
import {Item, Role} from '@prisma/client';
import {useDebounce} from '@uidotdev/usehooks';
import {Button, Col, Image, Input, List, Typography} from 'antd';
import Link from 'next/link';
import {useCallback, useRef, useState} from 'react';
import {P, match} from 'ts-pattern';

export default function Home() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const items = useItemsListQuery({search: debouncedSearch});
  const changeCartItem = useChangeItemMutation();
  const mutatingItemId = useRef<string>('');

  const addItem = useCallback(
    (itemId: string) => {
      mutatingItemId.current = itemId;
      changeCartItem.mutateAsync({
        itemId,
        count: 1,
      });
    },
    [changeCartItem]
  );

  const removeItem = useCallback(
    (itemId: string) => {
      mutatingItemId.current = itemId;
      changeCartItem.mutateAsync({
        itemId,
        count: -1,
      });
    },
    [changeCartItem]
  );

  const authData = useAuthContext();

  const renderAdminItem = useCallback(
    (item: Item) => (
      <List.Item key={item.id} extra={<Image src={item.image} alt={item.name} height={200} />}>
        <Link href={`/item/${item.id}`}>
          <h2>{item.name}</h2>
          <h3>{item.description}</h3>
          <h4>{item.cost}₽</h4>
        </Link>
      </List.Item>
    ),
    []
  );

  const renderUserItem = useCallback(
    (item: Item, countInCart = 0, mutatedItemId?: string) => {
      const disabled = mutatedItemId === item.id;

      return (
        <List.Item
          key={item.id}
          extra={<Image src={item.image} alt={item.name} height={200} />}
          actions={
            countInCart === 0
              ? [
                  <Button key="add-to-cart" onClick={() => addItem(item.id)} disabled={disabled}>
                    В Корзину
                  </Button>,
                ]
              : [
                  <Button key="-" onClick={() => removeItem(item.id)} disabled={disabled}>
                    -
                  </Button>,
                  <Typography.Text key="count">{countInCart}</Typography.Text>,
                  <Button key="+" onClick={() => addItem(item.id)} disabled={disabled}>
                    +
                  </Button>,
                ]
          }>
          <Link href={`/item/${item.id}`}>
            <h2>{item.name}</h2>
            <h3>{item.description}</h3>
            <h4>{item.cost}₽</h4>
          </Link>
        </List.Item>
      );
    },
    [addItem, removeItem]
  );

  const renderItem = authData.role === Role.ADMIN ? renderAdminItem : renderUserItem;

  const content = match({items, changeCartItem})
    .with({items: {isLoading: true}}, () => (
      <List>
        <Loader inline />
      </List>
    ))
    .with({items: {data: P.not(undefined)}, changeCartItem: {isLoading: false}}, ({items: {data}}) => (
      <List
        itemLayout="vertical"
        size="large"
        dataSource={data}
        renderItem={(item) => renderItem(item, authData.cart.find((i) => i.id === item.id)?.count)}
      />
    ))
    .with({items: {data: P.not(undefined)}, changeCartItem: {isLoading: true}}, ({items: {data}}) => (
      <List
        itemLayout="vertical"
        size="large"
        dataSource={data}
        renderItem={(item) =>
          renderItem(item, authData.cart.find((i) => i.id === item.id)?.count, mutatingItemId.current)
        }
      />
    ))
    .otherwise(() => <h1>Неизвестная ошибка</h1>);

  return (
    <Col style={{padding: 20}}>
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск" style={{width: '100%'}} />
      {content}
    </Col>
  );
}
