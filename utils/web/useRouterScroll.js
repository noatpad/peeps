import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useRouterScroll = () => {
  const router = useRouter();

  useEffect(() => {
    const handler = () => { window.scrollTo(0, 0) };
    router.events.on('routeChangeComplete', handler);
    return () => { router.events.off('routerChangeComplete', handler) }
  });
}

export default useRouterScroll;
