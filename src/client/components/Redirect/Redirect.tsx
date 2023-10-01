import {RedirectType, redirect} from 'next/navigation';
import {FC} from 'react';
import Loader from '../Loader';

interface RedirectProps {
  to: string;
  type?: RedirectType;
}

const Redirect: FC<RedirectProps> = ({to, type}) => {
  redirect(to, type);
  return <Loader />;
};

export default Redirect;
