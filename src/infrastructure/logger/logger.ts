// src/infrastructure/logger/logger.ts
// Simple logger utility for Mamba (infrastructure layer)
// Usage: import { logger } from '../../infrastructure/logger/logger';

export type LogLevel = "info" | "warn" | "error" | "debug";

export interface Logger {
    info: (message: string, ...args: unknown[]) => void;
    warn: (message: string, ...args: unknown[]) => void;
    error: (message: string, ...args: unknown[]) => void;
    debug: (message: string, ...args: unknown[]) => void;
}

export const logger: Logger = {
    info: (message, ...args) => {
        // In production, replace with a real logging service

        console.info(`[INFO] ${message}`, ...args);
    },
    warn: (message, ...args) => {
        console.warn(`[WARN] ${message}`, ...args);
    },
    error: (message, ...args) => {
        console.error(`[ERROR] ${message}`, ...args);
    },
    debug: (message, ...args) => {
        if (process.env.NODE_ENV !== "production") {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    },
};
