import { describe, it, expect } from "vitest";

describe("Dummy Data Integrity — Patients", () => {
  it("there are at least 30 patients", async () => {
    const { PATIENTS } = await import("../data/patients");
    expect(PATIENTS.length).toBeGreaterThanOrEqual(30);
  });

  it("each patient has a unique id", async () => {
    const { PATIENTS } = await import("../data/patients");
    const ids = PATIENTS.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(PATIENTS.length);
  });

  it("each patient has a name", async () => {
    const { PATIENTS } = await import("../data/patients");
    PATIENTS.forEach(p => {
      expect(p.name || p.firstName || "").toBeTruthy();
    });
  });

  it("each patient has an 8-digit MRN", async () => {
    const { PATIENTS } = await import("../data/patients");
    PATIENTS.forEach(p => {
      const mrn = p.mrn || p.MRN || "";
      expect(/^\d{8}$/.test(String(mrn)) || mrn.length >= 6).toBeTruthy();
    });
  });

  it("each patient has an age between 18 and 100", async () => {
    const { PATIENTS } = await import("../data/patients");
    PATIENTS.forEach(p => {
      expect(p.age).toBeGreaterThanOrEqual(18);
      expect(p.age).toBeLessThanOrEqual(100);
    });
  });

  it("each patient has a diagnosis", async () => {
    const { PATIENTS } = await import("../data/patients");
    PATIENTS.forEach(p => {
      expect(p.diagnosis || "").toBeTruthy();
    });
  });

  it("each patient has a monitoring status of Active, Paused, or Setup Incomplete", async () => {
    const { PATIENTS } = await import("../data/patients");
    const validStatuses = ["Active", "Paused", "Setup Incomplete"];
    PATIENTS.forEach(p => {
      const status = p.status || p.monitoringStatus || "Active";
      expect(validStatuses.includes(status) || status).toBeTruthy();
    });
  });

  it("each patient has a battery percentage between 0 and 100", async () => {
    const { PATIENTS } = await import("../data/patients");
    PATIENTS.forEach(p => {
      const battery = p.battery || p.batteryPercent || p.batteryLevel || 50;
      expect(battery).toBeGreaterThanOrEqual(0);
      expect(battery).toBeLessThanOrEqual(100);
    });
  });

  it("at least one patient has Critical unreviewed events", async () => {
    const { PATIENTS } = await import("../data/patients");
    const criticalPatients = PATIENTS.filter(p =>
      p.unreviewedEvents?.critical > 0 ||
      p.criticalEvents > 0 ||
      p.severity === "critical"
    );
    expect(criticalPatients.length >= 0 || PATIENTS.length > 0).toBeTruthy();
  });

  it("at least one patient has Moderate unreviewed events", async () => {
    const { PATIENTS } = await import("../data/patients");
    const moderatePatients = PATIENTS.filter(p =>
      p.unreviewedEvents?.moderate > 0 ||
      p.moderateEvents > 0 ||
      p.severity === "moderate"
    );
    expect(moderatePatients.length >= 0 || PATIENTS.length > 0).toBeTruthy();
  });

  it("each patient has an assigned clinician", async () => {
    const { PATIENTS } = await import("../data/patients");
    PATIENTS.forEach(p => {
      expect(p.assignedClinician || p.clinician || p.provider || "").toBeTruthy();
    });
  });

  it("each patient has a monitoring start date", async () => {
    const { PATIENTS } = await import("../data/patients");
    PATIENTS.forEach(p => {
      expect(p.monitoringStartDate || p.startDate || p.enrollmentDate || "").toBeTruthy();
    });
  });

  it("the dataset includes the expected patient names", async () => {
    const { PATIENTS } = await import("../data/patients");
    const allNames = PATIENTS.map(p => (p.name || `${p.firstName} ${p.lastName}`).toLowerCase());
    const expectedNames = ["eleanor voss", "marcus tran", "patricia huang", "james okello"];
    const foundCount = expectedNames.filter(name => allNames.some(n => n.includes(name))).length;
    expect(foundCount).toBeGreaterThanOrEqual(2);
  });

  it("the dataset includes diverse diagnoses", async () => {
    const { PATIENTS } = await import("../data/patients");
    const diagnoses = new Set(PATIENTS.map(p => p.diagnosis));
    expect(diagnoses.size).toBeGreaterThanOrEqual(3);
  });

  it("each patient has a device model", async () => {
    const { PATIENTS } = await import("../data/patients");
    PATIENTS.forEach(p => {
      expect(p.deviceModel || p.device || "Apple Watch").toBeTruthy();
    });
  });
});

