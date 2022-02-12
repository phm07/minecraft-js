// https://stackoverflow.com/a/42919752/6235228

class PriorityQueue<T> {

    private readonly heap: T[];
    private readonly isGreater: (i: number, j: number) => boolean;

    public constructor(comparator = (a: T, b: T): boolean => a > b) {
        this.heap = [];
        this.isGreater = (i, j): boolean => comparator(this.heap[i], this.heap[j]);
    }

    public size(): number {
        return this.heap.length;
    }

    public isEmpty(): boolean {
        return this.size() === 0;
    }

    public top(): T {
        return this.heap[0];
    }

    public push(...values: T[]): number {

        values.forEach((value) => {
            this.heap.push(value);
            this.siftUp();
        });

        return this.size();
    }

    public pop(): T {

        const value = this.top();
        const bottom = this.size() - 1;
        this.swap(0, bottom);
        this.heap.pop();
        this.siftDown();
        return value;
    }

    private swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    private siftUp(): void {

        let node = this.size() - 1, parent = (node + 1 >>> 1) - 1;

        while (node > 0 && this.isGreater(node, parent)) {
            this.swap(node, parent);
            node = parent;
            parent = (node + 1 >>> 1) - 1;
        }
    }

    private siftDown(): void {

        let node = 0, left = 1, right = 2;

        while (left < this.size() && this.isGreater(left, node)
            || right < this.size() && this.isGreater(right, node)) {

            const maxChild = right < this.size() && this.isGreater(right, left) ? right : left;
            this.swap(node, maxChild);

            node = maxChild;
            left = (node << 1) + 1;
            right = node + 1 << 1;
        }
    }
}

export default PriorityQueue;