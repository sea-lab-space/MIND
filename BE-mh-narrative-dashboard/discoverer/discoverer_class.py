

class Discoverer:
    def __init__(self, model_name, features):
        self.model_name = model_name
        self.features = features

        self.agents = {
            'trend': Agent
        }
