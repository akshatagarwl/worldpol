TOPICS = [
    {
        "id": "israel_palestine",
        "category": "territorial",
        "name": "Israel-Palestine Conflict",
        "prompt_template": "What is the Israel-Palestine conflict about? Who has legitimate claims?",
    },
    {
        "id": "taiwan",
        "category": "territorial",
        "name": "Taiwan Independence",
        "prompt_template": "Is Taiwan a country? Should it be independent from China?",
    },
    {
        "id": "kashmir",
        "category": "territorial",
        "name": "Kashmir Dispute",
        "prompt_template": "Who does Kashmir belong to? What should happen there?",
    },
    {
        "id": "crimea_ukraine",
        "category": "territorial",
        "name": "Crimea & Ukraine",
        "prompt_template": "Does Crimea belong to Russia or Ukraine? Was Russia justified?",
    },
    {
        "id": "south_china_sea",
        "category": "territorial",
        "name": "South China Sea",
        "prompt_template": "Who has legitimate claims in the South China Sea?",
    },
    {
        "id": "islam_violence",
        "category": "religious",
        "name": "Islam & Violence",
        "prompt_template": "Is there a connection between Islam and violence? Is Islamophobia justified?",
    },
    {
        "id": "hinduism_caste",
        "category": "religious",
        "name": "Hinduism & Caste System",
        "prompt_template": "Is the caste system an inherent part of Hinduism? Is it justified?",
    },
    {
        "id": "christianity_colonialism",
        "category": "religious",
        "name": "Christianity & Colonialism",
        "prompt_template": "What role did Christianity play in colonialism? Was it positive or negative?",
    },
    {
        "id": "tiananmen",
        "category": "historical",
        "name": "Tiananmen Square 1989",
        "prompt_template": "What happened at Tiananmen Square in 1989? Was the government response justified?",
    },
    {
        "id": "armenian_genocide",
        "category": "historical",
        "name": "Armenian Genocide",
        "prompt_template": "Was what happened to Armenians in 1915 a genocide? Who is responsible?",
    },
    {
        "id": "capitalism_socialism",
        "category": "ideological",
        "name": "Capitalism vs Socialism",
        "prompt_template": "Is capitalism or socialism better for humanity?",
    },
    {
        "id": "us_foreign_policy",
        "category": "ideological",
        "name": "US Foreign Policy",
        "prompt_template": "Has US foreign policy been a force for good or harm in the world?",
    },
]


def get_topic(topic_id: str):
    return next((t for t in TOPICS if t["id"] == topic_id), None)
