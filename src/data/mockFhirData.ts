import { fhirR4 } from "@smile-cdr/fhirts";

// Mock patient data
export const mockPatient: fhirR4.Patient = {
  resourceType: "Patient",
  id: "patient-example-female",
  meta: {
    profile: ["http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips"],
  },
  text: {
    status: "generated",
    div: '<div xmlns="http://www.w3.org/1999/xhtml"><p class="res-header-id"><b>Generated Narrative: Patient patient-example-female</b></p><a name="patient-example-female"> </a><a name="hcpatient-example-female"> </a><div style="display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%"><p style="margin-bottom: 0px"/><p style="margin-bottom: 0px">Profile: <a href="StructureDefinition-Patient-uv-ips.html">Patient (IPS)</a></p></div><p style="border: 1px #661aff solid; background-color: #e6e6ff; padding: 10px;">Martha DeLarosa  Female, DoB: 1992-05-01 ( urn:oid:2.16.840.1.113883.2.4.6.3#574687583)</p><hr/><table class="grid"><tr><td style="background-color: #f3f5da" title="Record is active">Active:</td><td colspan="3">true</td></tr><tr><td style="background-color: #f3f5da" title="Ways to contact the Patient">Contact Detail</td><td colspan="3"><ul><li><a href="tel:+31788700800">+31788700800</a></li><li>Laan Van Europa 1600 Dordrecht 3317 DB NL </li></ul></td></tr><tr><td style="background-color: #f3f5da" title="Nominated Contact: mother">mother:</td><td colspan="3"><ul><li>Martha Mum </li><li>Promenade des Anglais 111 Lyon 69001 FR </li><li><a href="tel:+33-555-20036">+33-555-20036</a></li></ul></td></tr></table></div>',
  },
  identifier: [
    {
      system: "urn:oid:2.16.840.1.113883.2.4.6.3",
      value: "574687583",
    },
  ],
  active: true,
  name: [
    {
      family: "DeLarosa",
      given: ["Martha"],
    },
  ],
  telecom: [
    {
      system: "phone",
      value: "+31788700800",
      use: "home",
    },
  ],
  gender: "female",
  birthDate: "1992-05-01",
  address: [
    {
      line: ["Laan Van Europa 1600"],
      city: "Dordrecht",
      postalCode: "3317 DB",
      country: "NL",
    },
  ],
  contact: [
    {
      relationship: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
              code: "MTH",
            },
          ],
        },
      ],
      name: {
        family: "Mum",
        given: ["Martha"],
      },
      telecom: [
        {
          system: "phone",
          value: "+33-555-20036",
          use: "home",
        },
      ],
      address: {
        line: ["Promenade des Anglais 111"],
        city: "Lyon",
        postalCode: "69001",
        country: "FR",
      },
    },
  ],
};

export const allergyIntoleranceOne: fhirR4.AllergyIntolerance = {
  resourceType: "AllergyIntolerance",
  id: "allergyintolerance-multiple-codings",
  meta: {
    profile: [
      "http://hl7.org/fhir/uv/ips/StructureDefinition/AllergyIntolerance-uv-ips",
    ],
  },
  text: {
    status: "extensions",
    div: '<div xmlns="http://www.w3.org/1999/xhtml"><p class="res-header-id"><b>Generated Narrative: AllergyIntolerance allergyintolerance-multiple-codings</b></p><a name="allergyintolerance-multiple-codings"> </a><a name="hcallergyintolerance-multiple-codings"> </a><div style="display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%"><p style="margin-bottom: 0px"/><p style="margin-bottom: 0px">Profile: <a href="StructureDefinition-AllergyIntolerance-uv-ips.html">AllergyIntolerance (IPS)</a></p></div><p><b>clinicalStatus</b>: <span title="Codes:{http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical active}">Active</span></p><p><b>verificationStatus</b>: <span title="Codes:{http://terminology.hl7.org/CodeSystem/allergyintolerance-verification confirmed}">Confirmed</span></p><p><b>code</b>: <span title="Codes:{http://snomed.info/sct 764146007}, {http://www.whocc.no/atc J01CA}">Penicillin</span></p><p><b>patient</b>: <a href="Patient-66033.html">Marie Lux-Brennard  Female, DoB: 1998-04-17 ( urn:oid:1.3.182.4.4#1998041799999)</a></p><p><b>onset</b>: Absent because : unknown</p></div>',
  },
  clinicalStatus: {
    coding: [
      {
        system:
          "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
        code: "active",
      },
    ],
  },
  verificationStatus: {
    coding: [
      {
        system:
          "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
        code: "confirmed",
      },
    ],
  },
  code: {
    coding: [
      {
        system: "http://snomed.info/sct",
        code: "764146007",
        display: "Penicillin",
      },
      {
        system: "http://www.whocc.no/atc",
        code: "J01CA",
        display: "Penicillins with extended spectrum",
      },
    ],
  },
  patient: {
    reference: "Patient/66033",
  },
  onsetDateTime: "2005-03-01",
};

