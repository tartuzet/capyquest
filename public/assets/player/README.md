# Capi player sprites

Place final transparent PNG sprites here when replacing the generated Phaser.Graphics fallback.

Expected files:

- `capi-idle.png`
- `capi-run-1.png`
- `capi-run-2.png`
- `capi-jump.png`

Suggested size: `80x64 px`.

Direction: side-facing to the right. The game flips the sprite for left movement.

Alignment: keep Capi's feet near the bottom edge and keep the full character inside the canvas. The current arcade hitbox in `src/entities/Player.ts` is tuned for this size.

To enable these PNGs, set `USE_EXTERNAL_PLAYER_SPRITES` to `true` in `src/scenes/PreloadScene.ts`.
