# %%
%matplotlib inline
%reload_ext autoreload
%autoreload 2

import sys
sys.path.append("./")

import pandas as pd
import os
import seaborn as sns
from datetime import timedelta
from copy import deepcopy
from utils.date_filter import DATE_RANGE, filter_dates
from pathlib import Path
import sys

notebook_path = %pwd
root_dir = Path(notebook_path).resolve().parent
print(root_dir)

# %%
# load INS-W_4 dataset for evaluation
def load_single_file_csv(data_path, folder_path, file_name, pids_filter=None): 
    survey_data_dir = os.path.join(data_path, folder_path, file_name)
    df = pd.read_csv(survey_data_dir)
    if pids_filter is not None:
        return df[df['pid'].isin(pids_filter)]
    else:
        return df

# %% [markdown]
# ## Step 1: Filter out depression candidates
# 
# **Heuristics**
# 
# * For synthesized data, we want the participants to have "some" depression symptoms for clinicinal evaluation.
# * Use latest data (W_4/2021 data in GLOBEM dataset).
# * Use BDI2 score to filter out participants with moderate or severe depression.

# %%
post_survey = load_single_file_csv("data_raw/INS-W_4/", "SurveyData", "post.csv")
pre_survey = load_single_file_csv("data_raw/INS-W_4/", "SurveyData", "pre.csv")

# include just pid and BDI_{pre/post}
post_survey = post_survey[['pid', 'BDI2_POST']]
pre_survey = pre_survey[['pid', 'BDI2_PRE']]

# merge the two tables
merged = pd.merge(post_survey, pre_survey, on='pid', how='inner')
merged['BDI_avg'] = merged['BDI2_POST'] + merged['BDI2_PRE'] / 2
print("Before filter", len(merged))

# sort by BDI_avg
merged = merged.sort_values(by="BDI_avg", ascending=False)
# filter greater than 10 points avg
merged_filtered = merged[merged['BDI_avg'] >= 19]
print("After filter:", len(merged_filtered))

# the percentage match other reported rates
print("Moderate or severe depression rate:", len(merged_filtered) / len(merged))

# %%
# get the list of the PIDs
candidate_pids = merged_filtered['pid'].to_list()
len(candidate_pids)

# %% [markdown]
# ## Step 2: Get a finalized set of participants
# 
# **Heuristics**
# * Should be consistent in filling out regular measurment scores: 10 weeks --> 10 times
# * As a proof-of-concept mock data, we assume that clinicians/patients will find a way to ensure reporting of the data
# 

# %%
dep_weekly = load_single_file_csv(
    "data_raw/INS-W_4/", "SurveyData", "ema.csv", candidate_pids)
dep_weekly = filter_dates(
    dep_weekly, DATE_RANGE[4]["start"], DATE_RANGE[4]["end"])

# %%
def check_ema_data_completeness(df, features):
    df = deepcopy(df[['pid'] + features])
    # drop na
    df = df.dropna(how='any')
    # count each pid how many row
    df['count'] = df.groupby('pid')['pid'].transform('count')
    # filter out those with less than 10 rows
    df = df[df['count'] >= 10]

    # get pids
    complete_pids = df['pid'].unique().tolist()
    return complete_pids

phq4_complete_pids = check_ema_data_completeness(dep_weekly, ['phq4_EMA', 'phq4_anxiety_EMA', 'phq4_depression_EMA'])
pss4_complete_pids = check_ema_data_completeness(dep_weekly, ['pss4_EMA'])
panas_complete_pids = check_ema_data_completeness(dep_weekly, ['positive_affect_EMA', 'negative_affect_EMA'])

# intersection usable pids
usable_pids = list(set(phq4_complete_pids).intersection(
    set(pss4_complete_pids)).intersection(set(panas_complete_pids)))
print("Usable pids:", len(usable_pids))

# sort usable_pids by its text
usable_pids.sort()

# %%
# set fixed randomized seed
import random
MAGIC = 24
random.seed(MAGIC)
# random sample 5 pids
candidate_pids = random.sample(usable_pids, 5)
valid_pids = candidate_pids
print(candidate_pids)

valid_pids_deps = dep_weekly[dep_weekly['pid'].isin(candidate_pids)]

# %%
sns.lineplot(data=valid_pids_deps, x='date',
             y='positive_affect_EMA', hue='pid')

# %%
sns.lineplot(data=valid_pids_deps, x='date',
             y='negative_affect_EMA', hue='pid')

# %%
sns.lineplot(data=valid_pids_deps, x='date',
             y='phq4_depression_EMA', hue='pid')

# %%
sns.lineplot(data=valid_pids_deps, x='date', y='phq4_EMA', hue='pid')

# %% [markdown]
# *Note: No interpolation! Self-report data (active data) requires human participation, i.e., should not be interpreted as data missing at random.*

# %%
def save_separate_emas(df, features, name):
    df = deepcopy(df[['pid', 'date'] + features])
    # drop na
    df = df.dropna(how='any')
    # count each pid how many row
    df.columns.str.replace('_EMA', '')
    df.to_csv(f"{root_dir}/data/INS-W_4_survey_{name}.csv", index=False)


save_separate_emas(
    valid_pids_deps, ['phq4_EMA', 'phq4_anxiety_EMA', 'phq4_depression_EMA'], 'phq4')
save_separate_emas(valid_pids_deps, ['pss4_EMA'] ,'pss4')
save_separate_emas(
    valid_pids_deps, ['positive_affect_EMA', 'negative_affect_EMA'], 'panas')

# %% [markdown]
# ## Step 3: Extract passive sensing data for the selected participants
# 
# **Heuristics**
# * Do data transformation to derive human-interpretable, meaningful features
# * Use the lowest granularity of data possible (e.g., parts of day, daily). Higher granularity data can always be grouped.

# %%
from utils.feature_loader import PassiveFeatureLoader
from utils.plot_feature import plot_feature

# %%
wifiExtractFeatures = ["uniquedevices"]

wifiData = PassiveFeatureLoader("4", "wifi", wifiExtractFeatures, valid_pids)
plot_feature(wifiData)
wifiData.save_data()

wifiDataAllday = PassiveFeatureLoader(
    "4", "wifi", wifiExtractFeatures, valid_pids, granularity='allday')
plot_feature(wifiDataAllday)
wifiDataAllday.save_data()

# %%
bluetoothFeaturesToExtract = [
    "uniquedevices",
]

allBluetoothData = PassiveFeatureLoader(
    "4", "bluetooth", bluetoothFeaturesToExtract, valid_pids)
plot_feature(allBluetoothData, daily=False)
allBluetoothData.save_data()

allBluetoothDataAllday = PassiveFeatureLoader(
    "4", "bluetooth", bluetoothFeaturesToExtract, valid_pids, granularity='allday')
plot_feature(allBluetoothDataAllday)
allBluetoothDataAllday.save_data()

# %%
physicalActivityFeaturesToExtract = [
    "countepisodesedentarybout",
    "sumsteps"
]

allPhysicalActivityData = PassiveFeatureLoader(
    "4", "steps", physicalActivityFeaturesToExtract, valid_pids)
plot_feature(allPhysicalActivityData, daily=False)
allPhysicalActivityData.save_data()

allPhysicalActivityDataAllday = PassiveFeatureLoader(
    "4", "steps", physicalActivityFeaturesToExtract, valid_pids, granularity='allday')
plot_feature(allPhysicalActivityDataAllday)
allPhysicalActivityDataAllday.save_data()

# %%
locationFeaturesToExtract = [
    "timeathome",
    "numberofsignificantplaces",
    "totaldistance",
    "radiusgyration",
    "duration_in_locmap_study",
    "duration_in_locmap_exercise",
    "duration_in_locmap_greens",    
]

allLocationData = PassiveFeatureLoader(
    "4", "location", locationFeaturesToExtract, valid_pids)
plot_feature(allLocationData, daily=False)
allLocationData.save_data()

locationFeaturesToExtractAllDay = ["circdnrtn"]

allLocationDataAllday = PassiveFeatureLoader(
    "4", "location", locationFeaturesToExtract + locationFeaturesToExtractAllDay, valid_pids, granularity='allday')
plot_feature(allLocationDataAllday)
allLocationDataAllday.save_data()

# %%
sleepFeaturesToExtract = [
    "avgdurationasleepunifiedmain",
    "avgdurationawakeunifiedmain",
    "maxdurationasleepunifiedmain",
    "maxdurationawakeunifiedmain",
    "sumdurationasleepunifiedmain",
    "sumdurationawakeunifiedmain",
    "countepisodeasleepunifiedmain",
    "countepisodeawakeunifiedmain"
]

allSleepData = PassiveFeatureLoader(
    "4", "sleep", sleepFeaturesToExtract, valid_pids)
plot_feature(allSleepData, daily=False)
allSleepData.save_data()

featuresDailyExtract = [
    "firstwaketimemain",
    "lastwaketimemain",
    "firstbedtimemain",
    "lastbedtimemain",
]
allSleepDataAllday = PassiveFeatureLoader(
    "4", "sleep", featuresDailyExtract + sleepFeaturesToExtract, valid_pids, granularity='allday')
plot_feature(allSleepDataAllday)
allSleepDataAllday.save_data()

# %%
detailedCallFeaturesToExtract = [
    "missed_count",
    "incoming_count",
    "outgoing_count",
]

allDetailedCallData = PassiveFeatureLoader(
    "4", "call", detailedCallFeaturesToExtract, valid_pids)
plot_feature(allDetailedCallData, daily=False)
allDetailedCallData.save_data()

allDetailedCallDataAllday = PassiveFeatureLoader(
    "4", "call", detailedCallFeaturesToExtract, valid_pids, granularity='allday')
plot_feature(allDetailedCallDataAllday)
allDetailedCallDataAllday.save_data()

# %%
screenTimeFeaturesToExtract = [
    "countepisodeunlock",
    "sumdurationunlock",
    "maxdurationunlock",
    "avgdurationunlock",
    "sumdurationunlock_locmap_home",
    "avgdurationunlock_locmap_home",
    "maxdurationunlock_locmap_home",
    "countepisodeunlock_locmap_home"
]

allScreenTimeData = PassiveFeatureLoader(
    "4", "screen", screenTimeFeaturesToExtract, valid_pids)
plot_feature(allScreenTimeData)
allScreenTimeData.save_data()

allScreenTimeDataAllday = PassiveFeatureLoader(
    "4", "screen", screenTimeFeaturesToExtract, valid_pids, granularity='allday')
plot_feature(allScreenTimeDataAllday)
allScreenTimeDataAllday.save_data()

# %% [markdown]
# ## Step 4: Demographics
# 
# * We don't extract demographics here. For privacy considerations, we use synthesized data instead.


