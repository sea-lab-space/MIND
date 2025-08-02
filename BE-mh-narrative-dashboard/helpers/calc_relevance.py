import openai
import os
import numpy as np

openai.api_key = os.getenv("OPENAI_API_KEY")

class EmbeddingRelevance:
    def __init__(self, embedding_model="text-embedding-3-small"):
        self.client = openai.OpenAI()
        self.model = embedding_model

    def _compute_batch_emb(self, texts: list[str]):
        input_texts = [text.replace("\n", " ") for text in texts]
        embeds = self.client.embeddings.create(
            input=input_texts,
            model=self.model
        ).data
        return np.array(
         [embed.embedding for embed in embeds])

    def run(self, subjective_materials, data_insights):
        """
        subjective_materials: in the format of {"date": <date>, "text": <text_input_from_date>}
        data_insights: filtered (source need this computing) in the format of {"key": <key>, "summaryTitle": <insight text>}
        """
        insights_input = [
            insight['summaryTitle'] for insight in data_insights
        ]
        subjective_materials_input = [
            data['text'] for data in subjective_materials
        ]

        subjective_materials_emb = self._compute_batch_emb(subjective_materials_input)
        data_insights_emb = self._compute_batch_emb(insights_input)


        # compute cosine similarity between subjective_materials and data_insights use numpy
        # Input:  (#insight, embed_dim), (#date, embed_dim)
        # Output: (#insight, #date)
        # no need normalize: https://platform.openai.com/docs/guides/embeddings#which_distance_function_should_i_use_
        cosine_sim = np.dot(data_insights_emb, subjective_materials_emb.T)
        # map -1 to 1 in cosine sim to 0 to 1
        # cosine_sim = (cosine_sim + 1) / 2

        for i in range(len(data_insights)):
            relevance_data = []
            for j in range(len(subjective_materials)):
                relevance_data.append({
                    "date": subjective_materials[j]['date'],
                    # np to float
                    "relevance": float(cosine_sim[i][j])
                })
            data_insights[i]['relevance'] = relevance_data
        return data_insights