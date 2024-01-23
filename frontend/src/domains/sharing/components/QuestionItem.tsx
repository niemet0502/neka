import { getTimeAgoString } from "@/lib/utils";
import { QuestionApi } from "../type";

export const QuestionItem: React.FC<{ question: QuestionApi }> = ({
  question,
}) => {
  return (
    <div className="border-b">
      <div className="flex w-full">
        <div className="grid-cols-1 w-1/4 p-4 flex flex-col items-center">
          <span>{question.answers.length} réponses</span>
          <span>{question.view} vues</span>
        </div>
        <div className="flex-2 w-3/4 p-4">
          <h1 className="font-medium text-lg">{question.title}</h1>
          <p>{question.content}</p>
        </div>
      </div>

      <div className="w-full pb-4 pr-6">
        <p className="text-end">
          Posé par{" "}
          <span className="font-medium">{question.author?.username}</span>{" "}
          {getTimeAgoString(question.created_at)}
        </p>
      </div>
    </div>
  );
};
