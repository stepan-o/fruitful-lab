// Original procedural fire: heat is transported and dissipated in a small
// ping-pong field. Shapes are born and destroyed, never bent from fixed columns.
const vertex = `attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;
const common = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
             mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0., a = .5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = mat2(1.6, 1.2, -1.2, 1.6) * p + 17.13;
    a *= .5;
  }
  return v;
}
`;
const transport = common + `
uniform sampler2D u_previous;
uniform float u_step;
float stream(vec2 p) {
  return noise(p * 5.1 + vec2(0., -u_time * .72)) * .60
       + noise(p * 11.7 + vec2(u_time * .31, -u_time * 1.3)) * .23
       + noise(p * 24.0 + vec2(-u_time * .28, -u_time * 1.7)) * .075;
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float e = .008;
  // Curl of a stream function gives local rolling motion without fixed lanes.
  vec2 curl = vec2(stream(p + vec2(0.,e)) - stream(p - vec2(0.,e)),
                 stream(p - vec2(e,0.)) - stream(p + vec2(e,0.))) / (2. * e);
  float heat = texture2D(u_previous, uv).r;
  vec2 velocity = curl * .10 + vec2(0., .28 + heat * .24);
  vec2 from = uv - velocity * u_step / vec2(aspect, 1.);
  float carried = texture2D(u_previous, clamp(from, vec2(0.), vec2(1.))).r;
  // Cooling and entrainment destroy the transported shape as it rises.
  carried = max(0., carried - u_step * (.64 + uv.y * .55));
  float supply = noise(vec2(p.x * 8.3, u_time * 2.4)) * .65
               + noise(vec2(p.x * 2.7 + 8., u_time * 1.1)) * .35;
  supply = smoothstep(.36, .76, supply) * .94;
  float ignition = 1. - smoothstep(.008, .055, uv.y);
  heat = max(carried, supply * ignition);
  // Sub-quantum dither prevents RGBA8's decay from accumulating banding.
  heat += (hash(gl_FragCoord.xy + u_time * 71.) - .5) / 255.;
  gl_FragColor = vec4(max(heat, 0.), 0., 0., 1.);
}
`;
const display = common + `
uniform sampler2D u_heat;
uniform float u_layer;
uniform float u_fire;
vec4 shadows(vec2 uv, float aspect) {
  vec2 p = vec2(uv.x * aspect * 2.8, uv.y * 3.3);
  float t = u_time * .16;
  vec2 curl = vec2(fbm(p + vec2(t * .32, -t)), fbm(p + vec2(7.1, -t * .7)));
  float body = fbm(p + curl * 3.0 - vec2(t * .2, t));
  float veil = smoothstep(.29, .64, body);
  float edge = 1. - smoothstep(.02, .13, abs(body - .43));
  float height = 1. - smoothstep(.18, .98, uv.y);
  vec3 color = mix(vec3(.037, .045, .047), vec3(.095, .065, .046), exp(-uv.y * 5.5));
  color += edge * vec3(.15, .13, .10) * (1. - uv.y);
  float alpha = height * (.18 + veil * .62);
  return vec4(color * alpha, alpha);
}
float hash3(vec3 p) {
  p = fract(p * vec3(.123, .456, .789));
  p += dot(p, p.yzx + 19.19);
  return fract((p.x + p.y) * p.z);
}
float noise3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f*f*(3.-2.*f);
  return mix(mix(mix(hash3(i),hash3(i+vec3(1,0,0)),f.x),
                 mix(hash3(i+vec3(0,1,0)),hash3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash3(i+vec3(0,0,1)),hash3(i+vec3(1,0,1)),f.x),
                 mix(hash3(i+vec3(0,1,1)),hash3(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float turbulence(vec3 p) {
  return noise3(p)*.57 + noise3(p*2.03+7.3)*.28 + noise3(p*4.11+17.1)*.15;
}
vec4 flames(vec2 uv, float aspect) {
  float heat = texture2D(u_heat, uv).r;
  if (heat < .08) return vec4(0.);
  vec2 drift = vec2(fbm(vec2(uv.x*aspect*5., uv.y*6.-u_time*1.9)),
                    fbm(vec2(uv.x*aspect*7.+9., uv.y*4.-u_time*1.2)));
  vec3 sum = vec3(0.);
  float opacity = 0.;
  // Five depth slices turn the transported envelope into luminous overlapping
  // sheets. Dark gaps remain between folds instead of a filled, painted shape.
  for (int i=0;i<5;i++) {
    vec3 p = vec3(uv.x*aspect*38. + drift.x*5.5,
                  uv.y*13.-u_time*4.9 + drift.y*2.0, float(i)*.61);
    float grain = turbulence(p);
    float depth = 1. - abs(float(i)-2.)*.19;
    float reaction = heat*depth - .10 - grain*.91;
    float density = exp(-pow((reaction-.025)/.088, 2.)) * smoothstep(.13,.28,heat);
    float hot = smoothstep(.28,.78,heat - grain*.13);
    float fold = exp(-abs(reaction-.09)*18.);
    vec3 light = mix(vec3(1.6,.20,.004),vec3(2.0,.63,.028),hot);
    light = mix(light,vec3(2.25,1.0,.13),hot*hot*hot);
    light += fold*vec3(.70,.26,.013);
    float alpha = density*.18;
    sum += (1.-opacity)*light*alpha;
    opacity += (1.-opacity)*alpha;
  }
  float fade = 1.-smoothstep(.53,.86,uv.y);
  return vec4(sum*fade, opacity*fade);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  // Look over the edge of the fire: its fuel bed stays below the viewport.
  // Preserve the folds' proportions, softly cropping their height and light.
  float fringe = (1. - smoothstep(.035, .19, uv.y)) * .38 * u_fire;
  gl_FragColor = u_layer < .5 ? shadows(uv, aspect)
    : flames(uv + vec2(0., .14), aspect) * fringe;
}
`;

