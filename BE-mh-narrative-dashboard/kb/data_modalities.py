from pydantic import BaseModel
from kb.data_description.survey_score import PHQ4, PSS4, PANAS, PANAS_POS, PANAS_NEG
from kb.data_description.bluetooth import 

class DataModalities(BaseModel):
    surveys: bool = False
    interviews: bool = False
    focus_groups: bool = False
    observations: bool = False
    documents: bool = False
    other: bool = False
    other_description: str = ""



# keys/filename consistent to processed csv
DATA_DESCRIPTION = {
    # in single file *_survey.csv
    "surveys": {
        "phq4": PHQ4,
        "pss4": PSS4,
        "positive_affect": PANAS + PANAS_POS,
        "negative_affect": PANAS + PANAS_NEG
    },
    # in separate files, *_{key}.csv
    "passive_sensing": {
        # in single file, key description


    }
}

if __name__ == "__main__":
    print(DATA_DESCRIPTION['surveys']['panas_negative'])