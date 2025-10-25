
import { useState, useEffect, RefObject } from 'react';

interface IntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
}

export function useOnScreen(
  ref: RefObject<Element>,
  options: IntersectionObserverOptions = { threshold: 0.1, rootMargin: '0px' }
): boolean {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // isIntersectingがtrueになったら更新を停止
      if (entry.isIntersecting) {
        setIntersecting(true);
        // 一度表示されたら監視を停止することでパフォーマンスを向上
        if (ref.current) {
            observer.unobserve(ref.current);
        }
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, options.threshold, options.rootMargin]); // refは不変なのでdepsから除外

  return isIntersecting;
}
