declare module "*.vs" {
    const content: string;
    export default content;
}

declare module "*.fs" {
    const content: string;
    export default content;
}

declare module "*.png" {
    const url: string;
    export default url;
}

declare module "seeded-rand" {
    export default class Random {
        static seed(seed: any): void;
        static random(): number;
    }
}