class Shader {

    private readonly program: WebGLProgram | null;

    public constructor(vertexShaderSource: string, fragmentShaderSource: string) {
        this.program = Shader.createProgram(vertexShaderSource, fragmentShaderSource);
    }

    private static createProgram(vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram | null {

        const program = GL.createProgram();

        if (program === null) return null;

        const vertexShader = Shader.createShader(program, GL.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = Shader.createShader(program, GL.FRAGMENT_SHADER, fragmentShaderSource);
        GL.linkProgram(program);

        if (vertexShader) Shader.deleteShader(program, vertexShader);
        if (fragmentShader) Shader.deleteShader(program, fragmentShader);

        return program;
    }

    private static createShader(program: WebGLProgram, type: GLenum, source: string): WebGLProgram | null {

        const shader = GL.createShader(type);

        if (!shader) return null;

        GL.shaderSource(shader, source);
        GL.compileShader(shader);

        const log = GL.getShaderInfoLog(shader);
        if (log !== "") {
            console.error((type === GL.VERTEX_SHADER ? "Vertex" : "Fragment") + " Shader Error Log:");
            console.error(log);
        }

        GL.attachShader(program, shader);
        return shader;
    }

    private static deleteShader(program: WebGLProgram, shader: WebGLShader): void {
        GL.detachShader(program, shader);
        GL.deleteShader(shader);
    }

    public getUniformLocation(uniform: string): WebGLUniformLocation | null {

        if (!this.program) return null;
        return GL.getUniformLocation(this.program, uniform);
    }

    public delete(): void {
        GL.deleteProgram(this.program);
    }

    public bind(): void {
        GL.useProgram(this.program);
    }

    public unbind(): void {
        GL.useProgram(0);
    }
}

export default Shader;