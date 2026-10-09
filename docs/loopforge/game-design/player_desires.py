"""One authored research/scenario source, rendered into every design record."""
import html

e = html.escape

def p(text):
    return '<p>' + e(text) + '</p>'

def fields(items):
    return '<dl>' + ''.join('<div class="definition"><dt>' + e(k) + '</dt><dd>' + e(v) + '</dd></div>' for k, v in items) + '</dl>'

def sources(items):
    return '<p class="small">' + ' · '.join('<a href="' + e(url, quote=True) + '" target="_blank" rel="noopener">' + e(label) + ' ↗</a>' for label, url in items) + '</p>' if items else ''

def disclosure(title, body):
    return '<details><summary>' + e(title) + '</summary>' + body + '</details>'

def cards(items):
    return ''.join(disclosure(x['title'], fields(x['fields']) + sources(x['sources'])) for x in items)

def scenario_fields(s):
    return [('Player wants', s['desire']), ('Situation', s['situation']), ('Commitment', s['choices']), ('Immediate payoff and cost', s['payoff']), ('Later echo', s['echo']), ('Interface and sensory feedback', s['ui']), ('Author view: causal support', s['engine']), ('Not yet delivered / guardrail', s['gap'])]

def render_player_desires(d):
    out = '<header class="section-head"><span class="kicker">Player promise · research → scenarios → interfaces</span><h2>' + e(d['thesis']) + '</h2>' + p(d['intro']) + '</header>'
    out += '<div class="callout">' + e(d['status']) + '</div>'
    out += '<div class="section-divider"></div><h3>Which games—and what players say</h3>' + p(d['priority'])
    out += disclosure('How to read this research', p(d['method']) + p('The research organisations below study motivation; the comparison list names the developers making the games. Source descriptions, player testimony and our design inferences are kept separate. Player links contain spoilers.'))
    out += cards(d['voices'])
    out += disclosure('Compare all thirteen games and their developers', p('The first four lead the self-expression study. The remaining games answer specific production, workforce and interface questions; they are not interchangeable models for the whole game.') + cards(d['competitors']))
    out += disclosure('Foundations: what the research can and cannot establish', cards(d['foundations']))
    out += '<h3>Seven ways to make it yours</h3>' + p('Overlapping desires, not player classes or seven compulsory missions. The factory records what you commit to; you decide what it means.')
    out += '<div class="principle-grid">' + ''.join('<article><h4>' + e(x['title']) + '</h4><blockquote class="quote">' + e(x['fields'][0][1]) + '</blockquote>' + p(x['fields'][1][1]) + disclosure('Proof in play · ' + x['title'].lower(), fields(x['fields'][2:])) + '</article>' for x in d['anchors']) + '</div>'
    out += '<div class="section-divider"></div><h3>Design consequences for Loopforge</h3>' + fields(d['synthesis'])
    out += '<h3>Proposed situations for Parts 01–02</h3>' + p('These are conditional situations within shared systems. They are not a fixed event schedule. One production incident can serve ambition, care, authority and attachment depending on what the player does.')
    for s in d['scenarios']:
        out += disclosure(s['id'] + ' · ' + s['title'] + ' · ' + s['part'], '<span class="status">Proposed scenario</span>' + fields(scenario_fields(s)))
    out += '<h3>The daily experience</h3>' + fields(d['flow'])
    out += disclosure('Engine and authoring contract', fields(d['contract']) + sources([('Original Producer Vision', '/loopforge-design/sources/producer.md')]))
    out += disclosure('How we test whether this is enjoyable', fields(d['tests']))
    out += disclosure('Open decisions before implementation', '<ul>' + ''.join('<li>' + e(x) + '</li>' for x in d['open']) + '</ul>')
    out += '<p><a href="/loopforge-design/PLAYER_DESIRES_AND_SCENARIOS.md" download>Download the research and scenario record ↗</a></p>'
    return out

def player_desires_markdown(d):
    out = ['# ' + d['title'], d['date'], '*Generated from game-design/player-desires.json. Edit the source and rebuild the board.*', '## ' + d['thesis'], d['intro'], d['status'], '## Research method', d['method'], d['priority']]
    def rows(items):
        out.extend('**' + k + '.** ' + v for k, v in items)
    def group(title, items):
        out.append('## ' + title)
        for item in items:
            out.append('### ' + item['title'])
            rows(item['fields'])
            if item['sources']:
                out.append(' · '.join('[' + label + '](' + url + ')' for label, url in item['sources']))
    group('Seven ways to make it yours', d['anchors'])
    group('What players say', d['voices'])
    group('Games and developers', d['competitors'])
    group('Research foundations', d['foundations'])
    out.append('## Design consequences for Loopforge'); rows(d['synthesis'])
    out.extend(['## Proposed situations for Parts 01–02', 'Conditional situations, not seven compulsory missions. No scenario below is claimed as implemented.'])
    for s in d['scenarios']:
        out.append('### ' + s['id'] + ' · ' + s['title'] + ' · ' + s['part']); rows(scenario_fields(s))
    for title, items in [('The daily experience', d['flow']), ('Engine and authoring contract', d['contract']), ('Owner playtest', d['tests'])]:
        out.append('## ' + title); rows(items)
    out.append('[Original Producer Vision](/loopforge-design/sources/producer.md)')
    out.append('## Open decisions'); out.extend('- ' + x for x in d['open'])
    return '\n\n'.join(out) + '\n'
