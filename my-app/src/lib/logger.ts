export const logger = {
    error: (...args: any[]) => {
        if (process.env.NODE_ENV === 'development') {
            console.error(...args);
        }
        // In Production werden Fehler bereits durch Sentry erfasst
    },
    warn: (...args: any[]) => {
        if (process.env.NODE_ENV === 'development') {
            console.warn(...args);
        }
    },
    info: (...args: any[]) => {
        if (process.env.NODE_ENV === 'development') {
            console.info(...args);
        }
    },
    log: (...args: any[]) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(...args);
        }
    },
};
