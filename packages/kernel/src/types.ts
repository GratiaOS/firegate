// Core enums / ids
export type KernelLayerId =
  | 'L1_LOCAL'
  | 'L2_EMOTIONAL'
  | 'L3_MENTAL'
  | 'L4_ARCHETYPAL'
  | 'L5_TRANSGENERATIONAL'
  | 'L6_FIELD'
  | 'L7_KERNEL';

export type TerritoryId = 'ROOTS' | 'WATER' | 'LIGHTNING' | 'GUARDIANS' | 'ARK';

export type EventTrigger =
  | 'SENSORY'
  | 'INTERNAL'
  | 'FIELD_SYNC'
  | 'GUARDIAN_SIGNAL';

export type ProcessingStatus =
  | 'L1_CAPTURED'
  | 'L2_FELT'
  | 'L3_MAPPED'
  | 'L4_ARCH_TYPED'
  | 'L5_TRANSGEN_CHECK'
  | 'L6_FIELD_APPLIED'
  | 'L7_RULE_WRITTEN';

// Event & context
export interface EventContext {
  timestamp: string; // ISO 8601
  location?: string; // ex: "Bastaras / Garden / Driveway"
  plusCode?: string; // ex: "6V75+GH Casbas de Huesca"
  actors?: string[];
  tags?: string[];
}

export interface KernelEvent {
  id: string; // UUID or symbolic id: "DOG_IN_RAIN"
  trigger: EventTrigger;
  sourceTerritory: TerritoryId;
  sceneDescription: string;
  context: EventContext;
  processingStatus?: ProcessingStatus[];
  payload?: unknown;
}

// Layer state
export interface LayerStateBase {
  layer: KernelLayerId;
  eventId: string;
  summary?: string;
  data?: Record<string, unknown>;
}

export interface L1LocalState extends LayerStateBase {
  layer: 'L1_LOCAL';
  data?: {
    sensations?: string[];
    actions?: string[];
  };
}

export interface L2EmotionalState extends LayerStateBase {
  layer: 'L2_EMOTIONAL';
  data?: {
    feelings?: string[];
    intensity?: number; // 0..10
  };
}

export interface L3MentalState extends LayerStateBase {
  layer: 'L3_MENTAL';
  data?: {
    thoughts?: string[];
    decisions?: string[];
  };
}

export interface L4ArchetypalState extends LayerStateBase {
  layer: 'L4_ARCHETYPAL';
  data?: {
    symbols?: string[];
    roles?: string[];
  };
}

export interface L5TransgenerationalState extends LayerStateBase {
  layer: 'L5_TRANSGENERATIONAL';
  data?: {
    patternDetected?: string;
    actionTaken?: string;
  };
}

export interface L6FieldState extends LayerStateBase {
  layer: 'L6_FIELD';
  data?: {
    vibe?: 'CALM' | 'TENSION' | 'FLUX' | 'EXPANSION';
    fieldShift?: string;
    guardianSignals?: string[];
  };
}

export interface L7KernelState extends LayerStateBase {
  layer: 'L7_KERNEL';
  data?: {
    rulesApplied?: ReligareRuleId[];
    newRules?: ReligareRule[];
  };
}

export type LayerState =
  | L1LocalState
  | L2EmotionalState
  | L3MentalState
  | L4ArchetypalState
  | L5TransgenerationalState
  | L6FieldState
  | L7KernelState;

// Field snapshots
export interface FieldState {
  timestamp: string;
  vibe: 'CALM' | 'TENSION' | 'FLUX' | 'EXPANSION';
  activePatterns: string[];
  guardianSignals?: {
    module: 'GUARDIANS';
    signal: string;
  }[];
}

// Religare rules
export type ReligareRuleId = string;

export interface ReligareRule {
  ruleId: ReligareRuleId;
  description: string;
  createdFromEventId: string;
  antecedent?: string;
  consequent?: string;
  layersAffected?: KernelLayerId[];
}

// Processing context
export interface ProcessingContext {
  event: KernelEvent;
  layerStates: LayerState[];
  rules: ReligareRule[];
  fieldSnapshots?: FieldState[];
}

export type LayerProcessor = (ctx: ProcessingContext) => ProcessingContext;

export interface TerritoryModule {
  id: TerritoryId;
  processors: LayerProcessor[];
}
