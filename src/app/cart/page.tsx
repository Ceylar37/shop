'use client';

import {useAuthContext} from '@/client/components/AuthProvider';
import {useChangeItemMutation} from '@/client/services/cart';
import {Button, Col, Image, List, Typography} from 'antd';
import Link from 'next/link';
import {useCallback, useRef} from 'react';
import {match} from 'ts-pattern';

export default function Cart() {
  const authData = useAuthContext();
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

  const getContent = (mutatingItemId?: string) => {
    return (
      <List
        itemLayout="vertical"
        size="large"
        dataSource={authData.cart}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            extra={<Image src={item.image} alt={item.name} height={200} />}
            actions={[
              <Button key="-" onClick={() => removeItem(item.id)} disabled={mutatingItemId === item.id}>
                -
              </Button>,
              <Typography.Text key="count">{item.count}</Typography.Text>,
              <Button key="+" onClick={() => addItem(item.id)} disabled={mutatingItemId === item.id}>
                +
              </Button>,
            ]}>
            <Link href={`/item/${item.id}`}>
              <h2>{item.name}</h2>
              <h3>{item.description}</h3>
              <h4>{item.cost}₽</h4>
            </Link>
          </List.Item>
        )}
      />
    );
  };

  return (
    <Col style={{padding: 20}}>
      {match({...authData, isLoading: changeCartItem.isLoading})
        .with({isLoading: true}, () => getContent(mutatingItemId.current))
        .otherwise(() => getContent())}
      <h2>
        {authData.cart.length
          ? `Сумма: ${authData.cart.reduce((acc, item) => acc + Number(item.cost) * item.count, 0)}₽`
          : ''}
      </h2>
    </Col>
  );
}
