
import math

from kb.defs import NUMERICAL_FEATURE_KB


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
            return q['evidence'], q['action']
        

def search_modality_type(name):
    map_data_modality = {
        "passive sensing": [],
        "survey": []
    }
    map_data_modality_source = {}
    for key, value in NUMERICAL_FEATURE_KB.items():
        for k, v in value.items():
            if key not in map_data_modality_source:
                map_data_modality_source[key] = []
            map_data_modality_source[key].append(v['rename'])
            if key != "survey":
                map_data_modality['passive sensing'].append(v['rename'])
            else:
                map_data_modality['survey'].append(v['rename'])
    
    modality_type = None
    for k, v in map_data_modality_source.items():
        if name in v:
            modality_type = k
            break


    if name in map_data_modality['passive sensing']:
        return 'passive sensing', modality_type
    elif name in map_data_modality['survey']:
        return 'survey', modality_type


def search_evidence(qa_source, qaid):
    for qa in qa_source:
        if qa['qaid'] == qaid:
            return qa['question_source'], qa['action']
