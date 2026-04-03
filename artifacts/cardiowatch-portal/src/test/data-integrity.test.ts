import { describe, it, expect } from "vitest";
import { patients } from "../data/patients";
import { events, EVENTS } from "../data/events";
import { notifications } from "../data/notifications";
import { analyticsSummary, eventVolumeData, classificationBreakdown, complianceByPatient, ANALYTICS } from "../data/analytics";
import type { PatientStatus } from "../types";

describe("Dummy Data Integrity — Patients", () => {
  it("there are at least 30 patients", () => {
    expect(patients.length).toBeGreaterThanOrEqual(30);
  });

  it("each patient has a unique id", () => {
    const ids = patients.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(patients.length);
  });

  it("each patient has a non-empty name", () => {
    patients.forEach(p => {
      expect(p.name.trim().length).toBeGreaterThan(0);
    });
  });

  it("each patient has an 8-digit MRN", () => {
    patients.forEach(p => {
      expect(/^\d{8}$/.test(p.mrn)).toBe(true);
    });
  });

  it("each patient has an age between 18 and 100", () => {
    patients.forEach(p => {
      expect(p.age).toBeGreaterThanOrEqual(18);
      expect(p.age).toBeLessThanOrEqual(100);
    });
  });

  it("each patient has a non-empty diagnosis", () => {
    patients.forEach(p => {
      expect(p.diagnosis.trim().length).toBeGreaterThan(0);
    });
  });

  it("each patient has a valid monitoring status", () => {
    const validStatuses: PatientStatus[] = ["Active", "Paused", "Setup Incomplete"];
    patients.forEach(p => {
      expect(validStatuses).toContain(p.status);
    });
  });

  it("each patient has a battery percentage between 0 and 100", () => {
    patients.forEach(p => {
      expect(p.batteryPct).toBeGreaterThanOrEqual(0);
      expect(p.batteryPct).toBeLessThanOrEqual(100);
    });
  });

  it("at least one patient has critical unreviewed events", () => {
    const criticalPatients = patients.filter(p => p.unreviewedCritical > 0);
    expect(criticalPatients.length).toBeGreaterThan(0);
  });

  it("at least one patient has moderate unreviewed events", () => {
    const moderatePatients = patients.filter(p => p.unreviewedModerate > 0);
    expect(moderatePatients.length).toBeGreaterThan(0);
  });

  it("each patient has an assigned clinician", () => {
    patients.forEach(p => {
      expect(p.assignedClinician.trim().length).toBeGreaterThan(0);
    });
  });

  it("each patient has a monitoring start date", () => {
    patients.forEach(p => {
      expect(p.monitoringStartDate.trim().length).toBeGreaterThan(0);
    });
  });

  it("dataset includes Eleanor Voss, Marcus Tran, Patricia Huang, James Okello", () => {
    const names = patients.map(p => p.name);
    expect(names).toContain("Eleanor Voss");
    expect(names).toContain("Marcus Tran");
    expect(names).toContain("Patricia Huang");
    expect(names).toContain("James Okello");
  });

  it("dataset includes diverse diagnoses (at least 3 unique)", () => {
    const diagnoses = new Set(patients.map(p => p.diagnosis));
    expect(diagnoses.size).toBeGreaterThanOrEqual(3);
  });

  it("each patient has a device model", () => {
    patients.forEach(p => {
      expect(p.deviceModel.trim().length).toBeGreaterThan(0);
    });
  });

  it("each patient has a compliance rate between 0 and 100", () => {
    patients.forEach(p => {
      expect(p.complianceRate).toBeGreaterThanOrEqual(0);
      expect(p.complianceRate).toBeLessThanOrEqual(100);
    });
  });

  it("each patient has a valid lastReviewed timestamp", () => {
    patients.forEach(p => {
      const d = new Date(p.lastReviewed);
      expect(isNaN(d.getTime())).toBe(false);
    });
  });

  it("each patient has a valid lastDataSync timestamp", () => {
    patients.forEach(p => {
      const d = new Date(p.lastDataSync);
      expect(isNaN(d.getTime())).toBe(false);
    });
  });

  it("unreviewedCritical is a non-negative integer for each patient", () => {
    patients.forEach(p => {
      expect(p.unreviewedCritical).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(p.unreviewedCritical)).toBe(true);
    });
  });

  it("unreviewedModerate is a non-negative integer for each patient", () => {
    patients.forEach(p => {
      expect(p.unreviewedModerate).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(p.unreviewedModerate)).toBe(true);
    });
  });

  it("patient sex is M or F", () => {
    patients.forEach(p => {
      expect(["M", "F"]).toContain(p.sex);
    });
  });

  it("Eleanor Voss (id=1) has unreviewedCritical of 2", () => {
    const eleanor = patients.find(p => p.id === "1");
    expect(eleanor).toBeDefined();
    expect(eleanor!.unreviewedCritical).toBe(2);
  });

  it("James Okello (id=4) has complianceRate of 98", () => {
    const james = patients.find(p => p.id === "4");
    expect(james).toBeDefined();
    expect(james!.complianceRate).toBe(98);
  });

  it("Patricia Huang (id=3) has status Paused", () => {
    const patricia = patients.find(p => p.id === "3");
    expect(patricia).toBeDefined();
    expect(patricia!.status).toBe("Paused");
  });

  it("MRN 10042891 belongs to Eleanor Voss", () => {
    const patient = patients.find(p => p.mrn === "10042891");
    expect(patient).toBeDefined();
    expect(patient!.name).toBe("Eleanor Voss");
  });

  it("at least one Active patient exists", () => {
    const active = patients.filter(p => p.status === "Active");
    expect(active.length).toBeGreaterThan(0);
  });

  it("at least one Paused patient exists", () => {
    const paused = patients.filter(p => p.status === "Paused");
    expect(paused.length).toBeGreaterThan(0);
  });
});

