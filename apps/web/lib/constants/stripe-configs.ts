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
        maxIDESessionStorage: 2,
        maxIDESessionLength: 2,
        maxProjects: 2,
    },
    plus_subscription: {
        maxActiveIDESessions: 3,
        maxIDESessionStorage: 10,
        maxIDESessionLength: 6,
        maxProjects: 5,
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