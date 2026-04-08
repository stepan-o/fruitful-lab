"use client";

export type Segment = "content_creator" | "product_seller" | "service_provider";
export type VolumeBucket = "0-2" | "3-5" | "6-10" | "11-20" | "20+";
export type VisualStrength = "limited" | "decent" | "strong" | "very_strong";
export type SiteExperience = "a" | "b" | "c" | "d";
export type OfferClarity = "no" | "somewhat" | "yes";
export type GrowthMode = "organic" | "later" | "ads";

export type AnswersV2 = {
    segment?: Segment;
    niche?: string;
    volume_bucket?: VolumeBucket;
    visual_strength?: VisualStrength;
    site_experience?: SiteExperience;
    offer_clarity?: OfferClarity;
    primary_goal?: string;
    growth_mode?: GrowthMode;
};

export type StepBaseProps = {
    /** Called after an answer selection to move forward (wizard controls delay) */
    onAutoAdvance?: () => void;
};

export type Option<T extends string> = { label: string; value: T; hint?: string };
