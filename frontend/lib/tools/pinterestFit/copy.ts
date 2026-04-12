import { PINTEREST_FIT_CALL_URL } from "./config";
import type { CTAConfig, IntroCopy, OutcomeCopy, OutcomeKey, ReasonKey, RoleKey } from "./types";

export const INTRO_COPY = {
    title: "Could Pinterest Be a Bigger Opportunity for Your Brand Than You Think?",
    subtitle:
        "In under 2 minutes, find out whether Pinterest is a real opportunity for your brand — or just a distraction.",
    supportLine: "Built for product-based brands",
    primaryButtonLabel: "See If It’s a Fit",
    durationNote: "Takes about 2 minutes",
} as const satisfies IntroCopy;

export const RESULT_COPY_BY_OUTCOME = {
    strong_fit: {
        label: "Strong fit",
        headline: "Pinterest Could Be a Strong Growth Channel for Your Brand",
        intro: "Your answers suggest Pinterest could be a real growth opportunity for your brand — not just a nice-to-have.",
    },
    possible_fit: {
        label: "Possible fit",
        headline: "Pinterest Could Work for Your Brand — With the Right Strategy",
        intro: "There’s real potential here, but whether Pinterest pays off for your brand depends on how you approach it.",
    },
    not_right_now: {
        label: "Not the right fit right now",
        headline: "Pinterest May Be Premature for Your Brand Right Now",
        intro: "Pinterest doesn’t look like the smartest next move for your brand right now — at least not with your current setup.",
    },
} as const satisfies Record<OutcomeKey, OutcomeCopy>;

export const REASON_COPY_BY_KEY = {
    reason_category_strong:
        "Your niche has strong Pinterest potential — millions of people are actively looking for products and solutions like yours.",
    reason_category_good:
        "Your product category can work well on Pinterest, especially with the right positioning and creative strategy.",
    reason_category_maybe: "There may be room for your brand on Pinterest, but it will take sharper positioning to stand out.",
    reason_category_weak:
        "Your category is not the most obvious Pinterest fit, so the channel has more to prove in your case.",
    reason_offer_proven:
        "You already have a product or collection with real traction, which gives Pinterest something strong to amplify.",
    reason_offer_some_traction:
        "You’re not starting from zero — there’s already enough traction here to make Pinterest worth considering.",
    reason_offer_early: "Your product is still early, which makes Pinterest harder to evaluate as a channel right now.",
    reason_offer_unproven: "Your offer still needs stronger proof of demand before Pinterest becomes a smart next move.",
    reason_assets_strong:
        "You already have the kind of visual and supporting content that turns Pinterest traffic into potential customers.",
    reason_assets_decent:
        "You have enough content to start getting discovered in front of the right audience, even if there are still some gaps.",
    reason_assets_limited: "Your content library feels a bit thin right now, which means Pinterest may work more slowly.",
    reason_assets_weak:
        "Right now, your brand would need a much stronger content foundation before Pinterest makes sense to prioritize.",
    reason_site_ready: "Your website looks ready to turn Pinterest visitors into potential customers.",
    reason_site_solid: "Your site is in decent shape, which gives Pinterest a workable place to send traffic.",
    reason_site_friction: "Your website may still create friction if Pinterest starts driving traffic.",
    reason_site_not_ready: "Your website is not ready enough yet to make Pinterest traffic worth pursuing.",
    reason_goal_discovery:
        "Your goal lines up with one of Pinterest’s biggest strengths: getting your brand discovered by the right people.",
    reason_goal_traffic: "Pinterest can be a strong fit when the goal is driving qualified traffic to products or collections.",
    reason_goal_launches:
        "Pinterest can work well for launches and seasonal pushes when there’s a clear offer and enough creative support behind it.",
    reason_goal_retargeting:
        "Using Pinterest to build a warmer audience can make strategic sense, especially as part of a broader funnel.",
    reason_goal_sales_caution:
        "Pinterest can support sales, but it usually works best when the foundation is strong — and it can be especially powerful when paired with ads.",
    reason_support_ready:
        "You’re ready to take action if the opportunity is there, which makes Pinterest much more realistic to test now.",
    reason_support_open: "You’re open enough to explore this seriously, even if you’d want to start lean.",
    reason_support_cautious: "There’s interest here, but the hesitation could slow momentum if Pinterest does look promising.",
    reason_support_not_committed:
        "Right now, there doesn’t seem to be enough commitment behind seriously exploring Pinterest.",
    reason_ads_open: "You’re open to ads if they make sense, which gives Pinterest more room to become a meaningful channel.",
    reason_ads_later: "You’re open to ads later, which gives Pinterest a clearer path if the organic foundation looks promising.",
    reason_ads_unsure: "You’re still unsure about ads, so Pinterest may need to start as a slower organic test.",
    reason_ads_not_open: "If ads are fully off the table, Pinterest may need to play a narrower role for your brand.",
} as const satisfies Record<ReasonKey, string>;

export const ROLE_COPY_BY_KEY = {
    discovery_traffic: "Pinterest looks most promising here as a discovery and traffic channel for your brand.",
    organic_first_ads_later:
        "Pinterest may make the most sense as an organic-first channel, with room to layer ads later if the foundation proves strong.",
    sales_with_ads_support:
        "Pinterest could support sales for your brand, especially if you pair a strong organic foundation with paid promotion.",
    warm_audience_support:
        "Pinterest could play a strong supporting role by helping your brand attract and warm up future buyers over time.",
    selective_test_channel:
        "Pinterest may be worth testing for your brand as a selective discovery channel, but it will likely need sharper positioning and stronger creative to prove out than a more natural-fit category.",
    foundation_first:
        "There may be real potential here, but one or more important prerequisites still need tightening before Pinterest should do heavy lifting.",
    not_priority_yet:
        "Pinterest does not look like the right priority right now. Your foundation likely needs more work before this channel becomes worth serious attention.",
} as const satisfies Record<RoleKey, string>;

export const CTA_BY_OUTCOME = {
    strong_fit: {
        label: "Book a Fit Call",
        url: PINTEREST_FIT_CALL_URL,
        caption: "Want to talk through what this could look like for your brand?",
        subtext: "Based on your answers, Pinterest looks like a channel your brand should be taking seriously.",
        trackingEvent: "cta_fit_call_clicked",
    },
    possible_fit: {
        label: "Book a Fit Call",
        url: PINTEREST_FIT_CALL_URL,
        caption: "Want help figuring out whether Pinterest is worth pursuing for your brand?",
        subtext: "There may be real potential here, but whether Pinterest is worth pursuing depends on a few strategic factors.",
        trackingEvent: "cta_fit_call_clicked",
    },
    not_right_now: {
        label: "Book a Fit Call",
        url: PINTEREST_FIT_CALL_URL,
        caption: "Still want to talk it through or get a second opinion?",
        subtext: "If you want a second opinion on whether Pinterest is worth exploring later, you can still reach out.",
        trackingEvent: "cta_fit_call_clicked",
    },
} as const satisfies Record<OutcomeKey, CTAConfig>;
