import Blocks from "./blocks";
import Perlin from "perlin-simplex"
import Random from "seeded-rand"

class WorldGenerator {

    constructor(seed=0) {
        Random.seed(seed);
        this.perlin = new Perlin(Random);
    }

    generateChunk(chunk) {

        for(let x = 0; x < 16; x++) {
            for(let z = 0; z < 16; z++) {

                const height = Math.floor(
                    (this.perlin.noise((chunk.x*16+x)/100, (chunk.z*16+z)/100)) * 16
                    + (this.perlin.noise((chunk.x*16+x)/50, (chunk.z*16+z)/50)) * 8
                    + (this.perlin.noise((chunk.x*16+x)/25, (chunk.z*16+z)/25)) * 4
                    + 48
                );

                for(let y = 0; y < height; y++) {
                    if(y === height-1) {
                        chunk.setBlockAt(x, y, z, Blocks.GRASS);
                    } else if(y >= height-4) {
                        chunk.setBlockAt(x, y, z, Blocks.DIRT);
                    } else {
                        chunk.setBlockAt(x, y, z, Blocks.STONE);
                    }
                }
            }
        }
    }

}

export default WorldGenerator;