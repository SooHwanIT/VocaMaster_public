import { useEffect, useRef, useState } from 'react';

export const useDelayedPending = (
    pending: boolean,
    delayMs = 180,
    minVisibleMs = 380
) => {
    const [visible, setVisible] = useState(false);
    const shownAtRef = useRef<number | null>(null);
    const delayTimerRef = useRef<number | null>(null);
    const hideTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (delayTimerRef.current) {
            window.clearTimeout(delayTimerRef.current);
            delayTimerRef.current = null;
        }
        if (hideTimerRef.current) {
            window.clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }

        if (pending) {
            delayTimerRef.current = window.setTimeout(() => {
                shownAtRef.current = Date.now();
                setVisible(true);
            }, delayMs);
            return;
        }

        if (!visible) return;

        const shownAt = shownAtRef.current ?? Date.now();
        const elapsed = Date.now() - shownAt;
        const remaining = Math.max(0, minVisibleMs - elapsed);
        hideTimerRef.current = window.setTimeout(() => {
            setVisible(false);
            shownAtRef.current = null;
        }, remaining);
    }, [delayMs, minVisibleMs, pending, visible]);

    useEffect(() => {
        return () => {
            if (delayTimerRef.current) window.clearTimeout(delayTimerRef.current);
            if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
        };
    }, []);

    return visible;
};

export default useDelayedPending;