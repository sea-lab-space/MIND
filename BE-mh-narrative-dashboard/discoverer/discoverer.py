import asyncio
from typing import Literal
from tqdm import tqdm

class Discoverer:
    def __init__(self, numeric_agents, text_agents, retrospect_date, before_date, model_name):
        # all agents have the same base class
        self.numeric_agents = [
            agent(retrospect_date, before_date, model=model_name) for agent in numeric_agents
        ]
        # differentiate by agent name
        self.text_agents = [
            agent(retrospect_date, before_date, model=model_name) for agent in text_agents
        ]
        self.before_date = before_date
        self.retrospect_date = retrospect_date

    def _run_text_discovery(self, text_type: Literal['clinical note', 'clinical transcript'], context: str):
        running_agent = None
        for text_agent in self.text_agents:
            if text_agent.modality_source == text_type:
                running_agent = text_agent
        assert running_agent is not None, "No text agent found for the given modality type"

        res = asyncio.run(running_agent.run(context, verbose = False))
        return res

    def _run_numeric_discovery(self, feature_list):
        data_facts = []
        # print([feat['feature_name'] for feat in feature_list])

        for feature in tqdm(feature_list[:2]):
            feature_insights = []
            for discoverer in self.numeric_agents:
                # print(feature)
                data_fact = asyncio.run(discoverer.run(feature, verbose=False))
                if data_fact:
                    feature_insights.extend(data_fact)
            data_facts.append({
                "modality_type": feature['modality_type'],
                "modality_source": feature['modality_source'],
                "feature_name": feature['feature_name'],
                "data_facts": feature_insights
            })

        return data_facts
    
    def _prep_transcript(self, text_input):
        matching_feat = next(
            (feat['transcript'] for feat in text_input if feat['encounter_date']
             == self.retrospect_date),
            None
        )
        if matching_feat:
            formatted_transcript = "\n".join(
                f"Clinician: {turn['clinician']}\nPatient: {turn['patient']}"
                for turn in matching_feat
            )
        else:
            formatted_transcript = None

        # Build the result dictionary
        transcript_input = {self.retrospect_date: formatted_transcript}
        return transcript_input
    
    def run(self, features):
        # Find fact from text data
        text_input = features['this_series']
        # extract on exact date
        note_input = {
            self.retrospect_date: next((feat['clinical_note']
                          for feat in text_input if feat['encounter_date'] == self.retrospect_date), None)}
        transcript_input = self._prep_transcript(text_input)
        note_facts = self._run_text_discovery('clinical note', note_input)
        transcript_facts = self._run_text_discovery(
            'clinical transcript', transcript_input)
        
        # Find fact from time series data
        numeric_input = features['numerical_data']
        numeric_facts = self._run_numeric_discovery(numeric_input)

        
        return {
            "numeric_facts": numeric_facts,
            "note_facts": note_facts,
            "transcript_facts": transcript_facts
        }