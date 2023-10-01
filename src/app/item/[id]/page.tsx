'use client';

import {useAuthContext} from '@/client/components/AuthProvider';
import Loader from '@/client/components/Loader';
import Redirect from '@/client/components/Redirect';
import {useEditItemMutation, useItemQuery} from '@/client/services/item';
import {ItemData} from '@/schemas/ItemData';
import {Item, Role} from '@prisma/client';
import {Button, Form, Image, Input, Row} from 'antd';
import {P, match} from 'ts-pattern';

export default function Id({params}: {params: {id: string}}) {
  const authData = useAuthContext();
  const item = useItemQuery(params.id);
  const editItem = useEditItemMutation();

  const onSubmit = (data: ItemData) => {
    editItem.mutateAsync({id: params.id, ...data});
  };

  const getContent = (data?: Item, errorMessage?: string) => {
    return (
      <Row align="middle" style={{height: '100%'}}>
        <Form<ItemData>
          style={{margin: 'auto', width: 400, display: 'flex', flexDirection: 'column', gap: 10}}
          initialValues={data}
          onFinish={onSubmit}>
          <Form.Item<ItemData> label="Название" name="name" required={authData.role === Role.ADMIN}>
            <Input readOnly={authData.role === Role.CLIENT} />
          </Form.Item>
          <Form.Item<ItemData> label="Описание" name="description">
            <Input.TextArea readOnly={authData.role === Role.CLIENT} />
          </Form.Item>
          <Form.Item<ItemData> label="Цена" name="cost" required={authData.role === Role.ADMIN}>
            <Input readOnly={authData.role === Role.CLIENT} />
          </Form.Item>
          {authData.role === Role.ADMIN ? (
            <Form.Item<ItemData> label="Ссылка" name="image">
              <Input />
            </Form.Item>
          ) : (
            <Image src={data?.image} alt={data?.name} width={300} />
          )}
          {authData.role === Role.ADMIN && (
            <>
              <Button type="primary" htmlType="submit">
                Сохранить
              </Button>
              <div>{errorMessage}</div>
            </>
          )}
        </Form>
      </Row>
    );
  };

  return match({item, editItem})
    .with({item: {isLoading: true}}, () => (
      <>
        <Loader />
        {getContent()}
      </>
    ))
    .with({editItem: {data: P.not(undefined)}}, ({editItem: {data}}) => <Redirect to="/" />)
    .with({item: {data: P.not(undefined)}}, ({item: {data}}) => getContent(data))
    .otherwise(() => getContent());
}
