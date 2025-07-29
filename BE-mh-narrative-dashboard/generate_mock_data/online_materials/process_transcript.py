
import json
from typing import List
from pydantic import BaseModel, Field
import openai
import os
import sys
from tqdm import tqdm
from pathlib import Path
from dotenv import load_dotenv

project_root = Path(__file__).parent.parent.parent
print(project_root)
sys.path.append(str(project_root))
load_dotenv()

from MIND_types import (
    TranscriptResponse
)

from tqdm import tqdm

if __name__ == "__main__":
    print("Run this under caution: remove the exit() beneth. Transcripts have already been processed to align with the user study")
    exit()
    # download_base = {
    #     "7LD8iC4NqXM": "Lucy",
    #     "JKUFWK6iSsw": "Gabriella"
    # }

    # list all txts in the folder
    transcript_seeds = {}
    for file in os.listdir("./generate_mock_data/online_materials"):
        if file.endswith(".txt"):
            with open(f"./generate_mock_data/online_materials/{file}", "r") as f:
                id = file.split(".")[0]
                # read the whole file
                lines = f.readlines()
                transcript_seeds[id] = " ".join([line.strip() for line in lines])

    openai.api_key = os.getenv("OPENAI_API_KEY")
    MODEL_NAME = "gpt-4.1"

    for id, transcript in tqdm(transcript_seeds.items()):
        # ytt_api = YouTubeTranscriptApi()
        # fetched_transcript = ytt_api.fetch(video_id)

        # is iterable
        # text_full = []
        # for snippet in fetched_transcript:
        #     text_full.append(snippet.text)
        # text_full_str = " ".join(text_full)

        client = openai.OpenAI()
        
        encounter_prompt = f'''
            You are given a transcript of a patient's encounter with a mental health clinician.
            Format the transcript: add punctuations, and split between clinician and patient. 
            Keep the conversation in chronological order, and do not change what is said.

            {transcript}
        '''
        response = client.responses.parse(
            model=MODEL_NAME,
            input=[
                {"role": "system", "content": encounter_prompt}
            ],
            text_format=TranscriptResponse,
            temperature=0
        )
        event = response.output_parsed
        # pydantic to dict
        event_dict = event.model_dump()
        transcript = event_dict['response']

        # store the transcipt
        with open(f"./generate_mock_data/online_materials/{id}.json", "w") as f:
            f.write(json.dumps(transcript, indent=2))


