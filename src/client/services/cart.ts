import {ChangeItemCountInCart} from '@/schemas/ChangeItemCountInCart';
import {User} from '@prisma/client';
import {useMutation, useQueryClient} from 'react-query';
import {apiClient} from './_base.config';
import {INFO_KEY} from './auth';

const baseURL = '/cart';

export const useChangeItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangeItemCountInCart) => {
      return apiClient.post<User>(`${baseURL}/change`, {body: payload});
    },
    onSuccess: () => queryClient.invalidateQueries(INFO_KEY),
  });
};
