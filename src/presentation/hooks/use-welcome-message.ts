// Presentation: React hook to get the welcome message using DDD use case
import { useEffect, useState } from "react";

import { GetWelcomeMessage, WelcomeMessage } from "../../application/usecases/get-welcome-message";
import { MockUserRepository } from "../../infrastructure/repositories/user-repository";

export function useWelcomeMessage() {
    const [data, setData] = useState<WelcomeMessage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const repo = new MockUserRepository();
        const usecase = new GetWelcomeMessage(repo);
        usecase.execute().then((result) => {
            setData(result);
            setLoading(false);
        });
    }, []);

    return { data, loading };
}
