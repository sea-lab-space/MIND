# Mock Patient Data Generation

## Data Usage

### Passive sensing and survey scores (GLOBEM dataset)
* Use patient ids: 963, 1044, 1077 in GLOBEM
* See rationale and process in `passive_data_extraction` folder

### Medical setting (simulated sessions)

- **Case 1**: [Judith Johnson] Case study clinical example CBT: First session with a client with symptoms of depression (CBT model): "Lucy" [[link]](https://www.youtube.com/watch?v=7LD8iC4NqXM)
- **Case 2**: [Judith Johnson] Case study clinical example: First session with a client with symptoms of depression (CBT model): "Gabriella" [[link]](https://www.youtube.com/watch?v=JKUFWK6iSsw)
- **Case 3**: [University of Nottingham] Psychiatric Interviews for Teaching: Depression: "Alison" [[link]](https://www.youtube.com/watch?v=4YhpWZCdiZc)

> All materials above could be accessed publically online. We document a modified (i.e., persona-aligned), automatically processed transcript for research use.
> 
> **Disclaimer**: This is not a comprehensive list of all the materials online. We included only depression related interviews to set up our user study cases. The "patient"(s) in all the materials are "actors", and has no link to the data from the GLOBEM dataset. 

### Pairing

We keep the persona introducted in the simulated sessions (i.e., "Lucy", "Gabriella", "Alison") as the persona for the user study cases. We then "reverse engineer" their medical history, past encounters, and subsequent encounters with LLM. Those generated contents are subsequently **screened by practicing mental health clinicians** to ensure the realism of the data.

**User study test cases:**
- Case 1 - [963] - "Gabriella (Lin)"
- Case 2 - [1044] - "Lucy (Sutton)"

> **Rationale**: Both tutorial cases are from the same clinician's tutorial; and the patient demographic setup is similar to that in the GLOBEM dataset. 

**Onboarding & introduction case:**
- Case 3 - [1077] - "Alison (Daniels)"

> **Note**: This is a different setup than the previous two cases. Under the British setting, this interview is conducted by a GP (General Practitioner, or PCP (Primary Care Physician) in the US). The cases 1 & 2 are with a psychiatrist (specialist). We do not differentiate them as they are all considered mental health therapy first sessions.

See `personas_stub.json` for a paired version of patient persona.

## LLM Generation Process

### Contextual Data Prep

**[Life/physical Events]** (see `prep_mock_facts.py`)
Reuse **Discoverer** & **Synthesizer** Modules in the MIND compuation pipeline but tailored to mock session generation context (i.e., no notes & transcripts are looked at for both modules, only passive sensing / measurement scores from GLOBEM dataset are used).
* I/O: Takes data from `data` folder and output `context/encounters_mock_{patient_id}.json`, which conatains the generated data insights. Facts/insights used for each patient are stored in `context/{patient_id}` folder.
* Description: Generate data fact descriptions (derived value, extreme, trend, difference, and comparison), and corresponding data insights from a slice of GLOBEM dataset (see the slice in the previous section).
* Note: **Running this script will generate data for ALL mock patients.**

**[History Medical Information]** (see `prep_fill_EHR.py`)
Mock patient history data. 
* I/O: Takes `context/personas_stub.json` as input and output `context/personas_full.json`.
* Description: Generate mock data for past medical encounters (including type of encounter, ICD/CPT codes, and notes) and medication (including type, dosage, etc.)
* Note: **Running this script will generate data for only the given mock patient.** (due to rate limit in API, this is more controllable)

### Simulated Encounters

Mock depression encounter sessions (4 encounters) with multimodal data (see `fill_session.py`)
* I/O: Takes `context/personas_full.json` & `context/encounters_mock_{patient_id}` as input and output `{patient_id}_full.json` with multimodal data.
* Description: Generate mock data (transcript, medication, medical notes) for 4 simulated encounters spanning 10 weeks (at 0, 2, 6, 10 weeks respectively).
* Context provided for generation: patient persona, past encounter and medication history, past encounter with this clinician (this series of mh assessment), and measurement score insights.
* Transcript: Role-play agents (clinician & patient), using prompt inspired by [Interactive Agents: Simulating Counselor-Client Psychological Counseling via Role-Playing LLM-to-LLM Interactions](http://arxiv.org/abs/2408.15787).
* Medication: 0-shot generation of medication based on transcript
* Medical notes: 0-shot generation of medical notes based on transcript & medication (to ensure consistency)
* Note: **Running this script will generate data for ALL mock patients.**