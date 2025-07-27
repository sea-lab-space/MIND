import json
from discoverer import (
    TrendDiscovererAgent,
    ExtremeDiscovererAgent,
    DifferenceDiscovererAgent,
    ComparisonDiscovererAgent,
    DerivedValueDiscovererAgent,
    NotesDiscovererAgent,
    TranscriptsDiscovererAgent,
    Discoverer
)
from synthesizer import (
    Synthesizer,
)
from utils.overview_generation import SummarizationAgent
from visualizer import (
    Visualizer,
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
            ComparisonDiscovererAgent,
            DifferenceDiscovererAgent,
            DerivedValueDiscovererAgent,
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


def run_synthesizer(data, iters):
    synthesizer = Synthesizer(
        data_fact_source=data,
        retrospect_date='2021-05-09',
        before_date='2021-06-06',
        model_name=MODEL_NAME)
    result = synthesizer.run(iters)
    return result, synthesizer.data_fact_list

def exec(patient_id, save_interm = False):
    print("-- Running data prep...")
    data = run_data_prep(patient_id)
    if save_interm:
        with open(f"mock_data/data_input_{patient_id}.json", "w") as f:
            json.dump(data, f, indent=2)
            f.close()
        
    print("-- Running discoverer...")
    data_facts = run_discoverer(data)
    if save_interm:
        with open(f"mock_data/data_facts_{patient_id}.json", "w") as f:
            json.dump(data_facts, f, indent=2)
            f.close()

    print("-- Running synthesizer...")
    data_insights, data_fact_list = run_synthesizer(data_facts, iters=2)
    if save_interm:
        with open(f"mock_data/data_insights_{patient_id}.json", "w") as f:
            json.dump(data_insights, f, indent=2)
            f.close()
        with open(f"mock_data/data_facts_list_{patient_id}.json", "w") as f:
            json.dump(data_fact_list, f, indent=2)
            f.close()

    visualizer = Visualizer(
        data_insights=data_insights,
        data_fact_list=data_fact_list,
        raw_data=data,
    )
    visualization_spec = visualizer.run()

    print("-- Generating overview...")
    summarizer = SummarizationAgent(
        data,
        retrospect_date='2021-05-09',
        before_date='2021-06-06',
        model_name=MODEL_NAME)
    overview_res = summarizer.run()
    # save overview_res to file
    with open(f"mock_data/overview_{patient_id}.json", "w") as f:
        json.dump(overview_res, f, indent=2)
        f.close()

    final_spec = {
        "overview": overview_res,
        "insights": visualization_spec
    }

    return final_spec
    




if __name__ == "__main__":
    # final_output = exec(patient_id="INS-W_963", save_interm=True)

    # read data_facts.json
    with open("mock_data/data_facts_INS-W_963.json", "r") as f:
        data_facts = json.load(f)
        f.close()

    data_insights, data_fact_list = run_synthesizer(data_facts, iters=2)
    with open(f"mock_data/data_insights_INS-W_963.json", "w") as f:
        json.dump(data_insights, f, indent=2)
        f.close()

    with open(f"mock_data/data_facts_list_INS-W_963.json", "w") as f:
        json.dump(data_fact_list, f, indent=2)
        f.close()


    # read data_insights
    with open("mock_data/data_insights_INS-W_963.json", "r") as f:
        data_insights = json.load(f)
        f.close()

    # read data_facts_list
    with open("mock_data/data_facts_list_INS-W_963.json", "r") as f:
        data_facts_list = json.load(f)
        f.close()

    # read raw_data
    with open("mock_data/data_input_INS-W_963.json", "r") as f:
        data = json.load(f)
        f.close()

    # read mock_data/overview_INS-W_963.json
    with open("mock_data/overview_INS-W_963.json", "r") as f:
        overview_res = json.load(f)
        f.close()

    visualizer = Visualizer(
        data_insights=data_insights,
        data_fact_list=data_facts_list,
        raw_data=data,
    )

    res = visualizer.run()
    print(res)

    final_output = {
        "overview": overview_res,
        "insights": res
    }

    # save res to file
    with open(f"mock_data/Visualizer_INS-W_963.json", "w") as f:
        json.dump(final_output, f, indent=2)
        f.close()

    

    
    
