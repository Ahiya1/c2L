// reach/lib/types.ts

/** Valid pipeline stages for a customs broker contact */
export const VALID_STAGES = [
  'pending',
  'contacted',
  'follow_up_1',
  'follow_up_2',
  'responded',
  'call_scheduled',
  'exploring',
  'closed_won',
  'closed_lost',
  'dormant',
] as const;

export type PipelineStage = (typeof VALID_STAGES)[number];

/** Operational modes for the reach system */
export const VALID_MODES = ['DORMANT', 'DRY_RUN', 'LIVE'] as const;
export type ReachMode = (typeof VALID_MODES)[number];

/** A single customs broker contact from the CSV */
export interface Contact {
  priority: number;
  company_name: string;
  company_name_he: string;
  contact_name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  company_size: string;
  specialization: string;
  website: string;
  linkedin: string;
  status: PipelineStage;
  last_contact: string;
  next_action: string;
  notes: string;
}

/** The reach system configuration from config.yaml */
export interface ReachConfig {
  mode: ReachMode;
  pipeline_stages: Array<{
    id: PipelineStage;
    label_he: string;
    description: string;
  }>;
  campaign: {
    max_touches: number;
    touch_sequence: string[];
    days_between_touch_1_and_2: number;
    days_between_touch_2_and_3: number;
  };
  contact_details: {
    sender_name: string;
    sender_email: string;
    sender_phone: string;
    offer_url: string;
  };
}

/** A composed email ready for preview */
export interface ComposedEmail {
  to_name: string;
  to_email: string;
  subject: string;
  body: string;
  template_used: string;
  contact_priority: number;
}

/** Available template names (matches filenames without extension) */
export type TemplateName = 'cold-outreach' | 'follow-up' | 'value-add';
