# Quality review template

Date / batch:
Engine / model if known:
Image link or file:
Requested device count / models:
Layout ID / spatial mode ID / pose ID:
Scene Contract (device, composition, environment, lighting, camera, architecture):
Frozen render prompt (exact outgoing text):
Effective tool prompt (if exposed; otherwise unknown):
Prompt fidelity: **MATCH / PROMPT_DRIFT / PROMPT_UNVERIFIED**
If PROMPT_DRIFT: **STOP the entire batch; fix prompt handoff before further calls.**

Requested ratio / observed pixels:
Status: **PASS / REJECT / UNVERIFIED**

| Check | PASS / REJECT / UNVERIFIED | Evidence / correction |
|---|---|---|
| One image / one camera; exactly requested 1 or 2 devices; no collage | | |
| Both white screens unobstructed and Mac keyboard visible (for pair) | | |
| Floating mode matches: grounded / on-block / hover / floorless suspended | | |
| 16:9 actual aspect ratio (metadata when available) | | |
| Device model & housing proportions | | |
| Entire blank white screen visible | | |
| No logo/text/UI/person/hands/watermark | | |
| Camera tracks pose: flat iPhone viewed obliquely from above, Mac open, no 90° overhead | | |
| Flat iPhone block has a wide table-sized solid mineral top; tilted phone is physically supported | | |
| Scene camera/framing/placement/negative space matches contract | | |
| No desks, woodgrain, lifestyle sets, furniture or other props | | |
| No unrelated blocks/stands; intentional mineral plinths only in on-block mode | | |
| Selected environment/material and 0–3 architectural planes match contract | | |
| Selected lighting direction, plausible reflections and shadows | | |
| Genuinely novel composition vs recent images | | |

Revision instruction (if failed):
Decision reason:
History entry path:
