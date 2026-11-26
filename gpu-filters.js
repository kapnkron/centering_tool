(function attachTraceLockGpuFilter(globalScope) {
  const FILTER_IDS = {
    normal: 0,
    contrast: 1,
    edges: 2,
    emboss: 3,
    invert: 4,
    redChannel: 5,
    blueChannel: 6,
    threshold: 7,
  };

  const VERTEX_SHADER_SOURCE = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const FRAGMENT_SHADER_SOURCE = `
    precision highp float;
    uniform sampler2D u_image;
    uniform vec2 u_texelSize;
    uniform int u_filter;
    uniform float u_strength;
    uniform int u_splitEnabled;
    uniform float u_splitX;
    varying vec2 v_uv;

    float luma(vec3 c) {
      return dot(c, vec3(0.2126, 0.7152, 0.0722));
    }

    float sampleLuma(vec2 offset) {
      vec2 coord = clamp(v_uv + offset * u_texelSize, vec2(0.0), vec2(1.0));
      return luma(texture2D(u_image, coord).rgb);
    }

    void main() {
      vec4 base = texture2D(u_image, v_uv);
      if (u_splitEnabled == 1 && v_uv.x < u_splitX) {
        gl_FragColor = base;
        return;
      }

      if (u_filter == 0) {
        gl_FragColor = base;
        return;
      }

      if (u_filter == 1 || u_filter == 4) {
        float g = luma(base.rgb);
        float contrast = 1.0 + u_strength * 0.45;
        float val = clamp((g - 0.5) * contrast + 0.5, 0.0, 1.0);
        if (u_filter == 4) val = 1.0 - val;
        gl_FragColor = vec4(vec3(val), 1.0);
        return;
      }

      if (u_filter == 5) {
        gl_FragColor = vec4(vec3(base.r), 1.0);
        return;
      }

      if (u_filter == 6) {
        gl_FragColor = vec4(vec3(base.b), 1.0);
        return;
      }

      if (u_filter == 7) {
        float g = luma(base.rgb);
        float limit = (u_strength * 42.0) / 255.0;
        float val = g >= limit ? 1.0 : 0.0;
        gl_FragColor = vec4(vec3(val), 1.0);
        return;
      }

      if (u_filter == 2) {
        float centerWeight = 8.0 + u_strength;
        float sum =
          -sampleLuma(vec2(-1.0, -1.0))
          -sampleLuma(vec2( 0.0, -1.0))
          -sampleLuma(vec2( 1.0, -1.0))
          -sampleLuma(vec2(-1.0,  0.0))
          +sampleLuma(vec2( 0.0,  0.0)) * centerWeight
          -sampleLuma(vec2( 1.0,  0.0))
          -sampleLuma(vec2(-1.0,  1.0))
          -sampleLuma(vec2( 0.0,  1.0))
          -sampleLuma(vec2( 1.0,  1.0));
        float val = clamp(sum, 0.0, 1.0);
        gl_FragColor = vec4(vec3(val), 1.0);
        return;
      }

      if (u_filter == 3) {
        float gain = 0.55 + u_strength * 0.25;
        float sum =
          sampleLuma(vec2(-1.0, -1.0)) * -2.0 +
          sampleLuma(vec2( 0.0, -1.0)) * -1.0 +
          sampleLuma(vec2(-1.0,  0.0)) * -1.0 +
          sampleLuma(vec2( 0.0,  0.0)) *  1.0 +
          sampleLuma(vec2( 1.0,  0.0)) *  1.0 +
          sampleLuma(vec2( 0.0,  1.0)) *  1.0 +
          sampleLuma(vec2( 1.0,  1.0)) *  2.0;
        float val = clamp(sum * gain + 0.5, 0.0, 1.0);
        gl_FragColor = vec4(vec3(val), 1.0);
        return;
      }

      gl_FragColor = base;
    }
  `;

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader compile error: ${log}`);
    }
    return shader;
  }

  class TraceLockGpuFilter {
    constructor() {
      this.canvas = document.createElement("canvas");
      this.gl = null;
      this.backend = "cpu";
      this.program = null;
      this.texture = null;
      this.uniforms = {};
      this.ready = false;
      this.init();
    }

    init() {
      const options = {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      };
      const gl =
        this.canvas.getContext("webgl2", options) ||
        this.canvas.getContext("webgl", options);
      if (!gl) return;

      try {
        const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
        const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          gl.deleteProgram(program);
          return;
        }

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
          gl.STATIC_DRAW
        );
        const positionLoc = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        this.gl = gl;
        this.backend = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext
          ? "webgl2"
          : "webgl";
        this.program = program;
        this.texture = texture;
        this.uniforms = {
          image: gl.getUniformLocation(program, "u_image"),
          texelSize: gl.getUniformLocation(program, "u_texelSize"),
          filter: gl.getUniformLocation(program, "u_filter"),
          strength: gl.getUniformLocation(program, "u_strength"),
          splitEnabled: gl.getUniformLocation(program, "u_splitEnabled"),
          splitX: gl.getUniformLocation(program, "u_splitX"),
        };
        this.ready = true;
      } catch {
        this.ready = false;
      }
    }

    render(source, width, height, { filter = "normal", strength = 3, splitEnabled = false, splitRatio = 0.5 } = {}) {
      if (!this.ready || !this.gl || !width || !height) return false;
      const gl = this.gl;
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.useProgram(this.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

      const filterId = FILTER_IDS[filter] ?? 0;
      gl.uniform1i(this.uniforms.image, 0);
      gl.uniform2f(this.uniforms.texelSize, 1 / width, 1 / height);
      gl.uniform1i(this.uniforms.filter, filterId);
      gl.uniform1f(this.uniforms.strength, Number(strength) || 3);
      gl.uniform1i(this.uniforms.splitEnabled, splitEnabled ? 1 : 0);
      gl.uniform1f(this.uniforms.splitX, Math.min(1, Math.max(0, Number(splitRatio) || 0.5)));

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      return true;
    }
  }

  globalScope.TraceLockGpuFilter = TraceLockGpuFilter;
})(typeof window !== "undefined" ? window : globalThis);
