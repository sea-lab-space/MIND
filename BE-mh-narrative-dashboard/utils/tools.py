from datetime import datetime
import re
from utils.datetime_checker import datetime_checker
import numpy as np
from typing import List, Literal
from typing_extensions import TypedDict, Any
from agents import Agent, FunctionTool, RunContextWrapper, function_tool

# ! Warning: DO NOT alter doc string of function tools!
# ! Its used as part of the prompt for agent-decision making: write comments with # instead


@function_tool
def agent_tool_validate_fact_value(wrapper: RunContextWrapper[List], date: str) -> str:
    """
    Final verification tool: Confirm the value of a detected data fact at a specific date.

    Use this function only **after** identifying a data fact (e.g., difference, extreme).
    It reads and returns the feature value at the specified date for final confirmation.

    Args:
        date: The date to verify, in "YYYY-MM-DD" format.
    """

    # check formatting of the date with regex
    if not datetime_checker(date):
        print("triggered invalid date response")
        return "Invalid date format. Please use YYYY-MM-DD."

    data = wrapper.context
    keys = list(data[0].keys())
    for datum in data:
        if datum[keys[0]] == date:
            print("Validated data for date:", date,
                  "with value:", datum[keys[1]])
            return datum[keys[1]]

    return "Data not found for date: " + date

# @function_tool
# def agent_tool_validate_difference(wrapper: RunContextWrapper[List], time_1: str, time_2: str, attribute: Literal['more', 'less']) -> str:
#     """
#     Valid if the difference data fact found is valid.

#     Args:
#         time_1: The first timepoint, in YYYY-MM-DD format.
#         time_2: The second timepoint, in YYYY-MM-DD format.
#         attribute: The attribute of the feature, more or less.
#     """

#     # check formatting of the date with regex
#     if not datetime_checker(time_1) or not datetime_checker(time_2):
#         print("triggered invalid date response")
#         return "Invalid date format. Please use YYYY-MM-DD."
    
#     data = wrapper.context
#     val1 = find_data_by_date(data, time_1)
#     val2 = find_data_by_date(data, time_2)
#     return val1 - val2

def find_data_by_date(data, date):
    keys = data[0].keys()
    return next((datum[keys[1]] for datum in data if datum[keys[0]] == date), None)


def strip_date(date):
    match = re.search(r'\d{4}-\d{2}-\d{2}', date)
    if not match:
        return None
    return datetime.strptime(match.group(), '%Y-%m-%d')


def date_between_closed(date, start_date, end_date):
    date = strip_date(date)
    start_date = strip_date(start_date)
    end_date = strip_date(end_date)
    if not date or not start_date or not end_date:
        return False
    return start_date <= date <= end_date


def get_data_within_date_range(data, time_start, time_end):
    keys = list(data[0].keys())
    values = [datum[keys[1]] for datum in data if datetime_checker(
        datum[keys[0]]) and date_between_closed(datum[keys[0]], time_start, time_end)]
    return values

@function_tool
def agent_tool_calculate_average(wrapper: RunContextWrapper[List], time_start: str, time_end: str) -> str:
    """
    Calculate the average value of the given dataset between two time points.

    Args:
        time_start: The starting period, in YYYY-MM-DD format.
        time_end: The ending period, in YYYY-MM-DD format.
    """

    # check formatting of the date with regex
    if not datetime_checker(time_start) or not datetime_checker(time_end):
        print("triggered invalid date response")
        return "Invalid date format. Please use YYYY-MM-DD."
    
    data = wrapper.context
    values = get_data_within_date_range(data, time_start, time_end)
    
    print("Using calculate average tool", np.nanmean(values),
          "between", time_start, "and", time_end)
    return np.nanmean(values)

@function_tool
def agent_tool_calculate_stdev(wrapper: RunContextWrapper[List], time_start: str, time_end: str) -> str:
    """
    Calculate the standard deviation of the given dataset between two time points.

    Args:
        time_start: The starting period, in YYYY-MM-DD format.
        time_end: The ending period, in YYYY-MM-DD format.
    """
    # check formatting of the date with regex
    if not datetime_checker(time_start) or not datetime_checker(time_end):
        print("triggered invalid date response")
        return "Invalid date format. Please use YYYY-MM-DD."

    data = wrapper.context
    values = get_data_within_date_range(data, time_start, time_end)

    print("Using calculate stdev tool", np.nanstd(values),
          "between", time_start, "and", time_end)
    return np.nanstd(values)

@function_tool
def agent_tool_calculate_median(wrapper: RunContextWrapper[List], time_start: str, time_end: str) -> str:
    """
    Calculate the median value of the given dataset between two time points.

    Args:
        time_start: The starting period, in YYYY-MM-DD format.
        time_end: The ending period, in YYYY-MM-DD format.
    """
    # check formatting of the date with regex
    if not datetime_checker(time_start) or not datetime_checker(time_end):
        print("triggered invalid date response")
        return "Invalid date format. Please use YYYY-MM-DD."

    data = wrapper.context
    values = get_data_within_date_range(data, time_start, time_end)

    print("Using calculate median tool", np.nanmedian(values),
          "between", time_start, "and", time_end)
    return np.nanmedian(values)

@function_tool
def agent_tool_calculate_min(wrapper: RunContextWrapper[List], time_start: str, time_end: str) -> str:
    """
    Calculate the minimum value of the given dataset between two time points.

    Args:
        time_start: The starting period, in YYYY-MM-DD format.
        time_end: The ending period, in YYYY-MM-DD format.
    """
    # check formatting of the date with regex
    if not datetime_checker(time_start) or not datetime_checker(time_end):
        print("triggered invalid date response")
        return "Invalid date format. Please use YYYY-MM-DD."

    data = wrapper.context
    values = get_data_within_date_range(data, time_start, time_end)

    print("Using calculate min tool", np.nanmin(values),
          "between", time_start, "and", time_end)
    return np.nanmin(values)

@function_tool
def agent_tool_calculate_max(wrapper: RunContextWrapper[List], time_start: str, time_end: str) -> str:
    """
    Calculate the maximum value of the given dataset between two time points.

    Args:
        time_start: The starting period, in YYYY-MM-DD format.
        time_end: The ending period, in YYYY-MM-DD format.
    """
    # check formatting of the date with regex
    if not datetime_checker(time_start) or not datetime_checker(time_end):
        print("triggered invalid date response")
        return "Invalid date format. Please use YYYY-MM-DD."

    data = wrapper.context
    values = get_data_within_date_range(data, time_start, time_end)

    print("Using calculate max tool", np.nanmax(values), "between", time_start, "and", time_end)
    return np.nanmax(values)
    