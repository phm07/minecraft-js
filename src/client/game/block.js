class Block {

    static BLOCKS = {};
    static DIRT = new Block(1, { all: [0, 0] });
    static GRASS = new Block(2, { sides: [1, 0], top: [2, 0], bottom: [0, 0] });
    static STONE = new Block(3, { all: [3, 0] });

    constructor(id, uvs) {
        Block.BLOCKS[id] = this;
        this.id = id;
        this.uvs = Block.toUvArray(uvs);
    }

    static ofId(id) {
        return Block.BLOCKS[id];
    }

    static toUvArray(uvs) {

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
        for(let side of [front, back, top, bottom, right, left]) {
            const depth = side[0] + side[1] * 16;
            for(let i = 0; i < 4; i++) {
                uvArray.push([texCoords[i*2], texCoords[i*2+1], depth]);
            }
        }
        return uvArray;
    }
}

export default Block;