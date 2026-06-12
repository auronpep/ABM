export interface QuestionChoice {
  id: string;
  text: string;
}

interface QuestionCardProps {
  stem: string;
  choices: QuestionChoice[];
  selected: string | null;
  correct: string | null;
  onSelect: (id: string) => void;
  revealed: boolean;
  call?: string | null;
  disabled?: boolean;
}

export function QuestionCard({
  stem,
  choices,
  selected,
  correct,
  onSelect,
  revealed,
  call,
  disabled = false,
}: QuestionCardProps) {
  return (
    <div className="question-card">
      <div className="question-stem serif">
        {stem.split(/\n\n+/).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {call && <p className="question-call">{call}</p>}
      <div className="question-choices">
        {choices.map((choice) => {
          const isSelected = selected === choice.id;
          const isCorrect = revealed && correct === choice.id;
          const isWrongPick = revealed && isSelected && correct !== choice.id;
          const cls = ["question-choice"];
          if (!revealed && isSelected) cls.push("chosen");
          if (isCorrect) cls.push("correct");
          if (isWrongPick) cls.push("picked-wrong");
          if (revealed && !isCorrect && !isSelected) cls.push("dim");
          return (
            <button
              key={choice.id}
              className={cls.join(" ")}
              disabled={disabled || revealed}
              onClick={() => onSelect(choice.id)}
            >
              <span className="letter">{choice.id}</span>
              <span className="text">{choice.text}</span>
              {isCorrect && <span className="verdict mono">CREDITED</span>}
              {isWrongPick && <span className="verdict mono red">YOUR PICK</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
