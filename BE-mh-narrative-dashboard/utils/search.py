
import math


def search_id_in_facts(data_fact_list, fact_id):
    for fact in data_fact_list:
        if fact['id'] == fact_id:
            return fact
        
def replace_NaNs_to_null(data):
    for datum in data:
        for key, value in datum.items():
            if isinstance(value, float) and math.isnan(value):
                datum[key] = None
    return data

def search_feature_in_feature_list(features, feature_name):
    for feature in features:
        if feature['feature_name_renamed'] == feature_name:
            return feature
        
def search_question_in_question_list(questions, question):
    for q in questions:
        if q['question'] == question:
            return q
    