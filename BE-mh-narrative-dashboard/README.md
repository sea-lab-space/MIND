# ✨ MIND Computation Pipeline

Modular computation pipeline for the MIND dashboard. Designed to be modular and reusable under the **pipes and filter** software architecture.

## 🍵 Dependencies

### Install with `uv` [Recommended]

* Install uv globally on your machine: `pip install uv`
* Check if uv is installed by running `uv --version`
* Sync dependencies: `uv sync`. This will 1) create a python venv with a virtual python version consistent with the repo, and 2) install and manage all the dependencies needed to run the project.
* Run the project (single python file): `uv run <script_name>`. Make sure the project root is the `BE-MH-Narrative-Dashboard` Folder.

> For devs: Remember to add packages using `uv add`.

### Install with `conda` + `pip`

TBD... (TODO: export a requirements.txt in the end)

## 📈 Data Usage

We use a slice of GLOBEM as our dataset for the experiments in the paper.
The repo is self-contained (we document the examples used in this study in this repo) and you don't need full access to GLOBEM to run our scripts. All data used in this study is under the `data` folder. (Note: The ema data is stored in separate files because the times does not align with each measurement: each test is administered at different times.)

To see the full data processing pipeline, please refer to the `<GLOBEM Github Repo>`: <https://github.com/UW-EXP/GLOBEM> to obtain the full dataset. Our preprocess pipeline is in `passive_data_extraction` folder. To run the full preprocessing pipeline, put the whole dataset under `pasive_data_extraction/data_raw` folder and initiate a interactive session (notebook) with the scripts in `pasive_data_extraction/data_extraction.py`. Full `.ipynb` file will be provided upon request.

We also use synthetic data to simulate patient encounters. To see how its raw form is created, check `generate_mock_data/README.md`

## 🧠 Architecture/Pipeline

* **Discoverer**
  * **Data Fact Discoverer**: Evidences
  * **Data Insight Discoverer**: Clinical interpretations
* **Synthesizer**: Bridge active and passive modalities to generate actionable insights and coherent clinical narrative.
* **Visualizer**: Utility module to port the insights to the dashboard specifications.




## 📕 Prompt References
* [Englhardt et al. From Classification to Clinical Insights: Towards Analyzing and Reasoning About Mobile and Behavioral Health Data With Large Language Models [IMWUT'24]](https://github.com/ubicomplab/classification-to-clinical)
* [Qiu and Lan. Interactive Agents: Simulating Counselor-Client Psychological Counseling via Role-Playing LLM-to-LLM Interactions [arXiv'24]](http://arxiv.org/abs/2408.15787)