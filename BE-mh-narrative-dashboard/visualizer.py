from copy import deepcopy
import math

from utils.search import replace_NaNs_to_null, search_evidence, search_id_in_facts, search_modality_type

class Visualizer:
    def __init__(self, data_insights, data_fact_list, raw_data, qa_source, retrospect_date):
        self.data_insights = data_insights
        # self.narrator_agent = NarratorAgent(model_name)
        # self.data_insights_narrative = None
        self.data_fact_list = data_fact_list
        self.raw_data = raw_data
        self.qa_source = qa_source
        self.insight_count = 0
        self.retrospect_date = retrospect_date
            
    def _search_raw_data(self, source, name):
        for data in self.raw_data['numerical_data']:
            if data['modality_source'] == source and data['feature_name_renamed'] == name:
                return replace_NaNs_to_null(data['data'])
        print('error in search')
    
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
    

    def run(self):
        # self.data_insights_narrative = asyncio.run(self.narrator_agent.run(self.data_insights))
        specification = []
        for insight in self.data_insights:
            # print(insight)
            L3_fact_ids = insight['insight_source']
            L2_fact_ids = insight['l2_insight_source']
            # use the L2 sequence, and append anything remaining in L3 to the end
            fact_ids = deepcopy(L2_fact_ids)
            fact_ids.extend([fact for fact in L3_fact_ids if fact not in L2_fact_ids])
            # fact_ids = insight['insight_source']
            inference_sources = []
            expand_view = []
            qaids = []
            for fact_id in fact_ids:
                fact = search_id_in_facts(self.data_fact_list, fact_id)
                # ! occurance where it can not be backtraced
                if fact is None:
                    print('error in id')
                    continue
                if fact_id.startswith("qa-"):
                    
                    qaid = insight['qaid']
                    if qaid not in qaids:
                        qaids.append(qaid)
                        textual_evidences, action = search_evidence(self.qa_source, qaid)
                        sources = set()
                        for textual_evidence in textual_evidences:
                            sources.add(textual_evidence["source"])
                        inference_sources = inference_sources + list(sources)
                        # get clinical notes appended
                        expand_view.append(
                            {
                                "summarySentence": action,
                                "dataPoints": None,
                                "spec": [
                                    {
                                        "fact_type": "text",
                                        "date": self.retrospect_date,
                                        "text": textual_evidence['text']
                                    } 
                                    for textual_evidence in textual_evidences if textual_evidence['source'] == "clinical note"
                                ],
                                "sources": ["clinical note"],
                                "dataSourceType": "text",
                                "isShowL2": False
                            }
                        )
                        expand_view.append(
                            {
                                "summarySentence": action,
                                "dataPoints": None,
                                "spec": [
                                    {
                                        "fact_type": "text",
                                        "date": self.retrospect_date,
                                        "text": textual_evidence['text']
                                    } 
                                    for textual_evidence in textual_evidences if textual_evidence['source'] == "session transcript"
                                ],
                                "sources": ["session transcript"],
                                "dataSourceType": "text",
                                "isShowL2": False
                            }
                        )


                    modality_type, modality_source = search_modality_type(fact['spec']['name'])
                    
                    inference_sources.append(modality_type)
                    expand_view.append(
                        {
                            "summarySentence": fact['spec']['fact_description'],
                            "dataPoints": self._search_raw_data(modality_source, fact['spec']['name']),
                            "spec": fact['spec'],
                            "sources": [modality_type],
                            "dataSourceType": fact['spec']['fact_type'],
                            "isShowL2": fact_id in L2_fact_ids
                        }
                    )
                elif fact['modality_type'] == 'passive sensing' or fact['modality_type'] == 'survey':
                    inference_sources.append(fact['modality_type'])
                    expand_view.append(
                        {
                            "summarySentence": fact['spec']['fact_description'],
                            "dataPoints": self._search_raw_data(fact['modality_source'], fact['spec']['name']),
                            "spec": fact['spec'],
                            "sources": [fact['modality_type']],
                            "dataSourceType": fact['spec']['fact_type'],
                            "isShowL2": fact_id in L2_fact_ids
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
                            "dataPoints": None, # self._search_raw_text_data(map_text_keys[fact['modality_source']]),
                            "spec": [
                                {
                                    "fact_type": "text",
                                    **evidence
                                }
                                for evidence in fact["evidence"]
                            ],
                            "sources": [fact['modality_source']],
                            # ! Here dataSourceType means "text" add in FE
                            "dataSourceType": fact['modality_type'],
                            "isShowL2": fact_id in L2_fact_ids
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
    