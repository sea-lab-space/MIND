
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