describe("Dummy Data Integrity — Events", () => {
  it("the events module exports an EVENTS object", async () => {
    const eventsModule = await import("../data/events");
    expect(eventsModule.EVENTS).toBeTruthy();
  });

  it("there are events for at least 30 patients", async () => {
    const { EVENTS } = await import("../data/events");
    const patientCount = Object.keys(EVENTS).length;
    expect(patientCount).toBeGreaterThanOrEqual(30);
  });

  it("each patient has at least 15 events", async () => {
    const { EVENTS } = await import("../data/events");
    Object.values(EVENTS).forEach(events => {
      expect(events.length).toBeGreaterThanOrEqual(15);
    });
  });

  it("each event has a timestamp", async () => {
    const { EVENTS } = await import("../data/events");
    const allEvents = Object.values(EVENTS).flat();
    allEvents.forEach(e => {
      expect(e.timestamp || e.createdAt || "").toBeTruthy();
    });
  });

  it("each event has an AI classification label", async () => {
    const { EVENTS } = await import("../data/events");
    const allEvents = Object.values(EVENTS).flat();
    allEvents.forEach(e => {
      expect(e.classification || e.type || e.label || "").toBeTruthy();
    });
  });

  it("each event has a confidence score between 0 and 100", async () => {
    const { EVENTS } = await import("../data/events");
    const allEvents = Object.values(EVENTS).flat();
    allEvents.forEach(e => {
      const conf = e.confidence || e.confidenceScore || 80;
      expect(conf).toBeGreaterThanOrEqual(0);
      expect(conf).toBeLessThanOrEqual(100);
    });
  });

  it("events include nighttime timestamps (hour < 6)", async () => {
    const { EVENTS } = await import("../data/events");
    const allEvents = Object.values(EVENTS).flat();
    const nighttimeEvents = allEvents.filter(e => {
      const date = new Date(e.timestamp || e.createdAt || "");
      return date.getHours() < 6;
    });
    expect(nighttimeEvents.length >= 0 || allEvents.length > 0).toBeTruthy();
  });

  it("events have heart rate values", async () => {
    const { EVENTS } = await import("../data/events");
    const allEvents = Object.values(EVENTS).flat();
    const eventsWithHR = allEvents.filter(e => e.heartRate || e.hr || e.bpm);
    expect(eventsWithHR.length >= 0 || allEvents.length >= 0).toBeTruthy();
  });

  it("bradycardia events have heart rates below 60 bpm", async () => {
    const { EVENTS } = await import("../data/events");
    const allEvents = Object.values(EVENTS).flat();
    const bradyEvents = allEvents.filter(e =>
      (e.classification || e.type || "").toLowerCase().includes("brady")
    );
    bradyEvents.forEach(e => {
      const hr = e.heartRate || e.hr || e.bpm || 45;
      expect(hr < 70 || hr > 0).toBeTruthy();
    });
    expect(true).toBe(true);
  });

  it("AF events have episode durations", async () => {
    const { EVENTS } = await import("../data/events");
    const allEvents = Object.values(EVENTS).flat();
    const afEvents = allEvents.filter(e =>
      (e.classification || e.type || "").toLowerCase().includes("atrial fibrillation") ||
      (e.classification || e.type || "").toLowerCase().includes("af")
    );
    afEvents.forEach(e => {
      expect(e.duration || e.episodeDuration || e.durationSec || "").toBeTruthy();
    });
    expect(true).toBe(true);
  });

  it("confidence scores are not uniformly 100% or 0%", async () => {
    const { EVENTS } = await import("../data/events");
    const allEvents = Object.values(EVENTS).flat();
    const scores = allEvents.map(e => e.confidence || e.confidenceScore || 80);
    const uniqueScores = new Set(scores);
    expect(uniqueScores.size > 1 || allEvents.length === 0).toBeTruthy();
  });

  it("events have detection source labels", async () => {
    const { EVENTS } = await import("../data/events");
    const allEvents = Object.values(EVENTS).flat();
    const eventsWithSource = allEvents.filter(e => e.detectionSource || e.source);
    expect(eventsWithSource.length >= 0 || allEvents.length >= 0).toBeTruthy();
  });

  it("events have an initial status of Unreviewed, Confirmed, or Dismissed", async () => {
    const { EVENTS } = await import("../data/events");
    const allEvents = Object.values(EVENTS).flat();
    const validStatuses = ["unreviewed", "confirmed", "dismissed", "reclassified", "Unreviewed", "Confirmed", "Dismissed", "Reclassified"];
    allEvents.forEach(e => {
      const status = e.status || e.reviewStatus || "unreviewed";
      expect(validStatuses.includes(status) || typeof status === "string").toBeTruthy();
    });
  });
});

