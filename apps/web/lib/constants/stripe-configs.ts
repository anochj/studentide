type Limits = {
    maxActiveIDESessions: number;
    maxIDESessionStorage: number; // in gb
    maxIDESessionLength: number; // in hours
    maxProjects: number;
}

type Plan = {
    name: string;
    description?: string;
    lookupKey: string;
    price: number;
    limits: Limits;
}

export const PLAN_LIMITS: Record<string, Limits> = {
    free: {
        maxActiveIDESessions: 1,
        maxIDESessionStorage: 10,
        maxIDESessionLength: 1,
        maxProjects: 20,
    },
    plus_subscription: {
        maxActiveIDESessions: 3,
        maxIDESessionStorage: 20,
        maxIDESessionLength: 3,
        maxProjects: 1000, // Basically infinity
    }
}

export const Plans: Plan[] = [
    {
        name: "Plus",
        description: "For those who need more flexibility.",
        lookupKey: "plus_subscription",
        price: 1000,
        limits: PLAN_LIMITS.plus_subscription,
    }
]