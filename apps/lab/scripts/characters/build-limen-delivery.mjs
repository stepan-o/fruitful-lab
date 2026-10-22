/** Reproduce the three delivery levels from the retained, hash-checked source.
 * Writes only to the supplied output directory. No upload or credit spend. */
import {createRequire} from 'node:module';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const [sourceArg,outArg]=process.argv.slice(2);
if(!sourceArg||!outArg)throw Error('Usage: node scripts/characters/build-limen-delivery.mjs source-motions.glb output-directory');
const out=path.resolve(outArg),sourcePath=path.resolve(sourceArg);
await mkdir(out,{recursive:true});
const expectedHash='5db2609332dc0a84f59722b9ca5dffb969d1e36c7d1875ab34681041755de3c5';
const require=createRequire(import.meta.url);
const {NodeIO, PropertyType} = require('@gltf-transform/core');
const {ALL_EXTENSIONS, EXTMeshoptCompression} = require('@gltf-transform/extensions');
const {textureCompress, reorder, prune} = require('@gltf-transform/functions');
const {MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder} = require('meshoptimizer');
const sharp = require('sharp');
const validator = require('gltf-validator');
sharp.concurrency(1);
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder,
});
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const save = (name, data) => writeFile(path.join(out, name), JSON.stringify(data, null, 2) + '\n');
const sourceBytes = await readFile(sourcePath);
assert.equal(digest(sourceBytes), expectedHash, 'Source hash mismatch');
const sourceJSON = JSON.parse(sourceBytes.subarray(20, 20 + sourceBytes.readUInt32LE(12)).toString());
const source = await io.readBinary(sourceBytes);
const primitives = doc => doc.getRoot().listMeshes().flatMap(m => m.listPrimitives());
const triangleCount = doc => primitives(doc).reduce((n, p) => n + p.getIndices().getCount() / 3, 0);
const assertArray = (a, b, label) => assert.deepEqual(Array.from(a), Array.from(b), label);

// NodeIO omits near-identity TRS fields within its writer epsilon. Restore the
// exact source fields in the JSON chunk; BIN-relative accessor offsets do not
// change. No quantization/dequantization nodes are introduced by this pipeline.
function retainSourceNodeTransforms(input) {
  const bytes = Buffer.from(input), oldLength = bytes.readUInt32LE(12);
  const json = JSON.parse(bytes.subarray(20, 20 + oldLength).toString());
  assert.equal(json.nodes.length, sourceJSON.nodes.length);
  json.nodes.forEach((node, i) => {
    const original = sourceJSON.nodes[i]; assert.equal(node.name, original.name);
    for (const field of ['matrix', 'translation', 'rotation', 'scale']) {
      delete node[field];
      if (field in original) node[field] = original[field];
    }
  });
  const text = Buffer.from(JSON.stringify(json)), length = Math.ceil(text.length / 4) * 4;
  const tail = bytes.subarray(20 + oldLength), result = Buffer.alloc(20 + length + tail.length, 0x20);
  bytes.copy(result, 0, 0, 20); result.writeUInt32LE(result.length, 8); result.writeUInt32LE(length, 12);
  text.copy(result, 20); tail.copy(result, 20 + length); return result;
}

function clipInfo(doc) {
  return doc.getRoot().listAnimations().map(a => ({
    name: a.getName(), channels: a.listChannels().length,
    start: Math.min(...a.listSamplers().map(s => s.getInput().getArray()[0])),
    duration: Math.max(...a.listSamplers().map(s => s.getInput().getArray().at(-1))),
  }));
}

function nodeRecords(doc) {
  return doc.getRoot().listNodes().map(n => ({
    name: n.getName(), children: n.listChildren().map(c => c.getName()),
    translation: n.getTranslation(), rotation: n.getRotation(), scale: n.getScale(),
    hasMesh: !!n.getMesh(), hasSkin: !!n.getSkin(), extras: n.getExtras(),
  }));
}

