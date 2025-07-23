



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
            if data['modality_source'] == source and data['feature_name'] == name:
                return data['data']

    def run(self):
        specification = []

        for insight in self.data_insights:
            fact_ids = insight['insight_source']
            inference_sources = []
            expand_view = []
            for fact in fact_ids:
                fact = self._search_id_in_facts(fact)
                if fact['modality_type'] == 'passive sensing' or fact['modality_type'] == 'survey':
                    inference_sources.append(fact['modality_type'])
                    expand_view.append(
                        {
                            "summarySentence": fact['spec']['fact_description'],
                            "dataPoints": self._search_raw_data(fact['modality_source'], fact['spec']['name']),
                            "sources": [fact['modality_type']],
                            "dataSourceType": fact['spec']['fact_type']
                        }
                    )
                elif fact['modality_type'] == 'text':
                    inference_sources.append(fact['modality_source'])
                    expand_view.append(
                        {
                            "summarySentence": fact['fact_text'],
                            # ! Here dataPoints means source text
                            "dataPoints": fact['evidence'],
                            "sources": [fact['modality_source']],
                            # ! Here dataSourceType means "text" add in FE
                            "dataSourceType": fact['modality_type'],
                            # TODO: relevance computation with sentenceBERT
                            "relevance": random.random()
                        }
                    )
            
            specification.append(
                {
                    "key": f"insight-{self.insight_count}",
                    "summaryTitle": insight["insight_description"],
                    "sources": inference_sources,
                    "insightType": insight['insight_category'],
                    "expandView": expand_view
                }
            )
        
        return specification
    