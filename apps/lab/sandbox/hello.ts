async function delay(ms: number): Promise<string> {
    return new Promise(((resolve) => {
        setTimeout(() => resolve(`waited ${ms}`), ms);
    }));
}

async function main() {
    console.log("start")

    const result = await (delay(300));
    console.log("after await:", result);

    console.log("end");
}

main().catch((err) => {
    console.error("error:", err);
    process.exit(1);
});
