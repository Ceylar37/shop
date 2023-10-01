'use client';
import {useLogoutMutation} from '@/client/services/auth';
import {Role} from '@prisma/client';
import {Button, Layout, Menu, Row} from 'antd';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {FC, useMemo} from 'react';
import {match} from 'ts-pattern';
import {useAuthContext} from '../AuthProvider';
import Loader from '../Loader';

interface Nav {
  path: string;
  title: string;
}

const baseNavs: Nav[] = [
  {
    path: '/',
    title: 'Главная',
  },
];

const navs: Record<string, Nav[]> = {
  [Role.ADMIN]: [
    ...baseNavs,
    {
      path: '/item/new',
      title: 'Новый товар',
    },
  ],
  [Role.CLIENT]: [
    ...baseNavs,
    {
      path: '/cart',
      title: 'Корзина',
    },
  ],
};

const Header: FC = () => {
  const logout = useLogoutMutation();

  const pathname = usePathname();
  const {role} = useAuthContext();

  const currentNavs = useMemo(() => navs[role], [role]);

  const logoutHandler = () => {
    logout.mutateAsync();
  };

  const content = (
    <Layout.Header>
      <Row align="middle" justify="space-between">
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[pathname]}
          items={currentNavs.map((nav) => ({
            key: nav.path,
            label: <Link href={nav.path}>{nav.title}</Link>,
          }))}
        />
        <Button type="primary" onClick={logoutHandler}>
          Выйти
        </Button>
      </Row>
    </Layout.Header>
  );

  return match(logout)
    .with({isLoading: true}, () => (
      <>
        <Loader />
        {content}
      </>
    ))
    .otherwise(() => content);
};

export default Header;
