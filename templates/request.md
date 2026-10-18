# Mock generation request

- Device: `iphone17` / `macbookpro14`
- Engine: `gpt-image` / `nano-banana`
- Number of images: 4 (each image independent, **not a contact sheet**)
- Aspect ratio: 16:9 landscape
- Screen: completely blank white and fully visible
- Art direction: `STYLE.md` baseline (monochrome half-gray)
- Variation priorities: composition / architectural planes / background material / lighting
- References: links or approved files, if any
- Constraints override: none unless specified by user
- Destination for outputs: tool's native result, optionally archived after review
- Image-generation approval: follow user's explicit request and the active environment's permission rules

Before image generation, plan one environment + composition + light combination per image from `configs/presets.json` and confirm no unnecessary decorative blocks are added.
