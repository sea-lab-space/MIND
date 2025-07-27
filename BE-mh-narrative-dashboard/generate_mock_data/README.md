# Mock Patient Data Generation

## Data Usage

### Passive sensing and survey scores (GLOBEM dataset)
* Use patient ids: 963, 1044, 1077 in GLOBEM
* See rationale and process in `passive_data_extraction` folder

### Medical setting (simulated sessions)

- **Case 1**: [Judith Johnson] Case study clinical example CBT: First session with a client with symptoms of depression (CBT model): "Lucy" [[link]](https://www.youtube.com/watch?v=7LD8iC4NqXM)
- **Case 2**: [Judith Johnson] Case study clinical example: First session with a client with symptoms of depression (CBT model): "Gabriella" [[link]](https://www.youtube.com/watch?v=JKUFWK6iSsw)
- **Case 3**: [University of Nottingham] Psychiatric Interviews for Teaching: Depression: "Alison" [[link]](https://www.youtube.com/watch?v=4YhpWZCdiZc)

> All materials above could be accessed publically online. We do not share the videos for copyright reasons, but encourage readers to access the source materials themselves.
> 
> **Disclaimer**: This is not a comprehensive list of all the materials online. We included only depression related interviews to set up our user study cases. The "patient"(s) in all the materials are "actors", and has no link to the data from the GLOBEM dataset. 

### Pairing

We keep the persona introducted in the simulated sessions (i.e., "Lucy", "Gabriella", "Alison") as the persona for the user study cases. We then "reverse engineer" their medical history, past encounters, and subsequent encounters with LLM. Those generated contents are subsequently **screened by practicing mental health clinicians** to ensure the realism of the data.

**User study test cases:**
- Case 1 - [963] - "Lucy"
- Case 2 - [1044] - "Gabriella"

> **Rationale**: Both tutorial cases are from the same clinician's tutorial; and the patient demographic setup is similar to that in the GLOBEM dataset. 

**Onboarding & introduction case:**
- Case 3 - [1077] - "Alison"

> **Note**: This is a different setup than the previous two cases. Under the British setting, this interview is conducted by a GP (General Practitioner, or PCP (Primary Care Physician) in the US). The cases 1 & 2 are with a psychiatrist (specialist).

## LLM Generation Process

1. Preliminary persona (see `personas_stub.json`)
   * Directly prompt LLM for persona generation under constraint
   * Prompt (fill in the name and description). Information in `<>` are provided as seed.
    ```{markdown}
    Help me generate the name and persona description of this depression patient:    

    "name": "",
    "ethnicity": "<ethnicity>",
    "age": <age>,
    "gender": "<gender>",
    "income": "<income range>",
    "occupation": "Student",
    "generation": "<immigrant status>",
    "description": ""
    ```
2. Generate data facts from passive sensing / measurement scores (see `mock_facts.py`)
   * I/O: Takes all data from `data` folder and output `context/encounters_mock_{patient_id}.json`.
   * Description: Generate data fact descriptions (extreme, trend, difference, and comparison) from a slice of GLOBEM dataset (see the slice in the previous section).
3. Mock patient history data (see `fill_EHR.py`)
   * I/O: Takes `context/personas_stub.json` as input and output `context/personas_full.json`.
   * Description: Generate mock data for past medical encounters (including type of encounter, ICD/CPT codes, and notes [which is further verified by human for use in study]) and medication (including type, dosage, etc.)
4. Mock depression encounter sessions (4 encounters) with multimodal data (see `fill_session.py`)
   * I/O: Takes `context/personas_full.json` & `context/encounters_mock_{patient_id}` as input and output `{patient_id}_full.json` with multimodal data.
   * Description: Generate mock data (transcript, medication, medical notes) for 4 simulated encounters spanning 10 weeks (at 0, 2, 6, 10 weeks respectively).
     * Context provided for generation: patient persona, past encounter and medication history, past encounter with this clinician (this series of mh assessment), and measurement score insights.
     * Transcript: Role-play agents (clinician & patient), using prompt inspired by [Interactive Agents: Simulating Counselor-Client Psychological Counseling via Role-Playing LLM-to-LLM Interactions](http://arxiv.org/abs/2408.15787).
     * Medication: 0-shot generation of medication based on transcript
     * Medical notes: 0-shot generation of medical notes based on transcript & medication (to ensure consistency)