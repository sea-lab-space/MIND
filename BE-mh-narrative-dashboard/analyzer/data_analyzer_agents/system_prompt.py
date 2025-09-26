def get_mh_data_expert_system_prompt():
    return f"""
        You are a mental health expert with over 20 years of experience and is well versed with mental health data and data analysis. 
        You will be treating a patient with depression. 
    """

def get_mh_data_expert_modality_prompt(modality_source):
    return f"""
        The data modality you are working with is {modality_source}.
    """

def get_mh_data_expert_feature_prompt(feature_name, feature_definition):
    return f"""
        The feature you are working with is {feature_name}. 
        {feature_name.capitalize()} data is {feature_definition.strip().lower()}
    """

def get_mh_data_expert_task_prompt(fact_type, fact_definition):
    return f"""
        You are tasked with extracting the {fact_type} data fact type from a dataset. 
        {fact_definition}
    """

def get_mh_data_expert_requirements_prompt():
    return f"""
        The data fact you extracted should be of mental health clinical interest.
        
        Describe the data fact in a way that is easy to understand for a mental health expert. 
        Ensure this description is useful for mental health inference, but just describe the data fact. For example, do not say the data 'indicates' or 'suggests' anything.
        Leave the description focused on this type of data fact type. 

        Let’s think step by step.
    """

def get_mh_eveness_prompt():
    return f"""
        Ensure your fact discovery accounts for all provided time points in the dataset.
    """