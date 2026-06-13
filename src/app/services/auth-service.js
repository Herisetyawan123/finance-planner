const USERS_KEY = "finance_planner_users";

export const authService = {
    register: async (name, email, password) => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const users = JSON.parse(
        localStorage.getItem(USERS_KEY) || "[]"
        );

        if (users.some((u) => u.email === email)) {
        throw new Error("Email sudah terdaftar");
        }

        const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        return {
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
            token: `dummy-token-${newUser.id}`,
        };
    },
    login: async (email, password) => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const users = JSON.parse(
        localStorage.getItem(USERS_KEY) || "[]"
        );

        const user = users.find(
        (u) =>
            u.email === email &&
            u.password === password
        );
        console.log("Login attempt for email:", email);
        console.log("Found user:", user);
        console.log("All users in system:", users);
        if (!user) {
        throw new Error("Email atau password salah");
        }

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token: `dummy-token-${user.id}`,
        };
    },
};