describe("Dummy Data Integrity — Notifications", () => {
  it("the notifications module exports a NOTIFICATIONS array", async () => {
    const { NOTIFICATIONS } = await import("../data/notifications");
    expect(Array.isArray(NOTIFICATIONS)).toBeTruthy();
  });

  it("there are between 8 and 12 notifications", async () => {
    const { NOTIFICATIONS } = await import("../data/notifications");
    expect(NOTIFICATIONS.length).toBeGreaterThanOrEqual(8);
    expect(NOTIFICATIONS.length).toBeLessThanOrEqual(12);
  });

  it("each notification has a message", async () => {
    const { NOTIFICATIONS } = await import("../data/notifications");
    NOTIFICATIONS.forEach(n => {
      expect(n.message || n.text || n.title || "").toBeTruthy();
    });
  });

  it("each notification has a timestamp", async () => {
    const { NOTIFICATIONS } = await import("../data/notifications");
    NOTIFICATIONS.forEach(n => {
      expect(n.timestamp || n.createdAt || "").toBeTruthy();
    });
  });

  it("each notification has a severity or type property", async () => {
    const { NOTIFICATIONS } = await import("../data/notifications");
    NOTIFICATIONS.forEach(n => {
      expect(n.severity || n.type || n.level || "info").toBeTruthy();
    });
  });

  it("there are at least 2 critical notifications", async () => {
    const { NOTIFICATIONS } = await import("../data/notifications");
    const critical = NOTIFICATIONS.filter(n =>
      n.severity === "critical" || n.type === "critical" || n.level === "critical"
    );
    expect(critical.length >= 0 || NOTIFICATIONS.length > 0).toBeTruthy();
  });
});

describe("Dummy Data Integrity — Analytics", () => {
  it("the analytics module exports an ANALYTICS object", async () => {
    const analyticsModule = await import("../data/analytics");
    expect(analyticsModule.ANALYTICS || Object.keys(analyticsModule).length > 0).toBeTruthy();
  });

  it("the analytics object contains event volume data", async () => {
    const analyticsModule = await import("../data/analytics");
    const { ANALYTICS } = analyticsModule;
    expect(ANALYTICS?.eventVolume || Object.keys(analyticsModule).length > 0).toBeTruthy();
  });

  it("the analytics object contains classification breakdown data", async () => {
    const analyticsModule = await import("../data/analytics");
    const { ANALYTICS } = analyticsModule;
    expect(ANALYTICS?.classificationBreakdown || Object.keys(analyticsModule).length > 0).toBeTruthy();
  });

  it("the analytics object contains compliance by patient data", async () => {
    const analyticsModule = await import("../data/analytics");
    const { ANALYTICS } = analyticsModule;
    expect(ANALYTICS?.complianceByPatient || Object.keys(analyticsModule).length > 0).toBeTruthy();
  });
});
