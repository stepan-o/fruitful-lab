"""Current playable composition, kept separate from future mechanics proposals."""
import html

def render_focused_console():
    rows=[
      ('Factory wall','Six fixed camera positions; two live, four dark with names only. Confirmed instruments stay above, speaking adviser tokens below.','Open a camera or supervisor channel. No permanent action column.'),
      ('Intercom and morning brief','A large portrait socket and labelled comic dialogue: factory, other supervisor, priority.','Preview a voice, explicitly appoint, then inspect the proposed arrangement.'),
      ('Placement desk','Two room screens and receiving tokens; the adviser’s room carries delegated authority.','Accept or swap, inspect the objection, then authorize.'),
      ('Room focus','One enlarged feed, known operator, condition/output and latest receipt.','Observe the shift here or inspect an attributed action.'),
      ('Incident response','The room report, adviser recommendation and known costs of each response.','Decision pauses. Inspect records without resolving; the pending response remains accessible.'),
      ('Dispatch office','Original dispatch artwork, two destinations and linked worker/quota counters.','Preview locally. Review, then seal an irreversible order.'),
      ('Logistics debrief','Original shipping/logistics artwork, output, wear, losses and supervisor reactions.','Inspect the causal record or begin another first-day playtest.'),
      ('Development and records','Separate capability map and selectable causal receipts.','Future requirements are labelled as design; hidden traits are not exposed.'),
      ('Help, instruments, settings','Recoverable guidance and contextual facts in dialogs. Six equipment kits and an author mixer.','No permanent tutorial paragraph. Draft choices survive closing, navigation and theme/menu changes.'),
    ]
    table=''.join('<tr>'+''.join('<td>'+html.escape(x)+'</td>' for x in row)+'</tr>' for row in rows)
    return '''<header class="section-head"><span class="kicker">Implemented composition / 8 October</span><h2>A camera wall, then one job at a time.</h2><p>The material-only action column has been replaced. Start shift lands at the six-camera factory wall. Briefing, placements, room focus, dispatch and debrief each take over the workspace.</p></header>
    <p class="document-links"><a href="/stepanoskin/loopforge/play" target="_blank" rel="noopener">Play the first shift ↗</a> · <a href="/stepanoskin/loopforge/play/console-study" target="_blank" rel="noopener">Compare first-turn / full-floor density ↗</a> · <a href="FOCUSED_CONSOLE_REBUILD.md" download>Implementation contract</a></p>
    <div class="table-wrap"><table><thead><tr><th>Job</th><th>What occupies the screen</th><th>Interaction</th></tr></thead><tbody>'''+table+'''</tbody></table></div>
    <h3>Original art beyond the managed rooms</h3><p>The dispatch office is an allocation setting. Shipping/logistics frames the end-of-shift review, and the lobby frames the start menu. These remain outside the six-room management grid. Their reuse preserves the factory’s world while giving each interface a recognizable place.</p>
    <h3>Presentation owns focus; the engine owns facts</h3><p>FirstShift retains the active workspace, selected channel, local placement changes and draft dispatch. Only validated player projections establish facts. The wall and room focus advance the response-paced shift; other workspaces, dialogs, hidden tabs and the menu pause requests. A confirmed phase transition opens its next workspace once, after which the player can inspect elsewhere without losing work.</p>
    <h3>Hardware is visible at play size</h3><p>Each theme has a whole monitor housing, separate supervisor socket and three button states. Frames preserve their authored proportions around calibrated live openings. Shared blank tape carries Caveat pen lettering; live comic speech uses Barlow Semi Condensed; instruments use IBM Plex Mono. Native text remains selectable and accessible. Portraits, resource reliefs and the overhead source retain recognizable Loopforge materials.</p>
    <h3>What this proves—and what remains</h3><p>The first-day slice exercises adviser choice, arrangement, continuous production, delegated actions, intervention and irreversible dispatch. The full-floor view is an author-only visual fixture with no commands. It does not claim later progression, advanced BDI, a live 3D factory or cloud saves. The owner’s visual and enjoyment review remains decisive.</p>'''
