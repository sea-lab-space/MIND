import re

def strip_excess_whitespace(text: str) -> str:
    lines = text.strip().split('\n')
    cleaned_lines = [re.sub(r'\s+', ' ', line).strip()
                    for line in lines if line.strip()]
    cleaned_text = '\n'.join(cleaned_lines)
    return cleaned_text
