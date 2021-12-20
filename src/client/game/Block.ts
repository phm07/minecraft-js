type UV = { all?: number[], sides?: number[], top?: number[], bottom?: number[] };

class Block {

    private readonly id: number;
    public readonly uvs: number[][];

    public static readonly BLOCKS: {[index: number]: Block} = [];

    public static readonly DIRT = new Block(1, { all: [0, 0] });
    public static readonly GRASS = new Block(2, { sides: [1, 0], top: [2, 0], bottom: [0, 0] });
    public static readonly STONE = new Block(3, { all: [3, 0] });

    public constructor(id: number, uvs: UV) {
        Block.BLOCKS[id] = this;
        this.id = id;
        this.uvs = Block.toUvArray(uvs);
    }

    public static ofId(id: number): Block {
        return Block.BLOCKS[id];
    }

    public static toUvArray(uvs: UV): number[][] {

        let front, back, top, bottom, right, left;
        if(uvs.all) {
            front = back = top = bottom = right = left = uvs.all;
        }
        if(uvs.sides) {
            front = back = right = left = uvs.sides;
        }
        if(uvs.top) {
            top = uvs.top;
        }
        if(uvs.bottom) {
            bottom = uvs.bottom;
        }

        const uvArray = [];
        const texCoords = [0, 1, 1, 1, 1, 0, 0, 0];

        for(const side of [front, back, top, bottom, right, left]) {
            if(!side) continue;
            const depth = side[0] + side[1] * 16;
            for(let i = 0; i < 4; i++) {
                uvArray.push([texCoords[i*2], texCoords[i*2+1], depth]);
            }
        }
        return uvArray;
    }
}

export default Block;