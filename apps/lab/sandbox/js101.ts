const user = { name: "Susy", roles: ["admin", "editor"] };

function hasRole(u: { roles: string[] }, role: string) {
    return u.roles.includes(role);
}

async function main() {
    console.log("has admin?", hasRole(user, "admin"));

    const maybeCity = (user as any).address?.city ?? "Unknown";
    console.log("city:", maybeCity);
}

main();