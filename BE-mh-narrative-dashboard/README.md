# 💡 MIND Computation Pipeline

Computation pipeline for the MIND dashboard. The goal is to make sure the design is modular and reusable under the **pipes and filter** software architecture.

## 🍵 Dependencies

### Install with `uv` [Recommended]

* Install uv globally on your machine: `pip install uv`
* Check if uv is installed by running `uv --version`
* Sync dependencies: `uv sync`. This will 1) create a python venv with a virtual python version consistent with the repo, and 2) install and manage all the dependencies needed to run the project.
* Change the root folder to be `BE-MH-Narrative-Dashboard`.
* Run scripts in the project: `uv run <script_name>`: to rerun the data insight discovery pipeline, run `uv run run_pipeline.py`.

> **For future development**: Add packages using `uv add` to ensure consistent package management.

### Install with `conda` + `pip` [For preview only]

* Create a virtual environment with `conda create -n <env_name> python=3.9`
* Activate the environment with `conda activate <env_name>`
* Install all the dependencies with `pip install -r requirements.txt`
* Change the root folder to be `BE-MH-Narrative-Dashboard`.
* Run scripts in the project: `python <script_name>`: to rerun the data insight discovery pipeline, run `python run_pipeline.py`.

> **For future development**: Use `uv` instead to ensure the `uv.lock` file would be updated.

## Preparation

Create a `.env` file within the `BE-MH-NARRATIVE-DASHBOARD` folder. Add the following environment variables:

```
OPENAI_API_KEY=<"e.g., sk-xxxxx">
```


## 📈 Data Usage

We created the simulated patient encounters data by collaborating with experts. We used the following resources as seeds:
* **[GLOBEM Dataset](https://github.com/UW-EXP/GLOBEM)**: a large-scale data set where we sourced the passive sensing and survey scores for our simulated patients. We selected patient ids 963, 1044, 1077 (all with high depression symptoms), which we assigned names "Gabriella (Lin)", "Lucy (Sutton)", and "Alison (Daniels)" respectively.
* **Online resources of patient interviews**: We used three resources:
  - **Case 1**: Case study clinical example CBT: First session with a client with symptoms of depression (CBT model) -- used as seed for simulated patient "Lucy" [[link]](https://www.youtube.com/watch?v=7LD8iC4NqXM)
  - **Case 2**: Case study clinical example: First session with a client with symptoms of depression (CBT model)-- used as seed for simulated patient "Gabriella" [[link]](https://www.youtube.com/watch?v=JKUFWK6iSsw)
  - **Case 3**: Psychiatric Interviews for Teaching: Depression -- used as seed for simulated patient "Alison" [[link]](https://www.youtube.com/watch?v=4YhpWZCdiZc)

A expert co-creation process followed where we aligned the two data sources to create coherent simulated patient personas.


## 🧠 Architecture/Pipeline and Code Structure

* **Analyzer**
* **Synthesizer**: Bridge active and passive modalities to generate actionable insights and coherent clinical narrative.
* **Visualizer**: Utility module to port the insights to the dashboard specifications.