import {LoginData} from '@/schemas/LoginData';
import {User} from '@prisma/client';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {apiClient} from './_base.config';

const baseURL = '/auth';

export const INFO_KEY = 'info';

export const useInfoQuery = () =>
  useQuery({
    queryKey: [INFO_KEY],
    queryFn: () => apiClient.get<Omit<User, 'password'>>(`${baseURL}/info`),
  });

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginData) => apiClient.post<User>(`${baseURL}/login`, {body: payload}),
    onSuccess: () => queryClient.invalidateQueries(INFO_KEY),
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginData) => apiClient.post<User>(`${baseURL}/registration`, {body: payload}),
    onSuccess: () => queryClient.invalidateQueries(INFO_KEY),
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.post<User>(`${baseURL}/logout`),
    onSuccess: () => queryClient.invalidateQueries(INFO_KEY),
  });
};