// Retain every vertex of any triangle influenced by the head. One-ring expansion
// protects the boundary as well as eyes, teeth and skull topology. No smooth/remesh.
function headProtection(doc, p) {
  const skin = doc.getRoot().listSkins()[0];
  const heads = new Set(skin.listJoints().map((n, i) => /^(Head|head_end|headfront)$/.test(n.getName()) ? i : -1));
  heads.delete(-1); assert(heads.size > 0);
  const js = p.getAttribute('JOINTS_0').getArray(), ws = p.getAttribute('WEIGHTS_0').getArray();
  const head = new Uint8Array(p.getAttribute('POSITION').getCount());
  for (let v = 0; v < head.length; v++) {
    let weight = 0;
    for (let k = 0; k < 4; k++) if (heads.has(js[v * 4 + k])) weight += ws[v * 4 + k];
    if (weight >= .05) head[v] = 1;
  }
  const indices = p.getIndices().getArray(), locks = head.slice(), protectedTriangles = [];
  for (let i = 0; i < indices.length; i += 3) {
    const tri = Array.from(indices.subarray(i, i + 3));
    if (tri.some(v => head[v])) {
      tri.forEach(v => { locks[v] = 1; }); protectedTriangles.push(tri);
    }
  }
  return {locks, protectedTriangles};
}

function triangleSignatures(p, triangles) {
  const semantics = p.listSemantics().sort();
  const vertex = v => semantics.map(s => {
    const a = p.getAttribute(s), n = a.getElementSize();
    return s + ':' + Array.from(a.getArray().subarray(v * n, v * n + n)).join(',');
  }).join('|');
  const cache = new Map();
  const key = v => { if (!cache.has(v)) cache.set(v, digest(vertex(v))); return cache.get(v); };
  return new Set(triangles.map(tri => tri.map(key).sort().join('/')));
}

const sourceProtected = primitives(source).map(p => {
  const {protectedTriangles} = headProtection(source, p);
  return triangleSignatures(p, protectedTriangles);
});

function reduce(doc, level) {
  const records = [], originalTotal = triangleCount(doc);
  const jointCount = doc.getRoot().listSkins()[0].listJoints().length;
  for (const p of primitives(doc)) {
    const pos = p.getAttribute('POSITION'), normal = p.getAttribute('NORMAL'), uv = p.getAttribute('TEXCOORD_0');
    const js = p.getAttribute('JOINTS_0').getArray(), ws = p.getAttribute('WEIGHTS_0').getArray();
    const stride = 5 + jointCount, attrs = new Float32Array(pos.getCount() * stride);
    for (let v = 0; v < pos.getCount(); v++) {
      attrs.set(normal.getArray().subarray(v * 3, v * 3 + 3), v * stride);
      attrs.set(uv.getArray().subarray(v * 2, v * 2 + 2), v * stride + 3);
      for (let k = 0; k < 4; k++) attrs[v * stride + 5 + js[v * 4 + k]] += ws[v * 4 + k];
    }
    const {locks, protectedTriangles} = headProtection(doc, p);
    const original = p.getIndices(), target = Math.floor(original.getCount() * level.triangles / originalTotal / 3) * 3;
    const [indices, error] = MeshoptSimplifier.simplifyWithAttributes(
      new Uint32Array(original.getArray()), pos.getArray(), 3, attrs, stride,
      [.3, .3, .3, 2, 2, ...Array(jointCount).fill(.5)], locks, target, level.error,
      ['Permissive', 'RegularizeLight'],
    );
    const order = [...new Set(indices)], remap = new Uint32Array(pos.getCount());
    order.forEach((v, i) => { remap[v] = i; });
    for (const semantic of p.listSemantics()) {
      const a = p.getAttribute(semantic), n = a.getElementSize(), input = a.getArray();
      const output = new input.constructor(order.length * n);
      order.forEach((v, i) => output.set(input.subarray(v * n, v * n + n), i * n));
      p.setAttribute(semantic, a.clone().setArray(output));
    }
    const IndexArray = order.length <= 65535 ? Uint16Array : Uint32Array;
    p.setIndices(original.clone().setArray(IndexArray.from(indices, i => remap[i])));
    records.push({sourceTriangles: original.getCount() / 3, targetTriangles: target / 3,
      actualTriangles: indices.length / 3, attributeAwareError: error,
      protectedVertices: locks.reduce((n, v) => n + v, 0), protectedTriangles: protectedTriangles.length});
  }
  return records;
}

