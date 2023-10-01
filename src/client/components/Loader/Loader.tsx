import {createPortal} from 'react-dom';
import {P, match} from 'ts-pattern';
import {useLoaderContext} from '../LoaderProvider';
import styles from './Loader.module.css';

const Loader = ({inline = false}: {inline?: boolean}) => {
  const {mainRef} = useLoaderContext();

  return match({inline, currentRef: mainRef.current})
    .with({inline: true}, () => (
      <div className={styles.loader}>
        <div></div>
      </div>
    ))
    .with({inline: false, currentRef: P.not(null)}, ({currentRef}) =>
      createPortal(
        <div className={styles.loader + ' ' + styles.fullScreen}>
          <div></div>
        </div>,
        currentRef
      )
    )
    .otherwise(() => null);
};

export default Loader;
