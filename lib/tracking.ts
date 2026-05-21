type TrackingProperties = Record<string, string | number | boolean | null>;

export function trackEvent(
  eventName: string,
  properties: TrackingProperties = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...properties,
  };

  window.dispatchEvent(new CustomEvent("prime-nps-track", { detail: payload }));

  window
    .fetch("/api/nps/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    })
    .catch(() => {
      // Analytics should never block the respondent experience.
    });

  if (
    process.env.NODE_ENV !== "production" &&
    window.localStorage.getItem("prime-nps-debug-events") === "true"
  ) {
    console.info("[nps-event]", payload);
  }
}
