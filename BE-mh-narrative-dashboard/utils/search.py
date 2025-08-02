
def search_id_in_facts(data_fact_list, fact_id):
    for fact in data_fact_list:
        if fact['id'] == fact_id:
            return fact
