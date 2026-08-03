# Mizora — Product Requirements Document

**Document version:** 1.0  
**Last updated:** August 4, 2026  
**Status:** Approved from product discovery interview  
**Product:** Mizora — AI-powered health and habit tracking (AI deferred post–V1)

---

## 1. Executive summary

Mizora helps people reduce unhealthy screen time while building sustainable daily habits. Users lock selected distracting apps and unlock them by completing self-chosen healthy challenges (e.g., steps, water intake). The product prioritizes fun, reward, and habit formation over willpower alone.

**Version 1** is free, focused, and polished: validate the core “earn your scroll” loop in India (English) before expanding features, monetization, or AI.

---

## 2. Problem statement

Students and young professionals (18–30) spend significant time on distracting apps (Instagram, YouTube, social media). They want to cut screen time without abandoning apps they enjoy, and they struggle to maintain healthy routines with discipline alone.

**Product opportunity:** Tie access to distracting apps to completed healthy actions so habits become part of daily life—not one-off restrictions.

---

## 3. Vision and success

### 3.1 Vision

Make healthy habits fun, rewarding, and sustainable by replacing passive scrolling with intentional, user-chosen challenges.

### 3.2 Definition of a successful user

A successful Mizora user:

- Naturally spends less time on distracting apps
- Becomes more physically active
- Consistently maintains healthy routines because those routines are embedded in daily life

### 3.3 Product success (not downloads alone)

Mizora succeeds when users:

- Return regularly (retention)
- Complete challenges consistently
- Reduce unnecessary screen time after adopting App Lock
- Replace screen time with healthy actions as a default behavior

---

## 4. Target market and users

| Attribute               | Definition                                                                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Primary segment**     | Students and young working professionals                                                                                                 |
| **Age**                 | 18–30                                                                                                                                    |
| **Geography (initial)** | India                                                                                                                                    |
| **Language (initial)**  | English                                                                                                                                  |
| **Behaviors**           | Heavy use of distracting/social apps; desire for practical screen-time reduction; difficulty sustaining habits via self-discipline alone |
| **Needs**               | Simple, practical way to limit apps without “ quitting” favorites entirely                                                               |

---

## 5. Product principles

1. **Habits over punishment** — Encourage and reward; avoid guilt, fear, or pressure.
2. **User control** — User chooses apps to lock, challenge types, and goals; system recommends, never overrides.
3. **Privacy by design** — Minimum data collection; explicit consent; transparency; no selling personal data.
4. **Clarity over complexity** — Dashboard and analytics stay understandable; no metric overload in V1.
5. **Core free forever** — Locking, basic challenges, and habit building remain free; premium adds flexibility and depth, not essentials.

---

## 6. Version 1 scope

### 6.1 In scope (V1)

| Capability                 | Description                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| **App Lock**               | User selects apps to lock; access gated until challenge completion                                       |
| **Challenge-based unlock** | User picks a challenge; completing it unlocks locked apps (for configured duration/rules as implemented) |
| **Challenge types**        | Step goals; water intake goals                                                                           |
| **Tracking**               | Daily steps, water intake, screen time                                                                   |
| **Recommendations**        | Suggest apps to lock based on usage patterns (requires App Usage permission when user engages)           |
| **Dashboard**              | Central view of progress, challenges, streaks, unlocks (see §9.1)                                        |
| **Notifications**          | Limited, helpful set (see §8)                                                                            |
| **Onboarding**             | Short path to dashboard (see §7)                                                                         |

### 6.2 Explicitly out of scope (V1)

- AI features (personalization, coaching, smart automation)
- Premium subscription and paywalls on core flows
- Social features and community
- Sleep, workout, and nutrition tracking
- Wearable integrations
- Advanced analytics (internal tracking may still support product metrics; user-facing stays simple)
- Advertising as a core experience
- App Lock setup during first-run onboarding (introduced from dashboard later)

### 6.3 V1 goals

- Validate core habit-building and App Lock + unlock loop
- Ship a simple, polished experience
- Learn via retention, challenge completion, and screen-time behavior change

---

## 7. Onboarding and permissions

### 7.1 Onboarding flow

- **Duration target:** User reaches dashboard within **15–20 seconds** on first launch.
- **First launch collects:** Minimum required information only (e.g., name optional).
- **No App Lock setup** during onboarding; introduce App Lock from dashboard once value is clear (reduce drop-off).
- **First “win”:** Immediate exploration of the app—not a long questionnaire.

### 7.2 Permission strategy (just-in-time)

| Permission                  | When requested                                        |
| --------------------------- | ----------------------------------------------------- |
| **Health** (steps, etc.)    | When user first uses a feature that needs it          |
| **App usage / screen time** | When user first uses tracking or lock recommendations |

Never front-load all permissions before the user sees value.

---

## 8. Notifications (V1)

### 8.1 Allowed notification types

- Challenge reminders
- Challenge completed
- App unlock ready
- Daily streak reminders

### 8.2 Policy

| Rule             | Requirement                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| **Volume**       | Maximum **2–3 notifications per day**                                   |
| **Quiet hours**  | Default **10:00 PM – 8:00 AM** (no notifications unless user overrides) |
| **User control** | Toggle and customize notification types anytime                         |
| **Tone**         | Helpful and encouraging                                                 |

### 8.3 Prohibited

- Promotional notifications
- Unnecessary or repetitive reminders
- Guilt-, pressure-, or fear-based messaging

---

## 9. Analytics and metrics

### 9.1 User-facing (dashboard)

