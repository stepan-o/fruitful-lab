import '@babylonjs/loaders/glTF/2.0/glTFLoader';
import '@babylonjs/loaders/glTF/glTFFileLoader';
import '@babylonjs/loaders/glTF/2.0/Extensions/EXT_meshopt_compression';
import '@babylonjs/loaders/glTF/2.0/Extensions/EXT_texture_webp';
import '@babylonjs/loaders/glTF/2.0/Extensions/KHR_mesh_quantization';
import {MeshoptCompression} from '@babylonjs/core/Meshes/Compression/meshoptCompression';
import delivery from '@/lib/loopforge/agents/opening-worker-delivery.json';
// Room props can load before the cast. Both use the bundled decoder, not a CDN.
MeshoptCompression.Configuration.decoder.url=delivery.decoder.src;
