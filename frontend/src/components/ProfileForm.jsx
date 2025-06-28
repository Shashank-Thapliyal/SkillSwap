import { useEffect, useState } from "react";
import { PrimaryButton } from "./Buttons";
import { updateProfile } from "../api/userApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target } from "lucide-react";

const ProfileForm = ({ loggedInUser }) => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");

  const [canTeach, setCanTeach] = useState([]);
  const [wantToLearn, setWantToLearn] = useState([]);
  const [canTeachInput, setCanTeachInput] = useState("");
  const [wantToLearnInput, setWantToLearnInput] = useState("");
  const [canTeachCategory, setCanTeachCategory] = useState("others");
  const [wantToLearnCategory, setWantToLearnCategory] = useState("others");


  const [initialProfileState, setInitialProfileState] = useState(null);
  const [isChanged, setIsChanged] = useState(false);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loggedInUser) return;

    const isoDate = loggedInUser?.profile?.dob
      ? new Date(loggedInUser.profile.dob).toISOString().split("T")[0]
      : "";

    const initialState = {
      firstName: loggedInUser?.profile?.firstName || "",
      middleName: loggedInUser?.profile?.middleName || "",
      lastName: loggedInUser?.profile?.lastName || "",
      userName: loggedInUser?.profile?.userName || "",
      dob: isoDate,
      gender: loggedInUser?.profile?.gender || "",
      about: loggedInUser?.profile?.about || "",
      location: loggedInUser?.profile?.location || "",
      email: loggedInUser?.email || "",
      canTeach: loggedInUser?.skills?.canTeach || [],
      wantToLearn: loggedInUser?.skills?.wantToLearn || [],
    };

    setInitialProfileState(initialState);

    setFirstName(initialState.firstName);
    setMiddleName(initialState.middleName);
    setLastName(initialState.lastName);
    setUserName(initialState.userName);
    setDob(initialState.dob);
    setGender(initialState.gender);
    setAbout(initialState.about);
    setLocation(initialState.location);
    setEmail(initialState.email);
    setCanTeach(initialState.canTeach);
    setWantToLearn(initialState.wantToLearn);
  }, [loggedInUser]);

  useEffect(() => {
    if (!initialProfileState) return;

    const currentState = {
      firstName,
      middleName,
      lastName,
      userName,
      dob,
      gender,
      about,
      location,
      email,
      canTeach,
      wantToLearn,
    };

    const isDifferent = Object.keys(initialProfileState).some((key) => {
      if (Array.isArray(initialProfileState[key])) {
        return (
          initialProfileState[key].length !== currentState[key].length ||
          initialProfileState[key].some((v, i) => v !== currentState[key][i])
        );
      }
      return initialProfileState[key] !== currentState[key];
    });

    setIsChanged(isDifferent);
  }, [
    firstName, middleName, lastName, userName, dob, gender, about, location, email, canTeach, wantToLearn,
    initialProfileState
  ]);

  const addSkill = (type, e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue =
        type === "teach" ? canTeachInput.trim() : wantToLearnInput.trim();

      if (!trimmedValue) return;

      const skillObj = {
        name: trimmedValue,
        category: type === "teach" ? canTeachCategory : wantToLearnCategory,
      };


      if (type === "teach" && canTeach.length < 10) {
        setCanTeach([...canTeach, skillObj]);
        setCanTeachInput("");
      }

      if (type === "learn" && wantToLearn.length < 10) {
        setWantToLearn([...wantToLearn, skillObj]);
        setWantToLearnInput("");
      }
    }
  };

  const removeSkill = (type, skillToRemove) => {
    if (type === "teach") {
      setCanTeach(canTeach.filter((s) => s.name !== skillToRemove.name));
    } else {
      setWantToLearn(wantToLearn.filter((s) => s.name !== skillToRemove.name));
    }
  };


  const onSave = async () => {
    const profileData = {
      firstName,
      middleName,
      lastName,
      userName,
      about,
      location,
      canTeach,
      wantToLearn,
    };
    console.log("Saved Profile:", profileData);
    const response = await updateProfile(profileData);
    console.log(response.data.user);
    if (response.status === 200) {
      toast.success("Profile Updated Successfully")
      dispatch(setUser(response.data?.user));
      navigate("/profile")
    }
  };

  return (
    <div className="w-full max-w-3xl p-6 bg-[#252538] rounded-xl shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-white text-2xl font-bold mt-4">Edit Your Profile</h2>
      </div>

      <div className="grid grid-cols-6 gap-4 mb-6">
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name *" className="col-span-6 md:col-span-2 bg-[#2A2A40]  text-white px-4 py-3 rounded-lg border border-[#3C3C55] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none" />
        <input type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Middle Name" className="col-span-6 md:col-span-2 bg-[#2A2A40] text-white px-4 py-3 rounded-lg border border-[#3C3C55] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none" />
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name *" className="col-span-6 md:col-span-2 bg-[#2A2A40] text-white px-4 py-3 rounded-lg border border-[#3C3C55] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none" />
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Username *" className="col-span-6 md:col-span-3 bg-[#2A2A40] text-white px-4 py-3 rounded-lg border border-[#3C3C55] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none" />
        <input type="email" disabled value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" className="col-span-6 md:col-span-3 bg-[#2A2A40] border-0.5 border-white cursor-not-allowed text-white px-4 py-3 rounded-lg  focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none" />
        <input type="date" disabled value={dob || ""} onChange={(e) => setDob(e.target.value)} className="col-span-6 md:col-span-3 bg-[#2A2A40] text-white px-4 py-3 rounded-lg border-0.5 border-white cursor-not-allowed focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none" />
        <select value={gender} disabled onChange={(e) => setGender(e.target.value)} className="col-span-6 md:col-span-3 bg-[#2A2A40] text-white px-4 py-3 rounded-lg border-0.5 border-white cursor-not-allowed focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none">
          <option value="" disabled>Select Gender *</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="city" className="col-span-6 bg-[#2A2A40] text-white px-4 py-3 rounded-lg border border-[#3C3C55] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none" />
        <textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="About Me" className="col-span-6 bg-[#2A2A40] text-white px-4 py-3 rounded-lg border border-[#3C3C55] resize-none focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none " rows="3" />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-white mb-4">Skills</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <h3 className="font-medium text-white mb-3 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-green-400" />
              Can Teach
            </h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={canTeachInput}
                onKeyDown={(e) => addSkill("teach", e)}
                onChange={(e) => setCanTeachInput(e.target.value)}
                className="flex-1 bg-[#2A2A40] text-white px-4 py-3 rounded-lg border border-[#3C3C55] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none "
                placeholder="e.g. JavaScript"
              />
              <select
                value={canTeachCategory}
                onChange={(e) => setCanTeachCategory(e.target.value)}
                className="min-w-[120px] bg-[#2A2A40] text-white px-4 py-3 rounded-lg border border-[#3C3C55] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none text-sm appearance-none cursor-pointer hover:border-[#4A4A65] transition-colors"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="others">Others</option>
                <option value="technology">Technology</option>
                <option value="music">Music</option>
                <option value="sports">Sports</option>
                <option value="education">Education</option>
                <option value="language">Language</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="art">Art</option>
              </select>

            </div>
            <div className="flex flex-wrap gap-2">
              {canTeach.map((skill, i) => (
                <span
                  key={i}
                  className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30"
                >
                  {typeof skill === 'string' ? skill : skill.name}

                  <button
                    onClick={() => removeSkill("teach", skill)}
                    className="hover:text-red-200 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-white mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2 text-[#00C3FF]" />
              Want to Learn
            </h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={wantToLearnInput}
                onKeyDown={(e) => addSkill("learn", e)}
                onChange={(e) => setWantToLearnInput(e.target.value)}
                className="flex-1 bg-[#2A2A40] text-white px-4 py-3 rounded-lg border border-[#3C3C55] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none"
                placeholder="e.g. Music"
              />
              <select
                value={wantToLearnCategory}
                onChange={(e) => setWantToLearnCategory(e.target.value)}
                className="min-w-[120px] bg-[#2A2A40] text-white px-4 py-3 rounded-lg border border-[#3C3C55] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none text-sm appearance-none cursor-pointer hover:border-[#4A4A65] transition-colors"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="others">Others</option>
                <option value="technology">Technology</option>
                <option value="music">Music</option>
                <option value="sports">Sports</option>
                <option value="education">Education</option>
                <option value="language">Language</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="art">Art</option>
              </select>


            </div>
            <div className="flex flex-wrap gap-2">
              {wantToLearn.map((skill, i) => (
                <span
                  key={i}
                  className="bg-[#00C3FF]/20 text-[#00C3FF] px-3 py-1 rounded-full text-sm border border-[#00C3FF]/30"
                >

                  {typeof skill === 'string' ? skill : skill.name}

                  <button
                    onClick={() => removeSkill("learn", skill)}
                    className="hover:text-[#00C3FF] ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <PrimaryButton onClick={onSave} disabled={!isChanged} className="w-full mt-6">
        Save Profile
      </PrimaryButton>
    </div>
  );
};

export default ProfileForm;