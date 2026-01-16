def select_question(history):
    """
    history = [
      {"correct": True},
      {"correct": False},
      ...
    ]
    """

    if not history:
        return {
            "difficulty": "medium",
            "message": "Starting with a medium difficulty question."
        }

    correct = sum(1 for h in history if h.get("correct"))
    accuracy = correct / len(history)

    if accuracy > 0.8:
        return {
            "difficulty": "hard",
            "message": "You're doing great! Increasing difficulty."
        }
    elif accuracy < 0.5:
        return {
            "difficulty": "easy",
            "message": "Let's try something easier."
        }
    else:
        return {
            "difficulty": "medium",
            "message": "Keep going! Same difficulty."
        }
