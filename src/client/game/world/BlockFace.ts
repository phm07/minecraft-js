import Util from "../../../common/Util";
import Vec3 from "../../../common/Vec3";

class BlockFace {

    public static readonly NORTH = new BlockFace(new Vec3(0, 0, -1));
    public static readonly EAST = new BlockFace(new Vec3(1, 0, 0));
    public static readonly SOUTH = new BlockFace(new Vec3(0, 0, 1));
    public static readonly WEST = new BlockFace(new Vec3(-1, 0, 0));
    public static readonly TOP = new BlockFace(new Vec3(0, 1, 0));
    public static readonly BOTTOM = new BlockFace(new Vec3(0, -1, 0));
    public static readonly ALL = [BlockFace.NORTH, BlockFace.EAST, BlockFace.SOUTH, BlockFace.WEST, BlockFace.TOP, BlockFace.BOTTOM];

    public readonly dir: Vec3;

    private constructor(dir: Vec3) {
        this.dir = dir;
    }

    public static getNearestFace(position: Vec3): BlockFace {

        const x1 = Util.mod(position.x, 1) * 2 - 1;
        const y1 = Util.mod(position.y, 1) * 2 - 1;
        const z1 = Util.mod(position.z, 1) * 2 - 1;

        let nearestDist = Infinity;
        let nearestFace = BlockFace.NORTH;
        for (const face of BlockFace.ALL) {
            const { x, y, z } = face.dir;
            const dist = Util.dist3Square(x1, y1, z1, x, y, z);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestFace = face;
            }
        }

        return nearestFace;
    }
}

export default BlockFace;