Show only progress that motivates continued habit building:

- Today’s steps
- Today’s water intake
- Active challenges
- Completed challenges
- Unlocked apps (status)
- Current streak
- Simple weekly progress summary

**UX requirement:** Clean, easy to understand; avoid overwhelming graphs or raw data dumps in V1.

### 9.2 Internal product analytics (V1)

| Category          | Metrics                                                |
| ----------------- | ------------------------------------------------------ |
| **Activation**    | Onboarding completion rate                             |
| **Engagement**    | DAU, MAU                                               |
| **Core loop**     | Challenge acceptance rate, challenge completion rate   |
| **App Lock**      | App Lock adoption rate, average unlocked apps per user |
| **Outcome**       | Screen time reduction after enabling App Lock          |
| **Retention**     | Day 1, Day 7, Day 30 retention                         |
| **Notifications** | Notification engagement                                |
| **Product**       | Feature usage                                          |

Use these metrics to judge behavior change, not vanity downloads.

---

## 10. Business model

### 10.1 Version 1

- **100% free** — focus on validation and engaged user base.

### 10.2 Long term (freemium)

| Tier                   | Includes                                                                                                                                                   |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Free (always)**      | App lock, basic challenges, core habit building                                                                                                            |
| **Premium (optional)** | More challenge types, deeper insights/analytics, customizable automation, advanced app-lock rules, additional personalization; future premium capabilities |

- **Pricing:** Affordable for Indian users; **monthly and yearly** plans.
- **Trial:** Free trial so users can experience premium before subscribing.
- **Partnerships:** Health/wellness brand partnerships may be explored later; **not** ad-driven monetization.
- **Principle:** Premium = flexibility and convenience; **never** paywall essential habit-building features.

---

## 11. AI strategy (post–V1)

AI is **not** in V1. When introduced (roadmap Phase 3), AI must:

### 11.1 Role

- Help users build healthy habits; **not** control them
- Analyze screen time and activity to suggest better challenges
- Recommend apps worth locking
- Adjust challenge difficulty based on progress
- Provide simple insights and motivation

### 11.2 Constraints

- **Final decisions remain with the user**
- **No** medical advice or health diagnosis
- **No** guilt, fear, or shame-based motivation

---

## 12. Privacy and data

| Principle           | Requirement                                                        |
| ------------------- | ------------------------------------------------------------------ |
| **Minimization**    | Collect only data required for app function                        |
| **Consent**         | Explicit permission for health and app usage access                |
| **Local-first**     | Prefer on-device storage where possible                            |
| **Server**          | Only essential account and sync data, stored securely              |
| **No sale of data** | Never sell user data                                               |
| **No ad sharing**   | No sharing personal information with third parties for advertising |
| **Deletion**        | Users can delete account and associated data at any time           |
| **Transparency**    | Clear disclosure of what is collected, why, and how it is used     |

---

## 13. Roadmap (12–24 months)

### Phase 1 — 0–6 months (V1)

**Ship:** App Lock, challenge-based unlock, steps, water, screen time tracking, usage-based lock recommendations, polished dashboard and notifications.

**Goal:** Validate core idea, improve retention, iterate from user feedback, grow an active community.

### Phase 2 — 6–12 months

**Ship:** Additional challenge types, improved habit tracking, streak enhancements, weekly reports, customizable app-lock rules, **optional Premium**.

**Goal:** Increase engagement; establish sustainable business model without limiting core free experience.

### Phase 3 — 12–18 months

**Ship:** AI-powered personalization—smarter challenge recommendations, habit insights, intelligent automation (user-controlled).

**Goal:** More adaptive product while preserving user agency.

### Phase 4 — 18–24 months

**Ship:** Wearable integrations, wellness partnerships, community challenges, global expansion.

**Goal:** Evolve Mizora from a focused habit app into a broader digital wellbeing platform.

---

## 14. Core user journeys (V1)

### 14.1 First-time user

1. Open app → minimal info → dashboard (&lt; 20 s).
2. Explore tracking and value without locking apps.
3. When ready, enable App Lock from dashboard; grant permissions just-in-time.
4. Select apps to lock; choose step or water challenge; complete challenge → unlock.

### 14.2 Returning user

1. View dashboard (steps, water, streak, challenges, unlock status).
2. Complete active challenge or start new one.
3. Receive at most 2–3 helpful notifications per day (respect quiet hours).

---

## 15. Non-functional requirements (V1)

- **Performance:** Dashboard and tracking feel responsive on mid-range Android/iOS devices common in India.
- **Reliability:** Challenge completion and unlock state must be trustworthy (no false locks/unlocks).
- **Accessibility:** Readable typography and clear CTAs for primary flows (baseline; formal a11y audit can follow V1).
- **Platform:** Mobile app (Expo-based codebase); platform-specific constraints for App Usage / Screen Time APIs must be documented in technical specs.

---

## 16. Open items for engineering / design

These were not specified in discovery and should be resolved before build lock:

- Exact unlock duration/rules after challenge completion (time-based vs session-based)
- Water intake logging UX (manual entry vs presets)
- Account/sync model (guest vs required account) given privacy and Firebase/Supabase in stack
- India-specific compliance checklist (e.g., DPDP awareness) with legal review
- Premium pricing amounts and trial length (Phase 2)

---

## 17. Appendix — interview traceability

This PRD reflects product discovery answers covering: vision, target users, V1 features, business model, future AI behavior, onboarding, notifications, premium philosophy, analytics, privacy, and phased roadmap.

---

_End of document_
