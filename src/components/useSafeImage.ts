'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface SafeImageTarget {
  src: string;
  srcSet?: string;
  sizes?: string;
}

interface SafeImageState<T> {
  shown: T | null;
  loading: T | null;
  failed: T | null;
  brokenSrc: string | null;
}

/**
 * Switches a visible `<img>` only after the next image finishes loading, so a failed fetch (such as switching months
 * while offline) keeps the already-loaded image and its matching label intact instead of changing the text without the
 * picture or replacing it with a broken icon. Returns the committed target, any pending target in flight, the target
 * that failed to load, and handlers for the visible `<img>` in case the initial image itself fails.
 */
export function useSafeImage<T extends SafeImageTarget>(target: T | null, attempt = 0) {
  const [state, setState] = useState<SafeImageState<T>>(() => ({
    shown: target,
    loading: null,
    failed: null,
    brokenSrc: null,
  }));

  const targetRef = useRef(target);
  const stateRef = useRef(state);
  useEffect(() => {
    targetRef.current = target;
    stateRef.current = state;
  });

  const targetSrc = target?.src ?? null;
  const targetSrcSet = target?.srcSet;
  const targetSizes = target?.sizes;

  useEffect(() => {
    const next = targetRef.current;
    const prev = stateRef.current;

    if (!next) {
      if (prev.shown !== null || prev.loading !== null || prev.failed !== null || prev.brokenSrc !== null) {
        setState({ shown: null, loading: null, failed: null, brokenSrc: null });
      }
      return;
    }

    if (prev.shown && next.src === prev.shown.src && next.srcSet === prev.shown.srcSet) {
      const broken = prev.brokenSrc === prev.shown.src;
      if (!broken) {
        if ((prev.failed && prev.failed.src !== prev.shown.src) || prev.loading) {
          setState((s) => ({ ...s, loading: null, failed: s.failed && s.shown && s.failed.src === s.shown.src ? s.failed : null }));
        }
        return;
      }
      if (attempt === 0 && prev.failed?.src === prev.shown.src) return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: next, failed: null }));

    const img = new Image();
    if (next.sizes) img.sizes = next.sizes;
    if (next.srcSet) img.srcset = next.srcSet;
    img.onload = () => {
      if (cancelled) return;
      setState({ shown: next, loading: null, failed: null, brokenSrc: null });
    };
    img.onerror = () => {
      if (cancelled) return;
      setState((s) => ({ ...s, loading: null, failed: next }));
    };
    img.src = next.src;

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [targetSrc, targetSrcSet, targetSizes, attempt]);

  const onShownLoad = useCallback(() => {
    setState((s) => {
      if (!s.shown) return s;
      const clearBroken = s.brokenSrc === s.shown.src;
      const clearFailed = s.failed?.src === s.shown.src;
      if (!clearBroken && !clearFailed) return s;
      return {
        ...s,
        brokenSrc: clearBroken ? null : s.brokenSrc,
        failed: clearFailed ? null : s.failed,
      };
    });
  }, []);

  const onShownError = useCallback(() => {
    setState((s) => (s.shown ? { ...s, brokenSrc: s.shown.src, failed: s.shown } : s));
  }, []);

  return {
    shown: state.shown,
    loading: state.loading,
    failed: state.failed,
    onShownLoad,
    onShownError,
  };
}
