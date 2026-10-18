# Quality review template

Date / batch:
Engine / model if known:
Image link or file:
Device:
Scene Contract (device, composition, environment, lighting, camera, architecture):
Frozen render prompt (exact outgoing text):
Effective tool prompt (if exposed; otherwise unknown):
Prompt fidelity: **MATCH / PROMPT_DRIFT / PROMPT_UNVERIFIED**
If PROMPT_DRIFT: **STOP the entire batch; fix prompt handoff before further calls.**

Requested ratio / observed pixels:
Status: **PASS / REJECT / UNVERIFIED**

| Check | PASS / REJECT / UNVERIFIED | Evidence / correction |
|---|---|---|
| One image, one device; no collage | | |
| 16:9 actual aspect ratio (metadata when available) | | |
| Device model & housing proportions | | |
| Entire blank white screen visible | | |
| No logo/text/UI/person/hands/watermark | | |
| Scene camera/framing/placement/negative space matches contract | | |
| No desks, woodgrain, lifestyle sets, furniture or other props | | |
| No freestanding blocks, stands or supports | | |
| Selected environment/material and 0–3 architectural planes match contract | | |
| Selected lighting direction, plausible reflections and shadows | | |
| Genuinely novel composition vs recent images | | |

Revision instruction (if failed):
Decision reason:
History entry path:
