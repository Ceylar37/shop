'use client';
import {useLoginMutation, useRegisterMutation} from '@/client/services/auth';
import {LoginData} from '@/schemas/LoginData';
import {Button, Form, Input, Layout} from 'antd';
import {FC, useState} from 'react';
import {P, match} from 'ts-pattern';
import Loader from '../Loader';

const Login: FC = () => {
  const login = useLoginMutation();
  const register = useRegisterMutation();

  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string>();

  const onSubmit = async (data: LoginData) => {
    try {
      if (isRegister) {
        await register.mutateAsync(data);
      } else {
        await login.mutateAsync(data);
      }
    } catch (e) {
      setError((e as {message: string}).message);
    }
  };

  const getContent = (errorMessage?: string) => (
    <Layout style={{height: '100vh'}}>
      <Form style={{margin: 'auto', width: 400, display: 'flex', flexDirection: 'column', gap: 10}} onFinish={onSubmit}>
        <h1>{isRegister ? 'Регистрация' : 'Вход'}</h1>
        <Form.Item<LoginData> label="Логин" name="name">
          <Input />
        </Form.Item>
        <Form.Item<LoginData> label="Пароль" name="password">
          <Input.Password />
        </Form.Item>
        <Button
          style={{
            textAlign: 'start',
          }}
          type="link"
          onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Войти' : 'Зарегистрироваться'}
        </Button>
        <Button type="primary" htmlType="submit">
          Войти
        </Button>
        <div>{errorMessage}</div>
      </Form>
    </Layout>
  );

  return match({isLoading: login.isLoading || register.isLoading, error})
    .with({isLoading: true}, () => (
      <>
        <Loader />
        {getContent()}
      </>
    ))
    .with({error: 'User already exists'}, () => getContent('Пользователь с таким логином уже существует'))
    .with({error: P.string}, () => getContent('Неверный логин или пароль'))
    .otherwise(() => getContent());
};

export default Login;
