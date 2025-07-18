from agents import Agent, ModelSettings, function_tool


class ExtremeDiscoverer:
    def __init__(self, model: str = "gpt4.1-nano"):
        self.model = model
        self.agent = Agent(
            name="Extreme Discoverer",
            instructions="Always respond in haiku form",
            model=model,
            tools=[self._tool_get_weather]
        )
    
    @function_tool
    def _tool_get_weather(self, city: str) -> str:
        return f"The weather in {city} is sunny"

    def __call__(self, *args, **kwargs):
        return f"Extreme Discoverer {self.model}"
    
if __name__ == "__main__":
    extreme_discoverer = ExtremeDiscoverer()
    print(extreme_discoverer)