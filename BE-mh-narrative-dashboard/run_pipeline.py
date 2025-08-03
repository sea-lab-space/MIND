import asyncio
import json
import time
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()
class MINDPipeline:
    def __init__(self, patient_id: str,
                 model_name: str = "gpt-4.1",
                 retrospect_date: str = "2021-05-09",
                 before_date: str = "2021-06-06",
                 save_to_cache: bool = True):
        self.patient_id = patient_id
        self.model_name = model_name
        self.retrospect_date = retrospect_date
        self.before_date = before_date
        self.save_to_cache = save_to_cache

        self.cache_dir = Path(f"mock_data/cache/{patient_id}")
        self.cache_dir.mkdir(parents=True, exist_ok=True)

        self.data = None
        self.data_facts = None
        self.data_fact_list = None
        self.data_insights = None
        self.data_insights_narrative = None
        self.visualization_spec = None
        self.overview = None
        self.suggest_activity = None
        self.rewritten_data_facts = None

    def _log(self, msg):
        if self.save_to_cache:
            print(msg)

    def _save(self, key, content, is_parent=False):
        if is_parent:
            path = self.cache_dir.parent.parent / f"{key}.json"
        else:
            path = self.cache_dir / f"{key}.json"
        with open(path, "w", encoding="utf-8") as f:
            json.dump(content, f, indent=2, ensure_ascii=False)

    def _load(self, key):
        path = self.cache_dir / f"{key}.json"
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def load_data(self, load_from_cache=False):
        self._log(f"Processing {self.patient_id}")
        if load_from_cache and (self.cache_dir / "data_input.json").exists():
            self._log("[Data] Loading from cache")
            self.data = self._load("data_input")
        else:
            self._log("[Data] Generating fresh")
            from utils.extract_single_feature import feature_transform

            with open("./generate_mock_data/context/personas_full.json", "r", encoding="utf-8") as f:
                personas = json.load(f)[self.patient_id]
            with open(f"./generate_mock_data/context/{self.patient_id}_full.json", "r", encoding="utf-8") as f:
                this_encounter = json.load(f)

            for encounter in this_encounter:
                encounter.pop("data_insights", None)
                encounter.pop("retrospect_date", None)
                encounter["encounter_date"] = encounter.pop(
                    "before_date", None)
                encounter["transcript"] = encounter.get("transcript", [])
                encounter["clinical_note"] = encounter.get("clinical_note", [])
                encounter["medication"] = encounter.get("medication", [])

            this_encounter = [
                e for e in this_encounter if e['encounter_id'] != 4]

            self.data = {
                'name': personas['name'],
                'description': personas['description'],
                'demographics': {k: personas[k] for k in ['ethnicity', 'gender', 'age', 'income', 'occupation', 'generation']},
                'medical_history_before': personas['medication'],
                'encounter_history_before': personas['encounters'],
                'this_series': this_encounter,
                'numerical_data': feature_transform(pid=self.patient_id, granularity="allday")
            }

            if self.save_to_cache:
                self._save("data_input", self.data)
        return self

    def run_discoverer(self, load_from_cache=False):
        if load_from_cache and (self.cache_dir / "data_facts.json").exists():
            self._log("[Discoverer] Loading from cache")
            self.data_facts = self._load("data_facts")
        else:
            self._log("[Discoverer] Running agents")
            from discoverer import Discoverer, TrendDiscovererAgent, ExtremeDiscovererAgent, ComparisonDiscovererAgent, DifferenceDiscovererAgent, DerivedValueDiscovererAgent, NotesDiscovererAgent, TranscriptsDiscovererAgent
            discoverer = Discoverer(
                numeric_agents=[
                    TrendDiscovererAgent, 
                    ExtremeDiscovererAgent, 
                    ComparisonDiscovererAgent,
                    DifferenceDiscovererAgent, 
                    DerivedValueDiscovererAgent
                    ],
                text_agents=[
                    NotesDiscovererAgent, 
                    TranscriptsDiscovererAgent
                    ],
                retrospect_date=self.retrospect_date,
                before_date=self.before_date,
                model_name=self.model_name
            )
            self.data_facts = discoverer.run(self.data)

            if self.save_to_cache:
                self._save("data_facts", self.data_facts)

            # sleep 10s (prevent connection issue)
            time.sleep(10)
        return self

    def run_synthesizer(self, iters=2, load_from_cache=False):
        if load_from_cache and (self.cache_dir / "data_insights.json").exists() and (self.cache_dir / "data_facts_list.json").exists():
            self._log("[Synthesizer] Loading from cache")
            self.data_insights = self._load("data_insights")
            self.data_fact_list = self._load("data_facts_list")
        else:
            self._log("[Synthesizer] Running")
            from synthesizer import Synthesizer
            synthesizer = Synthesizer(
                data_fact_source=self.data_facts,
                retrospect_date=self.retrospect_date,
                before_date=self.before_date,
                model_name=self.model_name
            )
            self.data_insights = synthesizer.run(iters)
            self.data_fact_list = synthesizer.data_fact_list
            time.sleep(5)
            if self.save_to_cache:
                self._save("data_insights", self.data_insights)
                self._save("data_facts_list", synthesizer.data_fact_list)
        return self

    def run_narrator(self, load_from_cache=False):
        if load_from_cache and (self.cache_dir / "data_insights_narrative.json").exists():
            self._log("[Narrator] Loading from cache")
            self.data_insights_narrative = self._load(
                "data_insights_narrative")
            self.rewritten_data_facts = self._load("rewritten_data_facts")
        else:
            self._log("[Narrator] Generating")
            from narrator.narrator import Narrator
            narrator = Narrator(
                data_fact_list=self.data_fact_list,
                data_insights_full=self.data_insights,
                model_name=self.model_name)
            # TODO: remove this asyncio
            self.data_insights_narrative, self.rewritten_data_facts = narrator.run(
                self.data_insights, verbose=False)
            if self.save_to_cache:
                self._save("data_insights_narrative",
                           self.data_insights_narrative)
                self._save("rewritten_data_facts", self.rewritten_data_facts)
        return self

    def run_visualizer(self):
        self._log("[Visualizer] Running")
        from visualizer import Visualizer
        visualizer = Visualizer(
            data_insights=self.data_insights_narrative,
            data_fact_list=self.rewritten_data_facts,
            raw_data=self.data
        )
        self.visualization_spec = visualizer.run()
        return self

    def run_overview(self, load_from_cache=False):
        if load_from_cache and (self.cache_dir / "overview.json").exists():
            self._log("[Overview] Loading from cache")
            self.overview = self._load("overview")
        else:
            self._log("[Overview] Generating")
            from helpers.overview_generation import SummarizationAgent
            summarizer = SummarizationAgent(
                self.data,
                retrospect_date=self.retrospect_date,
                before_date=self.before_date,
                model_name=self.model_name
            )
            self.overview = summarizer.run()
            if self.save_to_cache:
                self._save("overview", self.overview)
        return self
    
    def run_suggest_activity(self, load_from_cache=False):
        if load_from_cache and (self.cache_dir / "suggest_activity.json").exists():
            self._log("[Suggest Activity] Loading from cache")
            self.suggest_activity = self._load("suggest_activity")
        else:
            self._log("[Suggest Activity] Generating")
            from helpers import ActivityAgent
            suggest_activity = ActivityAgent(model_name=self.model_name)
            clinical_notes = "\n".join([datum['clinical_note']
                                       for datum in self.data['this_series']])
            self.suggest_activity = suggest_activity.run(clinical_notes=clinical_notes)
            if self.save_to_cache:
                self._save("suggest_activity", self.suggest_activity)
        return self
    
    def _get_all_survey_raw(self):
        passive_sensing_raw = []
        for datum in self.data['numerical_data']:
            if datum['modality_type'] == 'survey':
                datum["isShowL2"] = False
                datum['sources'] = [datum['modality_source']]
                datum['dataSourceType'] = "raw"
                datum['dataPoints'] = datum['data']
                datum['summarySentence'] = f"Displaying {datum['feature_name_renamed'].lower()} survey scores."
                # pop "feature_name_renamed", "feature_name", "modality_source", "modality_type"
                datum.pop('feature_name_renamed')
                datum.pop('feature_name')
                datum.pop('modality_source')
                datum.pop('modality_type')
                datum.pop('data')
                passive_sensing_raw.append(datum)
        return passive_sensing_raw
    
    def run_calc_relevance(self):
        self._log("[Calc Relevance] Running")
        from helpers import EmbeddingRelevance
        calc_relevance = EmbeddingRelevance()
        
        transcript_data = [
            {
                "date": info['encounter_date'],
                "text": "\n".join([turn['clinician'] + " " + turn['patient'] for turn in info['transcript']])
            }
            for info in self.data['this_series']
        ]

        clinical_notes_data = [
            {
                "date": info['encounter_date'],
                "text": info['clinical_note']
            }
            for info in self.data['this_series']
        ]

        insights_w_transcript = [
            {
                "key": insight['key'],
                "summaryTitle": insight['summaryTitle']
            }
            for insight in self.visualization_spec if "session transcript" in insight['sources']
        ]
        insights_w_clinical_notes = [
            {
                "key": insight['key'],
                "summaryTitle": insight['summaryTitle']
            }
            for insight in self.visualization_spec if "clinical note" in insight['sources']
        ]
        
        relevance_transcript = calc_relevance.run(
            subjective_materials=transcript_data,
            data_insights=insights_w_transcript
        )

        relevance_note = calc_relevance.run(
            subjective_materials=clinical_notes_data,
            data_insights=insights_w_clinical_notes
        )

        def retrive_relevance(key, relevance_data):
            for insight in relevance_data:
                if key == insight['key']:
                    return insight['relevance']
                else:
                    # raise error
                    ValueError("key not found in relevance_transcript")

        # add back to visualization_spec
        for insight in self.visualization_spec:
            if "session transcript" in insight['sources']:
                insight['transcriptRelevance'] = retrive_relevance(insight['key'], relevance_transcript)
            if "clinical note" in insight['sources']:
                insight['noteRelevance'] = retrive_relevance(insight['key'], relevance_note)

        return self

    def run_assembly(self):
        self._log("[Run] Final assembly")
        final_spec = {
            "overview": self.overview,
            "insights": self.visualization_spec,
            "session_subjective_info": self.data['this_series'],
            "survey_raw": self._get_all_survey_raw(),
            "suggest_activity": self.suggest_activity
        }
        self._save(f"{self.patient_id}", final_spec, is_parent=True)

        self._log("Done 🎉🎉")
        self._log("----------------------------------")
        return final_spec

if __name__ == "__main__":
    MODEL_NAME = 'gpt-4.1'
    # 
    USERS = ["INS-W_963", "INS-W_1044", "INS-W_1077"]

    for uid in USERS:
        pipeline = MINDPipeline(
            patient_id=uid,
            model_name=MODEL_NAME,
            retrospect_date='2021-05-09',
            before_date='2021-06-06',
            save_to_cache=True
        )

        final_output = (
            pipeline
            .load_data(load_from_cache=True)
            .run_discoverer(load_from_cache=True)
            .run_synthesizer(iters=2, load_from_cache=True)
            .run_narrator(load_from_cache=True)
            .run_overview(load_from_cache=True)
            .run_suggest_activity(load_from_cache=True)
            .run_visualizer()
            .run_calc_relevance()
            .run_assembly()
        )
