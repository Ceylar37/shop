import {Item} from '@prisma/client';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {apiClient} from './_base.config';

const baseURL = '/item';

const ITEMS_KEY = 'items';
const ITEM_KEY = 'item';

export const useItemsListQuery = (params?: {take?: number; skip?: number; search?: string}) => {
  const {take = 100, skip = 0, search} = params || {};

  return useQuery({
    queryKey: [ITEMS_KEY, {take, skip, search}],
    queryFn: () => apiClient.get<Item[]>(`${baseURL}/list?take=${take}&skip=${skip}&search=${search}`),
  });
};

export const useItemQuery = (id?: string) =>
  useQuery({
    queryKey: [ITEM_KEY, id],
    queryFn: () => apiClient.get<Item>(`${baseURL}?id=${id}`),
  });

export const useAddItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Item, 'id'>) => apiClient.post<Item>(`${baseURL}/add`, {body: payload}),
    onSuccess: () => queryClient.invalidateQueries(ITEMS_KEY),
  });
};

export const useEditItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, ...payload}: Item) => apiClient.post<Item>(`${baseURL}/edit?id=${id}`, {body: payload}),
    onSuccess: (data) => {
      queryClient.invalidateQueries(ITEMS_KEY);
      queryClient.invalidateQueries([ITEM_KEY, data.id]);
    },
  });
};
