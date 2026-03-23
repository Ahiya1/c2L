// reach/lib/config.ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { VALID_MODES, VALID_STAGES } from './types.js';

const configSchema = z.object({
  mode: z.enum(VALID_MODES),
  pipeline_stages: z.array(
    z.object({
      id: z.enum(VALID_STAGES),
      label_he: z.string().min(1),
      description: z.string().min(1),
    })
  ),
  campaign: z.object({
    max_touches: z.number().int().positive(),
    touch_sequence: z.array(z.string().min(1)),
    days_between_touch_1_and_2: z.number().int().positive(),
    days_between_touch_2_and_3: z.number().int().positive(),
  }),
  contact_details: z.object({
    sender_name: z.string().min(1),
    sender_email: z.string().email(),
    sender_phone: z.string().min(1),
    offer_url: z.string().url(),
  }),
});

export type ValidatedConfig = z.infer<typeof configSchema>;

/**
 * Load and validate the reach configuration from config.yaml.
 * Throws if the file is missing or the content is invalid.
 */
export function loadConfig(configPath?: string): ValidatedConfig {
  const path = configPath ?? resolve(import.meta.dirname, '..', 'config.yaml');
  const raw = readFileSync(path, 'utf-8');
  const parsed = parseYaml(raw);
  return configSchema.parse(parsed);
}

/**
 * Check if the system is in a mode that allows email composition.
 * DORMANT mode does NOT allow composition.
 */
export function canCompose(config: ValidatedConfig): boolean {
  return config.mode !== 'DORMANT';
}

/**
 * Assert that the system is in a mode that allows email composition.
 * Throws with a clear error if the system is DORMANT.
 */
export function assertCanCompose(config: ValidatedConfig): void {
  if (!canCompose(config)) {
    throw new Error(
      `[DORMANT] System is in DORMANT mode. Email composition is disabled.\n` +
        `To enable preview, change mode to DRY_RUN in config.yaml.`
    );
  }
}
