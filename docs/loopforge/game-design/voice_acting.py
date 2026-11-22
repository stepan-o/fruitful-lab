"""Build the voice reader from the downloadable recording recipes and existing cast art."""
import json
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parents[2] / 'apps/lab/public/loopforge-design/voice-acting'
BOARD = '/stepanoskin/loopforge/design'
FLOW = 'https://elevenlabs.io/app/flows/'


def player(file, label):
    return f'<audio controls preload="none" aria-label="{escape(label)}" src="{escape(file)}"></audio>'


def portrait(art, slug):
    ref = next(p for p in art['portraits'] if p['id'] == slug)
    small, medium = ref['variants'][:2]
    return (f'<img src="{small["src"]}" srcset="{small["src"]} {small["width"]}w, '
            f'{medium["src"]} {medium["width"]}w" sizes="(max-width: 700px) 160px, 240px" '
            f'width="{small["width"]}" height="{small["height"]}" alt="{escape(ref["name"])}" loading="lazy">')


def supervisor(r, art, flow):
    name, fx = r['character'], r['effects']
    orig = r['performance_reference']
    return f'''<article class="master" id="{r['slug']}">
<div class="casthead"><div><h3>{name}</h3><p class="voice">{escape(r['voice_name'])}</p></div>{portrait(art, r['slug'])}</div>
<blockquote>“{escape(r['line'])}”</blockquote><div class="take-label">Approved master · {r['duration_seconds']:.2f} s</div>
{player(r['master_file'], name + ' approved master')}
<p>{escape(r['direction'])}</p>
<details><summary>Dry take &amp; recording settings</summary><div class="details-body">
<div class="take-label">Selected dry take</div>{player(r['source_file'], name + ' before processing')}
<h4>Directed script</h4><pre>{escape(r['prompt'])}</pre>
<dl><dt>Voice ID</dt><dd><code>{r['voice_id']}</code></dd><dt>Selection</dt><dd><code>{r['source_generation']}</code></dd>
<dt>Final Robot distance</dt><dd>{fx['distance']:.2f}</dd><dt>Approved master ID</dt><dd><code>{r['master_generation']}</code></dd></dl>
<p>The earlier “{escape(orig['label'])}” reference used distance {orig['distance']:.2f}.</p>
<div class="links"><a href="{r['master_file']}" download>Download master</a><a href="{FLOW}{flow}?node={r['master_node']}">Open in ElevenLabs ↗</a></div>
</div></details></article>'''


def build_voice_acting():
    data = json.loads((OUT / 'voice-recipes.json').read_text())
    art = json.loads((ROOT / 'cast-art.json').read_text())
    cards = ''.join(supervisor(r, art, data['supervisor_flow']) for r in data['cast'])
    bob = data['bob']
    choices = ''.join(f'''<article class="candidate"><h3>{escape(c['name'])}</h3>
<p>{escape(c['angle'])}</p><div class="take-label">Security · {c['duration_seconds']:.2f} s</div>
{player(c['file'], 'bob audition by ' + c['name'])}</article>''' for c in bob['candidates'])
    page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#111915">
<title>Voice acting · Loopforge</title><link rel="stylesheet" href="voice-acting.css"></head>
<body><a class="skip" href="#main">Skip to recordings</a><div class="wrap">
<header><a href="{BOARD}#narrative-cast">← Loopforge / Game design</a><nav aria-label="Voice acting"><a href="#masters">Supervisors</a><a href="#pipeline">Recording process</a><a href="#bob">Cast bob</a></nav></header>
<main id="main"><h1>Voice acting</h1><p class="intro">The voices on the factory floor. Listen to the approved supervisor performances, reproduce their sound, and audition bob at the Security desk.</p>
<section id="masters"><h2>Approved supervisors</h2><div class="masters">{cards}</div></section>
<section id="pipeline"><h2>Recording process</h2>
<ol class="steps"><li><strong>Direct the line.</strong> Open a Text to Speech node in ElevenLabs Flows. Select <code>eleven_v4</code>, enter the character’s voice ID, and copy the directed script from the recording settings above. The bracketed text directs the actor. Use the spoken words alone for captions. For a new line, keep the character direction and place pauses where that line calls for them.</li>
<li><strong>Choose the dry performance.</strong> Generate speech as <code>mp3_44100_128</code> with default voice settings and no pronunciation dictionary. Listen for LIMEN’s two distinct phrases or STILETTO’s one-breath finish. Save the chosen take’s generation ID. Another reading of the same prompt can differ. To reproduce either reference exactly, use the dry recording provided above.</li>
<li><strong>Apply the Robot filter once.</strong> Feed the selected dry audio into the <code>source</code> input on an Audio Effects node (<code>eleven_audio_effects</code>). Set <code>filter_preset_id</code> to <code>robot</code>, send level to <code>1</code> and pan to <code>0</code>. Leave room environment and background noise unset. Set distance to <strong>0.30 for LIMEN</strong> or <strong>0.10 for STILETTO</strong>. Render directly from the dry take.</li>
<li><strong>Check and save.</strong> Compare dry and finished audio at normal speed. Check the words, phrase breaks and consonants against the approved reference. Save the final audio, duration, generation ID and settings beside the accepted dry take. Use the downloadable master for an exact copy of either approved line.</li></ol>
<div class="links"><a href="voice-recipes.json" download>Download recording recipes (JSON)</a><a href="{FLOW}{data['supervisor_flow']}">Supervisor session in ElevenLabs ↗</a></div></section>
<section id="bob"><div class="bobhead">{portrait(art, 'bob')}<div><p class="take-label">Casting open · Day 2, Security</p><h2>Finding bob’s voice</h2>
<p>bob has a warm, slightly cracked voice. He is asking LIMEN to recognize him from yesterday. Listen for the little catch on “leg” and whether the second sentence sounds like an appeal to someone who knows him.</p><blockquote>“{escape(bob['line'])}”</blockquote></div></div>
<p>All three actors read the same line with the same direction. These are dry auditions.</p><div class="choices">{choices}</div>
<div class="links"><a href="{BOARD}#narrative-cast">Read bob’s cast portrait</a><a href="{FLOW}{bob['flow']}">Casting session in ElevenLabs ↗</a></div></section>
</main></div><script>document.addEventListener('play', event => {{ if (event.target instanceof HTMLAudioElement) document.querySelectorAll('audio').forEach(other => {{ if (other !== event.target) other.pause(); }}); }}, true);</script></body></html>
'''
    (OUT / 'index.html').write_text(page)


if __name__ == '__main__':
    build_voice_acting()