function validateRigAndAnimation(doc) {
  assert.deepEqual(nodeRecords(doc), nodeRecords(source), 'Node hierarchy, transforms, attachment nodes and extras');
  assert.deepEqual(clipInfo(doc), clipInfo(source), 'Clip names, channels and timing');
  const before = source.getRoot().listSkins(), after = doc.getRoot().listSkins();
  assert.equal(after.length, before.length);
  for (let i = 0; i < before.length; i++) {
    assert.deepEqual(after[i].listJoints().map(n => n.getName()), before[i].listJoints().map(n => n.getName()));
    assertArray(after[i].getInverseBindMatrices().getArray(), before[i].getInverseBindMatrices().getArray(), 'Inverse binds unchanged');
    assert.equal(after[i].getSkeleton()?.getName(), before[i].getSkeleton()?.getName());
  }
  let comparedValues = 0;
  source.getRoot().listAnimations().forEach((a, i) => {
    const b = doc.getRoot().listAnimations()[i];
    a.listChannels().forEach((channel, k) => {
      const other = b.listChannels()[k];
      assert.equal(other.getTargetNode().getName(), channel.getTargetNode().getName());
      assert.equal(other.getTargetPath(), channel.getTargetPath());
      const sa = channel.getSampler(), sb = other.getSampler();
      assert.equal(sb.getInterpolation(), sa.getInterpolation());
      for (const getter of ['getInput', 'getOutput']) {
        assertArray(sa[getter]().getArray(), sb[getter]().getArray(), a.getName() + ' ' + getter);
        comparedValues += sa[getter]().getArray().length;
      }
    });
  });
  let maxWeightSumError = 0, vertices = 0;
  for (const a of doc.getRoot().listAccessors()) {
    for (const v of a.getArray()) assert(Number.isFinite(v), 'All accessor components finite');
  }
  for (const p of primitives(doc)) {
    assert.equal(p.getMode(), 4); assert.equal(p.getIndices().getCount() % 3, 0);
    const count = p.getAttribute('POSITION').getCount(), js = p.getAttribute('JOINTS_0').getArray(), ws = p.getAttribute('WEIGHTS_0').getArray();
    p.listSemantics().forEach(s => assert.equal(p.getAttribute(s).getCount(), count));
    for (const index of p.getIndices().getArray()) assert(index >= 0 && index < count);
    for (let v = 0; v < count; v++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        const j = js[v * 4 + k], w = ws[v * 4 + k];
        assert(Number.isInteger(j) && j >= 0 && j < 24); assert(w >= 0 && w <= 1); sum += w;
      }
      maxWeightSumError = Math.max(maxWeightSumError, Math.abs(sum - 1));
    }
    vertices += count;
  }
  assert(maxWeightSumError <= 1e-5, 'Skin weights normalized');
  const protectedCounts = primitives(doc).map((p, i) => {
    const idx = p.getIndices().getArray(), triangles = [];
    for (let k = 0; k < idx.length; k += 3) triangles.push(Array.from(idx.subarray(k, k + 3)));
    const signatures = triangleSignatures(p, triangles);
    for (const sig of sourceProtected[i]) assert(signatures.has(sig), 'Protected head triangle preserved');
    return sourceProtected[i].size;
  });
  return {nodes: doc.getRoot().listNodes().length, joints: after.map(s => s.listJoints().length),
    clips: clipInfo(doc), vertices, maxWeightSumError, exactAnimationValuesCompared: comparedValues,
    animationKeyframesBitExact: true, hierarchyAndBindTransformsExact: true,
    protectedHeadTrianglesRetained: protectedCounts};
}

function slerp(a, b, t) {
  let dot = a.reduce((sum, x, i) => sum + x * b[i], 0), end = b.slice();
  if (dot < 0) { dot = -dot; end = end.map(x => -x); }
  let result;
  if (dot > .9995) result = a.map((x, i) => x + (end[i] - x) * t);
  else {
    const theta = Math.acos(Math.max(-1, Math.min(1, dot))), sin = Math.sin(theta);
    result = a.map((x, i) => (Math.sin((1 - t) * theta) * x + Math.sin(t * theta) * end[i]) / sin);
  }
  const length = Math.hypot(...result); return result.map(x => x / length);
}