export function createHearth(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", {
    alpha: true, premultipliedAlpha: true, antialias: false,
    depth: false, stencil: false, preserveDrawingBuffer: false,
    powerPreference: "low-power",
  });
  // Reading and the separate Canvas2D embers work without WebGL.
  if (!gl) return null;
  const shaders: WebGLShader[] = [];
  const programs: WebGLProgram[] = [];
  const buffer = gl.createBuffer();
  type Target = { texture: WebGLTexture; framebuffer: WebGLFramebuffer };
  let targets: Target[] = [];
  let width = 1, height = 1, simWidth = 1, simHeight = 1, front = 0;
  let previous: number | null = null;
  function releaseTargets() {
    for (const target of targets) {
      gl!.deleteFramebuffer(target.framebuffer);
      gl!.deleteTexture(target.texture);
    }
    targets = [];
  }
  function dispose() {
    releaseTargets();
    shaders.forEach(shader => gl!.deleteShader(shader));
    programs.forEach(program => gl!.deleteProgram(program));
    gl!.deleteBuffer(buffer);
  }
  function compile(type: number, source: string) {
    const shader = gl!.createShader(type);
    if (!shader) return null;
    shaders.push(shader);
    gl!.shaderSource(shader, source);
    gl!.compileShader(shader);
    return gl!.getShaderParameter(shader, gl!.COMPILE_STATUS) ? shader : null;
  }
  const vs = compile(gl.VERTEX_SHADER, vertex);
  function link(source: string) {
    const fs = compile(gl!.FRAGMENT_SHADER, source);
    const program = gl!.createProgram();
    if (!program) return null;
    programs.push(program);
    if (!vs || !fs) return null;
    gl!.attachShader(program, vs);
    gl!.attachShader(program, fs);
    gl!.bindAttribLocation(program, 0, "a_position");
    gl!.linkProgram(program);
    return gl!.getProgramParameter(program, gl!.LINK_STATUS) ? program : null;
  }
  const stepProgram = link(transport), drawProgram = link(display);
  if (!buffer || !stepProgram || !drawProgram) { dispose(); return null; }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const loc = (program: WebGLProgram, name: string) => gl.getUniformLocation(program, name);
  const step = {resolution:loc(stepProgram,"u_resolution"), time:loc(stepProgram,"u_time"), dt:loc(stepProgram,"u_step"), texture:loc(stepProgram,"u_previous")};
  const draw = {resolution:loc(drawProgram,"u_resolution"), time:loc(drawProgram,"u_time"), layer:loc(drawProgram,"u_layer"), texture:loc(drawProgram,"u_heat"), fire:loc(drawProgram,"u_fire")};
  gl.clearColor(0, 0, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  return {
    resize(w: number, h: number) {
      width = w; height = h;
      const scale = Math.min(1, 512 / w, 192 / h);
      simWidth = Math.max(1, Math.round(w * scale));
      simHeight = Math.max(1, Math.round(h * scale));
      releaseTargets(); previous = null; front = 0;
      for (let i = 0; i < 2; i++) {
        const texture = gl.createTexture(), framebuffer = gl.createFramebuffer();
        if (!texture || !framebuffer) {
          gl.deleteTexture(texture); gl.deleteFramebuffer(framebuffer);
          releaseTargets(); break;
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, simWidth, simHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        targets.push({texture, framebuffer});
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {releaseTargets(); break;}
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },
    draw(elapsed: number, fire = 0) {
      if (targets.length !== 2) return;
      const dt = previous === null ? 1 / 30 : Math.min(Math.max(elapsed - previous, 0), .08);
      previous = elapsed;
      // No heat transport or flame shading while the page end is out of view.
      if (fire > 0) {
        gl.disable(gl.BLEND);
        gl.useProgram(stepProgram);
        gl.viewport(0, 0, simWidth, simHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, targets[1-front].framebuffer);
        gl.bindTexture(gl.TEXTURE_2D, targets[front].texture);
        gl.uniform1i(step.texture, 0);
        gl.uniform2f(step.resolution, simWidth, simHeight);
        gl.uniform1f(step.time, elapsed % 3600);
        gl.uniform1f(step.dt, dt);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        front = 1-front;
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(drawProgram);
      gl.bindTexture(gl.TEXTURE_2D, targets[front].texture);
      gl.uniform1i(draw.texture, 0);
      gl.uniform2f(draw.resolution, width, height);
      gl.uniform1f(draw.time, elapsed % 3600);
      gl.uniform1f(draw.fire, fire);
      for (const pass of fire > 0 ? [0, 1] : [0]) {
        gl.uniform1f(draw.layer, pass);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    },
    clear() { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.clear(gl.COLOR_BUFFER_BIT); },
    dispose,
  };
}
