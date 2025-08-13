import * as React from "react";
import { useTranslation } from "react-i18next";

import { HexagonBackground } from "./ui/shadcn-io/hexagon-background";
import { TypingText } from "./ui/shadcn-io/typing-text";
import { Progress } from "./ui/progress";

const loadingMessagesKeys = ["bootloader.loading"];

export function Bootloader({ onFinish }: { onFinish: () => void }) {
    const { t } = useTranslation();
    const [progress, setProgress] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [messageIndex, setMessageIndex] = React.useState(0);

    // Progress simulation
    React.useEffect(() => {
        if (!loading) return;
        if (progress >= 100) {
            setTimeout(() => {
                setLoading(false);
                onFinish();
            }, 500);
            return;
        }
        const timeout = setTimeout(
            () => {
                setProgress((p) => Math.min(100, p + Math.floor(Math.random() * 15) + 5));
            },
            Math.random() * 200 + 80,
        );
        return () => clearTimeout(timeout);
    }, [progress, loading, onFinish]);

    // Message cycling, independent of progress
    React.useEffect(() => {
        if (progress >= 100) return;
        const msgTimeout = setTimeout(() => {
            setMessageIndex((i) => (i + 1) % loadingMessagesKeys.length);
        }, 1400);
        return () => clearTimeout(msgTimeout);
    }, [messageIndex, progress]);

    return (
        <HexagonBackground className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-8">
                <TypingText
                    text={t("bootloader.title", "Mamba")}
                    duration={90}
                    cursor
                    className="text-6xl font-extrabold tracking-widest drop-shadow-lg mb-2"
                />
                <div className="w-80 mt-4">
                    <Progress value={progress} />
                </div>
                <div className="text-xs mt-4 animate-pulse tracking-widest drop-shadow-md">
                    {progress < 100 ? (
                        <TypingText
                            text={t(loadingMessagesKeys[messageIndex])}
                            duration={40}
                            className="font-mono"
                            animateOnChange={true}
                        />
                    ) : (
                        <span>{t("bootloader.ready", "Ready")}</span>
                    )}
                </div>
            </div>
        </HexagonBackground>
    );
}