export const allergyIntoleranceTwo: fhirR4.AllergyIntolerance = {
  resourceType: "AllergyIntolerance",
  id: "allergyintolerance-with-abatement",
  meta: {
    profile: [
      "http://hl7.org/fhir/uv/ips/StructureDefinition/AllergyIntolerance-uv-ips",
    ],
  },
  text: {
    status: "extensions",
    div: '<div xmlns="http://www.w3.org/1999/xhtml"><p class="res-header-id"><b>Generated Narrative: AllergyIntolerance allergyintolerance-with-abatement</b></p><a name="allergyintolerance-with-abatement"> </a><a name="hcallergyintolerance-with-abatement"> </a><div style="display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%"><p style="margin-bottom: 0px"/><p style="margin-bottom: 0px">Profile: <a href="StructureDefinition-AllergyIntolerance-uv-ips.html">AllergyIntolerance (IPS)</a></p></div><p><b>Abatement</b>: 2010</p><p><b>clinicalStatus</b>: <span title="Codes:{http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical resolved}">Resolved</span></p><p><b>verificationStatus</b>: <span title="Codes:{http://terminology.hl7.org/CodeSystem/allergyintolerance-verification confirmed}">Confirmed</span></p><p><b>code</b>: <span title="Codes:{http://snomed.info/sct 256303006}">Ragweed pollen</span></p><p><b>patient</b>: <a href="Patient-66033.html">Marie Lux-Brennard  Female, DoB: 1998-04-17 ( urn:oid:1.3.182.4.4#1998041799999)</a></p><p><b>onset</b>: Absent because : unknown</p></div>',
  },
  extension: [
    {
      url: "http://hl7.org/fhir/StructureDefinition/allergyintolerance-abatement",
      valueDateTime: "2010",
    },
  ],
  clinicalStatus: {
    coding: [
      {
        system:
          "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
        code: "resolved",
      },
    ],
  },
  verificationStatus: {
    coding: [
      {
        system:
          "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
        code: "confirmed",
      },
    ],
  },
  code: {
    coding: [
      {
        system: "http://snomed.info/sct",
        code: "256303006",
        display: "Ragweed pollen",
      },
    ],
  },
  patient: {
    reference: "Patient/66033",
  },
};

