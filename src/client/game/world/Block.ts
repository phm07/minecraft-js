import Material from "src/common/world/Material";

type UV = { all?: number[], sides?: number[], top?: number[], bottom?: number[] };

class Block {

    public static readonly BLOCKS: Record<number, Block | undefined> = [];
    public static readonly DIRT = new Block(Material.DIRT, { all: [0, 0] });
    public static readonly GRASS = new Block(Material.GRASS, { sides: [1, 0], top: [2, 0], bottom: [0, 0] });
    public static readonly STONE = new Block(Material.STONE, { all: [3, 0] });
    public static readonly BEDROCK = new Block(Material.BEDROCK, { all: [4, 0] }, false);

    public readonly id: number;
    public readonly uvs: number[][];
    public readonly breakable: boolean;

    public constructor(id: Material, uvs: UV, breakable = true) {
        Block.BLOCKS[id] = this;
        this.id = id;
        this.uvs = Block.toUvArray(uvs);
        this.breakable = breakable;
    }

    public static ofId(id: number): Block | undefined {
        return Block.BLOCKS[id];
    }

    public static toUvArray(uvs: UV): number[][] {

        let front, back, top, bottom, right, left;
        if (uvs.all) {
            front = back = top = bottom = right = left = uvs.all;
        }
        if (uvs.sides) {
            front = back = right = left = uvs.sides;
        }
        if (uvs.top) {
            top = uvs.top;
        }
        if (uvs.bottom) {
            bottom = uvs.bottom;
        }

        const uvArray = [];
        const texCoords = [0, 1, 1, 1, 1, 0, 0, 0];

        for (const side of [front, back, top, bottom, right, left]) {
            if (!side) continue;
            const depth = side[0] + side[1] * 16;
            for (let i = 0; i < 4; i++) {
                uvArray.push([texCoords[i * 2], texCoords[i * 2 + 1], depth]);
            }
        }
        return uvArray;
    }
}

export default Block;