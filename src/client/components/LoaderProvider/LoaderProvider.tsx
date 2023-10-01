import {PropsWithChildren, RefObject, createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {v4} from 'uuid';
import Loader from '../Loader';

interface LoaderData {
  addLoader: () => string;
  removeLoader: (loaderId: string) => void;
  mainRef: RefObject<HTMLDivElement>;
}

const LoaderContext = createContext<LoaderData>({} as LoaderData);

const LoaderProvider = ({children}: PropsWithChildren) => {
  const ref = useRef<HTMLDivElement>(null);
  const [loaders, setLoaders] = useState<string[]>([]);

  const addLoader = useCallback(() => {
    const id = v4();
    setLoaders((_loaders) => [..._loaders, id]);
    return id;
  }, []);

  const removeLoader = useCallback((loaderId: string) => {
    setLoaders((_loaders) => _loaders.filter((_loaderId) => _loaderId !== loaderId));
  }, []);

  return (
    <main ref={ref}>
      <LoaderContext.Provider
        value={{
          addLoader,
          removeLoader,
          mainRef: ref,
        }}>
        {children}
        {loaders.length !== 0 && <Loader />}
      </LoaderContext.Provider>
    </main>
  );
};

export const useLoaderContext = () => useContext(LoaderContext);
export const useLoader = (isLoading: boolean) => {
  const {addLoader, removeLoader} = useLoaderContext();

  useEffect(() => {
    const id = addLoader();

    return () => {
      removeLoader(id);
    };
  }, [addLoader, isLoading, removeLoader]);
};

export default LoaderProvider;
