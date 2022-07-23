import MathUtils from "common/math/MathUtils";

class Interpolator {

    private readonly animators: Record<string, { from: number, to: number, start: number, end: number } | undefined>;
    private time: number;

    public constructor(values: Record<string, number>) {

        this.animators = {};
        Object.entries(values).forEach(([index, value]) => {
            this.animators[index] = { from: value, to: value, start: 0, end: 0 };
        });

        this.time = 0;
    }

    public getValue(index: string): number {
        const animator = this.animators[index];
        if (!animator) {
            return 0;
        }
        return MathUtils.map(this.time, animator.start, animator.end, animator.from, animator.to);
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