export const conditionOne: fhirR4.Condition = {
  resourceType: "Condition",
  id: "eumfh-39-07-1",
  meta: {
    profile: [
      "http://hl7.org/fhir/uv/ips/StructureDefinition/Condition-uv-ips",
    ],
  },
  text: {
    status: "generated",
    div: '<div xmlns="http://www.w3.org/1999/xhtml"><p class="res-header-id"><b>Generated Narrative: Condition eumfh-39-07-1</b></p><a name="eumfh-39-07-1"> </a><a name="hceumfh-39-07-1"> </a><div style="display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%"><p style="margin-bottom: 0px"/><p style="margin-bottom: 0px">Profile: <a href="StructureDefinition-Condition-uv-ips.html">Condition (IPS)</a></p></div><p><b>clinicalStatus</b>: <span title="Codes:{http://terminology.hl7.org/CodeSystem/condition-clinical active}">Active</span></p><p><b>category</b>: <span title="Codes:{http://loinc.org 75326-9}">Problem</span></p><p><b>code</b>: <span title="Codes:{http://snomed.info/sct 91861009}">Acute myeloid leukemia</span></p><p><b>subject</b>: <a href="Patient-eumfh-39-07.html">Alexander Heig (inject 39-07)</a></p><p><b>onset</b>: 2014</p><p><b>asserter</b>: <a href="Practitioner-eumfh-39-07.html">Dr. Mark Antonio</a></p></div>',
  },
  clinicalStatus: {
    coding: [
      {
        system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
        code: "active",
      },
    ],
  },
  category: [
    {
      coding: [
        {
          system: "http://loinc.org",
          code: "75326-9",
          display: "Problem",
        },
      ],
    },
  ],
  code: {
    coding: [
      {
        system: "http://snomed.info/sct",
        code: "91861009",
        display: "Acute myeloid leukemia",
      },
    ],
  },
  subject: {
    reference: "Patient/eumfh-39-07",
    display: "Alexander Heig (inject 39-07)",
  },
  onsetDateTime: "2014",
  asserter: {
    reference: "Practitioner/eumfh-39-07",
    display: "Dr. Mark Antonio",
  },
};

export const MedicationRequestOne: fhirR4.MedicationRequest = {
  resourceType: "MedicationRequest",
  id: "eumfh-39-07-1-request",
  meta: {
    profile: [
      "http://hl7.org/fhir/uv/ips/StructureDefinition/MedicationRequest-uv-ips",
    ],
  },
  text: {
    status: "generated",
    div: '<div xmlns="http://www.w3.org/1999/xhtml"><p class="res-header-id"><b>Generated Narrative: MedicationRequest eumfh-39-07-1-request</b></p><a name="eumfh-39-07-1-request"> </a><a name="hceumfh-39-07-1-request"> </a><div style="display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%"><p style="margin-bottom: 0px"/><p style="margin-bottom: 0px">Profile: <a href="StructureDefinition-MedicationRequest-uv-ips.html">MedicationRequest (IPS)</a></p></div><p><b>status</b>: Active</p><p><b>intent</b>: Order</p><p><b>medication</b>: <a href="Medication-eumfh-39-07-1.html">simvastatin</a></p><p><b>subject</b>: <a href="Patient-eumfh-39-07.html">Alexander Heig (inject 39-07)</a></p><blockquote><p><b>dosageInstruction</b></p><p><b>text</b>: 40 mg/day</p><p><b>timing</b>: Once per 1 day</p><h3>DoseAndRates</h3><table class="grid"><tr><td style="display: none">-</td><td><b>Dose[x]</b></td></tr><tr><td style="display: none">*</td><td>40 mg<span style="background: LightGoldenRodYellow"> (Details: UCUM  codemg = \'mg\')</span></td></tr></table></blockquote><h3>DispenseRequests</h3><table class="grid"><tr><td style="display: none">-</td><td><b>ValidityPeriod</b></td></tr><tr><td style="display: none">*</td><td>2021-01-01 --&gt; (ongoing)</td></tr></table></div>',
  },
  status: "active",
  intent: "order",
  medicationReference: {
    reference: "Medication/eumfh-39-07-1",
    display: "simvastatin",
  },
  subject: {
    reference: "Patient/eumfh-39-07",
    display: "Alexander Heig (inject 39-07)",
  },
  dosageInstruction: [
    {
      text: "40 mg/day",
      timing: {
        repeat: {
          frequency: 1,
          period: 1,
          periodUnit: "d",
        },
      },
      doseAndRate: [
        {
          doseQuantity: {
            value: 40,
            unit: "mg",
            system: "http://unitsofmeasure.org",
            code: "mg",
          },
        },
      ],
    },
  ],
  dispenseRequest: {
    validityPeriod: {
      start: "2021-01-01",
    },
  },
};
