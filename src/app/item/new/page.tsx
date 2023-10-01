'use client';

import Loader from '@/client/components/Loader';
import Redirect from '@/client/components/Redirect';
import {useAddItemMutation} from '@/client/services/item';
import {ItemData} from '@/schemas/ItemData';
import {Button, Form, Input, Row} from 'antd';
import {P, match} from 'ts-pattern';

export default function New() {
  const addItem = useAddItemMutation();

  const onSubmit = (data: ItemData) => {
    addItem.mutateAsync(data);
  };
  const getContent = (errorMessage?: string) => {
    return (
      <Row align="middle" style={{height: '100%'}}>
        <Form
          style={{margin: 'auto', width: 400, display: 'flex', flexDirection: 'column', gap: 10}}
          onFinish={onSubmit}>
          <Form.Item<ItemData> label="Название" name="name" required>
            <Input />
          </Form.Item>
          <Form.Item<ItemData> label="Описание" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item<ItemData> label="Цена" name="cost" required>
            <Input />
          </Form.Item>
          <Form.Item<ItemData> label="Ссылка" name="image" required>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
          <div>{errorMessage}</div>
        </Form>
      </Row>
    );
  };

  return match(addItem)
    .with({isLoading: true}, () => (
      <>
        <Loader />
        {getContent()}
      </>
    ))
    .with({data: P.not(undefined)}, ({data}) => <Redirect to="/" />)
    .otherwise(() => getContent());
}
