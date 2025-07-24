def get_mh_data_expert_system_prompt():
    # ! Using case tailored prompt
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
        
        You are expected to return at least 3 data facts per fact type. 
        Specifically: 1) you are encouraged to discover more: you will be awared if you can find the complete set of data facts; 2) you are penalized if you hallucinate: if you cannot find 3 data facts, you should return what you have found, even if less than 3.

        Let’s think step by step.
    """

# ! scrapped this (causes unecessary wrong outputs)
def get_mh_data_date_prompt(retrospect_date_str: str, before_date_str: str, is_comparison: bool = False):
    common = f"You should put the most attention on data fact between {retrospect_date_str} and {before_date_str}."
    if is_comparison:
        return f"""
            By default, you should compare the data before {retrospect_date_str} and between {retrospect_date_str} and {before_date_str}.
            You should also add extra comparison if there is any other interesting data facts.
        """
    else:
        return f"""
            {common}
        """
    
def get_mh_eveness_prompt():
    return f"""
        Ensure your fact discovery accounts for all provided time points in the dataset.
    """
