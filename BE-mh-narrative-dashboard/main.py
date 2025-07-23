import json
from discoverer import (
    TrendDiscovererAgent,
    ExtremeDiscovererAgent,
    DifferenceDiscovererAgent,
    ComparisonDiscovererAgent,
    NotesDiscovererAgent,
    TranscriptsDiscovererAgent,
    Discoverer
)
from synthesizer import (
    Synthesizer,
)
from utils.extract_single_feature import feature_transform

MODEL_NAME = 'gpt-4.1'

def run_data_prep(patient_id):
    """
    Read mock data from previously generated json files and structure them into a unified format.
    
    Input: patient_id
    """
    data = {}

    # Step 1: Format personas & history
    with open(f"./generate_mock_data/context/personas_full.json", "r") as f:
        personas = json.load(f)
        personas_prelim = personas[patient_id]
        f.close()
    
    data['name'] = personas_prelim['name']
    data['description'] = personas_prelim['description']
    data['demographics'] = {
        "ethnicity": personas_prelim['ethnicity'],
        "gender": personas_prelim['gender'],
        "age": personas_prelim['age'],
        "income": personas_prelim['income'],
        "occupation": personas_prelim['occupation'],
        "generation": personas_prelim['generation'],
    }
    data["medical_history_before"] = personas_prelim['medication']
    data["encounter_history_before"] = personas_prelim['encounters']

    # Step 2: Format mockup encounter histories w/ THIS clinician
    with open(f"./generate_mock_data/context/{patient_id}_full.json", "r") as f:
        this_encounter = json.load(f)
        f.close()

    # drop "data_facts" key if exsist
    for encounter in this_encounter:
        encounter.pop("data_facts", None)
        encounter.pop("retrospect_date", None)
        encounter["encounter_date"] = encounter.pop("before_date", None)

    data['this_series'] = this_encounter

    # Step 3: Load numerical data features
    # ! There is NaNs in the data (not fully compatible to JSON standards but fine with dicts and TS use)
    feature_list = feature_transform(pid=patient_id, granularity="allday")
    data['numerical_data'] = feature_list

    return data


def run_discoverer(data):
    discoverer = Discoverer(
        numeric_agents=[
            TrendDiscovererAgent,
            ExtremeDiscovererAgent,
            DifferenceDiscovererAgent,
            ComparisonDiscovererAgent,
        ],
        text_agents=[
            NotesDiscovererAgent,
            TranscriptsDiscovererAgent,
        ],
        retrospect_date='2021-05-09',
        before_date='2021-06-06',
        model_name=MODEL_NAME
    )
    result = discoverer.run(data)
    return result


def run_synthesizer(data):
    synthesizer = Synthesizer(data_fact_source=data, model_name=MODEL_NAME)
    result = synthesizer.run(data)
    return result

def exec(patient_id, save_interm = False):
    if save_interm:
        print("-- Running data prep...")
        data = run_data_prep(patient_id)
        with open("mock_data/data_input.json", "w") as f:
            json.dump(data, f, indent=2)
            f.close()
        
        print("-- Running discoverer...")
        data_facts = run_discoverer(data)
        with open("mock_data/data_facts.json", "w") as f:
            json.dump(data_facts, f, indent=2)
            f.close()

        # print("-- Running synthesizer...")
        # data_synthesis = run_synthesizer(data_facts)
        
    else:
        # TODO: fill in later
        RuntimeError("Not implemented yet")



if __name__ == "__main__":
    exec(patient_id="INS-W_963", save_interm=True)

    # read data_facts.json
    with open("mock_data/data_facts.json", "r") as f:
        data_facts = json.load(f)
        f.close()
    
    run_synthesizer(data_facts)
    
    