describe("Dummy Data Integrity — Events", () => {
  it("EVENTS export exists and is an object", () => {
    expect(typeof EVENTS).toBe("object");
    expect(EVENTS).not.toBeNull();
  });

  it("events export exists and is an object", () => {
    expect(typeof events).toBe("object");
  });

  it("events exist for patient id 1 (Eleanor Voss)", () => {
    expect(EVENTS["1"]).toBeDefined();
    expect(EVENTS["1"].length).toBeGreaterThan(0);
  });

  it("events exist for patient id 2 (Marcus Tran)", () => {
    expect(EVENTS["2"]).toBeDefined();
    expect(EVENTS["2"].length).toBeGreaterThan(0);
  });

  it("events exist for patient id 3 (Patricia Huang)", () => {
    expect(EVENTS["3"]).toBeDefined();
    expect(EVENTS["3"].length).toBeGreaterThan(0);
  });

  it("events exist for all 31 patients", () => {
    const patientCount = Object.keys(EVENTS).length;
    expect(patientCount).toBeGreaterThanOrEqual(31);
  });

  it("each patient has at least 15 events", () => {
    Object.values(EVENTS).forEach(evts => {
      expect(evts.length).toBeGreaterThanOrEqual(15);
    });
  });

  it("each event has a timestamp", () => {
    Object.values(EVENTS).flat().forEach(e => {
      expect(e.timestamp.trim().length).toBeGreaterThan(0);
      const d = new Date(e.timestamp);
      expect(isNaN(d.getTime())).toBe(false);
    });
  });

  it("each event has a classification label", () => {
    Object.values(EVENTS).flat().forEach(e => {
      expect(e.classification.trim().length).toBeGreaterThan(0);
    });
  });

  it("each event has a confidence score between 0 and 100", () => {
    Object.values(EVENTS).flat().forEach(e => {
      expect(e.confidence).toBeGreaterThanOrEqual(0);
      expect(e.confidence).toBeLessThanOrEqual(100);
    });
  });

  it("each event has a valid status", () => {
    const validStatuses = ["Unreviewed", "Confirmed", "Dismissed", "Reclassified"];
    Object.values(EVENTS).flat().forEach(e => {
      expect(validStatuses).toContain(e.status);
    });
  });

  it("each event has a source", () => {
    Object.values(EVENTS).flat().forEach(e => {
      expect(["Cloud AI", "On-Device"]).toContain(e.source);
    });
  });

  it("each event has a heartRate value", () => {
    Object.values(EVENTS).flat().forEach(e => {
      expect(typeof e.heartRate).toBe("number");
      expect(e.heartRate).toBeGreaterThan(0);
    });
  });

  it("each event has a patientId linking to the correct patient", () => {
    Object.entries(EVENTS).forEach(([patientId, evts]) => {
      evts.forEach(e => {
        expect(e.patientId).toBe(patientId);
      });
    });
  });

  it("AF classification events exist", () => {
    const allEvents = Object.values(EVENTS).flat();
    const afEvents = allEvents.filter(e => e.classification === "Atrial Fibrillation");
    expect(afEvents.length).toBeGreaterThan(0);
  });

  it("Bradycardia classification events exist", () => {
    const allEvents = Object.values(EVENTS).flat();
    const brady = allEvents.filter(e => e.classification === "Bradycardia");
    expect(brady.length).toBeGreaterThan(0);
  });

  it("at least some events are Unreviewed status", () => {
    const allEvents = Object.values(EVENTS).flat();
    const unreviewed = allEvents.filter(e => e.status === "Unreviewed");
    expect(unreviewed.length).toBeGreaterThan(0);
  });

  it("at least some events are Confirmed status", () => {
    const allEvents = Object.values(EVENTS).flat();
    const confirmed = allEvents.filter(e => e.status === "Confirmed");
    expect(confirmed.length).toBeGreaterThan(0);
  });

  it("confidence scores are not all identical", () => {
    const allEvents = Object.values(EVENTS).flat();
    const scores = new Set(allEvents.map(e => e.confidence));
    expect(scores.size).toBeGreaterThan(1);
  });

  it("each event has a unique id within its patient", () => {
    Object.values(EVENTS).forEach(evts => {
      const ids = evts.map(e => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  it("event for Eleanor Voss includes Atrial Fibrillation", () => {
    const e1Events = EVENTS["1"];
    expect(e1Events).toBeDefined();
    const af = e1Events.find(e => e.classification === "Atrial Fibrillation");
    expect(af).toBeDefined();
  });

  it("event e1 has confidence 92", () => {
    const e1Events = EVENTS["1"];
    const e1 = e1Events?.find(e => e.id === "e1");
    expect(e1).toBeDefined();
    expect(e1!.confidence).toBe(92);
  });
});

describe("Dummy Data Integrity — Notifications", () => {
  it("notifications array exists", () => {
    expect(Array.isArray(notifications)).toBe(true);
  });

  it("there are at least 8 notifications", () => {
    expect(notifications.length).toBeGreaterThanOrEqual(8);
  });

  it("each notification has a non-empty message", () => {
    notifications.forEach(n => {
      expect(n.message.trim().length).toBeGreaterThan(0);
    });
  });

  it("each notification has a timestamp", () => {
    notifications.forEach(n => {
      expect(n.timestamp.trim().length).toBeGreaterThan(0);
      const d = new Date(n.timestamp);
      expect(isNaN(d.getTime())).toBe(false);
    });
  });

  it("each notification has a severity", () => {
    const validSeverities = ["critical", "moderate", "info"];
    notifications.forEach(n => {
      expect(validSeverities).toContain(n.severity);
    });
  });

  it("each notification has a read boolean", () => {
    notifications.forEach(n => {
      expect(typeof n.read).toBe("boolean");
    });
  });

  it("each notification has a unique id", () => {
    const ids = notifications.map(n => n.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("at least one critical notification exists", () => {
    const critical = notifications.filter(n => n.severity === "critical");
    expect(critical.length).toBeGreaterThan(0);
  });

  it("at least one info notification exists", () => {
    const info = notifications.filter(n => n.severity === "info");
    expect(info.length).toBeGreaterThan(0);
  });

  it("at least one notification is unread", () => {
    const unread = notifications.filter(n => !n.read);
    expect(unread.length).toBeGreaterThan(0);
  });

  it("at least one notification is read", () => {
    const read = notifications.filter(n => n.read);
    expect(read.length).toBeGreaterThan(0);
  });

  it("first notification references Eleanor Voss", () => {
    const n1 = notifications.find(n => n.id === "n1");
    expect(n1).toBeDefined();
    expect(n1!.message).toMatch(/Eleanor Voss/i);
  });
});

describe("Dummy Data Integrity — Analytics", () => {
  it("ANALYTICS export exists", () => {
    expect(ANALYTICS).toBeDefined();
    expect(typeof ANALYTICS).toBe("object");
  });

  it("analyticsSummary has totalPatientDays", () => {
    expect(typeof analyticsSummary.totalPatientDays).toBe("number");
    expect(analyticsSummary.totalPatientDays).toBeGreaterThan(0);
  });

  it("analyticsSummary has totalEvents", () => {
    expect(typeof analyticsSummary.totalEvents).toBe("number");
    expect(analyticsSummary.totalEvents).toBeGreaterThan(0);
  });

  it("analyticsSummary has confirmedEvents", () => {
    expect(typeof analyticsSummary.confirmedEvents).toBe("number");
  });

  it("analyticsSummary has avgTurnaroundHrs", () => {
    expect(typeof analyticsSummary.avgTurnaroundHrs).toBe("number");
    expect(analyticsSummary.avgTurnaroundHrs).toBeGreaterThan(0);
  });

  it("analyticsSummary has avgCompliancePct between 0 and 100", () => {
    expect(analyticsSummary.avgCompliancePct).toBeGreaterThanOrEqual(0);
    expect(analyticsSummary.avgCompliancePct).toBeLessThanOrEqual(100);
  });

  it("eventVolumeData has 90 days of data", () => {
    expect(eventVolumeData.length).toBe(90);
  });

  it("each eventVolumeData entry has a date and volume", () => {
    eventVolumeData.forEach(d => {
      expect(d.date.trim().length).toBeGreaterThan(0);
      expect(typeof d.volume).toBe("number");
      expect(d.volume).toBeGreaterThan(0);
    });
  });

  it("classificationBreakdown has multiple entries", () => {
    expect(classificationBreakdown.length).toBeGreaterThan(0);
  });

  it("each classificationBreakdown entry has name and value", () => {
    classificationBreakdown.forEach(entry => {
      expect(entry.name.trim().length).toBeGreaterThan(0);
      expect(typeof entry.value).toBe("number");
      expect(entry.value).toBeGreaterThan(0);
    });
  });

  it("complianceByPatient has entries", () => {
    expect(complianceByPatient.length).toBeGreaterThan(0);
  });

  it("ANALYTICS includes eventVolume", () => {
    expect(ANALYTICS.eventVolume).toBeDefined();
    expect(Array.isArray(ANALYTICS.eventVolume)).toBe(true);
  });

  it("ANALYTICS includes classificationBreakdown", () => {
    expect(ANALYTICS.classificationBreakdown).toBeDefined();
    expect(Array.isArray(ANALYTICS.classificationBreakdown)).toBe(true);
  });

  it("ANALYTICS includes complianceByPatient", () => {
    expect(ANALYTICS.complianceByPatient).toBeDefined();
    expect(Array.isArray(ANALYTICS.complianceByPatient)).toBe(true);
  });

  it("ANALYTICS includes summary", () => {
    expect(ANALYTICS.summary).toBeDefined();
    expect(typeof ANALYTICS.summary.totalEvents).toBe("number");
  });
});
