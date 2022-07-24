class ImageUtils {

    private readonly canvas: HTMLCanvasElement;
    private readonly context?: CanvasRenderingContext2D;
    private imageData?: Uint8ClampedArray;
    public width: number;
    public height: number;

    public constructor(image: ImageData, width = image.width, height = image.height, offX = 0, offY = 0) {

        this.width = width;
        this.height = height;

        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;

        this.context = this.canvas.getContext("2d") ?? undefined;
        this.context?.putImageData(image, -offX, -offY, 0, 0, image.width, image.height);
    }

    public static async fromSource(source: string): Promise<ImageData> {

        const image = await new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.addEventListener("load", () => {
                resolve(img);
            });
            img.src = source;
        });

        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d");
        context?.drawImage(image, 0, 0);

        return new ImageData(
            context?.getImageData(0, 0, canvas.width, canvas.height).data
            ?? new Uint8ClampedArray(canvas.width * canvas.height),
            canvas.width, canvas.height
        );
    }

    public updateImageData(): void {
        this.imageData = this.context?.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    }

    public pixelAt(x: number, y: number): number {

        if (!this.imageData) return 0;

        const index = (x + y * this.canvas.width) * 4;

        return (this.imageData[index] << 24
                | this.imageData[index + 1] << 16
                | this.imageData[index + 2] << 8
                | this.imageData[index + 3]) >>> 0;
    }

    public setPixel(x: number, y: number, rgba: number): void {

        const data = new Uint8ClampedArray(4);
        data[0] = (rgba & 0xff << 24) >>> 24;
        data[1] = (rgba & 0xff << 16) >>> 16;
        data[2] = (rgba & 0xff << 8) >>> 8;
        data[3] = rgba & 0xff;
        this.context?.putImageData(new ImageData(data, 1, 1), x, y);
    }

    public getData(): ImageData {
        return new ImageData(
            this.context?.getImageData(0, 0, this.width, this.height).data
                ?? new Uint8ClampedArray(this.width * this.height),
            this.width, this.height
        );
    }

    public toBase64(): string {
        return this.canvas.toDataURL();
    }
}

export default ImageUtils;