function sampleChannel(channel, time) {
  const s = channel.getSampler(), times = s.getInput().getArray(), values = s.getOutput().getArray();
  const size = s.getOutput().getElementSize(), interpolation = s.getInterpolation();
  assert(['LINEAR', 'STEP'].includes(interpolation), 'Unsupported interpolation must be explicitly handled');
  let low = 0, high = times.length - 1;
  while (high - low > 1) { const mid = (low + high) >>> 1; if (times[mid] <= time) low = mid; else high = mid; }
  if (time <= times[0]) high = low = 0;
  if (time >= times.at(-1)) low = high = times.length - 1;
  const a = Array.from(values.subarray(low * size, low * size + size));
  if (low === high || interpolation === 'STEP') return a;
  const b = Array.from(values.subarray(high * size, high * size + size));
  const f = Math.max(0, Math.min(1, (time - times[low]) / (times[high] - times[low])));
  return channel.getTargetPath() === 'rotation' ? slerp(a, b, f) : a.map((x, i) => x + f * (b[i] - x));
}

function pose(doc, animation, time, rest) {
  doc.getRoot().listNodes().forEach((n, i) => { n.setTranslation(rest[i].translation); n.setRotation(rest[i].rotation); n.setScale(rest[i].scale); });
  for (const c of animation.listChannels()) {
    const node = c.getTargetNode(), value = sampleChannel(c, time), target = c.getTargetPath();
    if (target === 'rotation') node.setRotation(value);
    else if (target === 'translation') node.setTranslation(value);
    else if (target === 'scale') node.setScale(value);
    else throw Error('Unsupported target ' + target);
  }
  return doc.getRoot().listSkins()[0].listJoints().map(n => n.getWorldMatrix());
}

function comparePoses(doc) {
  const srcRest = nodeRecords(source), dstRest = nodeRecords(doc), perClip = [];
  const srcAnimations = source.getRoot().listAnimations(), dstAnimations = doc.getRoot().listAnimations();
  for (let i = 0; i < srcAnimations.length; i++) {
    const info = clipInfo(source)[i], steps = Math.ceil(info.duration * 30);
    let maxWorldMatrixDelta = 0;
    for (let step = 0; step <= steps; step++) {
      const time = Math.min(info.duration, step / 30);
      const a = pose(source, srcAnimations[i], time, srcRest), b = pose(doc, dstAnimations[i], time, dstRest);
      a.forEach((matrix, j) => matrix.forEach((v, k) => { maxWorldMatrixDelta = Math.max(maxWorldMatrixDelta, Math.abs(v - b[j][k])); }));
    }
    assert(maxWorldMatrixDelta <= 1e-7);
    perClip.push({name: info.name, duration: info.duration, poses: steps + 1, jointMatricesPerPose: 24, maxWorldMatrixDelta});
  }
  for (const [d, rest] of [[source, srcRest], [doc, dstRest]]) d.getRoot().listNodes().forEach((n, i) => {
    n.setTranslation(rest[i].translation); n.setRotation(rest[i].rotation); n.setScale(rest[i].scale);
  });
  return {sampleRateHz: 30, tolerance: 1e-7, perClip,
    totalPoses: perClip.reduce((n, c) => n + c.poses, 0), maxWorldMatrixDelta: Math.max(...perClip.map(c => c.maxWorldMatrixDelta))};
}

async function validateFile(bytes, file) {
  const decoded = await io.readBinary(bytes);
  const rig = validateRigAndAnimation(decoded), poses = comparePoses(decoded), textures = [];
  for (const texture of decoded.getRoot().listTextures()) {
    const {info} = await sharp(texture.getImage()).raw().toBuffer({resolveWithObject: true});
    assert.equal(texture.getMimeType(), 'image/webp');
    textures.push({name: texture.getName(), mimeType: texture.getMimeType(), width: info.width, height: info.height, decodedChannels: info.channels});
  }
  const encodedReport = await validator.validateBytes(bytes, {uri: file, maxIssues: 1000});
  await save(file + '.encoded-validator.json', encodedReport);
  // The installed validator cannot inspect Meshopt bufferViews. Validate the
  // decoded accessors independently, and keep both reports for transparency.
  for (const extension of decoded.getRoot().listExtensionsUsed()) if (extension.extensionName === 'EXT_meshopt_compression') extension.dispose();
  const decodedBytes = await io.writeBinary(decoded);
  const decodedReport = await validator.validateBytes(decodedBytes, {uri: file + '.decoded.glb', maxIssues: 1000});
  await save(file + '.decoded-validator.json', decodedReport);
  assert.equal(decodedReport.issues.numErrors, 0, 'Decoded glTF validator errors');
  return {rig, poses, textures, validator: {encodedErrors: encodedReport.issues.numErrors,
    decodedErrors: decodedReport.issues.numErrors, decodedWarnings: decodedReport.issues.numWarnings,
    note: 'Decode-aware validation is authoritative for compressed accessors; inspect retained validator reports.'}};
}

