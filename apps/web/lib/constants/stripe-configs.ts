type Limits = {
    maxActiveIDESessions: number;
    maxIDESessionStorage: number; // in gb
    maxIDESessionLength: number; // in hours
    maxProjects: number;
}

type Plan = {
    name: string;
    description?: string;
    lookup_key: string;
    price: number;
    limits: Limits;
}

export const PLAN_LIMITS: Record<string, Limits> = {
    free: {
        maxActiveIDESessions: 1,
        maxIDESessionStorage: 10,
        maxIDESessionLength: 4,
        maxProjects: 10,
    },
    plus_subscription: {
        maxActiveIDESessions: 3,
        maxIDESessionStorage: 20,
        maxIDESessionLength: 12,
        maxProjects: 100, // Basically infinity
    }
}

export const Plans: Plan[] = [
    {
        name: "Plus",
        description: "For students who want more resources and features.",
        lookup_key: "plus_subscription",
        price: 1000,
        limits: PLAN_LIMITS.plus_subscription,
    }
]