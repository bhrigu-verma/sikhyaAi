import json

path = "/Users/bhriguverma/Downloads/sikhyaAi/sarvam-ai-cookbook/integrations/llamaindex_sarvam.ipynb"
with open(path) as f:
    nb = json.load(f)

for cell in nb["cells"]:
    src_text = "".join(cell["source"])
    if "class SarvamAILLM" not in src_text:
        continue

    src = cell["source"]
    for i, line in enumerate(src):
        if "self.client.chat.completions(" in line and ".create(" not in line:
            src[i] = line.replace("self.client.chat.completions(", "self.client.chat.completions.create(")
        if "ChatResponseGen(gen())" in line:
            src[i] = line.replace("ChatResponseGen(gen())", "gen()")
        if "CompletionResponseGen(gen())" in line:
            src[i] = line.replace("CompletionResponseGen(gen())", "gen()")
    break

with open(path, "w") as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)

print("Fixed and verified.")
