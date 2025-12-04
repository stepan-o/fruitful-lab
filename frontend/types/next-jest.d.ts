// frontend/types/next-jest.d.ts

declare module "next/jest.js" {
    import type { Config } from "jest";

    type NextJestConfigOptions = {
        dir?: string;
    };

    // next/jest returns a function that takes a Jest config
    // and returns a transformed config.
    export default function nextJest(
        options: NextJestConfigOptions
    ): (config: Config) => Config;
}