const levels = [
  {id: 'portrait', triangles: triangleCount(source), texture: 1024, error: 0},
  {id: 'floor', triangles: 18000, texture: 512, error: .012},
  {id: 'overview', triangles: 8000, texture: 256, error: .035},
];
const manifest={revision:'limen-landing-body/3',source:{sha256:expectedHash},levels:[],status:'building'};
manifest.levels = []; manifest.status = 'building';
manifest.source.triangles = triangleCount(source); manifest.source.nodes = nodeRecords(source);
manifest.source.clips = clipInfo(source); manifest.source.joints = source.getRoot().listSkins().map(s => s.listJoints().length);
manifest.method = {geometry: 'Attribute-aware Meshoptimizer; full head triangle/vertex locks; no remeshing',
  compression: 'Lossless EXT_meshopt_compression QUANTIZE encoder mode, no accessor quantization/filtering or animation resampling',
  textures: 'WebP quality 92, effort 4', nodeRetention: 'All nodes retained; prune accessors only',
  restTransforms: 'Original JSON TRS/matrix fields restored after serialization to avoid near-identity omission',
  sourceScriptSha256: digest(await readFile(fileURLToPath(import.meta.url)))};
await save('manifest.json', manifest);
const sourceValidation = await validator.validateBytes(sourceBytes, {uri: 'motions.glb', maxIssues: 1000});
await save('source-validator.json', sourceValidation);
for (const level of levels) {
  const doc = await io.readBinary(sourceBytes);
  const simplification = level.id === 'portrait' ? [] : reduce(doc, level);
  await doc.transform(
    textureCompress({encoder: sharp, targetFormat: 'webp', resize: [level.texture, level.texture], quality: 92, effort: 4}),
    reorder({encoder: MeshoptEncoder, target: 'size'}),
    prune({propertyTypes: [PropertyType.ACCESSOR], keepAttributes: true}),
  );
  doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({method: EXTMeshoptCompression.EncoderMethod.QUANTIZE});
  const bytes = retainSourceNodeTransforms(await io.writeBinary(doc)), file = 'limen-' + level.id + '-candidate-v1.glb';
  await writeFile(path.join(out, file), bytes);
  const record = {level: level.id, file, status: 'generated; validation pending', bytes: bytes.length,
    sha256: digest(bytes), triangles: triangleCount(doc), textureTarget: level.texture, simplification};
  manifest.levels.push(record); await save('manifest.json', manifest);
  console.log(JSON.stringify({stage: 'generated', ...record}));
  const validation = await validateFile(bytes, file);
  await save(level.id + '-validation.json', validation);
  record.status = 'structural checks passed; visual/contact/scene/performance review pending';
  record.joints = validation.rig.joints; record.clips = validation.rig.clips; record.nodes = validation.rig.nodes;
  record.textures = validation.textures; record.validation = level.id + '-validation.json';
  await save('manifest.json', manifest);
  console.log(JSON.stringify({stage: 'verified', level: level.id, bytes: bytes.length, triangles: record.triangles,
    maxJointMatrixDelta: validation.poses.maxWorldMatrixDelta, sampledPoses: validation.poses.totalPoses}));
}
assert.equal(digest(await readFile(sourcePath)), expectedHash, 'Canonical source unchanged after conversion');
manifest.status = 'structurally_verified_candidates'; manifest.completed_at = new Date().toISOString();
await save('manifest.json', manifest);
