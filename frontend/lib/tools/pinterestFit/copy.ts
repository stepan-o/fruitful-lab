import { PINTEREST_FIT_CALL_URL } from "./config";
import type { CTAConfig, IntroCopy, OutcomeCopy, OutcomeKey, ReasonKey, RoleKey } from "./types";

export const INTRO_COPY = {
    title: "Is Pinterest Actually a Fit for Your Brand?",
    subtitle:
        "Take this short assessment to see whether Pinterest makes sense for your brand, what role it could play, and whether it's worth exploring further.",
    supportLine: "Built for product-based brands.",
    primaryButtonLabel: "Start the Assessment",
    durationNote: "Takes about 2 minutes.",
} as const satisfies IntroCopy;

export const RESULT_COPY_BY_OUTCOME = {
    strong_fit: {
        label: "Strong fit",
        headline: "Your brand looks like a strong fit for Pinterest.",
        intro: "Based on your answers, Pinterest looks like a channel that could make strategic sense for your brand.",
    },
    possible_fit: {
        label: "Possible fit",
        headline: "Your brand could be a fit for Pinterest - but a few things may need tightening first.",
        intro: "There may be real potential here, but whether Pinterest is worth prioritizing depends on a few important factors.",
    },
    not_right_now: {
        label: "Not the right fit right now",
        headline: "Pinterest does not look like the right next move for your brand right now.",
        intro: "Based on your current foundation, Pinterest likely is not the best next priority right now.",
    },
} as const satisfies Record<OutcomeKey, OutcomeCopy>;

export const REASON_COPY_BY_KEY = {
    reason_category_strong: "Your category is a strong natural fit for Pinterest.",
    reason_category_good: "Your category can work well on Pinterest with the right strategy and assets.",
    reason_category_maybe: "Your category may have potential on Pinterest, but it needs stronger positioning to stand out.",
    reason_category_weak: "Your category is not the most natural Pinterest fit, so the case needs to be stronger elsewhere.",
    reason_offer_proven: "You already have a proven product or collection, which makes Pinterest easier to test strategically.",
    reason_offer_some_traction: "You have some product traction already, which gives Pinterest something solid to support.",
    reason_offer_early: "Your product is still early, which makes Pinterest harder to evaluate as a channel right now.",
    reason_offer_unproven: "Your offer is not proven enough yet, so Pinterest would likely be premature.",
    reason_assets_strong: "You already have strong visual and supporting content assets, which is a big advantage on Pinterest.",
    reason_assets_decent: "You have enough content to start, even if your asset library still has some gaps.",
    reason_assets_limited: "Your current content depth is limited, which may make Pinterest harder to sustain well.",
    reason_assets_weak: "You would need to build much stronger content assets before Pinterest becomes a smart priority.",
    reason_site_ready: "Your website looks ready to support Pinterest traffic.",
    reason_site_solid: "Your site is in solid shape overall, which gives Pinterest a workable landing point.",
    reason_site_friction: "Your website may still create friction if Pinterest starts driving traffic.",
    reason_site_not_ready: "Your website is not ready enough yet to make Pinterest traffic worth pursuing.",
    reason_goal_discovery: "Your goals match one of Pinterest's biggest strengths: helping new people discover your brand.",
    reason_goal_traffic: "Pinterest can be a strong fit when the goal is driving qualified traffic to products or collections.",
    reason_goal_launches: "Pinterest can support launches and seasonal moments well when the assets and timing are there.",
    reason_goal_retargeting:
        "Using Pinterest to build a warmer audience can make strategic sense, especially as part of a broader funnel.",
    reason_goal_sales_caution:
        "Your sales goals may be possible, but Pinterest usually works best with the right foundation and expectations.",
    reason_support_ready:
        "You seem ready to invest if the opportunity is there, which makes testing Pinterest much more realistic.",
    reason_support_open: "You're open to testing Pinterest in a lean way, which is often enough to start well.",
    reason_support_cautious: "Your current readiness is cautious, which may slow momentum even if the fit is there.",
    reason_support_not_committed:
        "Right now, there does not seem to be enough commitment behind exploring Pinterest seriously.",
    reason_ads_open:
        "You're open to ads if they make sense, which gives Pinterest more room to become a meaningful channel.",
    reason_ads_later: "You're open to ads later, which can work well once the foundation is clearer.",
    reason_ads_unsure: "You're still unsure about ads, so Pinterest may need to start as a slower organic test.",
    reason_ads_not_open: "If ads are fully off the table, Pinterest may need to play a narrower role for your brand.",
} as const satisfies Record<ReasonKey, string>;

export const ROLE_COPY_BY_KEY = {
    discovery_traffic:
        "Pinterest looks most promising for your brand as a discovery and traffic channel - helping more of your ideal audience find you.",
    organic_first_ads_later:
        "The smartest path here may be to start with organic, then layer in ads once the foundation is stronger.",
    sales_with_ads_support:
        "Pinterest could support sales for your brand, especially if you pair a strong organic foundation with paid promotion.",
    warm_audience_support:
        "Pinterest could play a strong supporting role by helping your brand attract and warm up future buyers over time.",
    selective_test_channel:
        "Pinterest may be worth testing for your brand as a selective discovery channel, but it will likely need sharper positioning and stronger creative to prove out than a more natural-fit category.",
    foundation_first:
        "There may be real potential here, but one or more important prerequisites still need tightening before Pinterest should do heavy lifting.",
    not_priority_yet:
        "Right now, Pinterest looks more like a later move than a now move - your foundation likely needs tightening first.",
} as const satisfies Record<RoleKey, string>;

export const CTA_BY_OUTCOME = {
    strong_fit: {
        label: "Book a Fit Call",
        url: PINTEREST_FIT_CALL_URL,
        subtext: "Your brand looks like it could be a strong candidate for Pinterest. Let's talk through what that could look like.",
        trackingEvent: "cta_fit_call_clicked",
    },
    possible_fit: {
        label: "Book a Fit Call",
        url: PINTEREST_FIT_CALL_URL,
        subtext: "There may be real potential here, but it depends on a few strategic factors. A fit call can help clarify that.",
        trackingEvent: "cta_fit_call_clicked",
    },
    not_right_now: {
        label: "Book a Fit Call",
        url: PINTEREST_FIT_CALL_URL,
        caption: "Still want to talk it through?",
        subtext: "If you want a second opinion on whether Pinterest is worth exploring later, you can still reach out.",
        trackingEvent: "cta_fit_call_clicked",
    },
} as const satisfies Record<OutcomeKey, CTAConfig>;
