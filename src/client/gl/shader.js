class Shader {

    constructor(vertexShaderSource, fragmentShaderSource) {
        this.program = Shader.#createProgram(vertexShaderSource, fragmentShaderSource);
    }

    static #createProgram(vertexShaderSource, fragmentShaderSource) {

        const program = GL.createProgram();
        const vertexShader = Shader.#createShader(program, GL.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = Shader.#createShader(program, GL.FRAGMENT_SHADER, fragmentShaderSource);
        GL.linkProgram(program);
        Shader.#deleteShader(program, vertexShader);
        Shader.#deleteShader(program, fragmentShader);
        return program;
    }

    static #createShader(program, type, source) {

        const shader = GL.createShader(type);
        GL.shaderSource(shader, source);
        GL.compileShader(shader);

        const log = GL.getShaderInfoLog(shader);
        if(log !== "") {
            console.error((type === GL.VERTEX_SHADER ? "Vertex" : "Fragment") + " Shader Error Log:");
            console.error(log);
        }

        GL.attachShader(program, shader);
        return shader;
    }

    static #deleteShader(program, shader) {
        GL.detachShader(program, shader);
        GL.deleteShader(shader);
    }

    getUniform(uniform, type) {
        const location = GL.getUniformLocation(this.program, uniform);
        return {
            set(value) {
                GL["uniform" + type](location, false, value);
            }
        };
    }

    delete() {
        GL.deleteProgram(this.program);
    }

    bind() {
        GL.useProgram(this.program);
    }

    unbind() {
        GL.useProgram(0);
    }
}

export default Shader;