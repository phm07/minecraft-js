import Util from "./Util";

class Interpolator {

    private readonly animators: { [index: string]: { from: number, to: number, start: number, end: number } };
    private time: number;

    public constructor(values: { [index: string]: number }) {

        this.animators = {};
        for (const index in values) {
            this.animators[index] = { from: values[index], to: values[index], start: 0, end: 0 };
        }

        this.time = 0;
    }

    public getValue(index: string): number {
        const animator = this.animators[index];
        if (!animator) {
            return 0;
        }
        return Util.map(this.time, animator.start, animator.end, animator.from, animator.to);
    }

    public animate(index: string, target: number, duration: number): void {
        this.animators[index] = {
            from: this.getValue(index),
            to: target,
            start: this.time,
            end: this.time + duration
        };
    }

    public update(delta: number): void {
        this.time += delta;
    }
}

export default Interpolator;