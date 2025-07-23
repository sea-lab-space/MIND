

class Synthesizer:
    # TODO: Implement critiquer & narrator
    def __init__(self, data_fact_source, model_name):
        self.fact_count = 0
        self.data_fact_source = data_fact_source
        self.data_fact_list = self._flatten_tag_source()
        
        self.generator_agent = None
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
                fact_list.append({
                    "id": f"{id_map[facts['modality_type']]}-{facts['modality_source']}-{self.fact_count}",
                    "modality_type": facts["modality_type"],
                    "modality_source": facts["modality_source"],
                    # <bluetooth: uniquedevices> Format: fact description
                    "full_description": f"<{facts['modality_type']}: "
                                        f"{facts['feature_name'] if facts['modality_type'] == 'survey' else facts['modality_source'] + ' ' + facts['feature_name']}> "
                                        f"{fact['fact_description']}",
                    **fact,
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
        prompt_text_list = []
        for fact in self.data_fact_list:
            prompt_text_list.append(
                f"[{fact['id']}] {fact['full_description']}"
            )
        return "\n".join(prompt_text_list)
    
    def run(self, data_facts):
        prompt = self._glue_prompt_input()
        print(f"{prompt}")
        return ""

