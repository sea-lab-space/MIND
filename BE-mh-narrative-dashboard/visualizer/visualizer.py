



import math
import random


class Visualizer:
    def __init__(self, data_insights, data_fact_list, raw_data):
        self.data_insights = data_insights
        self.data_fact_list = data_fact_list
        self.raw_data = raw_data
        self.insight_count = 0

    def _search_id_in_facts(self, fact_id):
        for fact in self.data_fact_list:
            if fact['id'] == fact_id:
                return fact
            
    def _search_raw_data(self, source, name):
        for data in self.raw_data['numerical_data']:
            if data['modality_source'] == source and data['feature_name_renamed'] == name:
                return self._replace_NaNs_to_null(data['data'])
    
    def _search_raw_text_data(self, source):
        text_list = []
        for data in self.raw_data['this_series']:
            text_list.append(
                {
                    "date": data['encounter_date'],
                    "record": data[source]
                }
            )
        return text_list
    

    def _replace_NaNs_to_null(self, data):
        for datum in data:
            for key, value in datum.items():
                if isinstance(value, float) and math.isnan(value):
                    datum[key] = None
        return data

    def run(self):
        specification = []

        for insight in self.data_insights:
            fact_ids = insight['insight_source']
            inference_sources = []
            expand_view = []
            for fact in fact_ids:
                fact = self._search_id_in_facts(fact)
                # ! occurance where it can not be backtraced
                if fact is None:
                    print('error in id')
                    continue
                if fact['modality_type'] == 'passive sensing' or fact['modality_type'] == 'survey':
                    inference_sources.append(fact['modality_type'])
                    expand_view.append(
                        {
                            "summarySentence": fact['spec']['fact_description'],
                            "dataPoints": self._search_raw_data(fact['modality_source'], fact['spec']['name']),
                            "spec": fact['spec'],
                            "sources": [fact['modality_type']],
                            "dataSourceType": fact['spec']['fact_type']
                        }
                    )
                elif fact['modality_type'] == 'text':
                    inference_sources.append(fact['modality_source'])
                    map_text_keys = {
                        "session transcript": "transcript",
                        "clinical note": "clinical_note"
                    }
                    expand_view.append(
                        {
                            "summarySentence": fact['fact_text'],
                            # ! Here dataPoints means source text + evidence
                            # TODO: add source transcript & notes
                            "dataPoints": self._search_raw_text_data(map_text_keys[fact['modality_source']]),
                            "spec": fact['evidence'],
                            "sources": [fact['modality_source']],
                            # ! Here dataSourceType means "text" add in FE
                            "dataSourceType": fact['modality_type'],
                        }
                    )
            
            specification.append(
                {
                    "key": f"insight-{self.insight_count}",
                    "summaryTitle": insight["insight_description"],
                    "sources": list(set(inference_sources)),
                    "insightType": insight['insight_category'],
                    "expandView": expand_view,
                    # # TODO: relevance computation with sentenceBERT
                    # "relevance": random.random()
                }
            )
            self.insight_count += 1
        
        return specification
    