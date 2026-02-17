/// <reference types="vite/client" />

interface Document {
    startViewTransition(callback: () => Promise<void> | void): {
        finished: Promise<void>;
        ready: Promise<void>;
        updateCallbackDone: Promise<void>;
        skipTransition: () => void;
    };
}
