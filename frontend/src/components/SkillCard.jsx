import { useDispatch } from "react-redux";
import { OutlineButton, SecondaryButton } from "./Buttons";
import { resetDiscoverUI, setSelectedSkillToLearn, setDiscoverTab } from "../../store/uiSlice";
import { useEffect } from "react";

const SkillCard = ({ skill }) => {
  const dispatch = useDispatch();

  const displayCategory =
    skill.category?.toLowerCase() === 'others'
      ? 'Miscellaneous'
      : skill.category?.charAt(0).toUpperCase() + skill.category?.slice(1);


  return (
    <div className="bg-[#252538] rounded-lg p-6 hover:bg-[#2A2A40] transition-colors cursor-pointer border border-[#3C3C55]">
      <h3 className="text-xl font-semibold text-white mb-2">
        {skill?.name[0].toUpperCase()}{skill?.name.slice(1)}
      </h3>

      <p className="font-semibold mb-6 text-[#A0A0B0]">
        {displayCategory || 'Uncategorized'}
      </p>

      <div className="flex justify-between text-[#A0A0B0] text-sm mb-4">
        <span>🎓 {skill?.learningCount}</span>
        <span>👨‍🏫 {skill?.teachingCount} teaching</span>
      </div>

      <div className="flex space-x-2">
        <SecondaryButton
          className="flex-1 text-sm py-2"
          onClick={() => {
            dispatch(setSelectedSkillToLearn(skill.name))
            dispatch(setDiscoverTab('people'));
          }}
        >
          Learn
        </SecondaryButton>

        <OutlineButton className="flex-1 text-sm py-2">Teach</OutlineButton>
      </div>
    </div>
  );
};

export default SkillCard; 