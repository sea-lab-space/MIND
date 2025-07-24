

import asyncio
import random
import re
from synthesizer.synthesizer_agents.insight_generator_agent import InsightProposalAgent
from datetime import datetime

def strip_date(date):
    match = re.search(r'\d{4}-\d{2}-\d{2}', date)
    if not match:
        return None
    return datetime.strptime(match.group(), '%Y-%m-%d')

def date_between(date, start_date, end_date):
    date = strip_date(date)
    start_date = strip_date(start_date)
    end_date = strip_date(end_date)
    if not date or not start_date or not end_date:
        return False
    return start_date <= date < end_date
class Synthesizer:
    # TODO: Implement critiquer & narrator
    def __init__(self, data_fact_source, retrospect_date, before_date, model_name):
        self.fact_count = 0
        self.before_date = before_date
        self.retrospect_date = retrospect_date
        self.data_fact_source = data_fact_source
        self.data_fact_list = self._flatten_tag_source()
        
        self.generator_agent = InsightProposalAgent(model_name)
        self.critiquer_agent = None
        self.narrator_agent = None

    # ! This is glue code: improve Discoverer data_fact data structure
    def _flatten_tag_numeric(self, num_fact_list):
        id_map = {
            "passive sensing": "ps",
            "survey": "sv"
        }

        fact_list = []
        for facts in num_fact_list:
            for fact in facts["data_facts"]:

                def is_include_fact(fact):
                    if fact['fact_type'] == 'difference' or fact['fact_type'] == 'trend' or fact['fact_type'] == 'derived value':
                        return date_between(fact['time_2'], self.retrospect_date, self.before_date)
                    elif fact['fact_type'] == 'extreme':
                        return date_between(fact['time'], self.retrospect_date, self.before_date)
                    elif fact['fact_type'] == 'comparison':
                        return date_between(fact['time_dur_2']['time_start'], self.retrospect_date, self.before_date)
                    else:
                        TypeError("Unknown fact type")
                        return False

                if is_include_fact(fact):
                    fact_list.append({
                        "id": f"{id_map[facts['modality_type']]}-{facts['modality_source']}-{self.fact_count}",
                        "modality_type": facts["modality_type"],
                        "modality_source": facts["modality_source"],
                        # <bluetooth: uniquedevices> Format: fact description
                        "full_description": f"<{facts['modality_type']}: "
                                            f"{facts['feature_name'] if facts['modality_type'] == 'survey' else facts['modality_source'] + ' ' + facts['feature_name']}> "
                                            f"{fact['fact_description']}",
                        "spec": {
                            **fact,
                        }
                    })
                    self.fact_count += 1
        return fact_list
    
    # ! This is glue code: improve Discoverer data_fact data structure
    def _tag_text(self, modality, text_list):
        txt_map = {
            "note_facts": "clinical note",
            "transcript_facts": "session transcript"
        }
        for text in text_list:
            text["id"] = f"{modality}-{self.fact_count}"
            text["modality_type"] = "text"
            text["modality_source"] = txt_map[modality]
            text["full_description"] = f"<Text: {txt_map[modality]}> {text['fact_text']}"
            self.fact_count += 1
        return text_list

    # ! This is glue code: improve Discoverer data_fact data structure
    def _flatten_tag_source(self):
        facts = []
        for key, value in self.data_fact_source.items():
            if key == "numeric_facts":
                numeric_fact_list = self._flatten_tag_numeric(value)
                facts.extend(numeric_fact_list)
            else:
                text_fact_list = self._tag_text(key, value)
                facts.extend(text_fact_list)
        return facts
    
    def _glue_prompt_input(self):
        # set fixed randomizer to shuffle data facts
        # ! Not validated if this could be better than keep original ordering (where same modality facts come in order)
        random.seed(42)
        random.shuffle(self.data_fact_list)

        prompt_text_list = []
        for fact in self.data_fact_list:
            prompt_text_list.append(
                f"[{fact['id']}] {fact['full_description']}"
            )
        return "\n".join(prompt_text_list)
    
    def run(self):
        prompt = self._glue_prompt_input()
        data_insights = asyncio.run(self.generator_agent.run(prompt, True))
        return data_insights

